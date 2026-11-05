// Góc dating: sàn nâng 1 m, kính liền chạy hết chiều ngang, 3 bàn sát kính + 1 bàn cạnh cầu thang.
import { LV } from '../../config/levels.js';
import { GLASS, V, boxAt, noCast, plane, rod } from '../helpers.js';
import { M } from '../materials.js';
import { bistroChair, squareTable } from '../props/furniture.js';
import { fig, spiky } from '../props/plants.js';

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
}
