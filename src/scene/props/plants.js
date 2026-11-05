// Cây và chậu: bàng Singapore, monstera, môn, dương xỉ, trầu bà, cây có tán, bồn cây.
import { T, scene } from '../core.js';
import { leaf, leafBlob } from '../foliage.js';
import { V, boxAt, cyl, noCast, rod, std } from '../helpers.js';
import { M } from '../materials.js';
import { R, rr } from '../random.js';

export function pot(x, y, z, r, h, mat) { cyl(r, r * 0.8, h, mat || M.potConc, x, y + h / 2, z, 18); cyl(r * 0.92, r * 0.92, 0.02, M.soil, x, y + h - 0.03, z, 16); }
export function fig(x, y, z, s = 1, potMat) {   // bàng Singapore
  pot(x, y, z, 0.24 * s, 0.42 * s, potMat);
  const top = y + 0.42 * s;
  for (let k = 0; k < 4; k++) {
    const a = R() * 6.28, hgt = rr(0.9, 1.7) * s, b = V(x + Math.cos(a) * 0.05, top, z + Math.sin(a) * 0.05), e = V(x + Math.cos(a) * 0.2 * s, top + hgt, z + Math.sin(a) * 0.2 * s);
    rod(b, e, 0.015 * s, M.trunk);
    for (let j = 0; j < 9; j++) {
      const t = rr(0.35, 1), p = b.clone().lerp(e, t);
      leaf('fig', p.x, p.y, p.z, rr(-0.9, -0.2), R() * 6.28, rr(-0.4, 0.4), rr(0.3, 0.42) * s, new T.Color().setHSL(rr(0.25, 0.3), 0.5, rr(0.2, 0.3)));
    }
  }
}
export function monstera(x, y, z, s = 1, potH = 0) {
  if (potH) pot(x, y, z, 0.26 * s, potH);
  const base = y + potH;
  for (let k = 0; k < 9; k++) {
    const a = k / 9 * 6.28 + rr(-0.3, 0.3), len = rr(0.4, 0.8) * s, tip = V(x + Math.cos(a) * len * 0.6, base + len, z + Math.sin(a) * len * 0.6);
    rod(V(x, base, z), tip, 0.008, std('#4f7a35', 0.8));
    leaf('monstera', tip.x, tip.y - 0.05, tip.z, rr(0.6, 1.1), -a + Math.PI / 2, 0, rr(0.42, 0.6) * s, new T.Color().setHSL(rr(0.27, 0.31), 0.55, rr(0.18, 0.27)));
  }
}
export function spiky(x, y, z, s = 1) {   // phát tài / cau cảnh lá dài
  pot(x, y, z, 0.2 * s, 0.34 * s, M.potClay);
  const top = y + 0.34 * s;
  rod(V(x, top, z), V(x, top + 0.9 * s, z), 0.02 * s, M.trunk);
  for (let k = 0; k < 26; k++) leaf('blade', x, top + rr(0.6, 0.95) * s, z, rr(-1.4, -0.3), R() * 6.28, 0, rr(0.35, 0.5) * s, new T.Color().setHSL(rr(0.22, 0.3), 0.4, rr(0.3, 0.42)));
}
// lá to bóng mọc dọc một đoạn cành, cùng kiểu với cây ficus trong nhà; sun: cây ngoài trời sáng và ngả vàng hơn một chút
function leafBranch(a, b, count, reach, size, sun = 0) {
  for (let i = 0; i < count; i++) {
    const p = a.clone().lerp(b, rr(0.15, 1)), yaw = R() * 6.28, r = rr(0.05, reach), young = R() < 0.12;
    leaf('ficus', p.x + Math.cos(yaw) * r, p.y + rr(-0.14, 0.2), p.z + Math.sin(yaw) * r, rr(0.5, 1.5), Math.PI / 2 - yaw, rr(-0.4, 0.4), size * rr(0.8, 1.2),
      new T.Color().setHSL(young ? rr(0.2, 0.24) : rr(0.27, 0.32) - sun * 0.02, young ? 0.55 : 0.5, young ? rr(0.38, 0.46) : rr(0.17, 0.28) + sun * 0.05));
  }
}
export function tree(x, z, h, crown, n, y = 0) {   // cây tán lớn ngoài trời: thân cong nhẹ, cành vươn lên, lá dày dọc cành
  const pts = [V(x, y, z)], lx = rr(-0.3, 0.3), lz = rr(-0.3, 0.3), H = h * 0.62;
  for (let k = 1; k <= 5; k++) { const t = k / 5; pts.push(V(x + lx * t + Math.sin(t * 4) * 0.06, y + t * H, z + lz * t)); }
  const r0 = 0.03 * h;
  for (let k = 0; k < 5; k++) rod(pts[k], pts[k + 1], r0 * (1 - k * 0.15), M.trunk, scene, 8);
  const br = [], N = 9;
  for (let k = 0; k < N; k++) {
    const p = pts[2 + k % 4], a = k * 2.4 + rr(-0.3, 0.3), len = crown * rr(0.6, 1), up = h * rr(0.14, 0.3);
    const e = V(p.x + Math.cos(a) * len, p.y + up, p.z + Math.sin(a) * len);
    rod(p, e, r0 * 0.42, M.trunk, scene, 6); br.push([p, e]);
    const a2 = a + rr(-0.7, 0.7), e2 = V(e.x + Math.cos(a2) * crown * rr(0.25, 0.45), e.y + h * rr(0.06, 0.14), e.z + Math.sin(a2) * crown * rr(0.25, 0.45));
    rod(e, e2, r0 * 0.24, M.trunk, scene, 5); br.push([e, e2]);
  }
  br.push([pts[4], V(pts[5].x, pts[5].y + h * 0.3, pts[5].z)]);
  const per = Math.round(n * 7 / br.length), reach = 0.34 + crown * 0.18;
  for (const [a, b] of br) leafBranch(a, b, per, reach, 0.28 + crown * 0.02, 1);
}

