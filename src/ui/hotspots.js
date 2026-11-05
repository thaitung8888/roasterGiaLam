// Chấm gắn vào cảnh 3D: "Xem menu" ở quầy, "Xem ảnh" ở từng trạm, và bấm thẳng vào quầy để mở menu.
import { PHOTOS } from '../config/photos.js';
import { STATIONS } from '../config/stations.js';
import { $ } from '../env.js';
import { PICK, T, camera, view } from '../scene/core.js';
import { V, toPlan } from '../scene/helpers.js';

import { Lightbox } from './lightbox.js';
import { Menu } from './menu.js';

const NEAR = 0.14;   // chấm chỉ hiện khi camera đã gần tới trạm

function photoSpots() {
  return Object.entries(PHOTOS).flatMap(([id, list]) => {
    const stop = STATIONS.findIndex(s => s.id === id);
    return list.map(p => {
      const el = document.createElement('button');
      el.type = 'button'; el.className = 'hs'; el.tabIndex = -1; el.setAttribute('aria-label', 'Xem ảnh: ' + p.text);
      el.innerHTML = '<span class="dot"></span><span class="tag">Xem ảnh</span>';
      el.addEventListener('click', e => { e.stopPropagation(); Lightbox.show(p); });
      document.body.appendChild(el);
      return { el, at: toPlan(...p.at), stop, src: p.src, fetched: false };
    });
  });
}

export function createHotspots() {
  const menuStop = STATIONS.findIndex(s => s.menu), v = V(0, 0, 0);
  const spots = [{ el: $('hsMenu'), at: toPlan(6.9, 1.45, -10.05), stop: menuStop }, ...photoSpots()];
  const ray = new T.Raycaster(), ndc = new T.Vector2();
  let cur = 0, hover = false;
  spots[0].el.addEventListener('click', e => { e.stopPropagation(); Menu.show(); });
  const nearMenu = () => Math.abs(cur - menuStop) < NEAR;
  const busy = () => Menu.isOpen() || Lightbox.isOpen();
  function hit(x, y) {
    if (!nearMenu() || !PICK.menu) return false;
    ndc.set(x / view.w * 2 - 1, -(y / view.h) * 2 + 1); ray.setFromCamera(ndc, camera);
    return ray.intersectObject(PICK.menu).length > 0;
  }
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || busy()) return;
    hover = !e.target.closest('button, a, .rail') && hit(e.clientX, e.clientY);
    document.body.classList.toggle('pick', hover);
  });
  addEventListener('click', e => {
    if (busy() || e.target.closest('button, a, .rail, .menu, .photo')) return;
    if (hit(e.clientX, e.clientY)) Menu.show();
  });
  return {
    update(c) {
      cur = c;
      for (const s of spots) {
        const near = Math.abs(cur - s.stop) < NEAR;
        // tới gần trạm thì tải sẵn ảnh, bấm vào là hiện ngay
        if (Math.abs(cur - s.stop) < 1 && s.src && !s.fetched) { s.fetched = true; new Image().src = s.src; }
        if (near) {
          v.copy(s.at).project(camera);
          const vis = v.z < 1 && Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.9;
          if (vis) s.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * view.w}px,${(-v.y * 0.5 + 0.5) * view.h}px)`;
          s.el.classList.toggle('on', vis); s.el.tabIndex = vis ? 0 : -1;
        } else if (s.el.classList.contains('on')) { s.el.classList.remove('on'); s.el.tabIndex = -1; document.body.classList.remove('pick'); }
      }
    }
  };
}
