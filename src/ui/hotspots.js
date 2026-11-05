// Chấm "Xem menu" gắn vào quầy và bấm thẳng vào quầy trong cảnh 3D để mở menu.
import { STATIONS } from '../config/stations.js';
import { $ } from '../env.js';
import { PICK, T, camera, view } from '../scene/core.js';
import { V, toPlan } from '../scene/helpers.js';

import { Menu } from './menu.js';

export function createHotspots() {
  const el = $('hsMenu'), at = toPlan(6.9, 1.45, -10.05), stop = STATIONS.findIndex(s => s.menu), v = V(0, 0, 0);
  const ray = new T.Raycaster(), ndc = new T.Vector2();
  let cur = 0, hover = false;
  el.addEventListener('click', e => { e.stopPropagation(); Menu.show(); });
  const near = () => Math.abs(cur - stop) < 0.14;
  function hit(x, y) {
    if (!near() || !PICK.menu) return false;
    ndc.set(x / view.w * 2 - 1, -(y / view.h) * 2 + 1); ray.setFromCamera(ndc, camera);
    return ray.intersectObject(PICK.menu).length > 0;
  }
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || Menu.isOpen()) return;
    hover = !e.target.closest('button, a, .rail') && hit(e.clientX, e.clientY);
    document.body.classList.toggle('pick', hover);
  });
  addEventListener('click', e => {
    if (Menu.isOpen() || e.target.closest('button, a, .rail, .menu')) return;
    if (hit(e.clientX, e.clientY)) Menu.show();
  });
  return {
    update(c) {
      cur = c;
      if (near()) {
        v.copy(at).project(camera);
        const vis = v.z < 1 && Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.9;
        if (vis) el.style.transform = `translate(${(v.x * 0.5 + 0.5) * view.w}px,${(-v.y * 0.5 + 0.5) * view.h}px)`;
        el.classList.toggle('on', vis); el.tabIndex = vis ? 0 : -1;
      } else if (el.classList.contains('on')) { el.classList.remove('on'); el.tabIndex = -1; document.body.classList.remove('pick'); }
    }
  };
}
