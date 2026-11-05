// Mặt đê có người: vài người đi bộ và xe đạp lướt qua, nhìn từ kính dating thấy dáng in trên nền trời.
// Chỉ vẽ khi camera ở gần góc dating, các trạm khác không phải trả chi phí này.
import { mood } from '../atmosphere.js';
import { T, onFrame } from '../core.js';
import { V, add, box, cyl, group, live, rod, std } from '../helpers.js';

const Y = 4.42, X0 = -48, X1 = 48;

function walker(top, leg) {
  const g = group();
  cyl(0.15, 0.13, 0.62, std(top, 0.8), 0, 1.16, 0, 10, g);
  const head = new T.Mesh(new T.SphereGeometry(0.11, 10, 8), std('#c99a78', 0.7)); head.position.y = 1.6; g.add(head);
  const legs = [-1, 1].map(s => { const p = group(s * 0.08, 0.86, 0, 0, g); box(0.1, 0.84, 0.1, std(leg, 0.8), 0, -0.42, 0, p); return p; });
  return { g, legs };
}
function cyclist(top) {
  const g = group(), dark = std('#1b1d1f', 0.6, 0.3), wheels = [-0.55, 0.55].map(x => {
    const w = new T.Mesh(new T.TorusGeometry(0.33, 0.018, 6, 22), dark); w.position.set(x, 0.34, 0); g.add(w); return w;
  });
  rod(V(-0.55, 0.34, 0), V(-0.1, 0.8, 0), 0.016, dark, g, 5); rod(V(0.55, 0.34, 0), V(0.4, 0.92, 0), 0.016, dark, g, 5); rod(V(-0.1, 0.8, 0), V(0.4, 0.86, 0), 0.016, dark, g, 5);
  const body = cyl(0.14, 0.12, 0.6, std(top, 0.8), 0.06, 1.14, 0, 10, g); body.rotation.z = -0.4;
  const head = new T.Mesh(new T.SphereGeometry(0.105, 10, 8), std('#c99a78', 0.7)); head.position.set(0.24, 1.55, 0); g.add(head);
  return { g, wheels };
}

export function buildDike() {
  const all = live(group());
  // [x đầu, z, tốc độ m/s, màu áo, màu quần hoặc null nếu là xe đạp]
  const people = [[-30, 20.4, 1.25, '#e9e4d8', '#39424e'], [-26.5, 20.7, 1.2, '#c85b4a', '#2c2f33'], [8, 22.6, -1.4, '#2f5d7c', '#d8d2c4'],
    [34, 22.9, -1.1, '#d9a93a', '#3a3d40'], [-6, 21, 4.2, '#efefe9', null], [22, 22.3, -3.6, '#3f7f6a', null]];
  const items = people.map(([x, z, v, top, leg]) => {
    const f = leg ? walker(top, leg) : cyclist(top);
    all.add(f.g); f.g.position.set(x, Y, z); f.g.rotation.y = leg ? (v > 0 ? Math.PI / 2 : -Math.PI / 2) : (v > 0 ? 0 : Math.PI);
    return { ...f, v, x, step: x };
  });
  add(all);
  onFrame((t, dt) => {
    all.visible = mood.near;
    if (!mood.near) return;
    for (const p of items) {
      p.x += p.v * dt;
      if (p.x > X1) p.x = X0; else if (p.x < X0) p.x = X1;
      p.g.position.x = p.x;
      if (p.legs) { const a = Math.sin(p.x * 3.4) * 0.5; p.legs[0].rotation.x = a; p.legs[1].rotation.x = -a; p.g.position.y = Y + Math.abs(Math.cos(p.x * 3.4)) * 0.025; }
      else p.wheels.forEach(w => { w.rotation.z -= p.v * dt / 0.33; });
    }
  });
}