// Cây bàng Đài Loan (ficus) dáng cao thanh: thân cong nhẹ, cành vươn lên, lá to bóng mọc dọc cành
export function ficusTree(x, z, potR = 0.36, potH = 0.48) {
  pot(x, 0, z, potR, potH);
  const pts = [V(x, potH - 0.04, z)], lean = [rr(-0.12, 0.12), rr(0.05, 0.18)];
  for (let k = 1; k <= 6; k++) { const t = k / 6; pts.push(V(x + lean[0] * t * 3 + Math.sin(t * 4) * 0.06, potH + t * 3.3, z + lean[1] * t * 3)); }
  for (let k = 0; k < 6; k++) rod(pts[k], pts[k + 1], 0.06 - k * 0.007, M.trunk, null, 8);
  const br = [];
  for (let k = 0; k < 11; k++) {
    const p = pts[2 + (k % 5)].clone(), a = k * 2.4 + rr(-0.3, 0.3), len = rr(0.8, 1.4), up = rr(0.6, 1.3);
    const e = V(p.x + Math.cos(a) * len, p.y + up, p.z + Math.sin(a) * len);
    rod(p, e, 0.026, M.trunk, null, 6); br.push([p, e, a]);
    const a2 = a + rr(-0.7, 0.7), e2 = V(e.x + Math.cos(a2) * rr(0.3, 0.6), e.y + rr(0.3, 0.7), e.z + Math.sin(a2) * rr(0.3, 0.6));
    rod(e, e2, 0.016, M.trunk, null, 5); br.push([e, e2, a2]);
  }
  br.push([pts[4], V(pts[6].x, pts[6].y + 0.9, pts[6].z), 0]);
  for (const [a, b] of br) leafBranch(a, b, 70, 0.42, 0.27);
}
// Cây trong bồn: monstera (lá xẻ thuỳ), môn (lá tim), dương xỉ, trầu bà rủ
export function monsteraBig(x, y, z, s = 1) {
  const n = 8 + Math.floor(R() * 4);
  for (let k = 0; k < n; k++) {
    const a = k / n * 6.28 + rr(-0.25, 0.25), reach = rr(0.2, 0.45) * s, hgt = rr(0.3, 0.85) * s;
    const mid = V(x + Math.cos(a) * reach * 0.4, y + hgt * 0.7, z + Math.sin(a) * reach * 0.4), tip = V(x + Math.cos(a) * reach, y + hgt, z + Math.sin(a) * reach);
    rod(V(x, y, z), mid, 0.009, std('#4f7a35', 0.8), null, 4); rod(mid, tip, 0.008, std('#4f7a35', 0.8), null, 4);
    leaf('monstera', tip.x, tip.y - 0.04, tip.z, rr(0.35, 0.85), Math.PI / 2 - a, rr(-0.3, 0.3), rr(0.42, 0.62) * s, new T.Color().setHSL(rr(0.28, 0.32), 0.55, rr(0.16, 0.25)));
  }
}
export function alocasia(x, y, z, s = 1) {
  for (let k = 0; k < 5; k++) {
    const a = R() * 6.28, tip = V(x + Math.cos(a) * 0.15 * s, y + rr(0.6, 1.2) * s, z + Math.sin(a) * 0.15 * s);
    rod(V(x, y, z), tip, 0.01, std('#5d7d3a', 0.8), null, 4);
    leaf('heart', tip.x, tip.y - 0.03, tip.z, rr(0.25, 0.6), Math.PI / 2 - a, rr(-0.2, 0.2), rr(0.42, 0.6) * s, new T.Color().setHSL(rr(0.26, 0.3), 0.5, rr(0.2, 0.3)));
  }
}
export function fern(x, y, z, s = 1) {
  for (let k = 0; k < 28; k++) { const a = R() * 6.28; leaf('blade', x + Math.cos(a) * 0.06, y, z + Math.sin(a) * 0.06, rr(0.9, 1.45), Math.PI / 2 - a, 0, rr(0.4, 0.58) * s, new T.Color().setHSL(rr(0.24, 0.29), 0.5, rr(0.3, 0.4))); }
}
export function pothosTrail(x, y, z, len) {   // trầu bà rủ qua mép bồn (mép quay về +x)
  for (let k = 0; k < 16; k++) { const t = k / 15; leaf('heart', x + 0.03 + t * 0.04, y - t * len, z + Math.sin(t * 7) * 0.08, rr(0.9, 1.4), Math.PI / 2 - rr(-0.5, 0.5), Math.PI + rr(-0.3, 0.3), rr(0.07, 0.1), new T.Color().setHSL(rr(0.2, 0.26), 0.55, rr(0.3, 0.4))); }
}
// Bồn cây chạy dọc chân tường dưới sàn lửng tầng 2 (mặt bồn quay về +x)
export function planterRow(xw, za, zb) {
  const d = 0.75, h = 0.6, x1 = xw + d;
  boxAt(xw, x1, 0, h, za, zb, M.white);
  noCast(boxAt(xw + 0.04, x1 - 0.04, h - 0.04, h - 0.01, za - 0.04, zb + 0.04, M.soil));
  const seq = ['monstera', 'alocasia', 'fern', 'monstera', 'heartBush', 'alocasia', 'monstera', 'fern'];
  let i = 0;
  for (let z = za - 0.35; z > zb + 0.25; z -= rr(0.5, 0.7), i++) {
    const k = seq[i % seq.length], cx = xw + d * 0.45 + rr(-0.08, 0.08), cy = h - 0.02;
    if (k === 'monstera') monsteraBig(cx, cy, z, rr(1.05, 1.35));
    else if (k === 'alocasia') alocasia(cx, cy, z, rr(1.0, 1.3));
    else if (k === 'fern') fern(cx, cy, z, rr(0.9, 1.15));
    else leafBlob('heart', cx, cy + 0.45, z, 0.35, 40, 0.22, [0.24, 0.3], [0.2, 0.32]);
    if (i % 2 === 0) pothosTrail(x1, h, z + rr(-0.2, 0.2), rr(0.3, 0.5));
    leafBlob('blade', xw + d * 0.75, h + 0.15, z - 0.3, 0.22, 14, 0.3, [0.24, 0.3], [0.26, 0.36]);
  }
}
