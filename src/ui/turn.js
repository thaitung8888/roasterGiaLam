// Lời nhắc xoay ngang: hiện khi xem bằng điện thoại ở màn dọc, tự tắt khi xoay, có thể bỏ qua.
import { $ } from '../env.js';

const KEY = 'gl-turn-skip';
const read = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch { return false; } };
const save = () => { try { sessionStorage.setItem(KEY, '1'); } catch { /* trình duyệt chặn lưu: chỉ nhớ trong lần xem này */ } };

export function createTurnPrompt() {
  const el = $('turn'), phone = matchMedia('(orientation: portrait) and (pointer: coarse) and (max-width: 600px)');
  let skipped = read();
  const sync = () => { el.hidden = skipped || !phone.matches; };
  $('turnSkip').addEventListener('click', () => { skipped = true; save(); sync(); });
  phone.addEventListener('change', sync);
  sync();
}
