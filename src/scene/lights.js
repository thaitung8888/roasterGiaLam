// Ánh sáng chung: trời, nắng (đổ bóng), đèn vàng ấm ở quầy, xưởng rang, tầng trên.
import { SHADOWS, T, lin, scene } from './core.js';

export function buildLights() {
  scene.add(new T.HemisphereLight(lin('#f2f6f6'), lin('#8a7f6e'), 0.82));
  scene.add(new T.AmbientLight(lin('#ffffff'), 0.12));
  const sun = new T.DirectionalLight(lin('#fff2df'), 1.15);
  sun.position.set(-5, 30, 7); sun.target.position.set(1, 0, -13.5); scene.add(sun.target);
  if (SHADOWS) {
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -23, right: 23, top: 23, bottom: -23, near: 5, far: 60 });
    sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.03;
  }
  scene.add(sun);
  const warm = '#ffd5a0';
  [[9.4, 1.95, -10.5, 0.3, 5], [9.4, 1.95, -17.5, 0.3, 5], [8.4, 2.8, -14, 0.5, 11], [2.2, 2.6, -27.2, 0.85, 7], [3.6, 2.4, -28.8, 0.35, 5], [-1.8, 2.4, -24.6, 0.25, 6], [-8.5, 4.6, -13, 0.35, 10], [-8.5, 4.6, -21, 0.35, 10],
   [2.5, 6.2, -27.6, 0.45, 9], [-6, 5.3, -26.5, 0.4, 7], [-5, 3.4, -4, 0.3, 10]].forEach(([x, y, z, i, d]) => {
    const l = new T.PointLight(lin(warm), i, d, 1.6); l.position.set(x, y, z); scene.add(l);
  });
}
