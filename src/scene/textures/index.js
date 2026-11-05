// Toàn bộ texture vẽ bằng canvas: tường, sàn, gạch, cỏ, lá cây, tranh tường…
import { R, pick, rr } from '../random.js';
import { canvasTex, mottle, speckle } from './canvas.js';

export const TX = {};
export function buildTextures() {
  // tấm xi măng 1.2 × 2.4 m, khe ghép và vít bắt
  TX.panel = canvasTex(256, 512, (g, w, h) => {
    g.fillStyle = '#bcb0a1'; g.fillRect(0, 0, w, h); mottle(g, w, h, 8, 0.06); speckle(g, w, h, 2400, 0.05, 0.06, 1.4);
    g.strokeStyle = 'rgba(70,58,46,.55)'; g.lineWidth = 3; g.strokeRect(1.5, 1.5, w - 3, h - 3);
    g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; g.strokeRect(4, 4, w - 8, h - 8);
    g.fillStyle = 'rgba(60,50,42,.6)';
    for (const fx of [0.09, 0.91]) for (const fy of [0.05, 0.36, 0.64, 0.95]) { g.beginPath(); g.arc(fx * w, fy * h, 3.2, 0, 7); g.fill(); }
  });
  // tôn sóng bạc
  TX.corr = canvasTex(128, 32, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w / 4, 0);
    gr.addColorStop(0, '#9da3a6'); gr.addColorStop(0.35, '#e1e4e5'); gr.addColorStop(0.6, '#c3c8ca'); gr.addColorStop(1, '#9da3a6');
    for (let i = 0; i < 4; i++) { g.save(); g.translate(i * w / 4, 0); g.fillStyle = gr; g.fillRect(0, 0, w / 4, h); g.restore(); }
  });
  // mặt dưới mái: lớp cách nhiệt bạc vân ô
  TX.foil = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#cfc6b6'; g.fillRect(0, 0, w, h);
    const s = 32;
    for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) {
      g.fillStyle = (x / s + y / s) % 2 ? 'rgba(255,255,255,.22)' : 'rgba(90,80,60,.12)';
      g.beginPath(); g.moveTo(x + s / 2, y); g.lineTo(x + s, y + s / 2); g.lineTo(x + s / 2, y + s); g.lineTo(x, y + s / 2); g.fill();
    }
    g.strokeStyle = 'rgba(80,70,55,.25)'; g.lineWidth = 2; for (let x = 0; x <= w; x += 128) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  });
  TX.concrete = canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#c7c6c0'; g.fillRect(0, 0, w, h); mottle(g, w, h, 14, 0.05);
    for (let i = 0; i < 9000; i++) { g.fillStyle = pick(['#9c9a93', '#e8e6df', '#8d8a82', '#b4b1a9']); g.globalAlpha = rr(0.3, 0.8); g.fillRect(R() * w, R() * h, rr(1, 3.5), rr(1, 3.5)); }
    g.globalAlpha = 1; g.strokeStyle = 'rgba(70,70,66,.35)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(0, 1); g.lineTo(w, 1); g.moveTo(1, 0); g.lineTo(1, h); g.stroke();
  });
  TX.epoxy = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#8db8d6';   // sàn các tầng trên: xanh nước biển nhạt
    g.fillRect(0, 0, w, h); mottle(g, w, h, 10, 0.05); speckle(g, w, h, 900, 0.03, 0.03, 1); });
  TX.tiles = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#d3d3cf'; g.fillRect(0, 0, w, h); mottle(g, w, h, 6, 0.04);
    g.strokeStyle = 'rgba(120,120,112,.5)'; g.lineWidth = 2;
    for (const p of [1, w / 2]) { g.beginPath(); g.moveTo(p, 0); g.lineTo(p, h); g.moveTo(0, p); g.lineTo(w, p); g.stroke(); }
  });
  TX.white = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#ebe8e1'; g.fillRect(0, 0, w, h); mottle(g, w, h, 6, 0.03); speckle(g, w, h, 500, 0.02, 0.03, 1); });
  TX.asphalt = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#56585a'; g.fillRect(0, 0, w, h); speckle(g, w, h, 9000, 0.08, 0.12, 1.2); mottle(g, w, h, 8, 0.05); });
  TX.pavers = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#8d7f78'; g.fillRect(0, 0, w, h);
    const bw = 64, bh = 32;
    for (let y = 0; y < h; y += bh) for (let x = -bw; x < w; x += bw) {
      const ox = (y / bh) % 2 ? bw / 2 : 0;
      g.fillStyle = pick(['#a08f86', '#94857d', '#a99a91', '#8a7b73']); g.fillRect(x + ox + 2, y + 2, bw - 4, bh - 4);
    }
    speckle(g, w, h, 1200, 0.05, 0.08, 1);
  });
  TX.grass = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#7dab3d'; g.fillRect(0, 0, w, h); mottle(g, w, h, 12, 0.07);
    for (let i = 0; i < 14000; i++) {
      const x = R() * w, y = R() * h, l = rr(3, 9);
      g.strokeStyle = pick(['#9cc95a', '#6a9a33', '#88b84a', '#5e8a2c', '#b3d873']); g.globalAlpha = rr(0.4, 0.9);
      g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + rr(-2, 2), y - l); g.stroke();
    }
    g.globalAlpha = 1;
  });
  // tường kè chân đê: tranh hoa sen
  TX.mural = canvasTex(1024, 188, (g, w, h) => {
    g.fillStyle = '#e7ebe7'; g.fillRect(0, 0, w, h); mottle(g, w, h, 8, 0.05);
    g.fillStyle = '#3f9aa4'; g.fillRect(0, h * 0.78, w, h * 0.22);
    for (let i = 0; i < 26; i++) {
      const x = R() * w, y = rr(h * 0.45, h * 0.8), r = rr(14, 30);
      g.fillStyle = pick(['#2f7f62', '#3d9471', '#287058']); g.beginPath(); g.ellipse(x, y, r * 1.5, r * 0.55, 0, 0, 7); g.fill();
    }
    for (let i = 0; i < 18; i++) {
      const x = R() * w, y = rr(h * 0.2, h * 0.55), s = rr(10, 20);
      g.strokeStyle = '#2f7f62'; g.lineWidth = 3; g.beginPath(); g.moveTo(x, y); g.lineTo(x + rr(-6, 6), h * 0.8); g.stroke();
      for (let k = 0; k < 5; k++) {
        const a = -Math.PI / 2 + (k - 2) * 0.42;
        g.fillStyle = k % 2 ? '#f08fb2' : '#e76a9a';
        g.save(); g.translate(x, y); g.rotate(a + Math.PI / 2); g.beginPath(); g.ellipse(0, -s * 0.7, s * 0.34, s * 0.8, 0, 0, 7); g.fill(); g.restore();
      }
    }
    for (let i = 0; i < 10; i++) { g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(R() * w, R() * h * 0.3, rr(20, 60), 3); }
  });
  // gỗ nhuộm xanh của quầy
  TX.tealWood = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#1f8e9e'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) {
      const y = R() * h, amp = rr(1, 5), ph = R() * 6;
      g.strokeStyle = R() < 0.5 ? `rgba(255,255,255,${rr(0.04, 0.12)})` : `rgba(5,40,50,${rr(0.06, 0.18)})`;
      g.lineWidth = rr(0.6, 2.4); g.beginPath();
      for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin(x / rr(40, 70) + ph) * amp);
      g.stroke();
    }
    g.strokeStyle = 'rgba(5,40,50,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke();
  });
  TX.ply = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#dcc7a2'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { const y = R() * h; g.strokeStyle = `rgba(140,100,60,${rr(0.05, 0.14)})`; g.lineWidth = rr(0.5, 2); g.beginPath(); for (let x = 0; x <= w; x += 8) g.lineTo(x, y + Math.sin(x / 30 + i) * 2); g.stroke(); }
  });
  TX.jute = canvasTex(128, 128, (g, w, h) => {
    g.fillStyle = '#a98b5c'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < w; i += 4) { g.fillStyle = 'rgba(70,50,25,.25)'; g.fillRect(i, 0, 1.5, h); g.fillRect(0, i, w, 1.5); }
  });
  // vỏ mặt tiền: tấm xanh xám nhạt, sáng dần lên phía trên (1 lần lặp = 2.4 m ngang × cả chiều cao)
  TX.facade = canvasTex(512, 1024, (g, w, h) => {
    const gr = g.createLinearGradient(0, h, 0, 0);
    gr.addColorStop(0, '#839d8f'); gr.addColorStop(0.45, '#9ab4a6'); gr.addColorStop(1, '#b0c6bb');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 6) { g.fillStyle = `rgba(255,255,255,${(x / 6) % 2 ? 0.035 : 0})`; g.fillRect(x, 0, 3, h); }
    for (let i = 0; i < 7; i++) { const x = R() * w, ww = rr(20, 90), sg = g.createLinearGradient(x, 0, x + ww, 0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.5, `rgba(255,255,255,${rr(0.05, 0.12)})`); sg.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = sg; g.fillRect(x, 0, ww, h); }
    const dirt = g.createLinearGradient(0, h, 0, h * 0.8); dirt.addColorStop(0, 'rgba(60,70,55,.25)'); dirt.addColorStop(1, 'rgba(60,70,55,0)'); g.fillStyle = dirt; g.fillRect(0, h * 0.8, w, h * 0.2);
    g.fillStyle = 'rgba(40,55,48,.35)'; g.fillRect(0, 0, 2, h); g.fillRect(w / 2, 0, 2, h);
  });
  TX.graffiti = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#e9e8e2'; g.fillRect(0, 0, w, h); mottle(g, w, h, 6, 0.05);
    g.lineCap = 'round';
    for (let i = 0; i < 9; i++) {
      g.strokeStyle = pick(['#1b1d22', '#2c48b4', '#6a4bb0', '#1b1d22']); g.lineWidth = rr(6, 16);
      g.beginPath(); g.moveTo(rr(0, w), rr(h * 0.2, h * 0.8));
      g.bezierCurveTo(rr(0, w), rr(0, h), rr(0, w), rr(0, h), rr(0, w), rr(h * 0.2, h * 0.8)); g.stroke();
    }
  }, { clamp: true });
  // mặt nhà phố bên cạnh
  TX.house = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#f0ede6'; g.fillRect(0, 0, w, h); mottle(g, w, h, 6, 0.05);
    g.fillStyle = '#3d4a50'; g.fillRect(w * 0.18, h * 0.18, w * 0.64, h * 0.52);
    g.fillStyle = 'rgba(200,220,225,.35)'; g.fillRect(w * 0.2, h * 0.2, w * 0.28, h * 0.48);
    g.fillStyle = '#c9c4ba'; g.fillRect(0, h * 0.86, w, h * 0.06);
    g.strokeStyle = '#2b2f31'; g.lineWidth = 3; for (let x = w * 0.18; x < w * 0.84; x += 14) { g.beginPath(); g.moveTo(x, h * 0.72); g.lineTo(x, h * 0.86); g.stroke(); }
  });
  // mây: các đốm mờ nối liền bốn mép để lặp vô tận, màu trời do shader trong atmosphere.js tô
  TX.clouds = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 150; i++) {
      const x = R() * w, y = R() * h, r = rr(26, 92), a = rr(0.1, 0.34);
      for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) {
        const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
        gr.addColorStop(0, `rgba(255,255,255,${a})`); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
      }
    }
  }, { linear: true });
  // lá: xám trắng + kênh alpha, màu xanh do từng lá tự tô
  const leafShape = (g, w, h, body) => {
    g.clearRect(0, 0, w, h); g.save(); body(g, w, h); g.restore();
    g.globalCompositeOperation = 'source-atop';
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#b9b9b9');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = w * 0.02; g.beginPath(); g.moveTo(w / 2, h); g.lineTo(w / 2, h * 0.05); g.stroke();
    g.globalCompositeOperation = 'source-over';
  };
  TX.leafOval = canvasTex(128, 128, (g, w, h) => leafShape(g, w, h, g => { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(w / 2, h * 0.52, w * 0.27, h * 0.46, 0, 0, 7); g.fill(); }), { clamp: true });
  TX.leafFig = canvasTex(128, 128, (g, w, h) => leafShape(g, w, h, g => {
    g.fillStyle = '#fff'; g.beginPath(); g.moveTo(w / 2, h * 0.98);
    g.bezierCurveTo(w * 0.1, h * 0.8, w * 0.28, h * 0.45, w * 0.12, h * 0.25); g.bezierCurveTo(w * 0.05, h * 0.02, w * 0.95, h * 0.02, w * 0.88, h * 0.25);
    g.bezierCurveTo(w * 0.72, h * 0.45, w * 0.9, h * 0.8, w / 2, h * 0.98); g.fill();
  }), { clamp: true });
  // lá hình tim (đầu lá ở trên, cuống ở dưới): dùng cho môn, trầu bà; monstera thêm thuỳ xẻ và lỗ khoét
  const heartPath = (g, w, h, C1, C2) => { g.beginPath(); g.moveTo(w / 2, h * 0.03); g.bezierCurveTo(w * C1, h * 0.28, w * C2, h * 0.75, w * 0.24, h * 0.97); g.quadraticCurveTo(w * 0.42, h * 0.99, w / 2, h * 0.84); g.quadraticCurveTo(w * 0.58, h * 0.99, w * 0.76, h * 0.97); g.bezierCurveTo(w * (1 - C2), h * 0.75, w * (1 - C1), h * 0.28, w / 2, h * 0.03); g.fill(); };
  TX.leafHeart = canvasTex(128, 128, (g, w, h) => leafShape(g, w, h, g => { g.fillStyle = '#fff'; heartPath(g, w, h, 0.16, 0.0); }), { clamp: true });
  TX.leafMonstera = canvasTex(256, 256, (g, w, h) => leafShape(g, w, h, g => {
    g.fillStyle = '#fff'; heartPath(g, w, h, -0.02, -0.06);
    g.globalCompositeOperation = 'destination-out';
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
      const y = h * (0.26 + k * 0.16);
      g.beginPath(); g.moveTo(w / 2 + s * w * 0.55, y - h * 0.05); g.lineTo(w / 2 + s * w * 0.13, y + h * 0.02); g.lineTo(w / 2 + s * w * 0.55, y + h * 0.015); g.fill();
    }
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(w / 2 + s * w * 0.075, h * (0.36 + k * 0.16), w * 0.016, h * 0.035, s * 0.4, 0, 7); g.fill(); }
  }), { clamp: true });
  TX.leafFicus = canvasTex(128, 128, (g, w, h) => leafShape(g, w, h, g => {
    g.fillStyle = '#fff'; g.beginPath(); g.moveTo(w / 2, h * 0.02);
    g.bezierCurveTo(w * 0.14, h * 0.22, w * 0.14, h * 0.8, w / 2, h * 0.98); g.bezierCurveTo(w * 0.86, h * 0.8, w * 0.86, h * 0.22, w / 2, h * 0.02); g.fill();
  }), { clamp: true });
  // gạch thô xám nâu, mạch vữa đậm (1 lần lặp = 2.4 m × 1.2 m)
  TX.brick = canvasTex(512, 256, (g, w, h) => {
    g.fillStyle = '#3e3935'; g.fillRect(0, 0, w, h);
    const bw = 48, bh = 16;
    for (let y = 0, row = 0; y < h; y += bh, row++) for (let x = -bw; x < w; x += bw) {
      const ox = row % 2 ? bw / 2 : 0, c = pick(['#7a6a5c', '#6b5d52', '#86766a', '#5f544b', '#8f7f70', '#71655b', '#9a8a7a']);
      g.fillStyle = c; g.fillRect(x + ox + 2, y + 2, bw - 4, bh - 3);
      g.fillStyle = `rgba(0,0,0,${rr(0.05, 0.22)})`; g.fillRect(x + ox + 2, y + bh - 5, bw - 4, 3);
      if (R() < 0.3) { g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(x + ox + rr(4, 30), y + 3, rr(6, 14), 4); }
    }
    speckle(g, w, h, 1600, 0.06, 0.12, 1.4);
  });
  // sàn terrazzo giống xom-le-15: nền ngà, hạt đá màu, đường ron chia ô
  TX.terrazzo = canvasTex(1024, 1024, (g, w, h) => {
    g.fillStyle = '#b9b2a6'; g.fillRect(0, 0, w, h);
    const chips = ['#4b3fae', '#ffc700', '#6d6a72', '#e9e2d4', '#2a2533', '#8f86c9'];
    for (let i = 0; i < 5200; i++) {
      g.fillStyle = pick(chips); g.globalAlpha = rr(0.6, 1);
      g.beginPath(); const x = R() * w, y = R() * h, r = R() * R() * 9 + 1.2;
      g.moveTo(x + r, y); for (let k = 1; k < 6; k++) { const a = k / 6 * 6.283, rq = r * rr(0.6, 1.2); g.lineTo(x + Math.cos(a) * rq, y + Math.sin(a) * rq); } g.fill();
    }
    g.globalAlpha = 1; speckle(g, w, h, 900, 0.05, 0.05, 2);
    g.strokeStyle = 'rgba(40,36,48,.55)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke();
  });
  TX.leafBlade = canvasTex(64, 128, (g, w, h) => leafShape(g, w, h, g => { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(w / 2, h / 2, w * 0.14, h * 0.48, 0, 0, 7); g.fill(); }), { clamp: true });
}
