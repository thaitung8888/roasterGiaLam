// Khung xem ảnh toàn màn hình: mở từ chấm "Xem ảnh", đóng bằng Esc, nút Đóng hoặc bấm ra ngoài.
import { $ } from '../env.js';

export const Lightbox = (() => {
  const el = $('photo'), img = $('photoImg'), text = $('photoText'), close = $('photoClose');
  let last = null, open = false;
  function show(p) {
    if (open) return;
    open = true; last = document.activeElement;
    el.classList.remove('failed'); el.classList.add('loading');
    img.alt = p.text; text.textContent = p.text; img.src = p.src;
    el.hidden = false; document.documentElement.style.overflow = 'hidden';
    close.focus();
  }
  function hide() {
    if (!open) return;
    open = false; el.hidden = true; img.removeAttribute('src'); document.documentElement.style.overflow = '';
    if (last && last.focus) last.focus();
  }
  img.addEventListener('load', () => el.classList.remove('loading'));
  // mạng yếu hoặc mất kết nối: báo rõ thay vì để vòng xoay chạy mãi. Đóng rồi mở lại là tải lại từ đầu.
  img.addEventListener('error', () => {
    if (!open) return;
    el.classList.remove('loading'); el.classList.add('failed');
    text.textContent = 'Chưa tải được ảnh. Bạn kiểm tra mạng, đóng lại rồi bấm xem lần nữa nhé.';
  });
  close.addEventListener('click', hide);
  el.addEventListener('click', e => { if (e.target !== img) hide(); });
  addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'Tab') { e.preventDefault(); close.focus(); }   // chỉ có một nút để bấm
  });
  return { show, hide, isOpen: () => open };
})();
