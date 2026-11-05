// Chữ nổi GIALAM COFFEE ROASTER trên đỉnh mặt tiền.
import { canvasTex } from './canvas.js';

// chữ nổi trên đỉnh mặt tiền: GIALAM COFFEE ROASTER (chữ trắng, màu do vật liệu tô)
export function letterTex() {
  return canvasTex(2048, 216, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.font = '400 300px "Bebas Neue", Impact, "Arial Narrow", sans-serif';
    const txt = 'GIALAM COFFEE ROASTER', tw = g.measureText(txt).width, sx = Math.min(1.25, (w - 8) / tw);
    g.save(); g.translate(w / 2, h - 3); g.scale(sx, 1); g.textAlign = 'center'; g.fillStyle = '#ffffff'; g.fillText(txt, 0, 0); g.restore();
  }, { clamp: true });
}
