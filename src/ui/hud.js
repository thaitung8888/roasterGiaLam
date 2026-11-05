// Phần trăm góc phải, thanh trạm bên phải, chú thích góc dưới.
import { $, esc, reduce } from '../env.js';
import { captionHtml } from './sections.js';

export function createHud(stations, scroll) {
  const N = stations.length, meter = $('meter'), rail = $('rail'), caption = $('caption');
  const btns = stations.map((st, i) => {
    const li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<span class="lbl">${i && i < N - 1 ? String(i).padStart(2, '0') + ' · ' : ''}${esc(st.label)}</span><span class="tick"></span>`;
    b.setAttribute('aria-label', st.label);
    b.addEventListener('click', () => scroll.goTo(i));
    li.appendChild(b); rail.appendChild(li); return b;
  });
  let timer = 0, active = -1;
  function swap(i) {
    clearTimeout(timer); caption.classList.remove('show');
    const html = captionHtml(stations[i], i);
    if (!html) return;
    timer = setTimeout(() => {
      caption.innerHTML = html;
      caption.classList.toggle('right', stations[i].side === 'right');
      caption.classList.toggle('panel', stations[i].kind === 'outro');
      void caption.offsetWidth; caption.classList.add('show');
    }, reduce ? 0 : 260);
  }
  return {
    update(p) {
      meter.textContent = String(Math.round(p / (N - 1) * 100)).padStart(2, '0') + '%';
      const a = Math.round(p);
      if (a === active) return;
      active = a;
      document.body.classList.toggle('at-hero', a === 0);
      btns.forEach((b, i) => { b.classList.toggle('on', i === a); b.setAttribute('aria-current', i === a ? 'step' : 'false'); });
      swap(a);
    }
  };
}
