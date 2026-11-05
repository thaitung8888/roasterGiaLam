// Tầng 3: tường sau, phòng làm việc (bàn xanh ngọc), vách kính + cửa lùa tự mở, sân nửa ngoài trời, hai cây lớn.
import { BACK, HALL, LV } from '../../config/levels.js';
import { T, camera, lin, onFrame, scene } from '../core.js';
import { leafBlob } from '../foliage.js';
import { GLASS, V, add, beam, box, boxAt, cyl, glow, group, live, noCast, plane, rod, std, tmat } from '../helpers.js';
import { M } from '../materials.js';
import { kermitChair, plyChair, roundTable, stool } from '../props/furniture.js';
import { alocasia, fern, fig, monsteraBig, pothosTrail } from '../props/plants.js';
import { R, rr } from '../random.js';
import { TX } from '../textures/index.js';

export function buildFloor3() {
  const { z1 } = HALL, Y3 = LV.t3, ZF = BACK.zFront, XP = BACK.xRoom;
  // tường sau
  noCast(boxAt(-10.2, XP, 0, HALL.eave, z1, z1 - 0.2, M.panel));
  noCast(boxAt(XP, 10.2, 0, Y3, z1, z1 - 0.2, M.panel));
  noCast(boxAt(XP, 10.2, 7.3, HALL.eave, z1, z1 - 0.2, M.corr));
  // khối dưới tầng 3 trong nhà
  boxAt(-10, XP, 0, Y3 - 0.05, -24.7, z1, M.white);
  noCast(boxAt(-10, XP, Y3 - 0.05, Y3, -24.7, z1, M.epoxy));
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
  rail(-8.6, XP, -24.72, -24.72); rail(XP + 0.02, XP + 0.02, -24.72, ZF);
  boxAt(-8.3, -4.2, Y3 + 0.72, Y3 + 0.76, -24.85, -25.45, std('#2d8a99', 0.55));   // mặt bàn làm việc xanh ngọc như ảnh
  for (const x of [-8.15, -4.35]) boxAt(x - 0.03, x + 0.03, Y3, Y3 + 0.72, -24.9, -25.4, M.steel);
  boxAt(-8.3, -4.2, Y3 + 0.76, Y3 + 0.8, -24.86, -24.92, std('#2a2c2e', 0.6));
  for (const x of [-7.6, -6.6, -5.6, -4.6]) {
    stool(x, Y3, -25.85);
    boxAt(x - 0.16, x + 0.16, Y3 + 0.77, Y3 + 0.785, -25.0, -25.22, std('#3a3d40', 0.4, 0.5));
    boxAt(x - 0.16, x + 0.16, Y3 + 0.78, Y3 + 0.98, -24.98, -25.0, std('#202224', 0.3, 0.4)).rotation.x = -0.2;
  }
  for (const x of [-7.1, -5.1]) {
    rod(V(x, Y3 + 1.75, -25.15), V(x, HALL.eave - 0.4, -25.15), 0.004, M.steel, scene, 3);
    const gl = new T.Mesh(new T.SphereGeometry(0.16, 16, 12), M.lamp); gl.position.set(x, Y3 + 1.6, -25.15); noCast(add(gl));
  }
  // (bỏ tủ sách) góc tường: đèn tuýp đứng + quạt cây như ảnh
  cyl(0.12, 0.12, 0.02, std('#1b1c1e', 0.5, 0.5), -9.55, Y3 + 0.01, -27.9, 16);
  rod(V(-9.55, Y3, -27.9), V(-9.55, Y3 + 0.35, -27.9), 0.012, std('#1b1c1e', 0.5, 0.5), null, 6);
  noCast(rod(V(-9.55, Y3 + 0.35, -27.9), V(-9.55, Y3 + 1.75, -27.9), 0.028, glow('#ffe6c0', 1.9), null, 10));
  const sf = group(-9.4, Y3, -28.7, Math.PI / 2 + 0.4), fanM = std('#e9e9e6', 0.5);
  cyl(0.18, 0.2, 0.04, fanM, 0, 0.02, 0, 16, sf); rod(V(0, 0, 0), V(0, 1.0, 0), 0.016, fanM, sf, 8);
  box(0.1, 0.14, 0.16, fanM, 0, 1.06, -0.04, sf);
  const sring = new T.Mesh(new T.TorusGeometry(0.2, 0.008, 6, 28), std('#cfd2d2', 0.4, 0.5)); sring.position.set(0, 1.08, 0.1); sf.add(sring);
  const sbl = live(group(0, 1.08, 0.09, 0, sf));
  for (let k = 0; k < 3; k++) { const b = box(0.08, 0.17, 0.006, std('#dfe3e6', 0.4), 0, 0, 0, sbl); b.position.set(Math.sin(k * 2.094) * 0.09, Math.cos(k * 2.094) * 0.09, 0); b.rotation.z = -k * 2.094; }
  onFrame((t, dt) => { sbl.rotation.z += dt * 12; });
  boxAt(-8.6, -6.4, Y3, Y3 + 0.42, -29.0, -29.85, std('#6c7a6f', 0.9));
  boxAt(-8.6, -6.4, Y3 + 0.42, Y3 + 0.8, -29.65, -29.85, std('#6c7a6f', 0.9));
  roundTable(-7.5, Y3, -28.1, 0.3, 0.5);
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
  const tdoor = live(group(XP + 0.09, Y3, (DZ0 + DZ1) / 2));
  const dg = plane(DW - 0.06, 2.42, GLASS(), 0, 1.23, 0, Math.PI / 2, tdoor); dg.renderOrder = 2;
  box(0.05, 0.06, DW, frameK, 0, 2.46, 0, tdoor); box(0.05, 0.08, DW, frameK, 0, 0.04, 0, tdoor);
  for (const zz of [-DW / 2 + 0.03, DW / 2 - 0.03]) box(0.05, 2.48, 0.06, frameK, 0, 1.24, zz, tdoor);
  for (const xx of [-0.05, 0.05]) box(0.025, 0.9, 0.025, M.chrome, xx, 1.1, DW / 2 - 0.14, tdoor);
  let tOpen = 0;
  onFrame((t, dt) => {
    const c = camera.position, near = Math.abs(c.y - (Y3 + 1.6)) < 1.2 && Math.hypot(c.x - XP, c.z - (DZ0 + DZ1) / 2) < 3.2 ? 1 : 0;
    tOpen += (near - tOpen) * Math.min(1, dt * 2.4);
    tdoor.position.z = (DZ0 + DZ1) / 2 - tOpen * (DW - 0.08);
  });
  // ---- sân tầng 3 (theo ảnh): nền gạch xám, mái tôn kèo thép, mặt sau mở ra cây lớn có rèm cuộn,
  // bồn bê tông trồng cây rậm, ghế băng xanh rêu, bàn nhỏ khung inox, ghế gỗ ép, đèn cầu
  // mặt trước nhìn xuống xưởng: tường thấp + kính khung đen + polycarbonate phía trên
  for (let x = XP; x <= 10; x += 0.12) boxAt(x - 0.012, x + 0.012, Y3, Y3 + 1.0, ZF - 0.2, ZF - 0.22, frameK);   // lan can sắt đen
  boxAt(XP, 10, Y3 + 0.98, Y3 + 1.02, ZF - 0.18, ZF - 0.24, frameK);
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
  noCast(boxAt(9.82, 9.98, 6.6, 7.3, ZF, z1, M.corrSide));
  { const tx = 13.6, tz = -28.4, base = V(tx, 0, tz), mid = V(tx - 0.5, 4.6, tz + 0.3);
    rod(base, mid, 0.34, M.trunk, null, 10);
    for (let k = 0; k < 8; k++) {
      const a2 = k * 0.8 + rr(-0.2, 0.2), e = V(mid.x + Math.cos(a2) * rr(2.0, 3.6), rr(5.4, 8.6), mid.z + Math.sin(a2) * rr(2.0, 3.4));
      rod(mid, e, 0.12, M.trunk, null, 7);
      leafBlob('oval', e.x, e.y, e.z, 1.8, 140, 0.4, [0.2, 0.28], [0.3, 0.44]);
    }
    leafBlob('oval', mid.x, 7.4, mid.z, 2.6, 240, 0.42, [0.2, 0.28], [0.3, 0.44]);
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
    const g = group(x, Y3, z);
    box(len, 0.05, 0.42, oliveT, 0, 0.45, 0, g); for (const sx of [-len / 2 + 0.12, len / 2 - 0.12]) box(0.06, 0.45, 0.38, oliveT, sx, 0.225, 0, g);
    box(len, 0.32, 0.04, oliveT, 0, 0.82, -0.2, g).rotation.x = -0.1; for (const sx of [-len / 2 + 0.12, len / 2 - 0.12]) box(0.05, 0.4, 0.04, oliveT, sx, 0.65, -0.19, g);
  };
  bench(3.4, -29.0, 2.2); bench(7.4, -29.0, 1.8);
  box(1.0, 0.05, 0.6, oliveT, 0.5, Y3 + 0.74, -28.85); for (const sx of [0.08, 0.92]) box(0.06, 0.72, 0.5, oliveT, sx, Y3 + 0.36, -28.85);
  // bàn nhỏ khung inox mặt kính mờ / trắng, đặt theo cặp
  const sideT = (x, z, h, top) => {
    const g = group(x, Y3, z, rr(-0.05, 0.05)), st = std('#c3c8cb', 0.3, 0.8);
    box(0.46, 0.025, 0.4, top, 0, h, 0, g);
    for (const sx of [-0.215, 0.215]) for (const sz of [-0.185, 0.185]) box(0.018, h, 0.018, st, sx, h / 2, sz, g);
    for (const sz of [-0.185, 0.185]) box(0.44, 0.018, 0.018, st, 0, 0.012, sz, g);
  };
  const frost = std('#d9e2e2', 0.2, 0.1, { transparent: true, opacity: 0.85 }), whiteTop = std('#ecebe6', 0.5);
  sideT(2.9, -27.9, 0.45, frost); sideT(3.37, -27.92, 0.45, whiteTop);
  sideT(5.9, -28.1, 0.48, frost); sideT(6.37, -28.12, 0.48, whiteTop);
  sideT(0.2, -27.6, 0.78, frost);
  const tg = group(0, Y3, 0);
  kermitChair(-2.6, -26.6, Math.PI / 2 + 0.3, tg); kermitChair(-2.7, -27.4, Math.PI / 2 - 0.2, tg); kermitChair(0.9, -26.9, -Math.PI / 2 - 0.4, tg);
  sideT(-2.0, -27.0, 0.5, std('#c3c8cb', 0.3, 0.8)); sideT(0.4, -26.5, 0.5, frost);
  const cbx = tmat(TX.concrete, [1.5, 1.5], 0.85, '#b9b8b2');
  noCast(boxAt(-3.4, -2.3, Y3, Y3 + 0.55, ZF - 0.3, ZF - 0.85, cbx)); noCast(boxAt(-3.35, -2.35, Y3 + 0.52, Y3 + 0.54, ZF - 0.35, ZF - 0.8, M.soil));
  leafBlob('oval', -2.85, Y3 + 1.35, ZF - 0.58, 0.45, 70, 0.14, [0.22, 0.3], [0.3, 0.42]);
  rod(V(-2.85, Y3 + 0.54, ZF - 0.58), V(-2.85, Y3 + 1.4, ZF - 0.58), 0.02, M.trunk, null, 6);
  
  sideT(2.2, -26.6, 0.5, std('#2c48b4', 0.5));
  // ghế gỗ ép thấp tựa nghiêng, quay ra phía cây
  plyChair(-1.4, Y3, -26.2, -0.55); plyChair(-0.6, Y3, -26.4, -0.35); plyChair(8.3, Y3, -26.9, -Math.PI / 2 + 0.5);
  // đèn cầu trắng treo từ mái
  for (const [x, z, y] of [[1.3, -27.2, Y3 + 2.4], [4.9, -28.4, Y3 + 1.95], [7.8, -27.0, Y3 + 2.3]]) {
    rod(V(x, y + 0.2, z), V(x, 7.05, z), 0.004, frameK, null, 3);
    const gl = new T.Mesh(new T.SphereGeometry(0.26, 20, 14), std('#f3f1ea', 0.6, 0, { emissive: lin('#fff3dc'), emissiveIntensity: 0.55 })); gl.position.set(x, y, z); noCast(add(gl));
  }
  // cây lớn phía sau xưởng + nhà trắng phía xa
  const bx = 2, bz = -34.5, top = V(bx, 4.6, bz);
  rod(V(bx, 0, bz), top, 0.32, M.trunk, scene, 10);
  for (let k = 0; k < 7; k++) {
    const a = k * 0.9 + rr(-0.2, 0.2), e = V(bx + Math.cos(a) * rr(2.5, 4.2), rr(6.5, 9.5), bz + Math.sin(a) * rr(1.8, 3.2) + 0.8);
    rod(top, e, 0.13, M.trunk, scene, 7);
    leafBlob('oval', e.x, e.y, e.z, 1.9, 150, 0.42, [0.2, 0.28], [0.3, 0.42]);
  }
  leafBlob('oval', bx, 8.8, bz, 3.0, 260, 0.45, [0.2, 0.28], [0.3, 0.42]);
  noCast(boxAt(-12, 14, 0, 16, -40, -48, std('#f1efea', 0.9)));
  noCast(plane(26, 12, M.house, 1, 9.6, -39.98));
}
