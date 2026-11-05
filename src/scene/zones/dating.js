// Góc dating: sàn nâng 1 m, kính liền chạy hết chiều ngang, 3 bàn sát kính + 1 bàn cạnh cầu thang, dây lá rủ hai đầu kính.
import { LV } from '../../config/levels.js';
import { leafBlob } from '../foliage.js';
import { GLASS, V, box, boxAt, cyl, noCast, plane, rod, std } from '../helpers.js';
import { M } from '../materials.js';
import { bistroChair, squareTable } from '../props/furniture.js';
import { fig, pothosTrail, spiky } from '../props/plants.js';
import { rr } from '../random.js';

export function buildDating() {
  const Y = LV.date, X0 = -10, X1 = -0.5, Z0 = -0.22, Z1 = -9.5;
  boxAt(X0, X1, 0, Y - 0.04, Z0, Z1, M.white);
  noCast(boxAt(X0, X1, Y - 0.04, Y, Z0, Z1, M.epoxy));
  // bậc lên từ tầng 1
  for (let k = 1; k <= 6; k++) boxAt(X1 + (6 - k) * 0.3, X1 + (7 - k) * 0.3, 0, k / 6 * Y, -7.6, -9.45, M.epoxy);
  for (const z of [-7.62, -9.43]) {
    rod(V(X1 + 1.8, 0.95, z), V(X1, Y + 0.95, z), 0.022, M.steel);
    for (let k = 0; k <= 3; k++) { const x = X1 + 1.8 - k * 0.6; rod(V(x, (k * 0.6) / 1.8 * Y, z), V(x, (k * 0.6) / 1.8 * Y + 0.95, z), 0.014, M.steel); }
  }
  // lan can kính mép sàn
  const rail = (a, b, axis) => {
    const L = Math.abs(b - a), c = (a + b) / 2;
    if (axis === 'z') { noCast(plane(L, 0.9, GLASS(), X1 - 0.02, Y + 0.45, c, Math.PI / 2)); boxAt(X1 - 0.05, X1 + 0.01, Y + 0.88, Y + 0.92, a, b, M.steel); }
    else { noCast(plane(L, 0.9, GLASS(), c, Y + 0.45, Z1 + 0.02)); boxAt(a, b, Y + 0.88, Y + 0.92, Z1 + 0.05, Z1 - 0.01, M.steel); }
  };
  rail(Z0 - 0.4, -7.6, 'z'); rail(-5, X1, 'x');
  // 3 bộ bàn hai người sát vách kính + 1 bộ cạnh cầu thang từ tầng 1 lên
  for (const x of [-7.6, -5.0, -2.4]) {
    squareTable(x, Y, -0.85);
    bistroChair(x - 0.5, Y, -0.95, Math.PI / 2 + 0.2); bistroChair(x + 0.5, Y, -0.95, -Math.PI / 2 - 0.2);
  }
  squareTable(-1.35, Y, -6.55);   // cạnh đầu cầu thang đi từ tầng 1 lên
  bistroChair(-1.35, Y, -6.0, Math.PI); bistroChair(-1.9, Y, -6.7, Math.PI / 2 - 0.3);
  spiky(-9.5, Y, -0.6, 1.25); fig(-9.3, Y, -3.6, 0.95, M.potClay); spiky(-1.1, Y, -0.6, 1.05);
  // đồ trên bàn sát kính: ly cà phê trên đĩa, cuốn sách, bình hoa nhỏ
  const white = std('#f1eee7', 0.45), coffee = std('#3a2115', 0.3), T0 = Y + 0.755;
  for (const [x, dx] of [[-7.6, -0.14], [-7.6, 0.14], [-5.0, 0.13], [-2.4, -0.13], [-2.4, 0.13]]) {
    cyl(0.075, 0.06, 0.012, white, x + dx, T0 + 0.006, -0.82, 16);
    cyl(0.042, 0.034, 0.075, white, x + dx, T0 + 0.05, -0.82, 14); cyl(0.037, 0.037, 0.004, coffee, x + dx, T0 + 0.086, -0.82, 12);
  }
  box(0.17, 0.022, 0.23, std('#b5472f', 0.7), -5.14, T0 + 0.011, -0.8).rotation.y = 0.35;
  box(0.16, 0.018, 0.22, std('#ece6d8', 0.8), -5.14, T0 + 0.03, -0.8).rotation.y = 0.2;
  cyl(0.028, 0.038, 0.13, std('#d7e8ea', 0.15, 0.1), -2.4, T0 + 0.065, -0.62, 12);
  leafBlob('oval', -2.4, T0 + 0.22, -0.62, 0.075, 14, 0.055, [0.94, 0.97], [0.62, 0.72]);
  // dây lá rủ từ thanh treo trên mép kính, dồn về hai đầu để giữa khung vẫn thoáng
  const hangY = 3.98, hangZ = -0.42;
  rod(V(-9.75, hangY, hangZ), V(-0.65, hangY, hangZ), 0.012, M.steel, null, 6);
  for (const [a, b] of [[-9.6, -7.5], [-2.7, -0.8]]) {
    const mid = (a + b) / 2;
    for (let x = a; x < b; x += 0.16) {
      const edge = 1 - Math.abs(x - mid) / (b - a) * 2, outer = a < -5 ? (b - x) / (b - a) : (x - a) / (b - a);
      pothosTrail(x, hangY, hangZ + rr(-0.05, 0.05), rr(0.25, 0.5) + outer * 0.75 + edge * 0.05);
    }
    leafBlob('heart', mid, hangY - 0.04, hangZ, 0.55, 90, 0.17, [0.26, 0.31], [0.24, 0.36], 0.28);
  }
}
