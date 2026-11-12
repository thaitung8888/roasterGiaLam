// Chấm gắn vào cảnh 3D: "Xem menu" ở quầy, "Xem ảnh" ở từng trạm, "Pha một ly" và "Rang một mẻ" trên đồ vật.
// Bấm thẳng vào đồ vật trong cảnh do explore.js lo.
import { PHOTOS } from '../config/photos.js';
import { STATIONS } from '../config/stations.js';
import { BENCH } from '../config/stories.js';
import { $ } from '../env.js';
import { camera, view } from '../scene/core.js';
import { V, toPlan } from '../scene/helpers.js';

import { Bench } from './bench.js';
import { Lightbox } from './lightbox.js';
import { Menu } from './menu.js';

const NEAR = 0.14;   // chấm chỉ hiện khi camera đã gần tới trạm
const stopOf = id => STATIONS.findIndex(s => s.id === id);

function spot(label, aria, cls, onClick) {
  const el = document.createElement('button');
  el.type = 'button'; el.className = 'hs ' + cls; el.tabIndex = -1; el.setAttribute('aria-label', aria);
  el.innerHTML = `<span class="dot"></span><span class="tag">${label}</span>`;
  el.addEventListener('click', e => { e.stopPropagation(); onClick(); });
  document.body.appendChild(el);
  return el;
}
function photoSpots() {
  return Object.entries(PHOTOS).flatMap(([id, list]) => list.map(p => (
    { el: spot('Xem ảnh', 'Xem ảnh: ' + p.text, 'photo-dot', () => Lightbox.show(p)), at: toPlan(...p.at), stop: stopOf(id), src: p.src, fetched: false })));
}
function actionSpots() {
  return Object.entries(BENCH).map(([kind, b]) => ({ el: spot(b.label, b.label, 'act', () => Bench.show(kind)), at: toPlan(...b.at), stop: stopOf(b.station) }));
}

export function createHotspots() {
  const menu = $('hsMenu'), v = V(0, 0, 0);
  menu.addEventListener('click', e => { e.stopPropagation(); Menu.show(); });
  const spots = [{ el: menu, at: toPlan(6.9, 1.45, -10.05), stop: STATIONS.findIndex(s => s.menu) }, ...actionSpots(), ...photoSpots()];
  return {
    update(cur) {
      const acting = Bench.isOpen();
      for (const s of spots) {
        // tới gần trạm thì tải sẵn ảnh, bấm vào là hiện ngay
        if (Math.abs(cur - s.stop) < 1 && s.src && !s.fetched) { s.fetched = true; new Image().src = s.src; }
        let vis = false;
        if (!acting && Math.abs(cur - s.stop) < NEAR) {
          v.copy(s.at).project(camera);
          vis = v.z < 1 && Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.9;
          if (vis) s.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * view.w}px,${(-v.y * 0.5 + 0.5) * view.h}px)`;
        }
        if (s.el.classList.contains('on') !== vis) { s.el.classList.toggle('on', vis); s.el.tabIndex = vis ? 0 : -1; }
      }
    }
  };
}
