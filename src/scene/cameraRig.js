// Đường bay camera qua các trạm (và các điểm via), cộng chút liếc theo chuột.
import { reduce } from '../env.js';
import { T, camera, measureView, renderer, view } from './core.js';
import { adjustView } from './explore.js';
import { UP, toPlan, V } from './helpers.js';

export function createRig(stations) {
  const N = stations.length;
  // via: các điểm camera đi qua giữa hai trạm (lối đi, bậc cầu thang), không dừng lại
  let posC, lookC, portrait = null, idx = [], M1 = 1;
  function build(p) {
    if (p === portrait) return; portrait = p;
    const cam = s => (p && s.cameraPortrait) || s.camera, pts = [];
    idx = [];
    stations.forEach(s => { (s.via || []).forEach(v => pts.push(v)); idx.push(pts.length); pts.push(cam(s)); });
    M1 = pts.length - 1;
    posC = new T.CatmullRomCurve3(pts.map(c => toPlan(...c.pos)), false, 'centripetal');
    lookC = new T.CatmullRomCurve3(pts.map(c => toPlan(...c.look)), false, 'centripetal');
  }
  build(view.w / view.h < 0.8);
  const p = V(0, 0, 0), l = V(0, 0, 0), fwd = V(0, 0, 0), right = V(0, 0, 0);
  let mx = 0, my = 0, sx = 0, sy = 0, fitted = false;
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; } });
  return {
    place(progress) {
      const i = Math.min(N - 2, Math.floor(progress)), f = progress - i;
      const t = (idx[i] + f * (idx[i + 1] - idx[i])) / M1;
      posC.getPoint(t, p); lookC.getPoint(t, l);
      if (!reduce) {
        sx += (mx - sx) * 0.05; sy += (my - sy) * 0.05;
        if (Math.abs(mx - sx) + Math.abs(my - sy) < 0.002) { sx = mx; sy = my; }
        fwd.subVectors(l, p).normalize(); right.crossVectors(fwd, UP).normalize();
        const d = p.distanceTo(l);
        l.addScaledVector(right, sx * d * 0.08).addScaledVector(UP, -sy * d * 0.045);
      }
      adjustView(p, l);
      camera.position.copy(p); camera.lookAt(l);
    },
    // chuột đã dừng và camera liếc xong: không cần vẽ lại vì chuyển động của camera nữa
    still: () => reduce || (sx === mx && sy === my),
    fit() {
      const { w, h } = view; measureView();
      if (w === view.w && h === view.h && fitted) return;
      fitted = true;
      const a = view.w / view.h; build(a < 0.8);
      // màn ngang điện thoại rất dài: thu góc dọc để hai mép hình không bị kéo giãn
      camera.aspect = a; camera.fov = a < 0.8 ? 74 : a < 1.2 ? 64 : a < 1.9 ? 56 : 48; camera.updateProjectionMatrix();
      renderer.setSize(view.w, view.h, false);
    }
  };
}
