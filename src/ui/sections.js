// Tạo các <section> của đường cuộn và HTML chú thích cho từng trạm.
import { SHOP } from '../config/shop.js';
import { esc } from '../env.js';

export function renderTrack(stations, track) {
  return stations.map(st => {
    const s = document.createElement('section');
    s.className = 'stop' + (st.kind ? ' ' + st.kind : '');
    s.id = st.id;
    if (st.kind === 'hero') {
      const h = st.hero;
      s.innerHTML = `<div class="hero-copy">
        <p class="eyebrow">${h.eyebrow.map(t => `<span>${esc(t)}</span>`).join('')}</p>
        <h1>${h.titleHtml}</h1>
        <p class="lede">${esc(h.lede)}</p>
        <p class="hint"><i></i>${esc(h.hint)}</p></div>`;
    }
    track.appendChild(s);
    return s;
  });
}
export function captionHtml(st, i) {
  if (st.kind === 'hero') return '';
  if (st.kind === 'outro') return `
    <p class="eyebrow"><span>${esc(st.eyebrow)}</span></p>
    <h2>${esc(st.title)}</h2>
    <dl class="info">
      <dt>Địa chỉ</dt><dd>${esc(SHOP.address)}</dd>
      <dt>Mở cửa</dt><dd>${esc(SHOP.hours)}</dd>
      <dt>Giá</dt><dd>${esc(SHOP.price)}</dd>
      <dt>Wifi</dt><dd><span id="wifiPass">${esc(SHOP.wifi)}</span><button class="copy" type="button" data-action="wifi">Chép</button></dd>
      <dt>Có</dt><dd>Điều hoà · chỗ đỗ ô tô · chuyển khoản</dd>
      <dt>Lưu ý</dt><dd>Hút thuốc ở không gian ngoài · không nhận chó mèo</dd>
    </dl>
    <div class="acts"><button class="btn" type="button" data-action="menu">Xem menu</button><button class="btn ghost" type="button" data-action="top">Về lại ven đê</button></div>
    <p class="fine">${esc(st.fine)}</p>`;
  return `
    <p class="eyebrow"><span class="num">${String(i).padStart(2, '0')}</span><span>${esc(st.label)}</span></p>
    <h2>${esc(st.title)}</h2>
    <p>${esc(st.body)}</p>
    ${st.menu ? '<div class="acts"><button class="btn" type="button" data-action="menu">Xem menu</button></div>' : ''}`;
}
