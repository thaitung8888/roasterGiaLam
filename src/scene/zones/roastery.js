// Cuối xưởng tầng 1: kho hạt (vách kính ám xanh) bên trái, xưởng rang mở bên phải, nhà vệ sinh.
import { BACK, HALL, LV } from '../../config/levels.js';
import { T, lin, onFrame } from '../core.js';
import { V, add, box, boxAt, cyl, glow, group, keep, live, noCast, plane, rod, std, tmat } from '../helpers.js';
import { M } from '../materials.js';
import { campChair } from '../props/furniture.js';
import { monsteraBig } from '../props/plants.js';
import { pick, rr } from '../random.js';
import { canvasTex } from '../textures/canvas.js';
import { TX } from '../textures/index.js';

export function buildRoastery() {
  const { z1 } = HALL, Y3 = LV.t3, ZF = BACK.zFront, XP = BACK.xRoom;
  // cuối xưởng tầng 1 chia đôi: bên trái là kho (chỉ thấy bức tường ván in chữ), bên phải là xưởng rang mở
  // thẳng ra xưởng, trần thép đen, tường gạch thô, bao tải hạt, máy rang trên xe đẩy xanh, sofa da đen
  const RX0 = XP, RX1 = 4.7, RS = 0.3, RH = Y3 - 0.25, dark = std('#1d1f22', 0.55, 0.45);
  noCast(boxAt(RX0, RX1, -0.02, 0.0, ZF, z1, M.concrete));
  // khung miệng phòng: dầm ngang + cột thép ở hai đầu và ở vách chia
  noCast(boxAt(RX0, RX1, RH - 0.32, RH, ZF + 0.02, ZF - 0.2, dark));
  for (const x of [RX0 + 0.08, RS, RX1 - 0.08]) boxAt(x - 0.08, x + 0.08, 0, RH, ZF + 0.02, ZF - 0.14, dark);
  // --- kho (theo ảnh): mặt trước vách kính ám xanh khung đen mảnh, bên trái là tấm cửa đen; bên trong tường gạch,
  // đèn tuýp dọc trên tường, bao hạt xếp trên pallet và kệ thép
  const KW = RS - RX0, KH = RH - 0.32, kz = ZF - 0.12, khoGlass = new T.MeshStandardMaterial({ color: lin('#9fbfae'), roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.38, depthWrite: false, side: T.DoubleSide });
  const kDoorX1 = RX0 + 1.25;
  noCast(boxAt(RX0 + 0.06, kDoorX1, 0, KH, kz + 0.02, kz - 0.03, std('#0f1012', 0.35, 0.3)));   // tấm cửa đen bóng
  boxAt(kDoorX1 - 0.15, kDoorX1 - 0.12, 0.9, 1.3, kz + 0.04, kz + 0.02, M.chrome);
  const gm = plane(RS - kDoorX1 - 0.08, KH, khoGlass, (kDoorX1 + RS - 0.08) / 2, KH / 2, kz); gm.renderOrder = 2; noCast(gm);
  for (const x of [kDoorX1, kDoorX1 + (RS - kDoorX1) / 2, RS - 0.08]) boxAt(x - 0.02, x + 0.02, 0, KH, kz + 0.02, kz - 0.02, dark);
  boxAt(RX0, RS, KH - 0.04, KH, kz + 0.02, kz - 0.02, dark); boxAt(RX0, RS, 0, 0.05, kz + 0.02, kz - 0.02, dark);
  const kBrick = tmat(TX.brick, [2.4, 1.2], 0.95, '#d8d0c8');
  noCast(plane(KW, RH, kBrick, (RX0 + RS) / 2, RH / 2, z1 + 0.02));
  noCast(plane(kz - z1, RH, kBrick, RX0 + 0.02, RH / 2, (kz + z1) / 2, Math.PI / 2));
  noCast(plane(kz - z1, RH, kBrick, RS - 0.09, RH / 2, (kz + z1) / 2, -Math.PI / 2));
  noCast(boxAt(RX0, RS, RH - 0.02, RH, kz, z1, std('#26282b', 0.7, 0.3)));
  noCast(rod(V(-0.5, 0.9, z1 + 0.06), V(-0.5, 2.25, z1 + 0.06), 0.025, glow('#f2f6ff', 2.2), null, 10));   // đèn tuýp dọc
  boxAt(-0.53, -0.47, 0.85, 0.9, z1 + 0.02, z1 + 0.09, std('#d9dcde', 0.4, 0.5)); boxAt(-0.53, -0.47, 2.25, 2.3, z1 + 0.02, z1 + 0.09, std('#d9dcde', 0.4, 0.5));
  for (const [px, pz] of [[-2.7, -29.2], [-1.4, -29.3]]) {
    const pal = group(px, 0, pz, rr(-0.06, 0.06));
    for (const zz of [-0.38, 0, 0.38]) box(1.0, 0.09, 0.1, M.wood, 0, 0.045, zz, pal);
    for (let k = 0; k < 7; k++) box(0.13, 0.03, 0.9, M.wood, -0.45 + k * 0.15, 0.105, 0, pal);
    for (let k = 0; k < 8; k++) { const b = box(0.46, 0.24, 0.62, M.jute, (k % 2 ? 0.24 : -0.24) + rr(-0.03, 0.03), 0.25 + Math.floor(k / 2) * 0.25, rr(-0.04, 0.04), pal); b.rotation.y = rr(-0.12, 0.12); }
  }
  const rk = group(-3.35, 0, -27.6, Math.PI / 2);
  for (const sx of [-0.7, 0.7]) for (const sz of [-0.22, 0.22]) box(0.04, 2.0, 0.04, std('#3d6fb0', 0.5, 0.4), sx, 1.0, sz, rk);
  for (const y of [0.15, 0.85, 1.55]) { box(1.44, 0.04, 0.48, std('#e8762c', 0.5, 0.4), 0, y, 0, rk); for (let x = -0.55; x < 0.6; x += 0.36) box(0.32, 0.32, 0.4, pick([M.jute, std('#c79a62', 0.95), std('#ecebe6', 0.9)]), x, y + 0.18, 0, rk); }
  box(0.5, 0.5, 0.5, std('#c79a62', 0.95), -0.25, 0.25, -26.6);
  for (let k = 0; k < 3; k++) box(0.55, 0.36, 0.4, M.jute, RS - 0.55 - (k % 2) * 0.1, 0.18 + Math.floor(k / 2) * 0.36, ZF + 0.45).rotation.y = rr(-0.2, 0.2);   // bao hạt chờ nhập kho
  // vách chia kho / xưởng rang
  noCast(boxAt(RS - 0.08, RS + 0.08, 0, RH, ZF - 0.1, z1, M.white));
  // --- xưởng rang
  // trần thép đen, dầm chạy dọc, dầm ngang, ống điện, bóng đèn
  noCast(boxAt(RS, RX1, RH - 0.02, RH, ZF, z1, std('#26282b', 0.7, 0.3)));
  for (let x = RS + 0.45; x < RX1 - 0.2; x += 0.7) noCast(boxAt(x - 0.04, x + 0.04, RH - 0.2, RH - 0.02, ZF - 0.2, z1, dark));
  noCast(boxAt(RS, RX1, RH - 0.24, RH - 0.02, -27.4, -27.55, dark));
  rod(V(RS + 0.2, RH - 0.3, -26.2), V(RX1 - 0.2, RH - 0.3, -26.2), 0.02, std('#3a3d40', 0.5, 0.5), null, 6);
  // đèn rọi nhỏ gắn trần, mặt đèn sáng vàng
  for (const bx of [1.15, 2.5, 3.85]) {
    cyl(0.05, 0.06, 0.15, dark, bx, RH - 0.3, -27.55, 12);
    cyl(0.045, 0.045, 0.012, glow('#ffd9a0', 2), bx, RH - 0.382, -27.55, 12);
  }
  // tường: gạch thô ở trong cùng, tôn kẽm sáng phía trước hai bên
  const brickM = tmat(TX.brick, [2.4, 1.2], 0.95), RW = RX1 - RS, RC = (RS + RX1) / 2;
  noCast(plane(RW, RH, brickM, RC, RH / 2, z1 + 0.02));
  const bz0 = ZF - 1.0, bL = bz0 - z1, bc = (bz0 + z1) / 2;
  noCast(plane(bL, RH, brickM, RS + 0.09, RH / 2, bc, Math.PI / 2));
  noCast(plane(bL, RH, brickM, RX1 - 0.02, RH / 2, bc, -Math.PI / 2));
  const zinc = tmat(TX.corr, [0.25, 1], 0.45, '#b9ab98', { metalness: 0.4 });
  noCast(plane(1.0, RH, zinc, RS + 0.095, RH / 2, ZF - 0.5, Math.PI / 2));
  noCast(plane(1.0, RH, zinc, RX1 - 0.025, RH / 2, ZF - 0.5, -Math.PI / 2));
  boxAt(RS + 0.09, RS + 0.12, 0.25, 2.6, -26.65, -26.67, std('#d9dcde', 0.4, 0.5));
  // bao tải đay in chữ treo trên tường gạch
  [[0.95, 2.0, 'ARABICA', '#2f8f4e'], [1.95, 2.05, 'ROBUSTA', '#6e4a2c']].forEach(([x, y, t, c]) => {
    const tex = canvasTex(160, 224, (g, w, h) => {
      g.fillStyle = '#b89a6c'; g.fillRect(0, 0, w, h);
      for (let i = 0; i < w; i += 3) { g.fillStyle = `rgba(80,58,30,${rr(0.08, 0.2)})`; g.fillRect(i, 0, 1, h); }
      for (let i = 0; i < h; i += 3) { g.fillStyle = `rgba(255,240,210,${rr(0.04, 0.1)})`; g.fillRect(0, i, w, 1); }
      g.strokeStyle = c; g.fillStyle = c; g.lineWidth = 5; g.beginPath(); g.arc(w / 2, h * 0.36, 34, 0, 7); g.stroke();
      g.beginPath(); g.ellipse(w / 2, h * 0.36, 11, 20, 0.4, 0, 7); g.fill();
      g.font = '700 22px "Bebas Neue", sans-serif'; g.textAlign = 'center'; g.fillText(t, w / 2, h * 0.66);
      g.font = '500 12px sans-serif'; g.fillText('VIETNAM · 60 KG', w / 2, h * 0.76);
      g.fillStyle = 'rgba(60,40,20,.25)'; g.fillRect(0, 0, w, 6); g.fillRect(0, h - 8, w, 8);
    }, { clamp: true });
    const s = keep(plane(0.82, 1.1, new T.MeshStandardMaterial({ map: tex, roughness: 1, side: T.DoubleSide }), x, y, z1 + 0.06));
    s.rotation.z = rr(-0.04, 0.04);
  });
  // máy rang màu xanh rêu trên chân thép (góc phải trong cùng), thùng xanh nhạt phía trước
  const cart = group(3.9, 0, -29.25, 0), green = std('#2c4437', 0.45, 0.35);
  box(0.8, 0.05, 0.56, dark, 0, 0.72, 0, cart);
  for (const sx of [-0.36, 0.36]) for (const sz of [-0.24, 0.24]) box(0.05, 0.72, 0.05, dark, sx, 0.36, sz, cart);
  box(0.72, 0.4, 0.48, std('#7da0c4', 0.55), 3.25, 0.2, -28.6).rotation.y = 0.12;
  const ro = group(0, 0.75, -0.02, 0, cart);
  box(0.62, 0.55, 0.48, green, 0, 0.275, 0, ro);
  const dr = cyl(0.2, 0.2, 0.42, M.chrome, 0, 0.62, 0.02, 20, ro); dr.rotation.x = Math.PI / 2;
  cyl(0.21, 0.21, 0.03, green, 0, 0.62, 0.24, 20, ro).rotation.x = Math.PI / 2;
  cyl(0.07, 0.07, 0.02, glow('#ff9a4a', 0.8), 0, 0.62, 0.26, 14, ro).rotation.x = Math.PI / 2;
  cyl(0.18, 0.05, 0.28, M.chrome, 0, 1.0, -0.05, 16, ro); cyl(0.05, 0.05, 0.1, M.chrome, 0, 0.84, -0.05, 10, ro);
  cyl(0.26, 0.26, 0.08, M.chrome, -0.36, 0.3, 0.28, 22, ro); box(0.06, 0.06, 0.18, dark, -0.15, 0.35, 0.2, ro);
  const stir = live(group(-0.36, 0.36, 0.28, 0, ro)); box(0.44, 0.02, 0.03, dark, 0, 0, 0, stir);
  onFrame((t, dt) => { stir.rotation.y += dt * 1.2; });
  box(0.2, 0.14, 0.03, std('#c9a24a', 0.4, 0.6), 0.2, 0.4, 0.245, ro);
  box(0.12, 0.09, 0.02, glow('#7fd6e0', 0.6), 0.2, 0.42, 0.262, ro);
  // máy rang mẫu trên bàn vàng
  const yt = group(1.55, 0, -29.3, 0), yellow = std('#d9a93a', 0.6);
  box(1.2, 0.05, 0.62, yellow, 0, 0.74, 0, yt); box(1.15, 0.03, 0.55, yellow, 0, 0.25, 0, yt);
  for (const sx of [-0.56, 0.56]) for (const sz of [-0.27, 0.27]) box(0.04, 0.74, 0.04, std('#b8892b', 0.6), sx, 0.37, sz, yt);
  box(0.55, 0.42, 0.42, std('#e9e8e3', 0.4, 0.3), 0.15, 0.98, -0.02, yt);
  box(0.42, 0.28, 0.01, std('#2a2420', 0.2, 0.3, { emissive: lin('#ff9a50'), emissiveIntensity: 0.18 }), 0.15, 1.0, 0.195, yt);
  box(0.55, 0.06, 0.02, std('#c43a2f', 0.5), 0.15, 0.8, 0.2, yt); box(0.48, 0.05, 0.36, dark, 0.15, 0.79, -0.02, yt);
  box(0.34, 0.14, 0.26, std('#f1efe9', 0.6), -0.38, 0.84, 0.05, yt);
  // ống bạc mềm: từ máy rang chính vắt ngang tường gạch rồi buông xuống; ống đen từ máy mẫu lên trần
  const flex = (pts, r, mat) => noCast(add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 60, r, 12), mat)));
  const silver = std('#c8ccce', 0.35, 0.75);
  flex([V(3.9, 1.85, -29.3), V(3.7, 2.45, -29.6), V(3.0, 2.62, -29.75), V(1.6, 2.6, -29.78), V(0.75, 2.42, -29.78), V(0.55, 1.9, -29.7), V(0.8, 1.05, -29.55), V(0.95, 0.4, -29.15), V(0.75, 0.12, -28.8)], 0.075, silver);
  flex([V(1.75, 1.2, -29.4), V(1.75, 1.9, -29.6), V(2.1, 2.6, -29.75), V(2.6, 2.95, -29.6)], 0.06, dark);
  // phuy nước xanh, ghế xếp hồng, thùng các-tông, bao hạt trắng
  cyl(0.22, 0.22, 0.62, std('#3c8fc2', 0.5), 0.72, 0.31, -28.6, 20); cyl(0.2, 0.2, 0.02, std('#2f7aa6', 0.5), 0.72, 0.625, -28.6, 20);
  campChair(2.7, -28.55, 0.35, '#e7a0b2');
  box(0.5, 0.4, 0.4, std('#c49a62', 0.95), 4.15, 0.2, -28.05).rotation.y = 0.2;
  box(0.4, 0.56, 0.06, std('#c9a06a', 0.95), 3.75, 0.28, -27.75).rotation.y = 0.5;
  const bag = new T.Mesh(new T.SphereGeometry(0.28, 14, 10), std('#e6e1d6', 0.95)); bag.scale.set(1, 1.2, 0.8); bag.position.set(4.3, 0.32, -27.45); add(bag);
  // sofa da đen trên đế gỗ: lệch về bên trái phòng, đặt thẳng
  const sofa = group(1.72, 0, -26.9, 0), leather = std('#141416', 0.42, 0.05);
  box(2.2, 0.05, 0.92, M.wood, 0, 0.3, 0, sofa);
  for (const sx of [-1.0, 1.0]) for (const sz of [-0.38, 0.38]) rod(V(sx, 0, sz), V(sx * 0.95, 0.28, sz * 0.9), 0.015, dark, sofa, 6);
  box(2.0, 0.04, 0.04, dark, 0, 0.08, 0.38, sofa); box(2.0, 0.04, 0.04, dark, 0, 0.08, -0.38, sofa);
  for (const sx of [-0.46, 0.46]) {
    box(0.9, 0.18, 0.7, leather, sx, 0.42, 0.06, sofa);
    const back = box(0.9, 0.48, 0.2, leather, sx, 0.72, -0.34, sofa); back.rotation.x = -0.12;
  }
  for (const sx of [-1.02, 1.02]) { box(0.2, 0.42, 0.88, leather, sx, 0.52, -0.02, sofa); box(0.22, 0.06, 0.9, leather, sx, 0.74, -0.02, sofa); }
  // hai bàn nhỏ khung inox trước sofa
  [[-0.32, 1.05], [0.3, 1.1]].forEach(([dx, dz]) => {
    const t = group(dx, 0, dz, rr(-0.06, 0.06), sofa), st = std('#c9ced1', 0.3, 0.8);
    box(0.5, 0.025, 0.42, st, 0, 0.5, 0, t);
    for (const sx of [-0.23, 0.23]) { box(0.025, 0.5, 0.025, st, sx, 0.25, 0.19, t); box(0.025, 0.5, 0.025, st, sx, 0.25, -0.19, t); box(0.025, 0.025, 0.42, st, sx, 0.02, 0, t); }
  });
  cyl(0.045, 0.04, 0.09, std('#f1efe9', 0.5), 1.1, 0.56, -25.85, 12);
  // monstera chậu đen góc phải phía trước
  cyl(0.24, 0.2, 0.42, std('#1b1c1e', 0.6), 4.2, 0.21, -26.75, 18); cyl(0.22, 0.22, 0.02, M.soil, 4.2, 0.41, -26.75, 16);
  monsteraBig(4.2, 0.42, -26.75, 1.25);
  // ánh sáng giả cho phòng: vầng vàng trên tường và sàn, bóng mềm dưới đồ vật và ở mép trần.
  // Đều là tấm hình gộp chung một lệnh vẽ, không phải đèn thật.
  const glowM = new T.MeshBasicMaterial({ map: TX.glow, color: lin('#ff9f58'), transparent: true, opacity: 0.15, blending: T.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false });
  noCast(plane(5.4, 3.4, glowM, RC, 1.55, z1 + 0.03));
  noCast(plane(5.4, 5, glowM, RC, 0.012, -27.6)).rotation.x = -Math.PI / 2;
  for (const [x, ry] of [[RS + 0.11, Math.PI / 2], [RX1 - 0.04, -Math.PI / 2]]) noCast(plane(3.6, 3, glowM, x, 1.5, -28.2, ry));
  const blob = canvasTex(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, w * 0.12, w / 2, h / 2, w / 2);
    gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }, { clamp: true });
  const shadeM = new T.MeshBasicMaterial({ map: blob, color: lin('#1c0f08'), transparent: true, opacity: 0.62, depthWrite: false, fog: false });
  for (const [x, z, w, d] of [[1.72, -26.9, 3.3, 1.9], [1.75, -25.8, 1.7, 1.1], [4.2, -26.75, 1.1, 1.1], [1.55, -29.3, 1.9, 1.1], [3.9, -29.25, 1.5, 1.1], [0.72, -28.6, 0.9, 0.9]]) noCast(plane(w, d, shadeM, x, 0.016, z)).rotation.x = -Math.PI / 2;
  const fade = canvasTex(8, 128, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, 'rgba(0,0,0,.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }, { clamp: true });
  const fadeM = new T.MeshBasicMaterial({ map: fade, color: lin('#1c0f08'), transparent: true, depthWrite: false, fog: false });
  noCast(plane(RW, 1.3, fadeM, RC, RH - 0.65, z1 + 0.06));
  noCast(plane(bL, 1.3, fadeM, RS + 0.12, RH - 0.65, bc, Math.PI / 2)); noCast(plane(bL, 1.3, fadeM, RX1 - 0.05, RH - 0.65, bc, -Math.PI / 2));
  // nhà vệ sinh
  noCast(boxAt(4.7, 10, 0, Y3 - 0.25, ZF, ZF - 0.12, M.white));
  for (const x of [6.0, 8.4]) { boxAt(x - 0.45, x + 0.45, 0, 2.1, ZF + 0.02, ZF - 0.13, M.wood); boxAt(x + 0.3, x + 0.36, 1.0, 1.06, ZF + 0.05, ZF + 0.02, M.chrome); }
  boxAt(7.0, 7.4, 2.25, 2.45, ZF + 0.03, ZF + 0.01, std('#1d93a3', 0.6));
  boxAt(4.7, 4.82, 0, Y3 - 0.25, ZF, z1, M.white);
}
