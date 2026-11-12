// Tầng 3: tường sau, phòng làm việc (quầy xanh ngọc liền tường thấp), vách kính + cửa lùa tự mở, sân nửa ngoài trời, hai cây lớn.
import { BACK, HALL, LV, PLAN } from '../../config/levels.js';
import { SHOP } from '../../config/shop.js';
import { PICK, T, camera, lin, onFrame, scene } from '../core.js';
import { gust, leafBlob } from '../foliage.js';
import { GLASS, V, add, beam, box, boxAt, cyl, fit, group, keep, live, noCast, plane, rod, std, tmat } from '../helpers.js';
import { M } from '../materials.js';
import { plyChair, roundTable, tubChair } from '../props/furniture.js';
import { alocasia, fern, fig, monsteraBig, pot, pothosTrail } from '../props/plants.js';
import { shadow } from '../props/shadow.js';
import { R, rr } from '../random.js';
import { canvasTex } from '../textures/canvas.js';
import { TX } from '../textures/index.js';

// tương tác ở tầng 3: màn laptop sáng lên, rèm cuộn hạ xuống, cây lớn rung lá và chim bay đi
export const DESK = { show() {} };
export const TERRACE = { level: 0.08, blind() {}, shake() {} };

function screenTex() {
  return canvasTex(512, 320, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#123a40'); gr.addColorStop(1, '#0b1f24');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#7fd6e0'; g.font = '600 26px "Be Vietnam Pro", sans-serif'; g.fillText('Gia Lâm Coffee Roaster', 34, 62);
    g.fillStyle = '#f3efe7'; g.font = '500 22px "JetBrains Mono", monospace';
    g.fillText('WIFI  ' + SHOP.wifi, 34, 150); g.fillText('MỞ CỬA  ' + SHOP.hours.replace(', mỗi ngày', ''), 34, 196);
    g.fillStyle = 'rgba(243,239,231,.5)'; g.font = '400 18px "Be Vietnam Pro", sans-serif'; g.fillText('Ổ cắm dọc quầy · Chúc bạn làm việc hiệu quả', 34, 262);
  }, { clamp: true });
}

