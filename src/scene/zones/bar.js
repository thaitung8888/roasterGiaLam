// Quầy order dọc tường phải: khối gỗ, thu ngân, tủ bánh, quầy dài, bàn sau inox, kệ rượu, tủ mát.
import { PICK, T, lin, onFrame, scene } from '../core.js';
import { leaf, leafBlob } from '../foliage.js';
import { GLASS, V, add, box, boxAt, cyl, glow, group, live, noCast, plane, rod, std } from '../helpers.js';
import { M } from '../materials.js';
import { barStool } from '../props/furniture.js';
import { fig, pot } from '../props/plants.js';
import { shadow } from '../props/shadow.js';
import { R, pick, rr } from '../random.js';
import { canvasTex } from '../textures/canvas.js';

export function beanLabel(band) {
  return canvasTex(160, 144, (g, w, h) => {
    g.fillStyle = '#f4f3ee'; g.fillRect(0, 0, w, h);
    g.fillStyle = band; g.fillRect(0, h * 0.3, w, h * 0.7);
    g.strokeStyle = '#2b4a7a'; g.lineWidth = 3; g.beginPath(); g.moveTo(10, h * 0.7); g.lineTo(40, h * 0.55); g.lineTo(62, h * 0.66); g.lineTo(90, h * 0.5); g.lineTo(118, h * 0.68); g.stroke();
    g.fillStyle = '#1c2a3a'; g.font = '700 17px "Bebas Neue", sans-serif'; g.textAlign = 'center';
    g.fillText('GIALAM', w / 2, h * 0.86); g.font = '500 10px sans-serif'; g.fillText('COFFEE ROASTER', w / 2, h * 0.94);
    g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, 0, w, 10);
  }, { clamp: true });
}
export function pastry(kind, x, y, z, parent, k = 1.5) {
  const sponge = std(pick(['#d7b07a', '#c9955a', '#e6cfa6']), 0.8), cream = std(pick(['#f3ece0', '#5a3a28', '#e8a7a4', '#f1d58c']), 0.7);
  if (kind === 0) { box(0.09 * k, 0.05 * k, 0.07 * k, sponge, x, y + 0.025 * k, z, parent); box(0.09 * k, 0.018 * k, 0.07 * k, cream, x, y + 0.059 * k, z, parent); }
  else if (kind === 1) { cyl(0.07 * k, 0.07 * k, 0.06 * k, sponge, x, y + 0.03 * k, z, 18, parent); cyl(0.07 * k, 0.07 * k, 0.015 * k, cream, x, y + 0.068 * k, z, 18, parent); }
  else if (kind === 2) { const c = new T.Mesh(new T.TorusGeometry(0.035 * k, 0.018 * k, 6, 10, Math.PI * 1.2), std('#c98b3e', 0.7)); c.position.set(x, y + 0.02 * k, z); c.rotation.x = -Math.PI / 2; add(c, parent); }
  else { for (let j = 0; j < 3; j++) cyl(0.032 * k, 0.032 * k, 0.012 * k, std('#a8743f', 0.8), x, y + (0.006 + j * 0.013) * k, z, 12, parent); }
}
export function buildBar() {
  // Bố cục dọc tường (z): đầu quầy ngang cầu thang lên dating, khối gỗ sát tường → thu ngân → tủ bánh → quầy dài (~70% tầng 1)
  const WX = 9.97, Z0 = -7.6, ZR = -8.6, ZC = -11.4, ZP = -12.8, ZE = -21.3, H = 1.05;
  const steelTop = std('#c3c8cb', 0.3, 0.75), steelBody = std('#a9b0b3', 0.4, 0.65);
  const white = std('#f4f3ef', 0.5), black = std('#18191b', 0.45, 0.3), red = std('#c3282f', 0.4, 0.1), kick = std('#0d4f59', 0.8);
  const bean = std('#4a2c1a', 0.9), glassM = GLASS();

  // tường sơn trắng phía sau quầy + vệt sáng ấm hắt xuống từ kệ
  noCast(boxAt(WX, WX + 0.02, 0, 2.75, -7.2, -22.2, std('#e9e4d8', 0.9)));
  const wash = canvasTex(16, 128, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,178,80,1)'); gr.addColorStop(0.6, 'rgba(255,190,100,.35)'); gr.addColorStop(1, 'rgba(255,190,100,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); }, { clamp: true });
  live(plane(14.1, 0.95, new T.MeshBasicMaterial({ map: wash, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.45 }), WX - 0.005, 2.05 - 0.475, -14.45, -Math.PI / 2));

  // kệ rượu xanh, dải LED dưới kệ, chai rượu dày đặc + vài chậu cây
  boxAt(9.6, WX, 2.06, 2.11, -7.4, -21.5, M.tealWood);
  noCast(boxAt(9.63, 9.66, 2.045, 2.06, -7.5, -21.4, glow('#ffcf85', 1.8)));
  const plantSpots = [-8.2, -10.9, -13.6, -16.0, -18.4, -20.6];
  const kinds = [
    { body: new T.CylinderGeometry(0.042, 0.042, 0.3, 12), bh: 0.3, neck: new T.CylinderGeometry(0.014, 0.02, 0.13, 8), nh: 0.13, items: [] },
    { body: new T.BoxGeometry(0.095, 0.23, 0.065), bh: 0.23, neck: new T.CylinderGeometry(0.016, 0.016, 0.07, 8), nh: 0.07, items: [] },
    { body: new T.CylinderGeometry(0.055, 0.058, 0.19, 12), bh: 0.19, neck: new T.CylinderGeometry(0.014, 0.017, 0.1, 8), nh: 0.1, items: [] }
  ];
  const bCols = ['#2a140c', '#5a1e14', '#8a3a16', '#b8862f', '#d9b25c', '#24361f', '#163020', '#c43a2f', '#e0d6bc', '#1f2a2e', '#6b1a2a', '#a34a1c', '#efe6cf'];
  for (let z = -7.55; z > -21.4; z -= rr(0.1, 0.14)) {
    if (plantSpots.some(p => Math.abs(p - z) < 0.2)) continue;
    pick(kinds).items.push([9.8 + rr(-0.05, 0.05), z, pick(bCols), rr(0.9, 1.1)]);
  }
  const o3 = new T.Object3D(), bottleMat = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.18, metalness: 0.1 });
  const capMat = std('#1a1a1a', 0.5), labelMat = std('#efe9d8', 0.8);
  kinds.forEach(k => {
    const n = k.items.length, bi = new T.InstancedMesh(k.body, bottleMat, n), ni = new T.InstancedMesh(k.neck, bottleMat, n);
    const ci = new T.InstancedMesh(new T.CylinderGeometry(0.016, 0.016, 0.03, 8), capMat, n), li = new T.InstancedMesh(k.body, labelMat, n);
    k.items.forEach(([x, z, c, s], i) => {
      o3.rotation.set(0, rr(-0.3, 0.3), 0);
      o3.position.set(x, 2.11 + k.bh * s / 2, z); o3.scale.set(1, s, 1); o3.updateMatrix(); bi.setMatrixAt(i, o3.matrix);
      o3.scale.set(1.04, s * 0.4, 1.04); o3.position.y = 2.11 + k.bh * s * 0.45; o3.updateMatrix(); li.setMatrixAt(i, o3.matrix);
      o3.scale.set(1, 1, 1); o3.position.y = 2.11 + k.bh * s + k.nh / 2; o3.updateMatrix(); ni.setMatrixAt(i, o3.matrix);
      o3.position.y = 2.11 + k.bh * s + k.nh + 0.012; o3.updateMatrix(); ci.setMatrixAt(i, o3.matrix);
      const col = lin(c); bi.setColorAt(i, col); ni.setColorAt(i, col);
    });
    for (const im of [bi, ni, ci, li]) { live(im); scene.add(im); }
  });
  pot(9.8, 2.11, -8.2, 0.07, 0.1, M.potClay); leafBlob('blade', 9.8, 2.32, -8.2, 0.12, 16, 0.2);
  pot(9.78, 2.11, -10.9, 0.1, 0.12, M.potClay);
  for (let k = 0; k < 30; k++) { const a = R() * 6.28; leaf('blade', 9.78 + Math.cos(a) * 0.05, 2.25, -10.9 + Math.sin(a) * 0.05, rr(0.9, 1.5), Math.PI / 2 - a, 0, rr(0.28, 0.4), new T.Color().setHSL(rr(0.25, 0.3), 0.5, rr(0.3, 0.4))); }
  pot(9.8, 2.11, -13.6, 0.08, 0.1, M.potClay);
  for (let k = 0; k < 22; k++) { const t = k / 21; leaf('oval', 9.72 - t * 0.12, 2.18 - t * 0.85, -13.6 + Math.sin(t * 9) * 0.1, rr(-0.5, 0.5), -Math.PI / 2 + rr(-0.6, 0.6), Math.PI + rr(-0.4, 0.4), rr(0.07, 0.1), new T.Color().setHSL(0.27, 0.5, rr(0.28, 0.38))); }
  pot(9.8, 2.11, -16.0, 0.08, 0.12, M.potConc);
  for (let k = 0; k < 9; k++) leaf('blade', 9.8 + rr(-0.04, 0.04), 2.22, -16.0 + rr(-0.04, 0.04), rr(-0.15, 0.15), R() * 6.28, 0, rr(0.35, 0.5), new T.Color().setHSL(0.24, 0.45, rr(0.24, 0.32)));

  pot(9.8, 2.11, -18.4, 0.09, 0.12, M.potClay);
  for (let k = 0; k < 26; k++) { const a = R() * 6.28; leaf('blade', 9.8 + Math.cos(a) * 0.05, 2.25, -18.4 + Math.sin(a) * 0.05, rr(0.9, 1.5), Math.PI / 2 - a, 0, rr(0.26, 0.38), new T.Color().setHSL(rr(0.25, 0.3), 0.5, rr(0.3, 0.4))); }
  pot(9.8, 2.11, -20.6, 0.08, 0.1, M.potClay);
  for (let k = 0; k < 20; k++) { const t = k / 19; leaf('oval', 9.72 - t * 0.1, 2.18 - t * 0.7, -20.6 + Math.sin(t * 8) * 0.1, rr(-0.5, 0.5), -Math.PI / 2 + rr(-0.6, 0.6), Math.PI + rr(-0.4, 0.4), rr(0.07, 0.1), new T.Color().setHSL(0.27, 0.5, rr(0.28, 0.38))); }
  // bàn sau inox, cánh tủ dưới, khối gỗ xanh sát tường đầu quầy
  boxAt(9.2, WX, 0.06, 0.88, ZR, ZE, steelBody); boxAt(9.18, WX, 0.88, 0.92, ZR, ZE, steelTop); boxAt(9.25, WX - 0.02, 0, 0.06, ZR, ZE, black);
  for (let z = -8.9; z > ZE + 0.3; z -= 0.62) { boxAt(9.19, 9.2, 0.15, 0.82, z - 0.28, z + 0.28, std('#b7bec1', 0.3, 0.7)); boxAt(9.16, 9.19, 0.7, 0.73, z - 0.18, z + 0.18, M.chrome); }
  boxAt(9.0, WX, 0.06, 0.95, Z0, -8.6, M.tealWood); boxAt(8.95, WX, 0.95, 0.99, Z0 + 0.05, -8.6, M.tealWood); boxAt(9.05, WX, 0, 0.06, Z0, -8.6, kick);
  // tranh cầu Long Biên
  const art = canvasTex(256, 192, (g, w, h) => {
    g.fillStyle = '#5d86b8'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8eef2'; g.beginPath(); g.arc(w * 0.72, h * 0.3, 18, 0, 7); g.fill();
    g.fillStyle = '#2d3a4a'; g.fillRect(0, h * 0.62, w, h * 0.38); g.strokeStyle = '#141a22'; g.lineWidth = 3;
    for (let k = 0; k < 4; k++) { const x = k * 70 - 10; g.beginPath(); g.moveTo(x, h * 0.6); g.quadraticCurveTo(x + 35, h * 0.28, x + 70, h * 0.6); g.stroke(); for (let j = 0; j < 7; j++) { g.beginPath(); g.moveTo(x + j * 10, h * 0.6); g.lineTo(x + j * 10 + 5, h * 0.42); g.stroke(); } }
    g.fillStyle = '#141a22'; g.fillRect(0, h * 0.59, w, 4);
  }, { clamp: true });
  const fr = box(0.04, 0.5, 0.66, std('#4a3424', 0.6), 9.9, 1.25, -8.05); fr.rotation.z = -0.08;
  plane(0.58, 0.42, new T.MeshStandardMaterial({ map: art, roughness: 0.7 }), 9.872, 1.25, -8.05, -Math.PI / 2).rotation.z = 0;
  box(0.1, 0.03, 0.14, std('#2f6b5c', 0.6), 9.5, 1.005, -7.9);
  // bình cứu hoả, hộp nhựa, máy pha tự động, cốc đỏ, đĩa, lò nướng
  [['#c8262c', -8.85], ['#c8262c', -9.05], ['#8fd3b8', -9.25], ['#1e1f22', -9.45]].forEach(([c, z]) => {
    cyl(0.065, 0.065, 0.48, std(c, 0.45, 0.1), 9.75, 0.92 + 0.24, z, 14); cyl(0.02, 0.02, 0.06, black, 9.75, 1.43, z, 8); box(0.1, 0.02, 0.02, black, 9.75, 1.47, z);
  });
  for (let k = 0; k < 2; k++) box(0.38, 0.16, 0.26, std('#e9ecec', 0.3, 0, { transparent: true, opacity: 0.75 }), 9.62, 1.0 + k * 0.17, -9.95);
  const am = group(9.62, 0.92, -10.55, -Math.PI / 2);
  box(0.36, 0.55, 0.42, std('#b9bfc2', 0.3, 0.8), 0, 0.275, 0, am); box(0.3, 0.2, 0.02, black, 0, 0.38, 0.215, am); box(0.18, 0.04, 0.12, M.chrome, 0, 0.08, 0.24, am);
  for (const dz of [-10.95, -11.1, -11.25]) { cyl(0.045, 0.04, rr(0.22, 0.34), red, 9.55 + rr(0, 0.25), 0.92 + 0.15, dz, 14); }
  cyl(0.12, 0.12, 0.13, white, 9.6, 0.92 + 0.065, -11.55, 20);
  const ov = group(9.62, 0.92, -12.1, -Math.PI / 2);
  box(0.46, 0.28, 0.36, black, 0, 0.14, 0, ov); box(0.3, 0.17, 0.01, std('#2b1a12', 0.2, 0.2, { emissive: lin('#ff8a3a'), emissiveIntensity: 0.25 }), -0.05, 0.14, 0.181, ov);
  // giá inox hai tầng úp ly
  for (const x of [9.32, 9.92]) for (const z of [-12.65, -14.35]) boxAt(x - 0.015, x + 0.015, 0.92, 1.66, z - 0.015, z + 0.015, M.chrome);
  for (const y of [1.3, 1.64]) boxAt(9.3, 9.94, y, y + 0.02, -12.65, -14.35, M.chrome);
  const gl = [], tm = [];
  for (let z = -12.75; z > -14.3; z -= 0.11) for (const x of [9.45, 9.62, 9.79]) { gl.push([x, z]); if (R() < 0.8) tm.push([x, z]); }
  const glassV = new T.MeshStandardMaterial({ color: lin('#e4f0f1'), roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.5, depthWrite: false });
  const bowl = new T.InstancedMesh(new T.CylinderGeometry(0.02, 0.038, 0.08, 12), glassV, gl.length), stem = new T.InstancedMesh(new T.CylinderGeometry(0.004, 0.004, 0.08, 6), glassV, gl.length), foot = new T.InstancedMesh(new T.CylinderGeometry(0.028, 0.028, 0.004, 12), glassV, gl.length);
  gl.forEach(([x, z], i) => { o3.rotation.set(0, 0, 0); o3.scale.set(1, 1, 1); o3.position.set(x, 1.66 + 0.04, z); o3.updateMatrix(); bowl.setMatrixAt(i, o3.matrix); o3.position.y = 1.66 + 0.12; o3.updateMatrix(); stem.setMatrixAt(i, o3.matrix); o3.position.y = 1.66 + 0.162; o3.updateMatrix(); foot.setMatrixAt(i, o3.matrix); });
  const tum = new T.InstancedMesh(new T.CylinderGeometry(0.034, 0.03, 0.1, 12), glassV, tm.length);
  tm.forEach(([x, z], i) => { o3.position.set(x, 1.32 + 0.05, z); o3.updateMatrix(); tum.setMatrixAt(i, o3.matrix); });
  for (const im of [bowl, stem, foot, tum]) { live(im); im.renderOrder = 3; scene.add(im); }
  // bồn rửa, nồi, ấm, máy xay sinh tố, hộp sữa
  boxAt(9.4, 9.85, 0.86, 0.925, -14.6, -15.1, std('#5e6366', 0.2, 0.8));
  rod(V(9.88, 0.92, -14.85), V(9.88, 1.3, -14.85), 0.012, M.chrome); rod(V(9.88, 1.3, -14.85), V(9.68, 1.22, -14.85), 0.012, M.chrome);
  cyl(0.11, 0.11, 0.16, M.chrome, 9.62, 0.92 + 0.08, -15.35, 18); cyl(0.08, 0.08, 0.12, M.chrome, 9.82, 0.92 + 0.06, -15.55, 16);
  box(0.14, 0.12, 0.14, black, 9.62, 0.98, -15.9); cyl(0.06, 0.05, 0.22, glassM, 9.62, 1.15, -15.9, 12);
  for (let k = 0; k < 4; k++) box(0.08, 0.2, 0.08, std(k % 2 ? '#f1f1ed' : '#d8e8f2', 0.6), 9.5 + (k % 2) * 0.1, 1.02, -16.3 - (k >> 1) * 0.1);
  for (let k = 0; k < 6; k++) { const z = -16.9 - k * 0.2; cyl(0.06, 0.06, 0.2, glassM, 9.62, 1.02, z, 14); cyl(0.055, 0.055, rr(0.08, 0.16), bean, 9.62, 0.96, z, 12); cyl(0.062, 0.062, 0.02, black, 9.62, 1.13, z, 14); }
  for (let k = 0; k < 3; k++) cyl(0.045, 0.04, rr(0.3, 0.45), white, 9.5 + k * 0.14, 0.92 + 0.19, -18.4 + rr(-0.05, 0.05), 14);
  box(0.4, 0.3, 0.45, std('#c3c9cc', 0.3, 0.7), 9.6, 1.07, -19.0);
  cyl(0.06, 0.06, 0.25, white, 9.75, 1.045, -19.5, 14);
  for (let k = 0; k < 4; k++) box(0.34, 0.02, 0.26, std('#2b2d30', 0.6), 9.6, 0.93 + k * 0.022, -20.0);
  box(0.2, 0.12, 0.14, std('#f1ede4', 0.6), 9.7, 0.98, -20.5); box(0.12, 0.2, 0.12, std('#d8e8f2', 0.6), 9.45, 1.02, -20.8);
  // tủ mát cửa kính cuối quầy, bảng điện, cửa tôn vào kho
  const fz0 = -21.4, fz1 = -22.05, fx0 = 8.95, fx1 = 9.6;
  boxAt(fx0, fx1, 0, 0.12, fz0, fz1, black); boxAt(fx0, fx1, 1.68, 1.78, fz0, fz1, black);
  for (const z of [fz0, fz1]) boxAt(fx0, fx1, 0, 1.78, z - 0.03, z + 0.03, black);
  boxAt(fx1 - 0.02, fx1, 0.12, 1.68, fz0, fz1, glow('#eef6f8', 0.9));
  noCast(plane(0.6, 1.56, glassM, fx0 - 0.005, 0.9, (fz0 + fz1) / 2, -Math.PI / 2));
  const fb = [];
  for (const y of [0.15, 0.55, 0.95, 1.3]) { boxAt(fx0 + 0.02, fx1 - 0.02, y - 0.01, y, fz0, fz1, glassM); for (let z = fz0 - 0.07; z > fz1 + 0.05; z -= 0.09) fb.push([fx0 + 0.25, y, z]); }
  const fbi = new T.InstancedMesh(new T.CylinderGeometry(0.03, 0.03, 0.22, 10), bottleMat, fb.length);
  fb.forEach(([x, y, z], i) => { o3.position.set(x, y + 0.11, z); o3.updateMatrix(); fbi.setMatrixAt(i, o3.matrix); fbi.setColorAt(i, lin(pick(['#f2efe6', '#e7a63a', '#c43a2f', '#7fb54a', '#3a6fb0']))); });
  live(fbi); scene.add(fbi);
  boxAt(9.9, WX, 1.35, 1.8, -20.95, -21.3, std('#dcdcd6', 0.6)); boxAt(9.88, 9.9, 1.4, 1.75, -21.0, -21.25, std('#9aa0a2', 0.5));
  noCast(plane(1.5, 2.6, M.corr, WX - 0.01, 1.3, -23.5, -Math.PI / 2));
  boxAt(9.9, WX, 2.6, 2.66, -22.75, -24.25, black); for (const z of [-22.75, -24.25]) boxAt(9.9, WX, 0, 2.66, z - 0.03, z + 0.03, black);
  // quạt treo cột + camera an ninh
  const fan = live(group(9.6, 3.15, -22.5, -Math.PI / 2));
  box(0.08, 0.14, 0.12, black, 0, 0, -0.06, fan); cyl(0.07, 0.07, 0.14, std('#e9e9e6', 0.5), 0, 0, 0.04, 14, fan).rotation.x = Math.PI / 2;
  const ring = new T.Mesh(new T.TorusGeometry(0.22, 0.008, 6, 32), std('#cfd2d2', 0.4, 0.5)); ring.position.z = 0.16; fan.add(ring);
  const blades = group(0, 0, 0.15, 0, fan);
  for (let k = 0; k < 3; k++) { const b = box(0.09, 0.19, 0.008, std('#dfe3e6', 0.4, 0, { transparent: true, opacity: 0.8 }), 0, 0, 0, blades); b.position.set(Math.sin(k * 2.094) * 0.1, Math.cos(k * 2.094) * 0.1, 0); b.rotation.z = -k * 2.094; }
  onFrame((t, dt) => { blades.rotation.z += dt * 14; fan.rotation.y = -Math.PI / 2 + Math.sin(t / 2400) * 0.5; });
  cyl(0.045, 0.045, 0.08, white, 9.62, 2.85, -22.3, 12);

  // khối thu ngân hình hộp nhô ra phía khách (sát cửa ra vào)
  boxAt(6.6, 8.25, 0.06, H - 0.04, -8.7, ZC, M.tealWood); boxAt(6.52, 8.3, H - 0.04, H, -8.65, ZC - 0.02, M.tealWood); boxAt(6.65, 8.2, 0, 0.06, -8.75, ZC + 0.05, kick);
  const pos = group(7.35, H, -10.1, Math.PI / 2);
  box(0.2, 0.02, 0.16, black, 0, 0.01, 0, pos); box(0.04, 0.16, 0.04, black, 0, 0.09, 0, pos);
  const scr = box(0.34, 0.24, 0.025, std('#202224', 0.3, 0.4), 0, 0.26, 0, pos); scr.rotation.x = -0.25;
  box(0.3, 0.2, 0.005, glow('#d7e6f2', 0.7), 0, 0.26, 0.015, pos).rotation.x = -0.25;
  box(0.08, 0.04, 0.16, std('#f2f2ef', 0.4), 6.9, H + 0.02, -10.55); box(0.07, 0.09, 0.005, glow('#cfe0ee', 0.6), 6.87, H + 0.07, -10.55).rotation.z = 0.5;
  box(0.18, 0.12, 0.2, std('#ecebe6', 0.5), 7.75, H + 0.06, -9.6);
  for (const z of [-10.85, -11.02]) { const c = box(0.02, 0.24, 0.17, std('#2a62c9', 0.6), 6.78, H + 0.11, z); c.rotation.z = 0.22; }
  box(0.11, 0.15, 0.01, std('#f4f4f0', 0.4), 6.76, H + 0.075, -9.1).rotation.y = 0.3;
  cyl(0.05, 0.05, 0.1, glassM, 6.88, H + 0.05, -9.45, 12);
  for (let k = 0; k < 4; k++) box(0.05, 0.07, 0.01, std('#ffffff', 0.6), 6.86, H + 0.035, -8.9 - k * 0.07);

  // phần giữa thấp hơn, tủ bánh kính chiếu sáng 3 tầng
  boxAt(7.6, 8.25, 0.06, 0.92, ZC, ZP, M.tealWood); boxAt(7.55, 8.3, 0.92, 0.96, ZC, ZP, M.tealWood);
  boxAt(6.95, 7.6, 0.06, 0.28, ZC - 0.08, ZP + 0.08, M.tealWood); boxAt(7.0, 7.55, 0, 0.06, ZC - 0.1, ZP + 0.1, kick);
  const cx0 = 6.92, cx1 = 7.6, cz0 = ZC - 0.1, cz1 = ZP + 0.1;
  boxAt(cx0, cx1, 0.28, 0.33, cz0, cz1, black); boxAt(cx0, cx1, 1.22, 1.26, cz0, cz1, black);
  for (const x of [cx0 + 0.02, cx1 - 0.02]) for (const z of [cz0 - 0.02, cz1 + 0.02]) boxAt(x - 0.02, x + 0.02, 0.33, 1.22, z - 0.02, z + 0.02, black);
  noCast(plane(cz0 - cz1, 0.89, glassM, cx0 - 0.005, 0.775, (cz0 + cz1) / 2, -Math.PI / 2));
  for (const z of [cz0, cz1]) noCast(plane(cx1 - cx0, 0.89, glassM, (cx0 + cx1) / 2, 0.775, z));
  boxAt(cx1 - 0.03, cx1 - 0.01, 0.33, 1.22, cz0, cz1, glow('#ffe7c6', 1.25));
  for (const y of [0.33, 0.6, 0.88]) {
    boxAt(cx0 + 0.03, cx1 - 0.04, y, y + 0.012, cz0 - 0.03, cz1 + 0.03, y > 0.5 ? glassM : black);
    for (let z = cz0 - 0.12; z > cz1 + 0.08; z -= 0.17) pastry(Math.floor(R() * 4), rr(7.12, 7.38), y + 0.012, z);
  }
  box(0.5, 0.02, 1.15, glow('#fff0d4', 1.2), 7.27, 1.21, (cz0 + cz1) / 2);
  for (const y of [0.59, 0.87]) box(0.5, 0.008, 1.15, glow('#fff0d4', 0.9), 7.27, y, (cz0 + cz1) / 2);

  // quầy dài: máy xay, máy pha, ca đánh sữa, túi hạt, rót tay, máy xay lớn
  boxAt(7.2, 8.0, 0.06, H - 0.04, ZP, ZE, M.tealWood); boxAt(7.08, 8.05, H - 0.04, H, ZP, ZE - 0.02, M.tealWood); boxAt(7.25, 7.95, 0, 0.06, ZP, ZE, kick);
  for (const z of [-13.5, -14.9, -16.3, -17.7, -19.1, -20.5]) boxAt(7.188, 7.2, 0.86, 0.94, z - 0.07, z + 0.07, white);
  for (const z of [-13.05, -13.45]) {
    const gr = group(7.62, H, z, Math.PI / 2);
    box(0.2, 0.05, 0.24, black, 0, 0.025, 0, gr); box(0.16, 0.34, 0.2, std('#1b1b1d', 0.35, 0.4), 0, 0.22, -0.02, gr);
    box(0.06, 0.04, 0.08, M.chrome, 0, 0.16, 0.12, gr);
    cyl(0.09, 0.04, 0.2, glassM, 0, 0.5, -0.02, 14, gr); cyl(0.07, 0.035, 0.12, bean, 0, 0.45, -0.02, 12, gr);
  }
  const em = group(7.62, H, -14.2, Math.PI / 2);
  box(0.82, 0.08, 0.56, black, 0, 0.04, 0, em);
  box(0.78, 0.36, 0.5, std('#dadde0', 0.2, 0.85), 0, 0.26, -0.02, em);
  for (const sx of [-0.4, 0.4]) box(0.03, 0.34, 0.5, red, sx, 0.26, -0.02, em);
  for (const sz of [0.235, -0.27]) box(0.8, 0.05, 0.02, red, 0, 0.38, sz, em);
  box(0.72, 0.03, 0.42, M.chrome, 0, 0.455, -0.02, em);
  for (let k = 0; k < 6; k++) cyl(0.034, 0.03, 0.06, white, -0.25 + k * 0.1, 0.5, -0.05 + (k % 2) * 0.1, 12, em);
  for (const sx of [-0.18, 0.18]) {
    cyl(0.045, 0.045, 0.06, M.chrome, sx, 0.16, 0.26, 12, em); box(0.035, 0.035, 0.18, black, sx, 0.12, 0.4, em);
    cyl(0.028, 0.028, 0.01, white, sx * 0.45, 0.3, 0.245, 12, em).rotation.x = Math.PI / 2;
  }
  for (const sx of [-0.35, 0.35]) rod(V(sx, 0.3, 0.24), V(sx * 1.05, 0.1, 0.34), 0.008, M.chrome, em);
  box(0.74, 0.03, 0.13, M.chrome, 0, 0.095, 0.33, em);
  box(0.12, 0.1, 0.12, black, 7.68, H + 0.05, -14.75); box(0.26, 0.012, 0.18, std('#3a3c3f', 0.8), 7.6, H + 0.006, -15.05);
  cyl(0.03, 0.03, 0.08, M.chrome, 7.55, H + 0.05, -15.05, 10);
  for (let k = 0; k < 3; k++) cyl(0.04, 0.036, 0.1, M.chrome, 7.82, H + 0.05, -14.9 - k * 0.1, 12);
  const labels = ['#a9d9c5', '#cfe3ef', '#9fcbe8'].map(beanLabel);
  labels.forEach((tx, k) => {
    const z = -17.2 - k * 0.2;
    box(0.06, 0.17, 0.19, std('#f4f3ee', 0.7), 7.33, H + 0.085, z);
    plane(0.19, 0.17, new T.MeshStandardMaterial({ map: tx, roughness: 0.7 }), 7.299, H + 0.085, z, -Math.PI / 2);
  });
  box(0.02, 0.1, 0.07, black, 7.26, H + 0.05, -16.95); box(0.005, 0.05, 0.05, white, 7.248, H + 0.07, -16.95);
  [['#3d2414', -16.4], ['#c9a273', -16.7]].forEach(([c, z]) => { cyl(0.04, 0.035, 0.14, glassM, 7.48, H + 0.07, z, 12); cyl(0.036, 0.032, 0.1, std(c, 0.6), 7.48, H + 0.05, z, 12); });
  cyl(0.08, 0.07, 0.2, glassM, 7.78, H + 0.1, -16.1, 14);
  for (let k = 0; k < 5; k++) { const s = new T.Mesh(new T.SphereGeometry(0.035, 10, 8), std('#f2a12c', 0.6)); s.position.set(7.78 + rr(-0.03, 0.03), H + 0.04 + (k % 2) * 0.06, -16.1 + rr(-0.03, 0.03)); add(s); }
  for (let k = 0; k < 5; k++) { const c = pick(['#a2242a', '#c98a2e', '#efe6d2', '#5b3a22', '#e05d3a']); cyl(0.03, 0.03, rr(0.12, 0.2), std(c, 0.3), 7.9, H + 0.08, -17.9 - k * 0.07, 10); }
  cyl(0.035, 0.035, 0.12, M.chrome, 7.72, H + 0.06, -18.4, 10);
  for (let k = 0; k < 6; k++) rod(V(7.72 + rr(-0.02, 0.02), H + 0.1, -18.4 + rr(-0.02, 0.02)), V(7.72 + rr(-0.04, 0.04), H + 0.3, -18.4 + rr(-0.04, 0.04)), 0.004, std(pick(['#e8e8e8', '#1d93a3', '#2a2a2a']), 0.6), scene, 4);
  cyl(0.035, 0.035, 0.18, std('#8b6ad0', 0.4), 7.88, H + 0.09, -18.65, 10); box(0.05, 0.05, 0.03, white, 7.88, H + 0.2, -18.65);
  box(0.15, 0.02, 0.15, black, 7.68, H + 0.01, -19.3);
  cyl(0.05, 0.04, 0.1, glassM, 7.68, H + 0.07, -19.3, 12); cyl(0.06, 0.025, 0.07, white, 7.68, H + 0.155, -19.3, 12);
  cyl(0.055, 0.06, 0.13, black, 7.82, H + 0.065, -19.45, 14);
  rod(V(7.78, H + 0.06, -19.43), V(7.66, H + 0.17, -19.43), 0.006, black, scene, 4); box(0.02, 0.1, 0.05, black, 7.88, H + 0.1, -19.45);
  cyl(0.045, 0.04, 0.09, red, 7.5, H + 0.045, -19.65, 12);
  const ek = group(7.68, H, -20.8, Math.PI / 2);
  box(0.24, 0.06, 0.3, black, 0, 0.03, 0, ek); box(0.2, 0.42, 0.28, std('#121214', 0.4, 0.4), 0, 0.27, -0.02, ek);
  cyl(0.06, 0.06, 0.06, black, 0, 0.51, -0.02, 12, ek); cyl(0.14, 0.05, 0.28, glassM, 0, 0.68, -0.02, 16, ek); cyl(0.1, 0.045, 0.14, bean, 0, 0.62, -0.02, 12, ek);
  box(0.05, 0.03, 0.01, red, 0, 0.36, 0.125, ek); box(0.06, 0.05, 0.08, M.chrome, 0, 0.14, 0.16, ek);
  for (const z of [-16.0, -16.85, -17.7, -18.55, -19.4, -20.25]) barStool(6.62, z, scene, Math.PI);

  // đèn thả que hình nón mảnh
  for (let z = -8.3; z > -21.0; z -= 1.7) {
    noCast(cyl(0.026, 0.007, 1.6, black, 8.6, 2.95 + 0.8, z, 10));
    rod(V(8.6, 4.55, z), V(8.6, 7.7, z), 0.003, M.steel, scene, 3);
    const tip = new T.Mesh(new T.SphereGeometry(0.012, 8, 6), glow('#fff0cc', 2.2)); tip.position.set(8.6, 2.945, z); noCast(add(tip));
  }
  // bàn thờ nhỏ trên bục gỗ, góc giữa cửa và quầy
  boxAt(8.5, 9.75, 0, 0.12, -0.6, -1.8, M.ply);
  boxAt(9.2, 9.7, 0.12, 0.68, -0.95, -1.45, std('#7a4b2a', 0.6));
  boxAt(9.18, 9.2, 0.2, 0.6, -1.0, -1.4, glow('#c8402a', 0.6));
  for (let k = 0; k < 4; k++) cyl(0.03, 0.03, rr(0.05, 0.1), std(pick(['#d4a62a', '#c43a2f', '#e9c46a']), 0.5, 0.3), 9.0, 0.12 + 0.04, -0.95 - k * 0.15, 10);
  fig(3.0, 0, -1.2, 1.1);

  // bóng mềm dọc chân quầy phía khách
  shadow(2.8, 4.2, 7.3, 0, -10.05); shadow(1.9, 2.2, 7.25, 0, -12.1); shadow(1.6, 10.4, 7.25, 0, (ZP + ZE) / 2); shadow(1.3, 1.3, 9.25, 0, -21.7);
  // khối bấm vô hình để mở menu
  PICK.menu = live(boxAt(6.3, 8.35, 0, 1.45, Z0, ZE, new T.MeshBasicMaterial({ visible: false })));
}
