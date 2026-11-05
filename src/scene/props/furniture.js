// Bàn ghế dùng lại ở nhiều khu.
import { T } from '../core.js';
import { V, beam, box, cyl, group, rod, std } from '../helpers.js';
import { M } from '../materials.js';

export function campChair(x, z, ry, fabric, parent) {
  const g = group(x, 0, z, ry, parent), fab = std(fabric, 0.92);
  for (const s of [-1, 1]) {
    rod(V(s * 0.27, 0, 0.24), V(s * 0.27, 0.44, -0.2), 0.012, M.steel, g);
    rod(V(s * 0.27, 0, -0.24), V(s * 0.27, 0.44, 0.2), 0.012, M.steel, g);
    rod(V(s * 0.28, 0.44, 0.2), V(s * 0.28, 0.62, 0.18), 0.012, M.steel, g);
    box(0.06, 0.025, 0.44, fab, s * 0.29, 0.62, -0.01, g);
    rod(V(s * 0.27, 0.36, -0.24), V(s * 0.29, 0.98, -0.42), 0.012, M.steel, g);
  }
  box(0.52, 0.03, 0.46, fab, 0, 0.35, -0.01, g).rotation.x = -0.14;
  const b = box(0.54, 0.62, 0.025, fab, 0, 0.68, -0.33, g); b.rotation.x = -0.3;
  if (fabric === '#2c48b4') box(0.55, 0.02, 0.03, std('#e6b430', 0.8), 0, 0.98, -0.42, g);
  return g;
}
export function kermitChair(x, z, ry, parent) {
  const g = group(x, 0, z, ry, parent), fab = std('#232427', 0.9);
  for (const s of [-1, 1]) {
    rod(V(s * 0.27, 0, 0.22), V(s * 0.27, 0.42, -0.18), 0.013, M.steel, g);
    rod(V(s * 0.27, 0, -0.22), V(s * 0.27, 0.42, 0.18), 0.013, M.steel, g);
    rod(V(s * 0.27, 0.42, -0.2), V(s * 0.27, 0.92, -0.3), 0.013, M.steel, g);
    box(0.055, 0.03, 0.46, M.wood, s * 0.29, 0.62, 0, g);
    rod(V(s * 0.28, 0.42, 0.18), V(s * 0.28, 0.61, 0.18), 0.012, M.steel, g);
  }
  box(0.52, 0.03, 0.44, fab, 0, 0.4, 0, g).rotation.x = -0.1;
  box(0.54, 0.4, 0.02, fab, 0, 0.74, -0.26, g).rotation.x = -0.18;
  return g;
}
export function lowTable(x, z, ry, color, parent) {
  const g = group(x, 0, z, ry, parent), top = std(color, 0.4, 0.5);
  box(0.56, 0.025, 0.4, top, 0, 0.36, 0, g);
  for (const sx of [-0.25, 0.25]) for (const sz of [-0.17, 0.17]) rod(V(sx, 0, sz), V(sx, 0.35, sz), 0.01, M.chrome, g);
  return g;
}
export function bistroChair(x, y, z, ry, parent) {
  const g = group(x, y, z, ry, parent);
  for (const sx of [-0.18, 0.18]) for (const sz of [-0.18, 0.18]) rod(V(sx * 1.08, 0, sz * 1.08), V(sx, 0.45, sz), 0.012, M.steel, g);
  box(0.42, 0.06, 0.42, M.cushion, 0, 0.48, 0, g);
  for (const sx of [-0.18, 0.18]) rod(V(sx, 0.45, -0.19), V(sx, 0.86, -0.24), 0.012, M.steel, g);
  box(0.4, 0.2, 0.025, M.wood, 0, 0.8, -0.235, g).rotation.x = -0.12;
  return g;
}
export function woodChair(x, y, z, ry, parent) {
  const g = group(x, y, z, ry, parent);
  for (const sx of [-0.18, 0.18]) for (const sz of [-0.18, 0.18]) box(0.035, 0.45, 0.035, M.woodDark, sx, 0.225, sz, g);
  box(0.42, 0.04, 0.42, M.woodDark, 0, 0.47, 0, g);
  box(0.42, 0.34, 0.03, M.woodDark, 0, 0.72, -0.2, g).rotation.x = -0.08;
  return g;
}
export function roundTable(x, y, z, r = 0.36, h = 0.74, parent) {
  const g = group(x, y, z, 0, parent);
  cyl(r, r, 0.03, M.blackTop, 0, h, 0, 24, g);
  cyl(0.028, 0.028, h, M.chrome, 0, h / 2, 0, 8, g);
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4; beam(V(0, 0.02, 0), V(Math.cos(a) * 0.3, 0.02, Math.sin(a) * 0.3), 0.05, 0.025, M.chrome, g); }
  return g;
}
export function barStool(x, z, parent, ry = 0) {
  const g = group(x, 0, z, ry, parent), fr = std('#3a3d40', 0.5, 0.5);
  for (const sx of [-0.15, 0.15]) for (const sz of [-0.15, 0.15]) rod(V(sx * 1.18, 0, sz * 1.18), V(sx, 0.72, sz), 0.011, fr, g);
  box(0.36, 0.025, 0.34, std('#26282b', 0.6), 0, 0.735, 0, g);
  for (const sz of [-0.165, 0.165]) box(0.36, 0.015, 0.015, fr, 0, 0.26, sz, g);
  for (const sx of [-0.165, 0.165]) box(0.015, 0.015, 0.36, fr, sx, 0.26, 0, g);
  for (const sz of [-0.07, 0.07]) rod(V(0.15, 0.72, sz), V(0.16, 0.95, sz), 0.009, fr, g);
  box(0.02, 0.02, 0.3, fr, 0.16, 0.95, 0, g);
  return g;
}
export function stool(x, y, z, parent) {
  const g = group(x, y, z, 0, parent);
  cyl(0.17, 0.17, 0.05, M.woodDark, 0, 0.66, 0, 18, g);
  for (let k = 0; k < 3; k++) { const a = k * 2.094; rod(V(Math.cos(a) * 0.17, 0, Math.sin(a) * 0.17), V(Math.cos(a) * 0.11, 0.64, Math.sin(a) * 0.11), 0.013, M.steel, g); }
  return g;
}
// ghế bành bọc vải xám, lưng cong ôm quanh, chân gỗ ngắn
export function tubChair(x, y, z, ry, parent) {
  const g = group(x, y, z, ry, parent), fab = std('#5f5d58', 0.95), r = 0.37, a0 = -0.6, a1 = Math.PI + 0.6;
  const sh = new T.Shape(); sh.absarc(0, 0, r, a0, a1, false); sh.absarc(0, 0, r - 0.09, a1, a0, true); sh.closePath();
  const back = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.44, bevelEnabled: true, bevelSize: 0.022, bevelThickness: 0.022, bevelSegments: 2, curveSegments: 14 }), fab);
  back.rotation.x = -Math.PI / 2; back.position.y = 0.26; g.add(back);
  cyl(r - 0.03, r - 0.06, 0.2, fab, 0, 0.34, 0, 24, g);
  cyl(r - 0.02, r - 0.05, 0.08, fab, 0, 0.21, 0, 24, g);
  for (const sx of [-0.2, 0.2]) for (const sz of [-0.2, 0.2]) rod(V(sx * 1.1, 0, sz * 1.1), V(sx, 0.18, sz), 0.016, M.wood, g, 8);
  return g;
}
export function plyChair(x, y, z, ry, parent) {
  const g = group(x, y, z, ry, parent);
  box(0.5, 0.04, 0.5, M.ply, 0, 0.38, 0, g);
  for (const s of [-1, 1]) box(0.035, 0.38, 0.5, M.ply, s * 0.23, 0.19, 0, g);
  box(0.5, 0.25, 0.03, M.ply, 0, 0.26, 0.24, g);
  const b = box(0.5, 0.82, 0.035, M.ply, 0, 0.78, -0.3, g); b.rotation.x = -0.3;
  return g;
}
