// Thông tin môi trường và hàm tiện ích nhỏ dùng chung.

export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const small = Math.min(innerWidth, innerHeight) < 700;
export const $ = id => document.getElementById(id);
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const vnd = n => n.toLocaleString('vi-VN') + 'đ';