export function buildFloor3() {
  const { z1 } = HALL, Y3 = LV.t3, ZF = BACK.zFront, XP = BACK.xRoom, hidden = new T.MeshBasicMaterial({ visible: false });
  // tường sau
  noCast(boxAt(-10.2, XP, 0, HALL.eave, z1, z1 - 0.2, M.panel));
  noCast(boxAt(XP, 10.2, 0, Y3, z1, z1 - 0.2, M.panel));
  noCast(boxAt(XP, 10.2, 7.3, HALL.eave, z1, z1 - 0.2, M.corr));
  // khối dưới tầng 3 trong nhà
  boxAt(-10, XP, 0, Y3 - 0.05, -24.7, z1, M.white);
  noCast(boxAt(-10, XP, Y3 - 0.05, Y3, -24.7, z1, tmat(TX.epoxy, [3, 3], 0.45, '#8c9fa8')));   // sàn xanh xám đậm hơn tầng dưới, như ảnh
  // bậc từ tầng 2 lên tầng 3
  for (let k = 1; k <= 4; k++) boxAt(-9.9, -8.6, LV.t2, LV.t2 + k * 0.175, -23.5 - (k - 1) * 0.3, -23.5 - k * 0.3, M.epoxy);
  // sàn sân tầng 3 (mái của xưởng rang + WC)
  noCast(boxAt(XP, 10, Y3 - 0.25, Y3, ZF, z1, tmat(TX.tiles, [0.6, 0.6], 0.7, '#a3a5a2')));   // gạch xám sân tầng 3
  // tầng 3 trong nhà: lan can, dãy bàn 4 chỗ, kệ, sofa nhỏ
  const rail = (x0, x1, z0, z1r) => {
    const alongZ = Math.abs(z1r - z0) > Math.abs(x1 - x0);
    const L = alongZ ? Math.abs(z1r - z0) : Math.abs(x1 - x0);
    noCast(plane(L, 1.0, GLASS(), (x0 + x1) / 2, Y3 + 0.5, (z0 + z1r) / 2, alongZ ? Math.PI / 2 : 0));
    boxAt(Math.min(x0, x1) - 0.03, Math.max(x0, x1) + 0.03, Y3 + 0.98, Y3 + 1.02, Math.min(z0, z1r) - 0.03, Math.max(z0, z1r) + 0.03, M.steel);
  };
  rail(XP + 0.02, XP + 0.02, -24.72, ZF);
  // quầy làm việc (theo ảnh): mặt xanh ngọc liền vào tường thấp ở mép sàn, nhìn thẳng xuống xưởng, đầu quầy là trụ tường có chậu cây
  const KX0 = -8.6, KX1 = XP - 0.06, KY = Y3 + 0.76, KZ = -24.68, teal = std('#2d8a99', 0.5);
  boxAt(KX0, KX1, Y3, KY, KZ, -24.92, M.white);
  boxAt(KX0 + 0.3, KX1, KY, KY + 0.045, KZ, -25.42, teal);
  boxAt(KX0, KX0 + 0.3, Y3, Y3 + 1.02, KZ, -25.6, M.white);
  pot(KX0 + 0.15, Y3 + 1.02, -25.15, 0.12, 0.16);
  leafBlob('heart', KX0 + 0.15, Y3 + 1.42, -25.15, 0.34, 46, 0.2, [0.26, 0.31], [0.22, 0.34]);
  pothosTrail(KX0 + 0.2, Y3 + 1.14, -25.3, 0.5);
  for (const x of [-7.6, -6.65, -5.7, -4.75]) tubChair(x, Y3, -25.85, rr(-0.08, 0.08));
  const screenM = new T.MeshBasicMaterial({ map: screenTex(), toneMapped: false }), screens = [];
  for (const x of [-7.6, -5.7]) {
    boxAt(x - 0.16, x + 0.16, KY + 0.045, KY + 0.06, -25.0, -25.22, std('#3a3d40', 0.4, 0.5));
    boxAt(x - 0.16, x + 0.16, KY + 0.055, KY + 0.255, -24.98, -25.0, std('#202224', 0.3, 0.4)).rotation.x = -0.2;
    const scr = live(plane(0.29, 0.18, screenM, x, KY + 0.155, -25.006)); scr.rotation.set(-0.2, Math.PI, 0); scr.visible = false; screens.push(scr);
  }
  DESK.show = on => screens.forEach(s => { s.visible = on; });
  PICK.desk = live(boxAt(-8.3, -4.2, KY, KY + 0.45, -24.8, -25.5, hidden));
  // lá cờ nhỏ trên quầy, ly nước
  const flag = canvasTex(96, 64, (g, w, h) => {
    g.fillStyle = '#d0232a'; g.fillRect(0, 0, w, h); g.fillStyle = '#f8d34a'; g.beginPath();
    for (let k = 0; k < 10; k++) { const r = k % 2 ? 9 : 22, a = -Math.PI / 2 + k * Math.PI / 5; g.lineTo(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r); }
    g.fill();
  }, { clamp: true });
  rod(V(-6.5, KY + 0.045, -25.02), V(-6.5, KY + 0.34, -25.02), 0.004, M.steel, null, 4);
  keep(noCast(plane(0.2, 0.135, new T.MeshStandardMaterial({ map: flag, roughness: 0.8, side: T.DoubleSide }), -6.39, KY + 0.27, -25.02)));
  cyl(0.035, 0.03, 0.1, std('#d99a3e', 0.3), -7.05, KY + 0.095, -25.2, 12); cyl(0.035, 0.03, 0.1, std('#4a2c1a', 0.3), -6.1, KY + 0.095, -25.2, 12);
  boxAt(-8.6, -6.4, Y3, Y3 + 0.42, -29.0, -29.85, std('#6c7a6f', 0.9));
  boxAt(-8.6, -6.4, Y3 + 0.42, Y3 + 0.8, -29.65, -29.85, std('#6c7a6f', 0.9));
  roundTable(-7.5, Y3, -28.1, 0.42);
  fig(-9.3, Y3, -29.5, 1.1);
  // vách ngăn trong nhà / sân: tấm polycarbonate mờ khung đen, giữa có cửa kính lùa tự mở khi đi tới
  const DZ0 = -27.6, DZ1 = -28.95, DW = DZ0 - DZ1, frameK = std('#17181a', 0.45, 0.5);
  const polyM = new T.MeshStandardMaterial({ color: lin('#e7ecea'), roughness: 0.35, metalness: 0.05, transparent: true, opacity: 0.6, depthWrite: false, side: T.DoubleSide });
  noCast(boxAt(XP - 0.06, XP + 0.06, Y3, 7.3, ZF, ZF - 0.06, frameK));
  // theo ảnh nhìn từ trong ra: phần dưới (tới 2,5 m) là kính trong khung đen dày, phần trên là polycarbonate mờ
  for (const [a, b] of [[ZF, DZ0], [DZ1, z1]]) {
    const gm = plane(Math.abs(b - a) - 0.06, 2.44, GLASS(), XP, Y3 + 1.25, (a + b) / 2, Math.PI / 2); gm.renderOrder = 2; noCast(gm);
  }
  { const pm = plane(ZF - z1, 7.3 - Y3 - 2.5, polyM, XP, (Y3 + 2.5 + 7.3) / 2, (ZF + z1) / 2, Math.PI / 2); pm.renderOrder = 2; noCast(pm); }
  boxAt(XP - 0.05, XP + 0.05, Y3, Y3 + 0.06, ZF, z1, frameK);
  for (const z of [ZF - 0.06, z1 + 0.06]) boxAt(XP - 0.06, XP + 0.06, Y3, 7.3, z - 0.06, z + 0.06, frameK);
  for (const z of [DZ0 + 0.04, DZ1 - 0.04]) boxAt(XP - 0.07, XP + 0.07, Y3, 7.3, z - 0.07, z + 0.07, frameK);   // khung đen dày hai bên cửa, như ảnh
  boxAt(XP - 0.06, XP + 0.06, Y3 + 2.44, Y3 + 2.58, ZF, z1, frameK); boxAt(XP - 0.04, XP + 0.04, Y3 + 4.6 - 0.03, Y3 + 4.6 + 0.03, ZF, z1, frameK);
  for (const z of [DZ0, DZ1]) boxAt(XP - 0.05, XP + 0.05, Y3, Y3 + 2.5, z - 0.035, z + 0.035, frameK);
  boxAt(XP + 0.06, XP + 0.12, Y3 + 2.52, Y3 + 2.6, DZ0 + 0.1, z1 + 0.3, frameK);   // ray treo cửa lùa
  const tdoor = fit(live(group(XP + 0.09, Y3, (DZ0 + DZ1) / 2)));
  const dg = plane(DW - 0.06, 2.42, GLASS(), 0, 1.23, 0, Math.PI / 2, tdoor); dg.renderOrder = 2;
  box(0.05, 0.06, DW, frameK, 0, 2.46, 0, tdoor); box(0.05, 0.08, DW, frameK, 0, 0.04, 0, tdoor);
  for (const zz of [-DW / 2 + 0.03, DW / 2 - 0.03]) box(0.05, 2.48, 0.06, frameK, 0, 1.24, zz, tdoor);
  for (const xx of [-0.05, 0.05]) box(0.025, 0.9, 0.025, M.chrome, xx, 1.1, DW / 2 - 0.14, tdoor);
  let tOpen = 0;
  onFrame((t, dt) => {
    const c = camera.position, near = Math.abs(c.y - (Y3 + 1.6)) < 1.2 && Math.hypot(c.x / PLAN - XP, c.z / PLAN - (DZ0 + DZ1) / 2) < 3.2 ? 1 : 0;
    tOpen += (near - tOpen) * Math.min(1, dt * 2.4);
    tdoor.position.z = (DZ0 + DZ1) / 2 - tOpen * (DW - 0.08);
  });
  // ---- sân tầng 3 (theo ảnh): nền gạch xám, mái tôn kèo thép, mặt sau mở ra cây lớn có rèm cuộn,
  // bồn bê tông trồng cây rậm, ghế băng xanh rêu, bàn nhỏ khung inox, ghế gỗ ép, đèn cầu
  // mặt trước nhìn xuống xưởng: tường thấp + kính khung đen + polycarbonate phía trên
  noCast(boxAt(XP, 10, Y3, Y3 + 1.02, ZF, ZF - 0.22, M.white));   // tường thấp màu trắng dưới lớp kính
  // bồn trắng sát tường, cây cau và cây rậm như ảnh
  const planterW = std('#d3cfc6', 0.9);
  for (const [a, b] of [[-3.0, -1.7], [0.2, 3.0], [4.4, 6.4], [7.6, 9.6]]) {
    noCast(boxAt(a, b, Y3, Y3 + 0.42, ZF - 0.22, ZF - 0.8, planterW)); noCast(boxAt(a + 0.05, b - 0.05, Y3 + 0.4, Y3 + 0.43, ZF - 0.27, ZF - 0.75, M.soil));
    for (let x = a + 0.35; x < b - 0.2; x += 0.75) {
      const cz = ZF - 0.5;
      if (R() < 0.5) leafBlob('blade', x, Y3 + 1.15, cz, 0.55, 46, 0.55, [0.24, 0.3], [0.26, 0.38], 0.9);
      else monsteraBig(x, Y3 + 0.42, cz, rr(0.95, 1.2));
    }
  }
  { const pm = plane(10 - XP, 7.3 - Y3 - 1.0, polyM, (XP + 10) / 2, (Y3 + 1.0 + 7.3) / 2, ZF - 0.06); pm.renderOrder = 2; noCast(pm); }
  for (let x = XP; x <= 10.01; x += (10 - XP) / 8) boxAt(x - 0.03, x + 0.03, Y3 + 1.0, 7.3, ZF, ZF - 0.12, frameK);
  for (const y of [Y3 + 1.0, Y3 + 2.4, Y3 + 3.8]) boxAt(XP, 10, y - 0.025, y + 0.025, ZF, ZF - 0.12, frameK);
  noCast(boxAt(-1.55, -1.35, Y3, 7.3, -26.5, -26.7, frameK));   // cột đen giữa sân
  // mái: tôn sóng, kèo thép chéo, xà gồ
  noCast(boxAt(XP, 10, 7.3, 7.42, ZF, z1, M.corr));
  for (let x = XP + 1.15; x < 10; x += 2.3) noCast(boxAt(x - 0.05, x + 0.05, 7.05, 7.3, ZF, z1, frameK));
  for (const z of [ZF - 0.1, (ZF + z1) / 2, z1 + 0.1]) {
    noCast(boxAt(XP, 10, 6.62, 6.7, z - 0.04, z + 0.04, frameK));
    for (let x = XP; x < 9.9; x += 1.15) noCast(beam(V(x, 6.7, z), V(x + 1.15, 7.05, z), 0.04, 0.04, frameK)), noCast(beam(V(x + 1.15, 6.7, z), V(x + 1.15, 7.05, z), 0.035, 0.035, frameK));
  }
  // rèm cuộn ở mép mái phía sau
  const blind = cyl(0.09, 0.09, 10 - XP - 0.2, std('#9aa09e', 0.6, 0.3), (XP + 10) / 2, 6.48, z1 + 0.2, 16); blind.rotation.z = Math.PI / 2;
  boxAt(XP, 10, 6.36, 6.4, z1 + 0.14, z1 + 0.28, std('#8a908e', 0.5, 0.4));
  // mặt phải: mở thoáng ra tán cây lớn thứ hai (nhìn thẳng từ cửa trong nhà ra như ảnh), lan can sắt đen thấp, rèm cuộn ở mép mái
  for (let z = ZF - 0.1; z >= z1; z -= 0.12) boxAt(9.86, 9.9, Y3, Y3 + 1.1, z - 0.012, z + 0.012, frameK);
  boxAt(9.84, 9.92, Y3 + 1.08, Y3 + 1.12, ZF, z1, frameK);
  for (const z of [ZF - 0.05, z1 + 0.05]) noCast(boxAt(9.82, 9.98, Y3, 7.3, z - 0.06, z + 0.06, frameK));
  const blind2 = cyl(0.09, 0.09, ZF - z1 - 0.2, std('#9aa09e', 0.6, 0.3), 9.75, 6.48, (ZF + z1) / 2, 16); blind2.rotation.x = Math.PI / 2;
  // tấm rèm buông từ hai trục cuộn, dài ngắn theo thanh kéo
  const sheetM = std('#d2c9b4', 0.95, 0, { side: T.DoubleSide }), sheet = (x, z, w, ry) => {
    const g = new T.PlaneGeometry(1, 1); g.translate(0, -0.5, 0);
    const m = live(add(new T.Mesh(g, sheetM))); m.position.set(x, 6.4, z); m.rotation.y = ry; m.scale.x = w; return m;
  };
  const sheets = [sheet((XP + 10) / 2, z1 + 0.2, 10 - XP - 0.2, 0), sheet(9.75, (ZF + z1) / 2, ZF - z1 - 0.2, Math.PI / 2)];
  TERRACE.blind = k => { TERRACE.level = k; sheets.forEach(m => { m.scale.y = 0.12 + k * (6.4 - (Y3 + 0.95)); }); };
  TERRACE.blind(TERRACE.level);
  PICK.blind = live(boxAt(XP, 10, 6.1, 6.75, z1, z1 + 0.5, hidden));
  noCast(boxAt(9.82, 9.98, 6.6, 7.3, ZF, z1, M.corrSide));
  { const tx = 13.6, tz = -28.4, base = V(tx, 0, tz), mid = V(tx - 0.5, 4.6, tz + 0.3);
    rod(base, mid, 0.34, M.trunk, null, 10);
    for (let k = 0; k < 8; k++) {
      const a2 = k * 0.8 + rr(-0.2, 0.2), e = V(mid.x + Math.cos(a2) * rr(2.0, 3.6), rr(5.4, 8.6), mid.z + Math.sin(a2) * rr(2.0, 3.4));
      rod(mid, e, 0.12, M.trunk, null, 7);
      leafBlob('ficus', e.x, e.y, e.z, 1.9, 300, 0.44, [0.25, 0.31], [0.2, 0.34]);
    }
    leafBlob('ficus', mid.x, 7.4, mid.z, 2.7, 520, 0.44, [0.25, 0.31], [0.2, 0.34]);
    PICK.tree = live(boxAt(10.4, 16.5, 4.2, 10, -31.5, -25.2, hidden));
    // chim đậu trong tán: chạm vào cây là một cơn gió lay cả tán và đàn chim bay đi
    const birdM = std('#2a2622', 0.8, 0, { side: T.DoubleSide }), birds = [];
    for (let i = 0; i < 6; i++) {
      const b = live(group()), wing = s => { const g = new T.PlaneGeometry(0.17, 0.06); g.translate(s * 0.085, 0, 0); g.rotateX(-Math.PI / 2); const w = new T.Mesh(g, birdM); b.add(w); return w; };
      box(0.045, 0.04, 0.12, birdM, 0, 0, 0, b); b.visible = false;
      birds.push({ b, l: wing(-1), r: wing(1), dir: V(rr(-1, 0.3), rr(0.35, 0.8), rr(-1, 1)).normalize(), t: 0 });
    }
    let shake = 0;
    TERRACE.shake = () => {
      shake = 1;
      birds.forEach((p, i) => { p.t = -i * 0.14; p.b.position.set(mid.x + rr(-1.5, 1.5), rr(6.4, 8.2), mid.z + rr(-1.5, 1.5)); p.b.rotation.y = Math.atan2(p.dir.x, p.dir.z); p.b.visible = true; });
    };
    onFrame((t, dt) => {
      if (shake > 0) { shake = Math.max(0, shake - dt * 0.45); gust.value = gust.base * (1 + 2.6 * shake); }
      for (const p of birds) {
        if (!p.b.visible) continue;
        p.t += dt; if (p.t < 0) continue;
        p.b.position.addScaledVector(p.dir, (2.5 + p.t * 2.5) * dt);
        const a = Math.sin(p.t * 24) * 0.9; p.l.rotation.z = -a; p.r.rotation.z = a;   // vỗ cánh quanh trục thân chim
        if (p.t > 4.5) p.b.visible = false;
      }
    });
    noCast(boxAt(24, 30, 0, 11, -18, -38, std('#f1efea', 0.9)));
    noCast(plane(20, 7.6, M.house, 23.98, 7.2, -28, -Math.PI / 2));
  }
  // bồn bê tông và cây rậm dọc mép phải
  const cbr = tmat(TX.concrete, [1.5, 1.5], 0.85, '#b9b8b2');
  for (let z = ZF - 0.3; z > z1 + 1.0; z -= 1.62) {
    noCast(boxAt(9.25, 9.8, Y3, Y3 + 0.55, z, z - 1.5, cbr)); noCast(boxAt(9.3, 9.75, Y3 + 0.52, Y3 + 0.54, z - 0.05, z - 1.45, M.soil));
    const cz = z - 0.75;
    if (R() < 0.5) fern(9.52, Y3 + 0.54, cz, 1.1); else leafBlob('blade', 9.52, Y3 + 0.95, cz, 0.42, 26, 0.36, [0.22, 0.3], [0.28, 0.4]);
  }
  // mặt sau: lan can sắt đen thấp + bồn bê tông xám trồng cây rậm
  for (let x = XP; x <= 10; x += 0.12) boxAt(x - 0.012, x + 0.012, Y3, Y3 + 1.1, z1 + 0.04, z1 + 0.02, frameK);
  boxAt(XP, 10, Y3 + 1.08, Y3 + 1.12, z1 + 0.06, z1, frameK);
  const cbox = tmat(TX.concrete, [1.5, 1.5], 0.85, '#b9b8b2');
  for (let x = XP + 0.1; x < 9.8; x += 1.62) {
    noCast(boxAt(x, x + 1.55, Y3, Y3 + 0.55, z1 + 0.62, z1 + 0.1, cbox));
    noCast(boxAt(x + 0.05, x + 1.5, Y3 + 0.52, Y3 + 0.54, z1 + 0.57, z1 + 0.15, M.soil));
    const cx = x + 0.78, cz = z1 + 0.36, kind = Math.floor(R() * 4);
    if (kind === 0) monsteraBig(cx, Y3 + 0.54, cz, rr(1.0, 1.3));
    else if (kind === 1) { fern(cx - 0.35, Y3 + 0.54, cz, 1.1); fern(cx + 0.35, Y3 + 0.54, cz, 0.95); }
    else if (kind === 2) alocasia(cx, Y3 + 0.54, cz, 1.25);
    else leafBlob('oval', cx, Y3 + 1.2, cz, 0.6, 90, 0.16, [0.24, 0.3], [0.24, 0.36]);
    leafBlob('blade', x + rr(0.2, 1.3), Y3 + 0.8, cz + rr(-0.1, 0.1), 0.3, 18, 0.32, [0.22, 0.3], [0.28, 0.4]);
    if (R() < 0.5) pothosTrail(x + rr(0.3, 1.2), Y3 + 0.55, z1 + 0.62, 0.35);
  }
  // ghế băng gỗ sơn xanh rêu có tựa + bàn rêu
  const oliveT = std('#69744a', 0.75);
  const bench = (x, z, len) => {
    const g = group(x, Y3, z); shadow(len + 0.5, 0.95, 0, 0, 0, g);
    box(len, 0.05, 0.42, oliveT, 0, 0.45, 0, g); for (const sx of [-len / 2 + 0.12, len / 2 - 0.12]) box(0.06, 0.45, 0.38, oliveT, sx, 0.225, 0, g);
    box(len, 0.32, 0.04, oliveT, 0, 0.82, -0.2, g).rotation.x = -0.1; for (const sx of [-len / 2 + 0.12, len / 2 - 0.12]) box(0.05, 0.4, 0.04, oliveT, sx, 0.65, -0.19, g);
  };
  bench(7.4, -29.0, 1.8);
  // ít bàn ghế cho thoáng: hai cặp ghế gỗ ép thấp, giữa mỗi cặp là bàn nhỏ khung inox
  const sideT = (x, z, h, top) => {
    const g = group(x, Y3, z, rr(-0.05, 0.05)), st = std('#c3c8cb', 0.3, 0.8); shadow(0.75, 0.7, 0, 0, 0, g);
    box(0.46, 0.025, 0.4, top, 0, h, 0, g);
    for (const sx of [-0.215, 0.215]) for (const sz of [-0.185, 0.185]) box(0.018, h, 0.018, st, sx, h / 2, sz, g);
    for (const sz of [-0.185, 0.185]) box(0.44, 0.018, 0.018, st, 0, 0.012, sz, g);
  };
  const frost = std('#d9e2e2', 0.2, 0.1, { transparent: true, opacity: 0.85 });
  for (const x of [1.4, 5.6]) {
    plyChair(x - 0.8, Y3, -27.2, Math.PI + 0.25); sideT(x, -27.3, 0.45, frost); plyChair(x + 0.8, Y3, -27.2, Math.PI - 0.25);
  }
  // đèn cầu trắng treo từ mái
  for (const [x, z, y] of [[1.3, -27.2, Y3 + 2.4], [4.9, -28.4, Y3 + 1.95], [7.8, -27.0, Y3 + 2.3]]) {
    rod(V(x, y + 0.2, z), V(x, 7.05, z), 0.004, frameK, null, 3);
    const gl = new T.Mesh(new T.SphereGeometry(0.26, 20, 14), std('#f3f1ea', 0.6, 0, { emissive: lin('#fff3dc'), emissiveIntensity: 0.55 })); gl.position.set(x, y, z); keep(noCast(add(gl)));
  }
  // cây lớn phía sau xưởng + nhà trắng phía xa
  const bx = 2, bz = -34.5, top = V(bx, 4.6, bz);
  rod(V(bx, 0, bz), top, 0.32, M.trunk, scene, 10);
  for (let k = 0; k < 7; k++) {
    const a = k * 0.9 + rr(-0.2, 0.2), e = V(bx + Math.cos(a) * rr(2.5, 4.2), rr(6.5, 9.5), bz + Math.sin(a) * rr(1.8, 3.2) + 0.8);
    rod(top, e, 0.13, M.trunk, scene, 7);
    leafBlob('ficus', e.x, e.y, e.z, 2.0, 320, 0.46, [0.25, 0.31], [0.2, 0.34]);
  }
  leafBlob('ficus', bx, 8.8, bz, 3.1, 560, 0.46, [0.25, 0.31], [0.2, 0.34]);
  noCast(boxAt(-12, 14, 0, 16, -40, -48, std('#f1efea', 0.9)));
  noCast(plane(26, 12, M.house, 1, 9.6, -39.98));
}
