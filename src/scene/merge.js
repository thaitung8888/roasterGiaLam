// Gộp mọi khối tĩnh cùng vật liệu thành một mesh (ít lệnh vẽ hơn) và gán UV theo mét thật.
import { SHADOWS, T, scene } from './core.js';

export function worldUV(g, tile) {
  const p = g.attributes.position, n = g.attributes.normal, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i)), x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    let u, v;
    if (ay >= ax && ay >= az) { u = x; v = z; } else if (ax >= az) { u = z; v = y; } else { u = x; v = y; }
    uv[i * 2] = u / tile[0]; uv[i * 2 + 1] = v / tile[1];
  }
  g.setAttribute('uv', new T.BufferAttribute(uv, 2));
}
export function mergeStatic() {
  scene.updateMatrixWorld(true);
  const buckets = new Map(), drop = [];
  scene.traverse(o => {
    if (!o.isMesh || o.isInstancedMesh) return;
    for (let p = o; p; p = p.parent) if (p.userData.live) return;
    const m = o.material; if (Array.isArray(m)) return;
    let noC = m.transparent || m.isMeshBasicMaterial;
    for (let p = o; p; p = p.parent) if (p.userData.noCast) noC = true;
    const g = (o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone()).applyMatrix4(o.matrixWorld);
    if (!g.attributes.normal) g.computeVertexNormals();
    if (m.userData.tile) worldUV(g, m.userData.tile);
    const key = m.uuid + (noC ? '-n' : '-c');
    if (!buckets.has(key)) buckets.set(key, { m, cast: !noC, list: [] });
    buckets.get(key).list.push(g); drop.push(o);
  });
  drop.forEach(o => { o.parent && o.parent.remove(o); o.geometry.dispose(); });
  for (const { m, cast, list } of buckets.values()) {
    let n = 0; list.forEach(g => { n += g.attributes.position.count; });
    const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2);
    let k = 0;
    list.forEach(g => {
      const c = g.attributes.position.count;
      pos.set(g.attributes.position.array, k * 3); nor.set(g.attributes.normal.array, k * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array, k * 2);
      k += c; g.dispose();
    });
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3)); geo.setAttribute('normal', new T.BufferAttribute(nor, 3)); geo.setAttribute('uv', new T.BufferAttribute(uv, 2));
    geo.computeBoundingSphere();
    const mesh = new T.Mesh(geo, m);
    mesh.castShadow = SHADOWS && cast; mesh.receiveShadow = SHADOWS && !m.isMeshBasicMaterial;
    if (m.transparent) mesh.renderOrder = 2;
    scene.add(mesh);
  }
}
