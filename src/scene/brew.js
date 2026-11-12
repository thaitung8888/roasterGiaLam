// Pha một ly ở máy espresso của quầy: ly hiện ra trên khay, dòng cà phê chảy xuống, ly đầy dần,
// sữa và lớp bọt phủ lên nếu là món sữa.
import { reduce } from '../env.js';
import { T, lin, onFrame } from './core.js';
import { group, live, std } from './helpers.js';

// màu cà phê, màu sau khi thêm sữa (null nếu không có sữa), màu và độ dày lớp trên cùng (crema, bọt, kem), ly nhỏ hay ly lớn
const LOOK = {
  'Espresso': { coffee: '#2b160b', milk: null, top: '#a2622e', topH: 0.004, small: true },
  'Americano': { coffee: '#3a1f10', milk: null, top: '#6b3a1a', topH: 0.002 },
  'Cappuccino': { coffee: '#3a1f10', milk: '#c9a27a', top: '#f2e9da', topH: 0.016 },
  'Latte': { coffee: '#3a1f10', milk: '#cfac84', top: '#efe2cc', topH: 0.006 },
  'Cafe kem béo': { coffee: '#2b160b', milk: null, top: '#f6efe0', topH: 0.02 },
  'Mocha': { coffee: '#3a1f10', milk: '#6e4126', top: '#efe2cc', topH: 0.008 },
  'Caramel Cream Cheese Latte': { coffee: '#3a1f10', milk: '#c79a62', top: '#fff2d6', topH: 0.02 }
};
const POUR_S = 1.7, MILK_S = 1.3, TOP_S = 0.5;
export const BREW = { pour() {}, clear() {} };

// trụ cao 1 đơn vị, đáy ở gốc toạ độ: kéo giãn theo trục y là ly đầy dần
function column(rTop, rBot, mat, open) {
  const g = new T.CylinderGeometry(rTop, rBot, 1, 20, 1, open); g.translate(0, 0.5, 0);
  return new T.Mesh(g, mat);
}
export function buildBrew(H) {
  // cùng vị trí và hướng với máy pha trong bar.js; ly đặt trên khay hứng nước ở mặt máy quay về phía barista
  const g = live(group(7.62, H, -14.2, Math.PI / 2)), X = -0.18, Z = 0.33, BASE = 0.11;
  g.visible = false;
  const coffeeM = new T.MeshStandardMaterial({ roughness: 0.2 }), topM = new T.MeshStandardMaterial({ roughness: 0.85 });
  const cup = column(0.042, 0.033, std('#f4f1ea', 0.35, 0, { side: T.DoubleSide }), true);
  const floor = column(0.033, 0.033, std('#f4f1ea', 0.35), false);
  const liquid = column(0.039, 0.031, coffeeM), top = column(0.04, 0.04, topM), stream = column(0.0035, 0.0035, coffeeM);
  for (const m of [cup, floor, liquid, top, stream]) { m.position.set(X, BASE, Z); g.add(m); }
  floor.scale.y = 0.004; stream.rotation.x = Math.PI;   // dòng chảy treo ngược từ trên xuống
  let st = null;
  const coffee = new T.Color(), milk = new T.Color();

  BREW.pour = name => {
    const L = LOOK[name] || LOOK.Latte, w = L.small ? 0.86 : 1.06, h = L.small ? 0.06 : 0.088;
    cup.scale.set(w, h, w); floor.scale.set(w, 0.004, w); liquid.scale.set(w, 1e-4, w); top.scale.set(w, 1e-4, w);
    coffee.copy(lin(L.coffee)); milk.copy(lin(L.milk || L.coffee)); coffeeM.color.copy(coffee); topM.color.copy(lin(L.top));
    st = { L, w, h, t: reduce ? 99 : 0 }; g.visible = true;
  };
  BREW.clear = () => { st = null; g.visible = false; };

  onFrame((t, dt) => {
    if (!st) return;
    st.t += dt;
    const { L, w, h } = st, full = h - 0.01, body = full - L.topH, firstTo = L.milk ? body * 0.4 : body;
    let level, pouring = true;
    if (st.t < POUR_S) { level = firstTo * st.t / POUR_S; coffeeM.color.copy(coffee); }
    else if (L.milk && st.t < POUR_S + MILK_S) {
      const k = (st.t - POUR_S) / MILK_S;
      level = firstTo + (body - firstTo) * k; coffeeM.color.copy(coffee).lerp(milk, k);
    } else { level = body; pouring = false; coffeeM.color.copy(L.milk ? milk : coffee); }
    const topK = pouring ? 0 : Math.min(1, (st.t - POUR_S - (L.milk ? MILK_S : 0)) / TOP_S);
    liquid.scale.set(w * 0.98, Math.max(level, 1e-4), w * 0.98);
    top.position.y = BASE + level; top.scale.set(w * 0.98, Math.max(L.topH * topK, 1e-4), w * 0.98); top.visible = topK > 0;
    // dòng chảy từ phía trên miệng ly xuống mặt nước
    const from = BASE + h + 0.07;
    stream.visible = pouring; stream.position.y = from; stream.scale.y = from - (BASE + level);
  });
}
