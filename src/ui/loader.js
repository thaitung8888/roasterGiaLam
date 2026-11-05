// Màn hình tải: thanh tiến độ đổi màu từ hạt xanh sang hạt rang.
import { $ } from '../env.js';

export function setLoad(v) {
  v = Math.max(0, Math.min(1, v));
  const bar = $('loadbar');
  bar.style.transform = `scaleX(${v})`;
  // màu hạt: xanh → vàng → nâu rang
  const stops = [[154, 168, 106], [201, 164, 92], [122, 74, 42], [70, 42, 26]];
  const k = v * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(k)), f = k - i;
  const c = stops[i].map((x, j) => Math.round(x + (stops[i + 1][j] - x) * f));
  bar.style.background = `rgb(${c.join(',')})`;
  $('loadpct').textContent = 'Đang rang hạt · ' + Math.round(v * 100) + '%';
}
export function finishLoad() { setLoad(1); setTimeout(() => $('loader').classList.add('done'), 300); }
export function fontsReady(list) {
  if (!document.fonts) return Promise.resolve();
  return Promise.race([Promise.all(list.map(f => document.fonts.load(f))), new Promise(r => setTimeout(r, 2500))]);
}
