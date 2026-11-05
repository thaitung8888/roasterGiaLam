// Sáng, chiều, tối và mưa: trời, ánh sáng, vệt đèn, hạt mưa đổi theo thời điểm và thời tiết.
// Mọi thứ chỉ đổi số liệu chứ không thêm đèn thật, nên đổi thời điểm gần như không tốn thêm sức vẽ.
// phase là một số chạy liên tục: 0 ban ngày, 1 hoàng hôn, 2 ban đêm. Mỗi giá trị khai báo ba mốc theo đúng thứ tự đó.
import { HALL, LV, PLAN } from '../config/levels.js';
import { STATIONS } from '../config/stations.js';
import { reduce, small } from '../env.js';
import { T, camera, lin, onFrame, scene } from './core.js';
import { gust } from './foliage.js';
import { add, live, noCast, plane } from './helpers.js';
import { LIGHT } from './lights.js';
import { M } from './materials.js';
import { canvasTex } from './textures/canvas.js';
import { TX } from './textures/index.js';

const STOP = STATIONS.findIndex(s => s.dusk);
const PHASE = { day: 0, dusk: 1, night: 2 };
const SLOW = 5, QUICK = 1.1;   // số giây cho mỗi nấc: tự chuyển ở góc dating, và khi bấm nút hoặc rời trạm
const RAIN_S = 1.6;            // số giây để mưa nặng hạt hoặc tạnh
export const mood = { near: false, night: false, rain: false };
let base = 0, phase = 0, want = 0, shown = '', atStop = false, rain = 0, rainWant = 0, apply = () => {};
// đang nắng và dừng ở góc dating thì tự chuyển hoàng hôn, trời mưa thì không có mặt trời lặn
const aim = () => (base === 0 && atStop && !rainWant ? 1 : base);

export function setTime(time, instant) {
  base = PHASE[time];
  want = aim();
  if (instant) { phase = want; apply(); }
}
export function setRain(on) { rainWant = on ? 1 : 0; want = aim(); mood.rain = on; }
export function setMood(cur) {
  atStop = Math.abs(cur - STOP) < 0.3;
  want = aim();
  mood.near = Math.abs(cur - STOP) < 1.1;
}

