// Hàm dựng nhanh: vật liệu, hộp, trụ, mặt phẳng, thanh nối hai điểm, nhóm.
import { T, lin, scene } from './core.js';

export const V = (x, y, z) => new T.Vector3(x, y, z);
export const MC = {};
export function std(color, rough = 0.85, metal = 0, extra) {
  const key = color + '|' + rough + '|' + metal;
  if (!extra && MC[key]) return MC[key];
  const m = new T.MeshStandardMaterial(Object.assign({ color: lin(color), roughness: rough, metalness: metal }, extra || {}));
  if (!extra) MC[key] = m;
  return m;
}
// vật liệu có texture lặp theo toạ độ thật: tile = [mét cho 1 lần lặp theo u, theo v]
export function tmat(map, tile, rough = 0.85, color = '#ffffff', extra) {
  const m = new T.MeshStandardMaterial(Object.assign({ map, color: lin(color), roughness: rough }, extra || {}));
  m.userData.tile = tile; return m;
}
export function glow(color, k = 1) { return new T.MeshBasicMaterial({ color: lin(color).multiplyScalar(k), toneMapped: false }); }
export const GLASS = () => MC.glass || (MC.glass = new T.MeshStandardMaterial({ color: lin('#d7e8ea'), roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.16, depthWrite: false, side: T.DoubleSide }));

export function add(m, parent) { (parent || scene).add(m); return m; }
export function box(w, h, d, mat, x, y, z, parent) { const m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); return add(m, parent); }
export function boxAt(x0, x1, y0, y1, z0, z1, mat, parent) {
  return box(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0), mat, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, parent);
}
export function cyl(rt, rb, h, mat, x, y, z, seg = 16, parent) { const m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(x, y, z); return add(m, parent); }
export function plane(w, h, mat, x, y, z, ry = 0, parent) { const m = new T.Mesh(new T.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.rotation.y = ry; return add(m, parent); }
export const UP = V(0, 1, 0);
// trụ tròn nối hai điểm (toạ độ của parent)
export function rod(a, b, r, mat, parent, seg = 6) {
  const d = new T.Vector3().subVectors(b, a), m = new T.Mesh(new T.CylinderGeometry(r, r, d.length(), seg), mat);
  m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(UP, d.normalize()); return add(m, parent);
}
// thanh hộp nối hai điểm (toạ độ của parent)
export function beam(a, b, w, h, mat, parent) {
  const d = new T.Vector3().subVectors(b, a), m = new T.Mesh(new T.BoxGeometry(w, d.length(), h), mat);
  m.position.copy(a).addScaledVector(d, 0.5); m.quaternion.setFromUnitVectors(UP, d.normalize()); return add(m, parent);
}
export function quad(a, b, c, d, mat, parent) {
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute([a, b, c, a, c, d].flatMap(p => [p.x, p.y, p.z]), 3));
  g.setAttribute('uv', new T.Float32BufferAttribute(new Array(12).fill(0), 2));
  g.computeVertexNormals(); return add(new T.Mesh(g, mat), parent);
}
export function group(x = 0, y = 0, z = 0, ry = 0, parent) { const g = new T.Group(); g.position.set(x, y, z); g.rotation.y = ry; return add(g, parent); }
export const live = o => { o.userData.live = true; return o; };     // không gộp, còn chuyển động hoặc cần bấm
export const noCast = o => { o.userData.noCast = true; return o; }; // không đổ bóng (tường, mái)
