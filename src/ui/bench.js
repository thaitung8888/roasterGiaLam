// Bảng tương tác ở từng trạm: pha một ly, rang một mẻ, ngồi xuống ghế, kéo mặt trời, mở laptop, hạ rèm.
// Mở ra thì camera tiến lại gần đồ vật (nếu có góc riêng) và giữ yên ở đó cho tới khi bấm Xong.
import { MENU } from '../config/menu.js';
import { SHOP } from '../config/shop.js';
import { BENCH, DRINKS, ROAST_STAGES, SUN_STAGES } from '../config/stories.js';
import { $, esc, vnd } from '../env.js';
import { currentPhase, setManual } from '../scene/atmosphere.js';
import { BREW } from '../scene/brew.js';
import { goTo, release } from '../scene/explore.js';
import { V, toPlan } from '../scene/helpers.js';
import { ROAST } from '../scene/zones/roastery.js';
import { DESK, TERRACE } from '../scene/zones/floor3.js';

import { Menu } from './menu.js';

export const Bench = (() => {
  const el = $('bench'), eyebrow = $('benchEyebrow'), title = $('benchTitle'), text = $('benchText'), ctl = $('benchCtl'), acts = $('benchActs'), close = $('benchClose');
  let open = null;

  // thanh kéo dùng chung: rang hạt, kéo mặt trời, hạ rèm
  function slider(value, label, ends, onInput) {
    ctl.innerHTML = `<div class="roast">
      <p class="stage" aria-live="polite"></p>
      <input type="range" min="0" max="100" value="${Math.round(value)}" aria-label="${label}">
      <div class="scale">${ends.map(e => `<span>${e}</span>`).join('')}</div></div>`;
    const range = ctl.querySelector('input'), stage = ctl.querySelector('.stage');
    const run = () => onInput(Number(range.value), stage);
    range.addEventListener('input', run); run();
  }
  const staged = (stages, k, stage) => { const s = stages.find(x => k < x.to); stage.textContent = s.name; text.textContent = s.text; };
  function button(label, ghost, onClick) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = ghost ? 'btn ghost' : 'btn'; b.textContent = label; b.addEventListener('click', onClick);
    acts.prepend(b); return b;
  }

  const CONTROLS = {
    brew() {
      const coffee = MENU.find(g => g.id === 'ca-phe').items;
      ctl.innerHTML = `<div class="chips" role="group" aria-label="Chọn món">${coffee.map(([n]) => `<button type="button" aria-pressed="false">${esc(n)}</button>`).join('')}</div>`;
      const chips = [...ctl.querySelectorAll('button')];
      chips.forEach((b, i) => b.addEventListener('click', () => {
        const [name, , price] = coffee[i];
        chips.forEach(c => c.setAttribute('aria-pressed', c === b ? 'true' : 'false'));
        BREW.pour(name);
        text.innerHTML = `${esc(DRINKS[name] || '')} <span class="price">${price ? vnd(price) : ''}</span>`;
      }));
      button('Xem cả menu', true, () => Menu.show());
    },
    roast() { slider(ROAST.level * 100, 'Nhiệt độ rang', ['Hạt xanh', 'Rang vừa', 'Rang đậm'], (k, stage) => { ROAST.set(k / 100); staged(ROAST_STAGES, k, stage); }); },
    seat() { ctl.innerHTML = ''; },
    sun() { slider(currentPhase() * 50, 'Giờ trong ngày', ['Trưa', 'Hoàng hôn', 'Đêm'], (k, stage) => { setManual(k / 50); staged(SUN_STAGES, k, stage); }); },
    desk() {
      ctl.innerHTML = `<dl class="info">
        <dt>Wifi</dt><dd><span id="deskWifi">${esc(SHOP.wifi)}</span><button class="copy" type="button" data-action="wifi">Chép</button></dd>
        <dt>Mở cửa</dt><dd>${esc(SHOP.hours)}</dd>
        <dt>Ổ cắm</dt><dd>Dọc quầy làm việc</dd></dl>`;
      DESK.show(true);
    },
    blind() { slider(TERRACE.level * 100, 'Hạ rèm', ['Cuộn lên', 'Hạ xuống'], k => TERRACE.blind(k / 100)); }
  };
  // dọn dẹp khi đóng bảng
  const DONE = { brew: () => BREW.clear(), sun: () => setManual(null), desk: () => DESK.show(false) };

  // camera của bảng: ghế camping lấy vị trí từ chính chiếc ghế, các bảng khác lấy từ stories.js
  function frame(kind, arg) {
    if (kind === 'seat') {
      const p = arg.pick.getWorldPosition(V(0, 0, 0)); p.y = 1.1;
      return [p, toPlan(0.8, 1.6, -16.9)];   // ngồi nhìn về gốc cây giữa xưởng
    }
    const c = BENCH[kind].camera;
    return c ? [toPlan(...c.pos), toPlan(...c.look)] : null;
  }

  function show(kind, arg) {
    if (kind === 'tree') { TERRACE.shake(); return; }
    if (kind === 'seat' && !arg) arg = nearestSeat(arg);
    if (open === 'seat' && kind === 'seat') { const f = frame(kind, arg); goTo(f[0], f[1], { hold: true }); return; }   // đổi sang ghế khác
    if (open) return;
    open = kind; const b = BENCH[kind];
    eyebrow.textContent = b.eyebrow; title.textContent = b.title; text.textContent = b.intro;
    acts.querySelectorAll('.btn:not(#benchClose)').forEach(n => n.remove());
    CONTROLS[kind]();
    el.hidden = false; document.body.classList.add('acting'); document.documentElement.style.overflow = 'hidden';
    const f = frame(kind, arg);
    if (f) goTo(f[0], f[1], { hold: true });
    close.focus();
  }
  function hide() {
    if (!open) return;
    if (DONE[open]) DONE[open]();
    open = null; el.hidden = true; document.body.classList.remove('acting'); document.documentElement.style.overflow = '';
    release();
  }
  // chấm "Ngồi xuống" không gắn với ghế nào: chọn ghế gần chấm nhất
  let seats = [];
  const nearestSeat = () => {
    const at = toPlan(...BENCH.seat.at), v = V(0, 0, 0);
    return seats.reduce((best, s) => (s.pick.getWorldPosition(v).distanceToSquared(at) < best.pick.getWorldPosition(V(0, 0, 0)).distanceToSquared(at) ? s : best));
  };
  close.addEventListener('click', hide);
  addEventListener('keydown', e => { if (open && e.key === 'Escape' && !Menu.isOpen()) hide(); });
  return { show, hide, isOpen: () => !!open, setSeats: list => { seats = list; } };
})();
