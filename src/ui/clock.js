// Nút Sáng, Chiều, Tối và nút Mưa. Lúc mở trang tự chọn theo giờ Hà Nội để khách vào buổi tối thấy quán lên đèn.
import { $ } from '../env.js';

function nowInHanoi() {
  const h = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', hour12: false }).format(new Date())) % 24;
  return h >= 6 && h < 16 ? 'day' : h >= 16 && h < 18 ? 'dusk' : 'night';
}

export function createClock(setTime, setRain) {
  const btns = [...$('clock').querySelectorAll('button')], rain = $('rainBtn');
  const mark = time => btns.forEach(b => b.setAttribute('aria-checked', b.dataset.time === time ? 'true' : 'false'));
  btns.forEach(b => b.addEventListener('click', () => { mark(b.dataset.time); setTime(b.dataset.time); }));
  rain.addEventListener('click', () => {
    const on = rain.getAttribute('aria-pressed') !== 'true';
    rain.setAttribute('aria-pressed', on ? 'true' : 'false'); setRain(on);
  });
  const first = nowInHanoi();
  mark(first); setTime(first, true);
  $('skyctl').hidden = false;
}
