// Tự hạ độ phân giải khi máy không theo kịp: ưu tiên chuyển động mượt hơn độ nét.
import { renderer } from './core.js';

const WINDOW = 45;       // số khung gom lại để tính trung bình
const SLOW = 1 / 40;     // chậm hơn 40 hình/giây thì hạ một nấc
const FLOOR = 1;         // không hạ dưới 1 điểm ảnh thật cho mỗi điểm CSS

export function createQuality() {
  let sum = 0, n = 0;
  return {
    // chỉ gọi khi camera đang chạy, vì lúc đứng yên vòng lặp cố ý vẽ thưa
    sample(dt) {
      if (dt > 0.25) return;   // tab vừa quay lại hoặc mới xoay máy, không tính
      sum += dt; n++;
      if (n < WINDOW) return;
      const avg = sum / n, ratio = renderer.getPixelRatio();
      sum = 0; n = 0;
      if (avg > SLOW && ratio > FLOOR) renderer.setPixelRatio(Math.max(FLOOR, ratio * 0.85));
    }
  };
}