const SKY_VERTEX = `
  varying vec3 vDir;
  void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FRAGMENT = `
  varying vec3 vDir;
  uniform sampler2D uClouds;
  uniform float uTime, uDusk, uNight, uRain;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
  void main() {
    vec3 d = normalize(vDir);
    float h = clamp(d.y, 0.0, 1.0);
    vec3 day = mix(vec3(0.88, 0.92, 0.92), vec3(0.52, 0.72, 0.86), pow(h, 0.6));
    vec3 eve = mix(vec3(1.0, 0.62, 0.34), vec3(0.34, 0.36, 0.6), pow(h, 0.5));
    float sun = max(dot(d, normalize(vec3(-0.22, 0.09, 1.0))), 0.0);
    eve += vec3(1.0, 0.6, 0.28) * (pow(sun, 18.0) * 0.5 + pow(sun, 220.0) * 0.8);
    vec3 night = mix(vec3(0.075, 0.1, 0.17), vec3(0.016, 0.026, 0.06), pow(h, 0.45));
    vec3 cell = floor(d * 170.0);
    float star = hash(cell), lit = step(0.9972, star) * smoothstep(0.03, 0.22, d.y);
    night += vec3(0.9, 0.93, 1.0) * lit * (0.55 + 0.45 * sin(uTime * 1.7 + star * 90.0));
    float moon = max(dot(d, normalize(vec3(0.3, 0.33, 1.0))), 0.0);
    night += vec3(0.95, 0.93, 0.84) * (smoothstep(0.99955, 0.9997, moon) + pow(moon, 700.0) * 0.16);
    vec3 col = mix(mix(day, eve, uDusk), night, uNight);
    vec2 p = d.xz / max(d.y + 0.16, 0.05);
    float c = texture2D(uClouds, p * 0.2 + vec2(uTime * 0.0045, uTime * 0.0016)).r;
    c = mix(c, texture2D(uClouds, p * 0.47 - vec2(uTime * 0.0022, 0.0)).r, 0.38);
    float body = smoothstep(0.3, 0.62, c) * smoothstep(0.0, 0.1, d.y);
    vec3 top = mix(mix(vec3(1.0), vec3(1.0, 0.7, 0.5), uDusk), vec3(0.15, 0.18, 0.26), uNight);
    vec3 under = mix(mix(vec3(0.74, 0.8, 0.85), vec3(0.62, 0.38, 0.42), uDusk), vec3(0.05, 0.07, 0.12), uNight);
    vec3 out3 = mix(col, mix(under, top, smoothstep(0.42, 0.72, c)), body * mix(0.9, 0.62, uNight));
    vec3 grey = mix(mix(vec3(0.6, 0.64, 0.68), vec3(0.5, 0.43, 0.45), uDusk), vec3(0.035, 0.045, 0.07), uNight);
    gl_FragColor = vec4(mix(out3, grey * (0.82 + 0.4 * c), uRain * 0.92), 1.0);
  }`;

// hạt mưa: mỗi hạt là một đoạn thẳng, cả trận mưa là một lệnh vẽ, rơi hoàn toàn trong shader và luôn bao quanh camera.
// Hạt nào lọt vào mái xưởng thì tắt, nên trong nhà không có mưa mà nhìn qua kính vẫn thấy.
const RAIN_VERTEX = `
  attribute float aEnd;
  uniform float uTime;
  uniform vec3 uCam;
  uniform vec4 uHall;
  varying float vShow;
  void main() {
    vec3 box = vec3(36.0, 18.0, 36.0);
    vec3 p = position * box + vec3(uTime * 1.6, -uTime * 17.0, 0.0);
    vec3 w = uCam + mod(p - uCam, box) - box * 0.5;
    bool roof = w.x > uHall.x && w.x < uHall.y && w.z > uHall.z && w.z < uHall.w;
    vShow = roof || w.y < 0.0 ? 0.0 : 1.0;
    w += vec3(-0.05, 0.55, 0.0) * aEnd;
    gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  }`;
const RAIN_FRAGMENT = `
  uniform vec3 uTint;
  uniform float uAlpha;
  varying float vShow;
  void main() { if (vShow < 0.5) discard; gl_FragColor = vec4(uTint, uAlpha); }`;
function buildRain() {
  const n = small ? 800 : 1500, pos = new Float32Array(n * 6), end = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const x = Math.random(), y = Math.random(), z = Math.random();
    pos.set([x, y, z, x, y, z], i * 6); end[i * 2 + 1] = 1;
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('aEnd', new T.BufferAttribute(end, 1));
  const m = new T.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uCam: { value: new T.Vector3() }, uTint: { value: new T.Color() }, uAlpha: { value: 0 },
      uHall: { value: new T.Vector4(HALL.x0 * PLAN - 0.2, HALL.x1 * PLAN + 0.2, HALL.z1 * PLAN - 0.2, 0.3) } },
    vertexShader: RAIN_VERTEX, fragmentShader: RAIN_FRAGMENT, transparent: true, depthWrite: false, fog: false
  });
  const lines = new T.LineSegments(g, m);
  lines.frustumCulled = false; lines.renderOrder = 3; lines.visible = false; lines.userData.sky = true;
  live(add(lines));
  return lines;
}
// nước trên khung kính dating: giọt đọng đứng yên, hai lớp vệt nước chảy xuống với tốc độ khác nhau
const DROPS_VERTEX = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const DROPS_FRAGMENT = `
  varying vec2 vUv;
  uniform sampler2D uDrops;
  uniform float uTime, uRain;
  uniform vec3 uTint;
  void main() {
    vec2 q = vUv * vec2(4.6, 1.08);
    float dots = texture2D(uDrops, q * 1.3).r;
    float a1 = texture2D(uDrops, q + vec2(0.0, uTime * 0.09)).g;
    float a2 = texture2D(uDrops, q * 1.7 + vec2(0.37, uTime * 0.16)).g;
    gl_FragColor = vec4(uTint, max(dots * 0.5, max(a1, a2) * 0.62) * uRain);
  }`;
function buildDrops() {
  const m = new T.ShaderMaterial({
    uniforms: { uDrops: { value: TX.drops }, uTime: { value: 0 }, uRain: { value: 0 }, uTint: { value: new T.Color() } },
    vertexShader: DROPS_VERTEX, fragmentShader: DROPS_FRAGMENT, transparent: true, depthWrite: false, fog: false, side: T.DoubleSide
  });
  const p = live(plane(9.2, 2.15, m, -5.2, 2.875, -0.05));
  p.renderOrder = 3; p.visible = false;
  return p;
}

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

// vệt sáng ban đêm: thay cho đèn thật, gộp chung thành một lệnh vẽ. [x, y, z, bán kính]; 'wall' là vệt hắt trên tường trái
const POOLS = [
  [0.8, 0.02, -17.5, 7.5], [5.2, 0.02, -14, 5], [5.4, 0.02, -3.2, 4.5], [1.2, 0.02, -8, 4],   // tầng 1
  [-5, LV.date + 0.02, -3.2, 5.2],                                                            // góc dating
  [-7.2, LV.t2 + 0.02, -13, 3.8], [-7.2, LV.t2 + 0.02, -20, 3.8],                             // tầng 2
  [-6.4, LV.t3 + 0.02, -26.8, 3.6], [1.6, LV.t3 + 0.02, -27.8, 3.6], [6.4, LV.t3 + 0.02, -27.8, 3.4],   // tầng 3
  [5.5, 0.02, 1.7, 4], [-5, 0.02, 1.7, 4.4]                                                   // đèn trong nhà hắt ra vỉa hè
];
function buildPools() {
  const m = new T.MeshBasicMaterial({ map: TX.glow, color: lin('#ffb56a'), transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 });
  POOLS.forEach(([x, y, z, r]) => { noCast(plane(r * 2, r * 2, m, x, y, z)).rotation.x = -Math.PI / 2; });
  for (const z of [-11.5, -15.5, -19.5, -23.5]) noCast(plane(3.6, 3.6, m, -9.95, 4.7, z, Math.PI / 2));
  return m;
}

export function buildAtmosphere() {
  const sky = new T.ShaderMaterial({
    uniforms: { uClouds: { value: TX.clouds }, uTime: { value: 0 }, uDusk: { value: 0 }, uNight: { value: 0 }, uRain: { value: 0 } },
    vertexShader: SKY_VERTEX, fragmentShader: SKY_FRAGMENT, side: T.BackSide, depthWrite: false, fog: false
  });
  live(add(new T.Mesh(new T.SphereGeometry(230, 32, 16), sky))).userData.sky = true;

  const patchM = new T.MeshBasicMaterial({ map: sunPatchTex(), transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false });
  const patch = live(plane(9.4, 7.2, patchM, -5.2, LV.date + 0.012, -3.9));
  patch.rotation.x = -Math.PI / 2; patch.renderOrder = 1;
  const poolM = buildPools(), lines = buildRain(), drops = buildDrops();

  // ba mốc sáng, chiều, tối
  const C = (...c) => c.map(lin);
  const sunC = C('#fff2df', '#ff9d5c', '#8ea6d6'), skyC = C('#f2f6f6', '#ffb98c', '#6d7da6'), groundC = C('#8a7f6e', '#6a4638', '#5a4232');
  const fogC = C('#dfe7e6', '#f2b98c', '#0d1420'), grassC = C('#ffffff', '#bda678', '#7f9186'), patchC = C('#ffe7c4', '#ff9a4e', '#000000');
  const roofC = [M.skyLight.color.clone(), M.skyLight.color.clone(), lin('#1a2333')], signC = C('#2a2f55', '#6a5a4a', '#fff0c8');
  // khi mưa: màu đèn trời và sương theo từng mốc, mặt đường tối và bóng nước
  const fogRainC = C('#a7b1ba', '#9a8f92', '#0a0f18'), skyRainC = C('#b4bfca', '#b09a98', '#5a6a8c'), tintC = C('#d5dde5', '#e0c9ba', '#8797b0');
  const wet = [[M.pavers, lin('#ffffff'), lin('#7f8488'), 0.9, 0.34], [M.asphalt, lin('#ffffff'), lin('#6c7176'), 0.95, 0.3]];
  const fog0 = { near: scene.fog.near, far: scene.fog.far }, tmp = new T.Color();
  const base0 = { sun: LIGHT.sun.intensity, sky: LIGHT.sky.intensity, ambient: LIGHT.ambient.intensity };
  const lamps = LIGHT.lamps.map(l => ({ l, i: l.intensity, d: l.distance }));

  const ease = k => k * k * (3 - 2 * k), sat = k => Math.min(1, Math.max(0, k));
  const stops = () => (phase < 1 ? [0, ease(phase)] : [1, ease(phase - 1)]);
  const num = ([a, b, c]) => { const [i, k] = stops(), p = i ? b : a, q = i ? c : b; return p + (q - p) * k; };
  const col = (out, c) => { const [i, k] = stops(); return out.copy(c[i]).lerp(c[i + 1], k); };

  apply = () => {
    const key = phase + '|' + rain;
    if (key === shown) return;
    shown = key;
    sky.uniforms.uDusk.value = ease(sat(phase)); sky.uniforms.uNight.value = ease(sat(phase - 1));
    mood.night = phase > 1.5;
    const r = ease(rain);
    sky.uniforms.uRain.value = r;
    col(LIGHT.sun.color, sunC); col(LIGHT.sky.color, skyC); col(LIGHT.sky.groundColor, groundC); col(scene.fog.color, fogC);
    LIGHT.sky.color.lerp(col(tmp, skyRainC), r * 0.7); scene.fog.color.lerp(col(tmp, fogRainC), r);
    scene.fog.near = fog0.near + (18 - fog0.near) * r; scene.fog.far = fog0.far + (95 - fog0.far) * r;
    LIGHT.sun.intensity = base0.sun * num([1, 0.66, 0.13]) * (1 - 0.65 * r); LIGHT.sky.intensity = base0.sky * num([1, 0.66, 0.24]) * (1 - 0.2 * r); LIGHT.ambient.intensity = base0.ambient * num([1, 0.8, 0.35]);
    for (const { l, i, d } of lamps) {
      // trời tối dần thì đèn trong nhà nổi lên; đèn quầy đứng sát tường trắng nên giữ thấp hơn
      l.intensity = i * (l === LIGHT.dating ? num([1, 2.7, 3.2]) : l === LIGHT.bar ? num([1, 1, 0.6]) : num([1, 1.3, 1.45]));
      l.distance = d * num([1, 1.1, 1.5]);
    }
    col(patchM.color, patchC); patchM.opacity = num([0.16, 0.5, 0]) * (1 - r); patchM.visible = phase < 1.95 && r < 0.98;
    poolM.opacity = num([0, 0.05, 0.34]); poolM.visible = phase > 1.02;
    col(M.grass.color, grassC); col(M.skyLight.color, roofC);
    col(M.signFace.emissive, signC); M.signFace.emissiveIntensity = num([0.25, 0.5, 1.5]);
    M.house.emissiveIntensity = num([0, 0.1, 0.65]);
    for (const [m, dry, soaked, r0, r1] of wet) { m.color.copy(dry).lerp(soaked, r); m.roughness = r0 + (r1 - r0) * r; }
    M.grass.color.multiplyScalar(1 - 0.28 * r);
    lines.visible = drops.visible = r > 0.01;
    col(lines.material.uniforms.uTint.value, tintC); lines.material.uniforms.uAlpha.value = r * 0.56;
    col(drops.material.uniforms.uTint.value, tintC); drops.material.uniforms.uRain.value = r;
    gust.value = 1 + r * 0.9;
  };

  onFrame((t, dt) => {
    if (!reduce) sky.uniforms.uTime.value = lines.material.uniforms.uTime.value = drops.material.uniforms.uTime.value = t / 1000;
    lines.material.uniforms.uCam.value.copy(camera.position);
    if (reduce) { phase = want; rain = rainWant; }
    else if (rain !== rainWant) rain = rainWant > rain ? Math.min(1, rain + dt / RAIN_S) : Math.max(0, rain - dt / RAIN_S);
    if (!reduce && phase !== want) {
      const step = dt / (base === 0 && want === 1 ? SLOW : QUICK);
      phase = want > phase ? Math.min(want, phase + step) : Math.max(want, phase - step);
    }
    apply();
  });
}
