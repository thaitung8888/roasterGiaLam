// Đổi vị trí cuộn thành tiến độ 0..N-1 (mỗi số nguyên là một trạm), camera đứng lại quanh mỗi trạm.
import { reduce } from '../env.js';

export function createScroll(sections) {
  const N = sections.length;
  let centers = [];
  const measure = () => { centers = sections.map(s => s.getBoundingClientRect().top + scrollY + s.offsetHeight / 2); };
  function raw() {
    const ref = scrollY + innerHeight / 2;
    if (ref <= centers[0]) return 0;
    for (let i = 0; i < N - 1; i++) if (ref < centers[i + 1]) return i + (ref - centers[i]) / (centers[i + 1] - centers[i]);
    return N - 1;
  }
  function dwell(p) {
    const i = Math.floor(p), f = p - i, g = Math.min(1, Math.max(0, (f - 0.2) / 0.6));
    return Math.min(N - 1, i + g * g * (3 - 2 * g));
  }
  function goTo(i) {
    const s = sections[i];
    scrollTo({ top: Math.max(0, s.getBoundingClientRect().top + scrollY + s.offsetHeight / 2 - innerHeight / 2), behavior: reduce ? 'auto' : 'smooth' });
  }
  addEventListener('resize', measure); measure();
  return { N, measure, target: () => dwell(raw()), goTo };
}
