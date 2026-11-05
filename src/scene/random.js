// Số ngẫu nhiên có hạt giống: cảnh lần nào tải cũng giống hệt nhau.

export let seed = 280;
export function R() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
export const rr = (a, b) => a + R() * (b - a);
export const pick = a => a[Math.floor(R() * a.length)];
