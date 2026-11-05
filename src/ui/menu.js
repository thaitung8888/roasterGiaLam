// Khung menu toàn màn hình: tab nhóm món, cuộn tới nhóm, đóng bằng Esc hoặc bấm ra ngoài.
import { MENU } from '../config/menu.js';
import { $, esc, reduce, vnd } from '../env.js';

export const Menu = (() => {
  const el = $('menu'), body = $('menuBody'), tabs = $('menuTabs');
  let last = null, open = false;
  body.innerHTML = MENU.map(g => `
    <section class="menu-sec" id="m-${g.id}" aria-labelledby="mh-${g.id}">
      <h3 id="mh-${g.id}">${esc(g.name)}<small>${esc(g.note)}</small></h3>
      ${g.items.map(([n, d, p]) => `<div class="item"><b>${esc(n)}</b><i>${vnd(p)}</i>${d ? `<span>${esc(d)}</span>` : ''}</div>`).join('')}
    </section>`).join('');
  const tabBtns = MENU.map((g, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = g.name; b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.addEventListener('click', () => {
      const sec = $('m-' + g.id);
      body.scrollTo({ top: sec.offsetTop - body.offsetTop - 12, behavior: reduce ? 'auto' : 'smooth' });
    });
    tabs.appendChild(b); return b;
  });
  body.addEventListener('scroll', () => {
    let cur = 0;
    MENU.forEach((g, i) => { if ($('m-' + g.id).offsetTop - body.offsetTop - 40 <= body.scrollTop) cur = i; });
    if (body.scrollTop + body.clientHeight >= body.scrollHeight - 4) cur = MENU.length - 1;
    tabBtns.forEach((b, i) => b.setAttribute('aria-selected', i === cur ? 'true' : 'false'));
  });
  function show() {
    if (open) return;
    open = true; last = document.activeElement; el.hidden = false; body.scrollTop = 0;
    document.documentElement.style.overflow = 'hidden';
    $('menuClose').focus();
  }
  function hide() {
    if (!open) return;
    open = false; el.hidden = true; document.documentElement.style.overflow = '';
    if (last && last.focus) last.focus();
  }
  $('menuClose').addEventListener('click', hide);
  el.addEventListener('click', e => { if (e.target === el) hide(); });
  addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'Tab') {   // giữ phím Tab trong khung menu
      const f = [...el.querySelectorAll('button')]; const first = f[0], lastF = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastF.focus(); }
      else if (!e.shiftKey && document.activeElement === lastF) { e.preventDefault(); first.focus(); }
    }
  });
  return { show, hide, isOpen: () => open };
})();
