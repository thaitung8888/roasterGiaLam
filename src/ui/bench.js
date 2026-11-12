// Bảng tương tác: pha một ly ở quầy, rang một mẻ ở xưởng rang. Mở ra thì camera tiến lại gần đồ vật.
import { MENU } from '../config/menu.js';
import { BENCH, DRINKS, ROAST_STAGES } from '../config/stories.js';
import { $, esc, vnd } from '../env.js';
import { BREW } from '../scene/brew.js';
import { goTo, release } from '../scene/explore.js';
import { toPlan } from '../scene/helpers.js';
import { ROAST } from '../scene/zones/roastery.js';

import { Menu } from './menu.js';

export const Bench = (() => {
  const el = $('bench'), eyebrow = $('benchEyebrow'), title = $('benchTitle'), text = $('benchText'), ctl = $('benchCtl'), close = $('benchClose');
  let open = null;

  function brew() {
    const coffee = MENU.find(g => g.id === 'ca-phe').items;
    ctl.innerHTML = `<div class="chips" role="group" aria-label="Chọn món">${coffee.map(([n]) => `<button type="button" aria-pressed="false">${esc(n)}</button>`).join('')}</div>`;
    const chips = [...ctl.querySelectorAll('button')];
    chips.forEach((b, i) => b.addEventListener('click', () => {
      const [name, , price] = coffee[i];
      chips.forEach(c => c.setAttribute('aria-pressed', c === b ? 'true' : 'false'));
      BREW.pour(name);
      text.innerHTML = `${esc(DRINKS[name] || '')} <span class="price">${price ? vnd(price) : ''}</span>`;
    }));
    const more = document.createElement('button');
    more.type = 'button'; more.className = 'btn ghost'; more.textContent = 'Xem cả menu';
    more.addEventListener('click', () => Menu.show());
    $('benchActs').prepend(more);
  }
  function roast() {
    const v = Math.round(ROAST.level * 100);
    ctl.innerHTML = `<div class="roast">
      <p class="stage" aria-live="polite"></p>
      <input type="range" min="0" max="100" value="${v}" aria-label="Nhiệt độ rang">
      <div class="scale"><span>Hạt xanh</span><span>Rang vừa</span><span>Rang đậm</span></div></div>`;
    const range = ctl.querySelector('input'), stage = ctl.querySelector('.stage');
    const show = () => {
      const k = Number(range.value), s = ROAST_STAGES.find(x => k < x.to);
      ROAST.set(k / 100); stage.textContent = s.name; text.textContent = s.text;
    };
    range.addEventListener('input', show); show();
  }

  function show(kind) {
    if (open) return;
    open = kind; const b = BENCH[kind];
    eyebrow.textContent = b.eyebrow; title.textContent = b.title; text.textContent = b.intro;
    $('benchActs').querySelectorAll('.btn:not(#benchClose)').forEach(n => n.remove());
    (kind === 'brew' ? brew : roast)();
    el.hidden = false; document.body.classList.add('acting'); document.documentElement.style.overflow = 'hidden';
    goTo(toPlan(...b.camera.pos), toPlan(...b.camera.look), { hold: true });
    close.focus();
  }
  function hide() {
    if (!open) return;
    if (open === 'brew') BREW.clear();
    open = null; el.hidden = true; document.body.classList.remove('acting'); document.documentElement.style.overflow = '';
    release();
  }
  close.addEventListener('click', hide);
  addEventListener('keydown', e => { if (open && e.key === 'Escape' && !Menu.isOpen()) hide(); });
  return { show, hide, isOpen: () => !!open };
})();
