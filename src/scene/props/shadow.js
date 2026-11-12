// Bóng mềm dưới đồ vật: một tấm hình tối mờ nằm sát sàn. Mọi bóng dùng chung vật liệu nên gộp thành một lệnh vẽ.
// Điện thoại không tính bóng thật, nên đây là thứ giữ cho bàn ghế "đứng" trên sàn thay vì lơ lửng.
import { noCast, plane } from '../helpers.js';
import { M } from '../materials.js';

export function shadow(w, d, x, y, z, parent) {
  const s = noCast(plane(w, d, M.shade, x, y + 0.012, z, 0, parent));
  s.rotation.x = -Math.PI / 2;
  return s;
}
