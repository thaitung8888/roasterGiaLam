// Ánh sáng chung: trời, nắng (đổ bóng), đèn điểm cho từng khu.
// Mỗi đèn điểm được tính lại cho từng điểm ảnh trên mọi bề mặt, nên đây là phần nặng nhất của khung hình:
// giữ danh sách thật ngắn, điện thoại chỉ dùng nhóm CORE và bù bằng ánh sáng trời.
import { small } from '../env.js';
import { SHADOWS, T, lin, scene } from './core.js';

const WARM = '#ffd5a0';
export const LIGHT = { lamps: [] };   // đèn chung để atmosphere.js đổi theo thời điểm trong ngày
// [x, y, z, độ sáng, tầm chiếu, màu]
const CORE = [
  [8.7, 2.5, -14, 0.8, 13, WARM],          // quầy order
  [2.5, 2.5, -27.4, 1.15, 7.5, '#ffb574'],  // xưởng rang
  [0.8, 4.7, -17.5, 0.9, 12, '#eef3ff'],   // 4 đèn tuýp giữa xưởng
  [-8.5, 4.6, -17, 0.5, 14, WARM],         // tầng 2
  [2.5, 6.2, -27.6, 0.45, 9, WARM],        // sân tầng 3
  [-5, 3.4, -4, 0.3, 10, WARM]             // góc dating
];
const EXTRA = [
  [-1.4, 2.0, -28.2, 0.55, 6, '#d9f2e6'],  // kho hạt
  [-1.8, 2.4, -24.6, 0.25, 6, WARM],       // trước kho
  [-6, 5.3, -26.5, 0.4, 7, WARM]           // phòng làm việc
];

export function buildLights() {
  LIGHT.sky = new T.HemisphereLight(lin('#f2f6f6'), lin('#8a7f6e'), small ? 0.88 : 0.82); scene.add(LIGHT.sky);
  LIGHT.ambient = new T.AmbientLight(lin('#ffffff'), 0.12); scene.add(LIGHT.ambient);
  const sun = LIGHT.sun = new T.DirectionalLight(lin('#fff2df'), 1.15);
  sun.position.set(-5, 30, 7); sun.target.position.set(1, 0, -13.5); scene.add(sun.target);
  if (SHADOWS) {
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -23, right: 23, top: 23, bottom: -23, near: 5, far: 60 });
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
  }
  scene.add(sun);
  (small ? CORE : CORE.concat(EXTRA)).forEach(([x, y, z, i, d, c]) => {
    const l = new T.PointLight(lin(c), i, d, 1.6); l.position.set(x, y, z); scene.add(l);
    LIGHT.lamps.push(l);
    if (z === -4) LIGHT.dating = l;
    if (z === -14) LIGHT.bar = l;
  });
}
