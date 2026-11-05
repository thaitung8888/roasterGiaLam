// Đường bay camera qua các trạm (và các điểm via), cộng chút liếc theo chuột.
import { reduce } from '../env.js';
import { T, camera, renderer } from './core.js';
import { UP, V } from './helpers.js';

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
    posC = new T.CatmullRomCurve3(pts.map(c => V(...c.pos)), false, 'centripetal');
    lookC = new T.CatmullRomCurve3(pts.map(c => V(...c.look)), false, 'centripetal');
  }
  build(innerWidth / innerHeight < 0.8);
  const p = V(0, 0, 0), l = V(0, 0, 0), fwd = V(0, 0, 0), right = V(0, 0, 0);
  let mx = 0, my = 0, sx = 0, sy = 0;
  addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; } });
  return {
    place(progress) {
      const i = Math.min(N - 2, Math.floor(progress)), f = progress - i;
      const t = (idx[i] + f * (idx[i + 1] - idx[i])) / M1;
      posC.getPoint(t, p); lookC.getPoint(t, l);
      if (!reduce) {
        sx += (mx - sx) * 0.05; sy += (my - sy) * 0.05;
        fwd.subVectors(l, p).normalize(); right.crossVectors(fwd, UP).normalize();
        const d = p.distanceTo(l);
        l.addScaledVector(right, sx * d * 0.08).addScaledVector(UP, -sy * d * 0.045);
      }
      camera.position.copy(p); camera.lookAt(l);
    },
    fit() {
      const a = innerWidth / innerHeight; build(a < 0.8);
      camera.aspect = a; camera.fov = a < 0.8 ? 74 : a < 1.2 ? 64 : 56; camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }
  };
}
