// Vỏ xưởng: sàn, tường, mặt tiền (kính, cửa lùa, chữ nổi), mái vì kèo, quạt hút, điều hoà, ống gió.
import { HALL, PLAN } from '../../config/levels.js';
import { T, camera, lin, onFrame, scene } from '../core.js';
import { leafBlob } from '../foliage.js';
import { GLASS, V, add, beam, box, boxAt, cyl, fit, group, keep, live, noCast, plane, quad, rod, std } from '../helpers.js';
import { M } from '../materials.js';
import { monstera } from '../props/plants.js';
import { R, rr } from '../random.js';
import { TX } from '../textures/index.js';
import { letterTex } from '../textures/signs.js';

export function buildShell() {
  const { x0, x1, z1, eave, ridge } = HALL;
  boxAt(x0, x1, -0.05, 0, 0, z1, M.terrazzo).userData.noCast = true;   // sàn tầng 1 terrazzo như xom-le-15
  // tường dài hai bên: tấm xi măng + tôn phía trên
  for (const s of [-1, 1]) {
    const xi = s * 10, xo = s * 10.2;
    noCast(boxAt(Math.min(xi, xo), Math.max(xi, xo), 0, 6.4, 0, z1, M.panel));
    noCast(boxAt(Math.min(xi, xo), Math.max(xi, xo), 6.4, eave, 0, z1, M.corr));
    // ô kính lấy sáng phía trên
    for (let z = -5; z > z1 + 1; z -= 5) {
      noCast(plane(2.6, 0.9, M.skyLight, s * 9.97, 7.15, z, -s * Math.PI / 2));
      boxAt(s * 9.95 - 0.04, s * 9.95 + 0.04, 6.66, 6.7, z - 1.32, z + 1.32, M.steel);
    }
  }
  // quạt hút trên tường bên quầy
  for (const z of [-12.5, -17.5]) {
    const f = live(group(9.9, 7.15, z, -Math.PI / 2));
    box(0.7, 0.7, 0.12, std('#8f9497', 0.5, 0.5), 0, 0, 0, f);
    const blades = group(0, 0, 0.08, 0, f);
    for (let k = 0; k < 3; k++) { const b = box(0.08, 0.3, 0.01, M.steel, 0, 0.15, 0, blades); b.position.set(Math.sin(k * 2.094) * 0.15, Math.cos(k * 2.094) * 0.15, 0); b.rotation.z = -k * 2.094; }
    onFrame((t, dt) => { blades.rotation.z += dt * 5; });
  }
  // mặt tiền (theo ảnh chụp từ mặt đường): một ô kính dài lệch trái, cửa kính lớn bên phải,
  // vỏ ngoài tôn sóng xanh đậm, đỉnh phẳng có lan can và chữ nổi. Mặt trong vẫn là tấm xi măng.
  const fz0 = 0.05, fz1 = -0.22, F = M.panelFacade, PT = HALL.parapet, XL = -7.6;
  const W = { x0: -9.8, x1: -0.6, y0: 1.8, y1: 3.95 }, D = { x0: 3.0, x1: 8.0, y1: 3.0, c: 5.5 };   // W: ô kính khu dating liền một tấm, chạy hết chiều ngang, cao như cũ
  noCast(boxAt(x0, W.x0, 0, 6.4, fz0, fz1, F));
  noCast(boxAt(W.x0, W.x1, 0, W.y0, fz0, fz1, F)); noCast(boxAt(W.x0, W.x1, W.y1, 6.4, fz0, fz1, F));
  noCast(boxAt(W.x1, D.x0, 0, 6.4, fz0, fz1, F));
  noCast(boxAt(D.x0, D.x1, D.y1, 6.4, fz0, fz1, F));
  noCast(boxAt(D.x1, x1 + 0.2, 0, 6.4, fz0, fz1, F));
  noCast(boxAt(x0 - 0.2, x1 + 0.2, 6.4, eave, fz0, fz1, M.corr));
  // tam giác hồi (mặt trong mặt tiền và mặt sau)
  for (const z of [0.02, z1 - 0.02]) {
    const sh = new T.Shape(); sh.moveTo(x0 - 0.2, eave); sh.lineTo(x1 + 0.2, eave); sh.lineTo(0, ridge + 0.05); sh.closePath();
    const m = new T.Mesh(new T.ShapeGeometry(sh), M.corrSide); m.position.z = z; noCast(add(m));
  }
  // lớp vỏ ngoài: tôn sóng màu đậm chạy hết mặt tiền
  const skin = (a, b, c, d, mat) => noCast(plane(b - a, d - c, mat, (a + b) / 2, (c + d) / 2, 0.075));
  const holes = [W, { x0: D.x0, x1: D.x1, y0: 0, y1: D.y1 }];
  const skinRegion = (a, b, mat) => {   // phủ vỏ ngoài một dải, chừa các ô kính và cửa
    const xs = [a, b]; holes.forEach(h => { for (const x of [h.x0, h.x1]) if (x > a && x < b) xs.push(x); });
    xs.sort((p, q) => p - q);
    for (let i = 0; i < xs.length - 1; i++) {
      const s0 = xs[i], s1 = xs[i + 1], m = (s0 + s1) / 2;
      let y = 0;
      for (const h of holes.filter(h => m > h.x0 && m < h.x1).sort((p, q) => p.y0 - q.y0)) { if (h.y0 > y) skin(s0, s1, y, h.y0, mat); y = Math.max(y, h.y1); }
      if (y < PT) skin(s0, s1, y, PT, mat);
    }
  };
  skinRegion(x0 - 0.2, x1 + 0.2, M.corrGreen);
  const pipe = std('#8e9a95', 0.5, 0.3);
  for (const x of [XL - 0.12, x1 + 0.05]) rod(V(x, 0, 0.17), V(x, PT - 0.1, 0.17), 0.055, pipe, scene, 10);
  keep(noCast(plane(2.0, 0.85, new T.MeshStandardMaterial({ map: TX.graffiti, roughness: 0.9 }), -9.0, 0.44, 0.09)));
  // ô kính dài góc dating, khung đen dày
  noCast(plane(W.x1 - W.x0, W.y1 - W.y0, GLASS(), (W.x0 + W.x1) / 2, (W.y0 + W.y1) / 2, -0.08));
  boxAt(W.x0 - 0.05, W.x1 + 0.05, W.y0 - 0.05, W.y0, 0.1, -0.2, M.steel); boxAt(W.x0 - 0.05, W.x1 + 0.05, W.y1, W.y1 + 0.05, 0.1, -0.2, M.steel);
  for (const x of [W.x0 - 0.025, W.x1 + 0.025]) boxAt(x - 0.025, x + 0.025, W.y0, W.y1, 0.1, -0.2, M.steel);   // khung mảnh, kính liền một tấm
  // cửa kính ra vào: một cánh lùa sang trái, trượt vào sau tấm kính cố định bên trái
  const DL = 5.3, DR = 7.0, leafW = DR - DL;
  noCast(plane(D.x1 - D.x0, D.y1 - 2.45, GLASS(), (D.x0 + D.x1) / 2, (2.45 + D.y1) / 2, -0.08));
  for (const [a, b] of [[D.x0, DL], [DR, D.x1]]) noCast(plane(b - a, 2.45, GLASS(), (a + b) / 2, 1.225, -0.08));
  boxAt(D.x0, D.x1, 2.42, 2.48, 0.0, -0.18, M.steel);
  for (const x of [D.x0, DL, DR, D.x1]) boxAt(x - 0.035, x + 0.035, 0, D.y1, 0.1, -0.18, M.steel);
  boxAt(D.x0 + 0.2, DR + 0.1, 2.5, 2.57, -0.21, -0.33, M.steel);   // ray treo cánh cửa phía trong
  const door = fit(live(group((DL + DR) / 2, 0, -0.27)));
  plane(leafW - 0.06, 2.36, GLASS(), 0, 1.21, 0, 0, door);
  box(leafW, 0.06, 0.05, M.steel, 0, 2.42, 0, door); box(leafW, 0.08, 0.05, M.steel, 0, 0.04, 0, door);
  for (const xx of [-leafW / 2 + 0.03, leafW / 2 - 0.03]) box(0.06, 2.44, 0.05, M.steel, xx, 1.22, 0, door);
  for (const zz of [0.06, -0.06]) box(0.03, 1.0, 0.03, M.chrome, leafW / 2 - 0.15, 1.1, zz, door);
  for (const xx of [-leafW / 2 + 0.25, leafW / 2 - 0.25]) cyl(0.035, 0.035, 0.04, M.steel, xx, 2.5, 0, 10, door).rotation.x = Math.PI / 2;
  let open = 0;
  onFrame((t, dt) => {
    const cx = camera.position.x / PLAN, cz = camera.position.z / PLAN, want = cz < 5.5 && cz > -3.5 && Math.abs(cx - (DL + DR) / 2) < 4.5 ? 1 : 0;
    open += (want - open) * Math.min(1, dt * 2.2);
    door.position.x = (DL + DR) / 2 - open * (leafW - 0.1);
  });
  // hộp mái che nan dọc trên cửa
  noCast(boxAt(D.x0 - 0.25, D.x1 + 0.25, 3.05, 3.65, 0.08, 0.78, std('#d5d9d8', 0.45, 0.2)));
  for (let x = D.x0 - 0.15; x < D.x1 + 0.2; x += 0.2) noCast(boxAt(x - 0.012, x + 0.012, 3.09, 3.61, 0.78, 0.8, std('#a3aaa8', 0.5, 0.3)));
  // đỉnh mặt tiền: gờ, lan can, chữ nổi GIALAM COFFEE ROASTER
  noCast(boxAt(x0 - 0.25, x1 + 0.25, PT - 0.02, PT + 0.12, 0.14, -0.35, std('#c9cdcb', 0.5, 0.3)));
  const RY = PT + 0.12, RZ = -0.22, rail = std('#e2e5e4', 0.4, 0.4);
  boxAt(x0 - 0.2, x1 + 0.2, RY + 1.0, RY + 1.06, RZ - 0.03, RZ + 0.03, rail);
  boxAt(x0 - 0.2, x1 + 0.2, RY + 0.06, RY + 0.1, RZ - 0.025, RZ + 0.025, rail);
  for (let x = x0 - 0.2; x <= x1 + 0.21; x += 1.275) boxAt(x - 0.03, x + 0.03, RY, RY + 1.06, RZ - 0.03, RZ + 0.03, rail);
  for (const x of [x0 - 0.2, x1 + 0.2]) boxAt(x - 0.03, x + 0.03, RY + 1.0, RY + 1.06, RZ, -3, rail);
  noCast(plane(x1 - x0 + 0.4, 0.88, std('#cfd6d6', 0.3, 0.2, { transparent: true, opacity: 0.3, side: T.DoubleSide }), 0, RY + 0.55, RZ));
  const lt = letterTex(), LW = 11.8, LH = LW * 216 / 2048;
  const back = new T.MeshStandardMaterial({ map: lt, alphaTest: 0.5, color: lin('#565d92'), roughness: 0.55, metalness: 0.15 });
  const face = M.signFace = new T.MeshStandardMaterial({ map: lt, alphaTest: 0.5, color: lin('#c2c6ee'), roughness: 0.45, metalness: 0.1, emissive: lin('#2a2f55'), emissiveIntensity: 0.25 });
  for (let k = 0; k <= 8; k++) { const m = new T.Mesh(new T.PlaneGeometry(LW, LH), k === 8 ? face : back); m.position.set(1.5, RY + LH / 2 - 0.02 - (8 - k) * 0.008, k * 0.03); keep(noCast(add(m))); }
  // bồn cây chân tường
  const planterM = std('#c3c4be', 0.9);
  for (const [a, b] of [[XL + 0.25, D.x0 - 0.2], [D.x1 + 0.2, x1 + 0.1]]) {
    noCast(boxAt(a, b, 0, 0.42, 0.08, 0.78, planterM)); noCast(boxAt(a + 0.05, b - 0.05, 0.38, 0.41, 0.13, 0.73, M.soil));
    for (let x = a + 0.35; x < b - 0.2; x += rr(0.6, 1.0)) {
      if (R() < 0.45) monstera(x, 0.41, 0.43, rr(0.6, 0.85));
      else leafBlob('blade', x, 0.8, 0.43, 0.32, 18, 0.34, [0.22, 0.3], [0.26, 0.38]);
    }
  }
  // mái: hai mái dốc, mặt dưới bạc, dải tấm lấy sáng
  const roofIn = (xa, ya, xb, yb, mat, dy = 0) => noCast(quad(V(xa, ya + dy, -0.15), V(xb, yb + dy, -0.15), V(xb, yb + dy, z1 - 0.3), V(xa, ya + dy, z1 - 0.3), mat));
  roofIn(-10.4, eave - 0.07, 0, ridge - 0.07, M.foil); roofIn(10.4, eave - 0.07, 0, ridge - 0.07, M.foil);
  roofIn(-10.4, eave + 0.05, 0, ridge + 0.05, M.roofTop); roofIn(10.4, eave + 0.05, 0, ridge + 0.05, M.roofTop);
  const yAt = x => eave + (ridge - eave) * (1 - Math.abs(x) / 10);
  for (const xc of [-6.2, -2.6, 2.6, 6.2]) {
    const a = xc - 0.6, b = xc + 0.6;
    noCast(quad(V(a, yAt(a) - 0.1, -0.6), V(b, yAt(b) - 0.1, -0.6), V(b, yAt(b) - 0.1, z1 + 0.6), V(a, yAt(a) - 0.1, z1 + 0.6), M.skyLight));
  }
  // vì kèo thép + xà gồ + cột
  const yb = 7.72;
  for (let z = -2.5; z > z1; z -= 5) {
    noCast(boxAt(x0, x1, yb - 0.09, yb + 0.09, z - 0.06, z + 0.06, M.steel));
    for (const s of [-1, 1]) {
      noCast(beam(V(s * 10, yAt(10) - 0.2, z), V(0, ridge - 0.2, z), 0.16, 0.12, M.steel));
      const pts = [0, 2.5, 5, 7.5, 10];
      for (let k = 0; k < pts.length - 1; k++) {
        const xa = s * pts[k], xb = s * pts[k + 1];
        if (k) noCast(beam(V(xa, yb, z), V(xa, yAt(xa) - 0.2, z), 0.06, 0.06, M.steel));
        noCast(beam(V(xa, yAt(xa) - 0.2, z), V(xb, yb, z), 0.06, 0.06, M.steel));
      }
    }
    noCast(beam(V(0, yb, z), V(0, ridge - 0.2, z), 0.06, 0.06, M.steel));
    for (const s of [-1, 1]) if (!(s === 1 && [-7.5, -12.5, -17.5].includes(z))) noCast(boxAt(s * 9.82 - 0.15, s * 9.82 + 0.15, 0, yb, z - 0.15, z + 0.15, M.steel));   // bỏ cột giữa kệ rượu
  }
  for (const x of [-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]) noCast(boxAt(x - 0.04, x + 0.04, yAt(x) - 0.26, yAt(x) - 0.14, 0, z1, M.steel));
  // điều hoà âm trần treo + ống gió đen
  const acM = std('#1d1f21', 0.6), grill = std('#f1f1ef', 0.5);
  for (const [x, z] of [[-1.5, -6.5], [3.4, -13], [-1.8, -24], [-7.5, -15], [-7.5, -24], [5.5, -6]]) {
    boxAt(x - 0.48, x + 0.48, 6.05, 6.35, z - 0.48, z + 0.48, acM);
    boxAt(x - 0.42, x + 0.42, 6.02, 6.05, z - 0.42, z + 0.42, grill);
    for (const dx of [-0.35, 0.35]) rod(V(x + dx, 6.35, z), V(x + dx, yb, z), 0.008, M.steel);
    const pts = [V(x, 6.4, z), V(x + 0.4, 6.9, z - 0.8), V(x + 0.2, 7.35, z - 2.5), V(x > 0 ? 9.6 : -9.6, 7.35, z - 3)];
    noCast(add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 24, 0.1, 8), std('#17191b', 0.7))));
  }
}
