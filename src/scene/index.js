// Khởi động cảnh: dựng từng khu (có thanh tải), rồi chạy vòng lặp vẽ.
import { STATIONS } from '../config/stations.js';
import { reduce } from '../env.js';
import { createRig } from './cameraRig.js';
import { camera, initCore, renderer, runFrame, scene } from './core.js';
import { BUILD_STEPS } from './zones/index.js';
import { createHotspots } from '../ui/hotspots.js';
import { Menu } from '../ui/menu.js';

export function startScene({ canvas, scroll, hud, onProgress, onReady }) {
  initCore(canvas);
  const rig = createRig(STATIONS);
  addEventListener('resize', () => { rig.fit(); scroll.measure(); });
  let cur = 0, last = 0, hs;
  return new Promise((resolve, reject) => {
    let i = 0;
    (function next() {
      try {
        if (i < BUILD_STEPS.length) { BUILD_STEPS[i++](); onProgress(0.08 + 0.87 * i / BUILD_STEPS.length); requestAnimationFrame(next); return; }
        hs = createHotspots();
        rig.fit(); scroll.measure(); cur = scroll.target(); rig.place(cur);
        renderer.compile(scene, camera);
        onReady(); requestAnimationFrame(loop); resolve();
      } catch (err) { reject(err); }
    })();
  });
  function loop(t) {
    requestAnimationFrame(loop);
    if (Menu.isOpen()) { last = t; return; }
    const dt = Math.min(0.1, (t - (last || t)) / 1000); last = t;
    const target = scroll.target();
    cur += (target - cur) * (reduce ? 1 : 1 - Math.exp(-dt * 4.2));
    if (Math.abs(target - cur) < 1e-4) cur = target;
    rig.place(cur); hud.update(cur);
    // góc máy thử khi so với ảnh thật (chỉ khi chạy npm run dev): gõ window.__cam = { pos: [x, y, z], look: [x, y, z] } trong console
    if (import.meta.env.DEV && window.__cam) { camera.position.set(...window.__cam.pos); camera.lookAt(...window.__cam.look); }
    runFrame(t, dt);
    hs.update(cur);
    renderer.render(scene, camera);
  }
}
export function hasWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
