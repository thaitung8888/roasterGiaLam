// Co mặt bằng cả cảnh theo PLAN trên hai trục x, z. Chiều cao giữ nguyên.
// Vật dựng thành nhóm (bàn ghế, máy móc) đổi vị trí theo mặt bằng nhưng giữ đúng kích thước thật.
// Co đều x và z nên phép co đổi chỗ được với góc xoay quanh trục y: nhóm xoay thế nào cũng không méo.
import { PLAN } from '../config/levels.js';
import { T, scene } from './core.js';

function restore(o) { o.scale.x /= PLAN; o.scale.z /= PLAN; }
function settle(parent) {
  for (const o of parent.children) {
    if (o.userData.fit) settle(o);
    else if (o.isGroup || o.userData.keep) restore(o);
  }
}
export function shrinkPlan() {
  const root = new T.Group();
  root.scale.set(PLAN, 1, PLAN);
  [...scene.children].filter(o => !o.userData.sky).forEach(o => root.add(o));
  settle(root);
  scene.add(root);
}
