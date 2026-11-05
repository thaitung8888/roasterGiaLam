// Khu camping giữa xưởng: cột có 4 đèn tuýp, cây ficus, 4 bộ ghế xếp đặt rải rác.
import { T, lin, scene } from '../core.js';
import { V, boxAt, glow, group, noCast, rod, std } from '../helpers.js';
import { M } from '../materials.js';
import { campChair, kermitChair, lowTable } from '../props/furniture.js';
import { ficusTree, fig, spiky } from '../props/plants.js';
import { rr } from '../random.js';

export function buildCamping() {
  const cx = 0.8, cz = -17.5;
  // cột trụ giữa + 4 bóng đèn tuýp xoè chéo lên trời ra 4 hướng (theo ảnh)
  noCast(boxAt(cx - 0.18, cx + 0.18, 0, 7.72, cz - 0.18, cz + 0.18, M.steel));
  const lampM = std('#2a2c2f', 0.4, 0.5), tubeM = glow('#f4f8ff', 2.2), capM = std('#d9dcde', 0.4, 0.5), hy = 3.9;
  noCast(boxAt(cx - 0.24, cx + 0.24, hy - 0.08, hy + 0.04, cz - 0.24, cz + 0.24, lampM));
  [[1, 0.25], [-1, -0.2], [0.2, 1], [-0.25, -1]].forEach(([dx, dz], k) => {
    const out = V(dx, 0, dz).normalize(), base = V(cx + out.x * 0.26, hy, cz + out.z * 0.26);
    const dir = V(out.x * 0.62, 1, out.z * 0.62).normalize(), len = k % 2 ? 1.25 : 1.4, tip = base.clone().addScaledVector(dir, len);
    rod(V(cx, hy - 0.02, cz), base, 0.02, lampM, null, 6);
    noCast(rod(base.clone().addScaledVector(dir, 0.06), tip, 0.022, tubeM, null, 10));
    for (const q of [base, tip]) rod(q.clone().addScaledVector(dir, -0.03), q.clone().addScaledVector(dir, 0.06), 0.03, capM, null, 10);
    const pl = new T.PointLight(lin('#eef3ff'), 0.35, 10, 1.6); pl.position.copy(base.clone().lerp(tip, 0.5)); scene.add(pl);
  });
  ficusTree(cx, cz + 0.62);
  // chỉ 4 bộ bàn ghế đặt thoải mái quanh xưởng, mỗi bộ xoay một hướng
  [[-1.4, -12.4, 0.35, 'blue'], [3.6, -14.4, -0.5, 'black'], [-1.3, -19.6, 0.8, 'black'], [3.3, -21.0, -0.15, 'blue']].forEach(([x, z, ry, kind]) => {
    const g = group(x, 0, z, ry);
    lowTable(0, 0, Math.PI / 2 + rr(-0.15, 0.15), kind === 'blue' ? '#c7cbce' : '#3c55c0', g);
    for (const sx of [-1, 1]) for (const sz of [-0.32, 0.32]) {
      const px = sx * rr(0.6, 0.72), pz = sz + rr(-0.06, 0.06), pry = (sx < 0 ? Math.PI / 2 : -Math.PI / 2) + rr(-0.35, 0.35);
      kind === 'blue' ? campChair(px, pz, pry, '#2c48b4', g) : kermitChair(px, pz, pry, g);
    }
  });
  fig(-4.3, 0, -10.0, 1.15); spiky(5.7, 0, -24.4, 1.1);
}
