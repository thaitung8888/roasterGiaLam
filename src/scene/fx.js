// Hiệu ứng làm cảnh thật hơn mà vẫn nhẹ: phản chiếu môi trường, vệt nắng qua mái, hơi nước.
// Không thứ nào là đèn thật: phản chiếu là một texture tính sẵn một lần lúc tải, còn lại là vài tấm hình trong suốt.
import { reduce } from '../env.js';
import { T, lin, onFrame, renderer, scene } from './core.js';
import { add, live, noCast, plane } from './helpers.js';
import { M } from './materials.js';
import { canvasTex } from './textures/canvas.js';
import { TX } from './textures/index.js';

const ENV = [];   // [vật liệu, độ phản chiếu gốc]
const WET = [];   // mặt đường, vỉa hè: chỉ phản chiếu khi mưa
const time = { value: 0 };
let stripeM;
const steamMs = [];
export const STEAM = {};   // hơi nước có thể đổi độ dày theo tương tác (máy rang)

// ---- phản chiếu môi trường: dựng một "căn xưởng" tối giản rồi cho three.js lọc thành texture phản chiếu
function envTexture() {
  const s = new T.Scene(), flat = (r, g, b) => new T.MeshBasicMaterial({ color: new T.Color(r, g, b), side: T.BackSide });
  const wall = flat(0.17, 0.145, 0.12), ceil = flat(0.08, 0.08, 0.08), floor = flat(0.07, 0.065, 0.06), front = flat(0.26, 0.3, 0.33);
  s.add(new T.Mesh(new T.BoxGeometry(20, 10, 30), [wall, wall, ceil, floor, front, wall]));
  const strip = new T.MeshBasicMaterial({ color: new T.Color(5.5, 5.4, 5.1) }), win = new T.MeshBasicMaterial({ color: new T.Color(2.4, 2.8, 3.1) });
  for (const x of [-6.2, -2.6, 2.6, 6.2]) { const m = new T.Mesh(new T.BoxGeometry(1.2, 0.1, 26), strip); m.position.set(x, 4.8, 0); s.add(m); }
  const w = new T.Mesh(new T.BoxGeometry(9, 2.2, 0.1), win); w.position.set(-5, -1.6, 14.8); s.add(w);
  const pm = new T.PMREMGenerator(renderer), tex = pm.fromScene(s, 0.035).texture;
  pm.dispose(); s.traverse(o => { if (o.geometry) o.geometry.dispose(); });
  return tex;
}
// Chỉ lấy phần phản chiếu bóng của môi trường, bỏ phần ánh sáng khuếch tán: nếu không, mọi bề mặt bóng sẽ sáng bệch
// hơn tường nhám bên cạnh. Bỏ đi còn bớt được một lần tra texture cho mỗi điểm ảnh.
const MAPS_NO_DIFFUSE = T.ShaderChunk.lights_fragment_maps.replace('iblIrradiance += getLightProbeIndirectIrradiance( /*lightProbe,*/ geometry, maxMipLevel );', '');
function glossOnly(shader) { shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_maps>', MAPS_NO_DIFFUSE); }
function buildReflections() {
  const env = envTexture(), seen = new Set();
  scene.traverse(o => {
    const m = o.material;
    if (!m || !m.isMeshStandardMaterial || seen.has(m)) return;
    seen.add(m);
    // chỉ bề mặt thật sự bóng hoặc kim loại rõ mới phản chiếu; tường, trần, sàn nhám và lá cây giữ nguyên cho nhẹ
    if (m.metalness < 0.4 && m.roughness >= 0.5) return;
    const k = m.metalness >= 0.4 ? 0.9 : 0.55;
    m.envMap = env; m.envMapIntensity = k; m.onBeforeCompile = glossOnly; ENV.push([m, k]);
  });
  for (const m of [M.pavers, M.asphalt]) { m.envMap = env; m.envMapIntensity = 0; m.onBeforeCompile = glossOnly; WET.push(m); }
}

// ---- vệt nắng từ các dải lấy sáng trên mái in xuống sàn và mặt quầy.
// Vị trí lệch khỏi dải mái theo hướng đèn mặt trời trong lights.js: mỗi mét hạ xuống lệch 0,2 m theo x và 0,68 m theo z.
// (Đã thử dựng cả tia nắng và bụi sáng lơ lửng trong không khí: xưởng ban ngày quá sáng nên chỉ làm cảnh bạc màu, vì vậy bỏ.)
function buildSunStripes() {
  const soft = canvasTex(64, 256, (c, w, h) => {
    c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    const gx = c.createLinearGradient(0, 0, w, 0); gx.addColorStop(0, '#000'); gx.addColorStop(0.3, '#fff'); gx.addColorStop(0.7, '#fff'); gx.addColorStop(1, '#000');
    c.fillStyle = gx; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'multiply';
    const gy = c.createLinearGradient(0, 0, 0, h); gy.addColorStop(0, '#000'); gy.addColorStop(0.08, '#fff'); gy.addColorStop(0.92, '#fff'); gy.addColorStop(1, '#000');
    c.fillStyle = gy; c.fillRect(0, 0, w, h);
    // bóng xà gồ cắt ngang vệt nắng
    c.globalCompositeOperation = 'source-over'; c.fillStyle = 'rgba(0,0,0,.5)';
    for (let y = 14; y < h; y += 37) c.fillRect(0, y, w, 4);
  }, { clamp: true });
  stripeM = new T.MeshBasicMaterial({ map: soft, transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
  for (const [x, y, z0, z1, w] of [[4.5, 0.02, -9.6, -25.2, 1.7], [-0.7, 0.02, -9.9, -25.2, 1.7], [7.62, 1.07, -13.0, -21.2, 0.8]]) {
    const p = live(noCast(plane(w, z0 - z1, stripeM, x, y, (z0 + z1) / 2))); p.rotation.x = -Math.PI / 2; p.renderOrder = 1;
  }
}

// ---- hơi nước: tấm hình luôn quay về camera, khói cuộn lên bằng hoa văn mây trôi
const STEAM_VERTEX = `
  uniform vec2 uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    mv.xy += position.xy * uSize;
    gl_Position = projectionMatrix * mv;
  }`;
const STEAM_FRAGMENT = `
  varying vec2 vUv;
  uniform sampler2D uClouds;
  uniform float uTime, uAlpha, uSeed;
  uniform vec3 uColor;
  void main() {
    float n = texture2D(uClouds, vec2(vUv.x * 0.35 + uSeed, vUv.y * 0.3 - uTime * 0.07)).r;
    float sway = texture2D(uClouds, vec2(uSeed - vUv.x * 0.2, vUv.y * 0.45 - uTime * 0.1)).r - 0.4;
    float x = abs(vUv.x * 2.0 - 1.0 + sway * 0.7 * vUv.y) / mix(0.3, 1.0, vUv.y);
    float mask = (1.0 - smoothstep(0.15, 1.0, x)) * smoothstep(0.0, 0.14, vUv.y) * pow(1.0 - vUv.y, 1.25);
    gl_FragColor = vec4(uColor, mask * smoothstep(0.1, 0.62, n) * uAlpha);
  }`;
function steam(x, y, z, w, h, alpha) {
  const g = new T.PlaneGeometry(1, 1); g.translate(0, 0.5, 0);
  const m = new T.ShaderMaterial({
    uniforms: { uClouds: { value: TX.clouds }, uTime: time, uSeed: { value: Math.random() }, uSize: { value: new T.Vector2(w, h) }, uColor: { value: new T.Color() }, uAlpha: { value: alpha } },
    vertexShader: STEAM_VERTEX, fragmentShader: STEAM_FRAGMENT, transparent: true, depthWrite: false, fog: false
  });
  m.userData.alpha = alpha;
  const mesh = new T.Mesh(g, m); mesh.position.set(x, y, z); mesh.renderOrder = 4; mesh.frustumCulled = false;
  live(add(mesh)); steamMs.push(m);
  return m;
}
function buildSteam() {
  steam(7.74, 1.53, -14.05, 0.34, 0.6, 1.5);      // máy pha ở quầy
  STEAM.roaster = steam(3.54, 1.14, -28.97, 0.6, 1.0, 1.25);   // khay làm nguội của máy rang
  for (const x of [-7.74, -4.87, -2.53]) steam(x, 1.845, -0.82, 0.1, 0.24, 1.6);   // ly cà phê nóng ở bàn sát kính dating
}

export function buildFx() {
  buildReflections(); buildSunStripes(); buildSteam();
  if (!reduce) onFrame(t => { time.value = t / 1000; });
}
// atmosphere.js gọi mỗi khi thời điểm hoặc thời tiết đổi: sunK là độ nắng 0..1, envK là độ sáng chung, rainK là độ mưa
const WHITE = lin('#ffffff');
export function tuneFx(sunK, envK, rainK, sunColor) {
  for (const [m, k] of ENV) m.envMapIntensity = k * envK;
  for (const m of WET) m.envMapIntensity = rainK * envK * 0.9;
  stripeM.color.copy(sunColor); stripeM.opacity = sunK * 0.5; stripeM.visible = sunK > 0.01;
  for (const m of steamMs) { m.uniforms.uColor.value.copy(WHITE).multiplyScalar(0.45 + 0.55 * envK); m.uniforms.uAlpha.value = m.userData.alpha * (m.userData.boost ?? 1); }
}
