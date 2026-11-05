// Điểm vào của trang: dựng đường cuộn và giao diện, rồi tải cảnh 3D.
import './styles/main.css';
import { SHOP } from './config/shop.js';
import { STATIONS } from './config/stations.js';
import { $ } from './env.js';

import { hasWebGL, startScene } from './scene/index.js';
import { createHud } from './ui/hud.js';
import { finishLoad, fontsReady, setLoad } from './ui/loader.js';
import { Menu } from './ui/menu.js';
import { createScroll } from './ui/scroll.js';
import { renderTrack } from './ui/sections.js';
import { createTurnPrompt } from './ui/turn.js';

createTurnPrompt();
const sections = renderTrack(STATIONS, $('track'));
const scroll = createScroll(sections);
const hud = createHud(STATIONS, scroll);
setLoad(0.04);
document.addEventListener('click', e => {
  const a = e.target.closest('[data-action]'); if (!a) return;
  if (a.dataset.action === 'top') scroll.goTo(0);
  if (a.dataset.action === 'menu') Menu.show();
  if (a.dataset.action === 'wifi') {
    const done = () => { a.textContent = 'Đã chép'; setTimeout(() => { a.textContent = 'Chép'; }, 1600); };
    const fallback = () => { const s = getSelection(), r = document.createRange(); r.selectNodeContents($('wifiPass')); s.removeAllRanges(); s.addRange(r); a.textContent = 'Đã chọn, bấm chép'; };
    try { navigator.clipboard.writeText(SHOP.wifi).then(done, fallback); } catch (err) { fallback(); }
  }
});
function runUIOnly() {
  document.body.classList.add('no-webgl'); finishLoad();
  (function tick() { requestAnimationFrame(tick); hud.update(scroll.target()); })();
}
fontsReady(['400 40px "Bebas Neue"', '800 40px "Bricolage Grotesque"', '500 20px "JetBrains Mono"', '400 16px "Be Vietnam Pro"']).then(() => {
  if (!hasWebGL()) return runUIOnly();
  startScene({ canvas: $('scene'), scroll, hud, onProgress: setLoad, onReady: finishLoad }).catch(err => { console.error(err); runUIOnly(); });
});
