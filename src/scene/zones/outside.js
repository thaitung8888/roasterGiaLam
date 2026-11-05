// Ngoài trời: vỉa hè, đường, đê cỏ, tranh tường hoa sen, cây, nhà bên cạnh, ô tô.
import { V, box, boxAt, cyl, group, noCast, plane, quad, std } from '../helpers.js';
import { M } from '../materials.js';
import { tree } from '../props/plants.js';
import { R, pick } from '../random.js';

export function buildOutside() {
  const X0 = -90, X1 = 90;
  noCast(boxAt(X0, X1, -0.06, 0, 0, 3.4, M.pavers));
  noCast(boxAt(X0, X1, -0.1, 0.12, 3.4, 3.6, std('#9a9890', 0.9)));
  noCast(boxAt(X0, X1, -0.1, -0.02, 3.6, 11.2, M.asphalt));
  for (let x = X0; x < X1; x += 6) noCast(boxAt(x, x + 3, -0.02, -0.015, 7.35, 7.5, std('#e9e7e0', 0.8)));
  // hàng rào sắt + tường tranh hoa sen
  noCast(boxAt(X0, X1, -0.1, 0.1, 11.2, 11.5, std('#9a9890', 0.9)));
  for (let x = X0; x < X1; x += 2.5) boxAt(x, x + 0.06, 0, 1.15, 11.33, 11.39, M.steel);
  boxAt(X0, X1, 1.08, 1.13, 11.31, 11.41, M.steel); boxAt(X0, X1, 0.25, 0.29, 11.31, 11.41, M.steel);
  for (let x = X0; x < X1; x += 0.14) boxAt(x, x + 0.018, 0.27, 1.1, 11.35, 11.37, M.steel);
  noCast(boxAt(X0, X1, 0, 1.15, 11.6, 11.85, M.mural));
  // mái đê cỏ
  const s0 = 11.85, s1 = 18.6, y0 = 1.15, y1 = 4.4;
  noCast(quad(V(X0, y0, s0), V(X0, y1, s1), V(X1, y1, s1), V(X1, y0, s0), M.grass));
  noCast(boxAt(X0, X1, 0, y1, s1, 30, M.grass));
  noCast(boxAt(X0, X1, y1, y1 + 0.02, 19.6, 24, M.asphalt));
  // cây non trên vỉa hè
  for (const x of [-21, -12.5, -1.6, 13.8, 20.5, 27]) {
    noCast(boxAt(x - 0.6, x + 0.6, 0, 0.06, 2.0, 3.0, M.soil));
    tree(x, 2.5, 4.2 + R(), 1.4, 170);
  }
  for (const x of [-30, -12, 6, 20, 34]) tree(x, 22, 5 + R() * 2, 2, 120, y1);
  // nhà phố hai bên
  const houses = [[-23, -16.2, 12], [15.8, 21, 14.5], [21, 28, 8.5], [-30, -23, 10]];
  // bên trái: phần xưởng tôn xanh nối dài; bên phải: tường rào thấp và cây
  noCast(boxAt(-16.2, -10.25, 0, 7.4, -14, -0.3, M.corrGreen));
  noCast(boxAt(10.25, 15.8, 0, 2.6, -0.6, -0.3, M.white));
  tree(13.2, -3.2, 7.5, 2.6, 260);
  houses.forEach(([a, b, h], i) => {
    noCast(boxAt(a, b - 0.05, 0, h, -14, -0.4, std(pick(['#efece4', '#e8e1d4', '#f2efe9', '#dfe3df']), 0.9)));
    noCast(plane(b - a - 0.05, h - 3.4, M.house, (a + b) / 2, 3.4 + (h - 3.4) / 2, -0.38));
    boxAt(a + 0.3, b - 0.35, 0, 2.9, -0.5, -0.38, std(i % 2 ? '#7c8790' : '#5d676d', 0.6, 0.4));
  });
  // ô tô đỗ trước cửa
  const car = group(-15.5, 0, 4.6, 0.02);
  box(4.4, 0.7, 1.8, std('#6a7075', 0.35, 0.6), 0, 0.62, 0, car);
  box(2.6, 0.62, 1.66, std('#1d2226', 0.15, 0.6), -0.2, 1.28, 0, car);
  for (const sx of [-1.4, 1.4]) for (const sz of [-0.86, 0.86]) { const w = cyl(0.34, 0.34, 0.24, std('#151515', 0.8), sx, 0.34, sz, 16, car); w.rotation.x = Math.PI / 2; }
}
