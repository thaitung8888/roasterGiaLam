// Vẽ texture bằng canvas 2D và các nét loang dùng chung.
import { T, maxAniso } from '../core.js';
import { R, rr } from '../random.js';

export function canvasTex(w, h, draw, opt = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c);
  if (!opt.linear) t.encoding = T.sRGBEncoding;
  t.anisotropy = maxAniso;
  if (!opt.clamp) t.wrapS = t.wrapT = T.RepeatWrapping;
  return t;
}
export function speckle(g, w, h, n, light = 0.06, dark = 0.08, maxR = 2) {
  for (let i = 0; i < n; i++) {
    g.fillStyle = R() < 0.5 ? `rgba(255,255,255,${R() * light})` : `rgba(0,0,0,${R() * dark})`;
    g.beginPath(); g.arc(R() * w, R() * h, R() * R() * maxR + 0.4, 0, 7); g.fill();
  }
}
export function mottle(g, w, h, n, a = 0.05) {
  for (let i = 0; i < n; i++) {
    const x = R() * w, y = R() * h, r = rr(w * 0.08, w * 0.35), gr = g.createRadialGradient(x, y, 0, x, y, r);
    const c = R() < 0.5 ? '255,255,255' : '40,30,20';
    gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  }
}
