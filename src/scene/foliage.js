// Lá cây: mọi chiếc lá được gom lại và vẽ bằng vài InstancedMesh cho nhẹ.
import { SHADOWS, T, scene } from './core.js';
import { live } from './helpers.js';
import { R, rr } from './random.js';

export const FOL = {};
export function leafKind(key, tex) { FOL[key] = { tex, items: [] }; }
export function leaf(key, x, y, z, rx, ry, rz, s, color) { FOL[key].items.push([x, y, z, rx, ry, rz, s, color]); }
export function leafBlob(key, cx, cy, cz, r, n, s, hue = [0.24, 0.3], light = [0.24, 0.36], flat = 0.8) {
  for (let i = 0; i < n; i++) {
    const u = R() * 2 - 1, a = R() * 6.283, q = Math.sqrt(1 - u * u), d = r * (0.5 + 0.5 * Math.sqrt(R()));
    leaf(key, cx + Math.cos(a) * q * d, cy + u * d * flat, cz + Math.sin(a) * q * d, rr(-1.3, 1.3), R() * 6.28, rr(-1.3, 1.3), s * rr(0.75, 1.25),
      new T.Color().setHSL(rr(hue[0], hue[1]), rr(0.45, 0.6), rr(light[0], light[1])));
  }
}
export function flushFoliage() {
  const o = new T.Object3D();
  for (const key in FOL) {
    const f = FOL[key]; if (!f.items.length) continue;
    const geo = new T.PlaneGeometry(1, 1); geo.translate(0, 0.48, 0);
    const mat = new T.MeshStandardMaterial({ map: f.tex, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.7 });
    const im = new T.InstancedMesh(geo, mat, f.items.length);
    f.items.forEach(([x, y, z, rx, ry, rz, s, c], i) => {
      o.position.set(x, y, z); o.rotation.set(rx, ry, rz, 'YXZ'); o.scale.set(s, s, s); o.updateMatrix();
      im.setMatrixAt(i, o.matrix); im.setColorAt(i, c.convertSRGBToLinear());
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.receiveShadow = SHADOWS; live(im); scene.add(im);
  }
}
