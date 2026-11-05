// Tầng 2: sàn lửng dọc tường trái, bồn cây phía dưới, cầu thang thép từ tầng 1, lan can kính.
import { BACK, LV } from '../../config/levels.js';
import { T, lin } from '../core.js';
import { V, add, box, boxAt, cyl, noCast, plane, quad, rod, std } from '../helpers.js';
import { M } from '../materials.js';
import { bistroChair, roundTable, woodChair } from '../props/furniture.js';
import { fig, planterRow } from '../props/plants.js';

export function buildFloor2() {
  const Y = LV.t2, X0 = -10, X1 = -5, Z0 = -9.5, Z1 = -24.7;
  // cầu thang tầng 1 → tầng 2 khoét vào khối sàn lửng (vuông góc với mép tầng 2), chỉ nhô ra xưởng khoảng 1,8 m
  // (theo ảnh: thang thép bậc xanh xám, sát vách đen của khối tầng 3, bên trái là tường trắng có bồn cây)
  const SZa = -23.45, SZb = Z1, SXo = -3.2, TR = 0.28, NS = 14, RISE = Y / (NS + 1), SXi = SXo - NS * TR;
  for (const [za, zb, xa] of [[Z0, SZa, X1], [SZa, SZb, SXi]]) {
    boxAt(X0, xa, 0, Y - 0.05, za, zb, M.white);
    noCast(boxAt(X0, xa, Y - 0.05, Y, za, zb, M.epoxy));
  }
  // bồn cây chân tường dưới sàn lửng: monstera, môn, dương xỉ, trầu bà rủ xuống
  planterRow(X1, -10.4, -22.9);
  // bậc từ dating lên tầng 2
  for (let k = 1; k <= 8; k++) boxAt(-9.9, -8.5, LV.date, LV.date + k * 0.2, -6.8 - (k - 1) * 0.3375, -6.8 - k * 0.3375, M.epoxy);
  rod(V(-8.5, LV.date + 0.95, -6.8), V(-8.5, Y + 0.95, -9.5), 0.02, M.steel);
  for (let k = 0; k <= 4; k++) { const z = -6.8 - k * 0.675, y = LV.date + k * 0.4; rod(V(-8.5, y, z), V(-8.5, y + 0.95, z), 0.013, M.steel); }
  // lan can kính kẹp chân
  // lan can kính cường lực: tấm kính hơi xanh có viền sáng, chân kẹp inox, tay vịn đen phía trên
  const railGlass = new T.MeshStandardMaterial({ color: lin('#bfe0e6'), roughness: 0.04, metalness: 0.25, transparent: true, opacity: 0.3, depthWrite: false, side: T.DoubleSide });
  const edgeM = std('#e8f3f4', 0.2, 0.3, { transparent: true, opacity: 0.75 }), handM = std('#141517', 0.4, 0.5);
  const glassPanel = (fixed, p, q, alongZ, y0 = Y) => {
    const c = (p + q) / 2, L = Math.abs(q - p) - 0.04, H = 1.0, at = (u, y) => alongZ ? [fixed, y, u] : [u, y, fixed];
    const m = plane(L, H, railGlass, ...at(c, y0 + 0.06 + H / 2), alongZ ? Math.PI / 2 : 0); m.renderOrder = 2; noCast(m);
    const ex = (w, h, u, y) => alongZ ? box(0.012, h, w, edgeM, fixed, y, u) : box(w, h, 0.012, edgeM, u, y, fixed);
    ex(L, 0.012, c, y0 + 0.06 + H); ex(L, 0.012, c, y0 + 0.06);
    for (const u of [c - L / 2, c + L / 2]) ex(0.012, H, u, y0 + 0.06 + H / 2);
    for (const u of [c - L / 2 + 0.18, c + L / 2 - 0.18]) { const [x, y, z] = at(u, y0 + 0.05); box(0.07, 0.1, 0.07, M.chrome, x, y, z); }
  };
  const glassRun = (fixed, a, b, alongZ) => {
    const dir = Math.sign(b - a), n = Math.max(1, Math.round(Math.abs(b - a) / 1.4));
    for (let k = 0; k < n; k++) glassPanel(fixed, a + dir * Math.abs(b - a) * k / n, a + dir * Math.abs(b - a) * (k + 1) / n, alongZ);
    const lo = Math.min(a, b), hi = Math.max(a, b);
    if (alongZ) boxAt(fixed - 0.025, fixed + 0.025, Y + 1.06, Y + 1.11, lo, hi, handM);
    else boxAt(lo, hi, Y + 1.06, Y + 1.11, fixed - 0.025, fixed + 0.025, handM);
  };
  glassRun(X1 - 0.04, Z0, SZa, true);   // chừa miệng cầu thang từ tầng 1 lên
  glassRun(Z0 + 0.04, -8.5, X1, false);
  // bậc thép tấm xanh xám, cổ bậc kín; phần nhô ra có má thang thép đen
  const stl = std('#141517', 0.45, 0.5), stepM = std('#55687a', 0.5, 0.45), riserM = std('#46586a', 0.55, 0.4);
  for (let k = 1; k <= NS; k++) {
    const xa = SXo - (k - 1) * TR, xb = SXo - k * TR, y = k * RISE;
    boxAt(xb, xa, 0, y - 0.05, SZa, SZb, M.white);
    boxAt(xb, xa + 0.02, y - 0.05, y, SZa + 0.01, SZb - 0.01, stepM);
    boxAt(xa + 0.002, xa + 0.012, y - RISE, y - 0.05, SZa + 0.01, SZb - 0.01, riserM);
    box(0.03, 0.006, Math.abs(SZb - SZa) - 0.1, std('#2a2d30', 0.6, 0.5), xa - 0.0, y + 0.003, (SZa + SZb) / 2);   // nẹp chống trượt
  }
  const yAtX = x => Math.min(Y, Math.max(0, (SXo - x) / TR) * RISE);
  // má thang đen hai bên phần nhô ra khỏi tường
  for (const z of [SZa - 0.005, SZb + 0.005]) noCast(quad(V(SXo, 0, z), V(X1, 0, z), V(X1, yAtX(X1) + 0.02, z), V(SXo, 0.2, z), stl));
  // vách đen của khối tầng 3 chạy dọc bên phải thang
  noCast(plane(BACK.xRoom - SXi + 0.4, LV.t3 + 1.05, std('#1c1e21', 0.7, 0.2), (BACK.xRoom + SXi - 0.4) / 2, (LV.t3 + 1.05) / 2, SZb + 0.012));
  // tay vịn: bên phải bắt vào vách đen suốt chiều dài; bên trái có song đứng ở đoạn nhô ra rồi chạy tiếp trên tường trắng
  rod(V(SXo, 0.95, SZb + 0.06), V(SXi, Y + 0.95, SZb + 0.06), 0.022, stl, null, 6);
  for (let x = SXo; x > SXi; x -= 0.9) rod(V(x, yAtX(x) + 0.9, SZb + 0.012), V(x, yAtX(x) + 0.9, SZb + 0.06), 0.01, stl, null, 4);
  for (let x = SXo; x > X1 - 0.05; x -= 0.14) rod(V(x, yAtX(x), SZb + 0.03), V(x, yAtX(x) + 0.92, SZb + 0.03), 0.008, stl, null, 4);
  rod(V(SXo, 0.95, SZa + 0.05), V(SXi, Y + 0.95, SZa + 0.05), 0.022, stl, null, 6);
  for (let x = SXo; x > X1 - 0.05; x -= 0.14) rod(V(x, yAtX(x), SZa + 0.03), V(x, yAtX(x) + 0.92, SZa + 0.03), 0.008, stl, null, 4);
  // lan can kính quanh miệng cầu thang trên tầng 2 (khung đen mảnh như ảnh)
  glassRun(SZa + 0.04, SXi, X1, false);
  // đèn rọi nhỏ màu đen gắn trên tường trắng dưới mép tầng 2
  for (let z = -10.9; z > -22.6; z -= 1.55) {
    box(0.05, 0.08, 0.05, stl, X1 + 0.03, 2.25, z);
    const h = cyl(0.035, 0.035, 0.12, stl, X1 + 0.1, 2.25, z, 10); h.rotation.z = Math.PI / 2 - 0.5;
  }
  // bộ bàn ghế băng gỗ sơn xanh rêu cạnh chân thang
  const olive = std('#6f7a4a', 0.75);
  box(0.5, 0.05, 1.2, olive, -3.85, 0.45, -22.3); for (const z of [-21.8, -22.8]) box(0.44, 0.42, 0.06, olive, -3.85, 0.21, z);
  box(0.7, 0.05, 1.0, olive, -3.05, 0.74, -22.25); for (const z of [-21.85, -22.65]) box(0.62, 0.72, 0.06, olive, -3.05, 0.36, z);
  // bàn tròn dọc lan can, bàn vuông sát tường
  // còn một nửa: 2 bàn tròn sát lan can, 2 bàn nhỏ sát tường, đặt so le cho thoáng
  for (const z of [-12.2, -17.6]) {
    roundTable(-5.85, Y, z);
    woodChair(-6.45, Y, z + 0.1, Math.PI / 2); woodChair(-5.85, Y, z - 0.62, 0);
  }
  for (const z of [-14.9, -20.0]) {
    roundTable(-9.25, Y, z, 0.3);
    bistroChair(-8.6, Y, z, -Math.PI / 2); bistroChair(-9.3, Y, z + 0.62, Math.PI);
  }
  fig(-9.45, Y, -11.0, 1.35); fig(-9.4, Y, -18.0, 1.15); fig(-9.4, Y, -22.5, 1.3);
  // đèn tường
  for (let z = -11.5; z > -24.5; z -= 4) {
    const m = new T.Mesh(new T.SphereGeometry(0.13, 16, 8, 0, Math.PI), M.lamp); m.position.set(-9.98, 4.7, z); m.rotation.y = Math.PI / 2; noCast(add(m));
  }
}
