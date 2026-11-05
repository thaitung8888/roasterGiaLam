// Bầu không khí: trời có mây trôi, nắng qua kính dating, và hoàng hôn khi dừng ở trạm có dusk: true.
// Mọi thứ đổi màu đều chỉ đổi số liệu chứ không thêm đèn, nên hoàng hôn gần như không tốn thêm sức vẽ.
import { STATIONS } from '../config/stations.js';
import { LV } from '../config/levels.js';
import { reduce } from '../env.js';
import { T, lin, onFrame, scene } from './core.js';
import { add, live, plane } from './helpers.js';
import { LIGHT } from './lights.js';
import { M } from './materials.js';
import { canvasTex } from './textures/canvas.js';
import { TX } from './textures/index.js';

const STOP = STATIONS.findIndex(s => s.dusk);
const RISE = 5, FALL = 1.4;   // số giây để trời chuyển sang hoàng hôn và trở lại
export const mood = { near: false };
let want = 0, dusk = 0, shown = -1;

export function setMood(cur) {
  want = Math.abs(cur - STOP) < 0.3 ? 1 : 0;
  mood.near = Math.abs(cur - STOP) < 1.1;
}

const SKY_VERTEX = `
  varying vec3 vDir;
  void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FRAGMENT = `
  varying vec3 vDir;
  uniform sampler2D uClouds;
  uniform float uTime, uDusk;
  void main() {
    vec3 d = normalize(vDir);
    float h = clamp(d.y, 0.0, 1.0);
    vec3 day = mix(vec3(0.88, 0.92, 0.92), vec3(0.52, 0.72, 0.86), pow(h, 0.6));
    vec3 eve = mix(vec3(1.0, 0.62, 0.34), vec3(0.34, 0.36, 0.6), pow(h, 0.5));
    float sun = max(dot(d, normalize(vec3(-0.22, 0.09, 1.0))), 0.0);
    eve += vec3(1.0, 0.6, 0.28) * (pow(sun, 18.0) * 0.5 + pow(sun, 220.0) * 0.8);
    vec3 col = mix(day, eve, uDusk);
    vec2 p = d.xz / max(d.y + 0.16, 0.05);
    float c = texture2D(uClouds, p * 0.2 + vec2(uTime * 0.0045, uTime * 0.0016)).r;
    c = mix(c, texture2D(uClouds, p * 0.47 - vec2(uTime * 0.0022, 0.0)).r, 0.38);
    float body = smoothstep(0.3, 0.62, c) * smoothstep(0.0, 0.1, d.y);
    vec3 lit = mix(vec3(1.0), vec3(1.0, 0.7, 0.5), uDusk);
    vec3 under = mix(vec3(0.74, 0.8, 0.85), vec3(0.62, 0.38, 0.42), uDusk);
    gl_FragColor = vec4(mix(col, mix(under, lit, smoothstep(0.42, 0.72, c)), body * 0.9), 1.0);
  }`;

// vệt nắng in trên sàn dating: cộng sáng lên sàn nên không cần đèn và bóng thật
function sunPatchTex() {
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
    const shear = 0.24, top = h * 0.18;   // đáy ảnh là phía kính, lên trên là sâu vào trong phòng
    const gr = g.createLinearGradient(0, h, 0, top);
    gr.addColorStop(0, '#fff'); gr.addColorStop(0.72, '#b8b8b8'); gr.addColorStop(1, '#000');
    g.fillStyle = gr;
    g.beginPath(); g.moveTo(w * 0.02, h); g.lineTo(w * 0.98, h); g.lineTo(w * 0.98 - shear * h, top); g.lineTo(w * 0.02 - shear * h, top); g.fill();
    // bóng thanh kính và lá cây lốm đốm
    g.strokeStyle = '#000'; g.lineWidth = 7;
    for (const x of [0.36, 0.71]) { g.beginPath(); g.moveTo(w * x, h); g.lineTo(w * x - shear * (h - top), top); g.stroke(); }
    g.fillStyle = 'rgba(0,0,0,.55)';
    for (let i = 0; i < 90; i++) {
      const y = h - (i * 37 % 300), x = (i * 131 % 512), r = 5 + i % 13;
      g.beginPath(); g.ellipse(x - shear * (h - y), y, r * 1.5, r, 0.5, 0, 7); g.fill();
    }
  }, { clamp: true });
}

export function buildAtmosphere() {
  const sky = new T.ShaderMaterial({
    uniforms: { uClouds: { value: TX.clouds }, uTime: { value: 0 }, uDusk: { value: 0 } },
    vertexShader: SKY_VERTEX, fragmentShader: SKY_FRAGMENT, side: T.BackSide, depthWrite: false, fog: false
  });
  live(add(new T.Mesh(new T.SphereGeometry(230, 32, 16), sky))).userData.sky = true;

  const patchM = new T.MeshBasicMaterial({ map: sunPatchTex(), transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false });
  const patch = live(plane(9.4, 7.2, patchM, -5.2, LV.date + 0.012, -3.9));
  patch.rotation.x = -Math.PI / 2; patch.renderOrder = 1;

  // màu lúc ban ngày và lúc hoàng hôn, nội suy theo dusk
  const C = (a, b) => [lin(a), lin(b)];
  const sunC = C('#fff2df', '#ff9d5c'), skyC = C('#f2f6f6', '#ffb98c'), groundC = C('#8a7f6e', '#6a4638'), fogC = C('#dfe7e6', '#f2b98c');
  const patchC = C('#ffe7c4', '#ff9a4e'), grassC = C('#ffffff', '#bda678'), base = { sun: LIGHT.sun.intensity, sky: LIGHT.sky.intensity, lamp: LIGHT.dating.intensity };
  const mix = (out, [a, b], k) => out.copy(a).lerp(b, k);

  onFrame((t, dt) => {
    if (!reduce) sky.uniforms.uTime.value = t / 1000;
    dusk = reduce ? want : Math.min(1, Math.max(0, dusk + (want > dusk ? dt / RISE : -dt / FALL)));
    if (dusk === shown) return;
    shown = dusk;
    const k = dusk * dusk * (3 - 2 * dusk);
    sky.uniforms.uDusk.value = k;
    mix(LIGHT.sun.color, sunC, k); mix(LIGHT.sky.color, skyC, k); mix(LIGHT.sky.groundColor, groundC, k); mix(scene.fog.color, fogC, k);
    LIGHT.sun.intensity = base.sun * (1 - 0.34 * k); LIGHT.sky.intensity = base.sky * (1 - 0.34 * k);
    LIGHT.dating.intensity = base.lamp * (1 + 1.7 * k);   // trời tối dần thì đèn trong phòng nổi lên
    mix(patchM.color, patchC, k); patchM.opacity = 0.16 + 0.34 * k;
    mix(M.grass.color, grassC, k);   // mái đê ngả ấm theo trời
  });
}
