// Khởi động cảnh: dựng từng khu (có thanh tải), rồi chạy vòng lặp vẽ.
import { STATIONS } from '../config/stations.js';
import { reduce } from '../env.js';
import { setMood, setRain, setTime } from './atmosphere.js';
import { createRig } from './cameraRig.js';
import { PICK, SHADOWS, camera, initCore, renderer, runFrame, scene } from './core.js';
import { addPick, exploreBusy, exploreUpdate, initExplore } from './explore.js';
import { toPlan } from './helpers.js';
import { createQuality } from './quality.js';
import { SEATS } from './zones/camping.js';
import { BUILD_STEPS } from './zones/index.js';
import { Bench } from '../ui/bench.js';
import { createClock } from '../ui/clock.js';
import { createHint } from '../ui/hint.js';
import { createHotspots } from '../ui/hotspots.js';
import { Lightbox } from '../ui/lightbox.js';
import { Menu } from '../ui/menu.js';

// Bám theo tiến độ cuộn bằng lò xo tới hạn: khởi động êm và dừng êm, tay vuốt giật mấy camera cũng không giật theo.
const SMOOTH = 0.15;
function follow(cur, target, s, dt) {
  const o = 2 / SMOOTH, x = o * dt, e = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x), d = cur - target, tmp = (s.v + o * d) * dt;
  s.v = (s.v - o * tmp) * e;
  return target + (d + tmp) * e;
}
// Vẽ một lần sau màn tải, kể cả thứ ngoài khung hình: texture và shader lên GPU sẵn, cú cuộn đầu không bị khựng.
function warmUp() {
  const off = [];
  scene.traverse(o => { if (o.isMesh && o.frustumCulled) { o.frustumCulled = false; off.push(o); } });
  renderer.render(scene, camera);
  off.forEach(o => { o.frustumCulled = true; });
}
const IDLE_MS = 32;   // camera đứng yên: chỉ vẽ khoảng 30 hình/giây cho quạt, cửa, đỡ nóng máy

export function startScene({ canvas, scroll, hud, onProgress, onReady }) {
  initCore(canvas);
  const rig = createRig(STATIONS);
  addEventListener('resize', () => rig.fit());
  const quality = createQuality();
  const spring = { v: 0 };
  let cur = 0, last = 0, drawn = 0, hs, hint;
  return new Promise((resolve, reject) => {
    let i = 0;
    (function next() {
      try {
        if (i < BUILD_STEPS.length) { BUILD_STEPS[i++](); onProgress(0.08 + 0.87 * i / BUILD_STEPS.length); requestAnimationFrame(next); return; }
        hs = createHotspots(); hint = createHint(); initExplore();
        // vật nhỏ nằm trong khối quầy phải thêm trước khối quầy
        addPick(PICK.espresso, () => Bench.show('brew')); addPick(PICK.roaster, () => Bench.show('roast'));
        addPick(PICK.desk, () => Bench.show('desk')); addPick(PICK.blind, () => Bench.show('blind')); addPick(PICK.tree, () => Bench.show('tree'));
        Bench.setSeats(SEATS); SEATS.forEach(s => addPick(s.pick, () => Bench.show('seat', s)));
        addPick(PICK.menu, () => Menu.show());
        createClock(setTime, setRain);
        rig.fit(); scroll.measure(); cur = scroll.target(); rig.place(cur);
        renderer.compile(scene, camera);
        // cảnh tĩnh và không vật chuyển động nào đổ bóng: tính bóng một lần rồi dùng lại
        if (SHADOWS) { renderer.shadowMap.autoUpdate = false; renderer.shadowMap.needsUpdate = true; }
        warmUp();
        onReady(); requestAnimationFrame(loop); resolve();
      } catch (err) { reject(err); }
    })();
  });
  function loop(t) {
    requestAnimationFrame(loop);
    if (Menu.isOpen() || Lightbox.isOpen()) { last = t; return; }
    const raw = (t - (last || t)) / 1000, dt = Math.min(0.1, raw);
    const target = scroll.target();
    const moving = cur !== target || exploreBusy();
    if (!moving && rig.still() && t - drawn < IDLE_MS && !(import.meta.env.DEV && window.__cam)) return;
    last = t; drawn = t;
    if (reduce) cur = target;
    else cur = follow(cur, target, spring, dt);
    if (Math.abs(target - cur) < 2e-4 && Math.abs(spring.v) < 2e-3) { cur = target; spring.v = 0; }
    if (moving) quality.sample(raw);
    exploreUpdate(dt);
    rig.place(cur); hud.update(cur); setMood(cur); hint.update(cur);
    // góc máy thử khi so với ảnh thật (chỉ khi chạy npm run dev): gõ window.__cam = { pos: [x, y, z], look: [x, y, z] } trong console
    if (import.meta.env.DEV && window.__cam) { camera.position.copy(toPlan(...window.__cam.pos)); camera.lookAt(toPlan(...window.__cam.look)); }
    runFrame(t, dt);
    hs.update(cur);
    renderer.render(scene, camera);
  }
}
export function hasWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
