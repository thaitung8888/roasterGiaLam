// Gợi ý một lần trong mỗi lượt xem: kéo để nhìn quanh, chạm sàn để đi tới.
import { $ } from '../env.js';

const KEY = 'gl-hint';
const read = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };
const save = () => { try { sessionStorage.setItem(KEY, '1'); } catch { /* trình duyệt chặn lưu: chỉ nhớ trong lần xem này */ } };

export function createHint() {
  const el = $('hint');
  let shown = read();
  el.textContent = matchMedia('(pointer: coarse)').matches ? 'Vuốt ngang để nhìn quanh · Chạm vào sàn để đi tới' : 'Kéo chuột để nhìn quanh · Bấm vào sàn để đi tới';
  const hide = () => el.classList.remove('on');
  return {
    // hiện khi người xem vừa vào tới trong quán
    update(cur) {
      if (shown || cur < 0.9) return;
      shown = true; save();
      el.classList.add('on'); setTimeout(hide, 6500);
      addEventListener('pointerdown', hide, { once: true });
    }
  };
}
