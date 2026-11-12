// Tự do khám phá: kéo để nhìn quanh, chạm sàn để đi tới, chạm đồ vật để tương tác.
// Camera vẫn chạy trên đường tham quan. Module này chỉ xoay hướng nhìn hoặc kéo camera lệch khỏi đường đó một lúc;
// cuộn tiếp là camera tự trôi về đường tham quan.
import { LV } from '../config/levels.js';
import { reduce } from '../env.js';
import { T, camera, lin, onFrame, scene, view } from './core.js';
import { UP, V } from './helpers.js';

const FLOORS = [0, LV.date, LV.t2, LV.t3];
const EYE = 1.55;       // tầm mắt khi đi trên sàn
const MOVE_S = 1.1;     // số giây để đi tới chỗ vừa chạm
const BACK_S = 0.9;     // số giây để trở về đường tham quan
const RELAX_S = 1.4;    // buông tay bao lâu thì hướng nhìn tự quay về góc đẹp
const REACH = 10;       // chỉ chạm được đồ vật trong tầm này (mét)
const UI = 'button, a, input, label, .rail, .menu, .photo, .bench, .skyctl, .turn';

const ease = k => k * k * (3 - 2 * k);
const from = { p: V(0, 0, 0), l: V(0, 0, 0) }, to = { p: V(0, 0, 0), l: V(0, 0, 0) };
const ray = new T.Raycaster(), ndc = new T.Vector2(), q = new T.Quaternion(), dir = V(0, 0, 0), side = V(0, 0, 0);
const picks = [];
let mode = 'rail', s = 0, dur = MOVE_S, anchor = 0, hold = false;
let yaw = 0, pitch = 0, drag = null, relax = 0, easing = false, solid = null, ring = null, ringK = 0;

// đồ vật chạm được: kiểm tra theo đúng thứ tự thêm vào, nên vật nhỏ nằm trong vật lớn phải thêm trước
export function addPick(obj, fn) { if (obj) picks.push([obj, fn]); }

// đưa camera tới một chỗ (toạ độ thật). hold: giữ nguyên ở đó dù người xem cuộn, dùng khi đang mở bảng tương tác
export function goTo(pos, look, opts = {}) {
  from.p.copy(camera.position); camera.getWorldDirection(dir); from.l.copy(camera.position).addScaledVector(dir, 4);
  to.p.copy(pos); to.l.copy(look);
  yaw = pitch = 0; mode = 'go'; s = reduce ? 1 : 0; dur = opts.dur || MOVE_S; hold = !!opts.hold; anchor = scrollY;
}
export function release() {
  if (mode === 'rail' || mode === 'back') return;
  from.p.copy(camera.position); camera.getWorldDirection(dir); from.l.copy(camera.position).addScaledVector(dir, 4);
  yaw = pitch = 0; mode = 'back'; s = reduce ? 1 : 0; hold = false;
}
// còn chuyển động thì vòng lặp phải vẽ đủ khung, không được vẽ thưa như lúc đứng yên
export const exploreBusy = () => !!(drag && drag.axis) || mode === 'go' || mode === 'back' || easing;

export function exploreUpdate(dt) {
  // cuộn trang dù chỉ một chút là quay về đường tham quan
  if ((mode === 'go' || mode === 'free') && !hold && Math.abs(scrollY - anchor) > 40) release();
  if (mode === 'go' || mode === 'back') {
    s = Math.min(1, s + dt / (mode === 'go' ? dur : BACK_S));
    if (s >= 1) mode = mode === 'go' ? 'free' : 'rail';
  }
  easing = false;
  if (!drag && mode === 'rail' && (yaw || pitch)) {
    relax += dt;
    if (relax > RELAX_S) {
      const k = Math.exp(-dt * 3); yaw *= k; pitch *= k; easing = true;
      if (Math.abs(yaw) + Math.abs(pitch) < 1e-3) yaw = pitch = 0;
    }
  }
}
// p, l là vị trí và điểm nhìn trên đường tham quan; sửa trực tiếp thành vị trí cuối cùng của camera
export function adjustView(p, l) {
  const k = ease(s);
  if (mode === 'go') { p.lerpVectors(from.p, to.p, k); l.lerpVectors(from.l, to.l, k); }
  else if (mode === 'free') { p.copy(to.p); l.copy(to.l); }
  else if (mode === 'back') { p.multiplyScalar(k).addScaledVector(from.p, 1 - k); l.multiplyScalar(k).addScaledVector(from.l, 1 - k); }
  if (!yaw && !pitch) return;
  dir.subVectors(l, p); side.crossVectors(dir, UP).normalize();
  q.setFromAxisAngle(UP, yaw); dir.applyQuaternion(q); side.applyQuaternion(q);
  q.setFromAxisAngle(side, pitch); dir.applyQuaternion(q);
  l.addVectors(p, dir);
}

function aim(x, y) { ndc.set(x / view.w * 2 - 1, -(y / view.h) * 2 + 1); ray.setFromCamera(ndc, camera); }
function pickAt(x, y) {
  aim(x, y);
  for (const [obj, fn] of picks) { const h = ray.intersectObject(obj); if (h.length && h[0].distance < REACH) return fn; }
  return null;
}
function tap(x, y) {
  const fn = pickAt(x, y);
  if (fn) { fn(); return; }
  if (hold) return;
  // khối tĩnh đã gộp nằm thẳng trong scene với toạ độ thật, nên pháp tuyến của mặt trúng cũng là pháp tuyến thật
  if (!solid) solid = scene.children.filter(o => o.isMesh && !o.isInstancedMesh && !o.userData.sky && !Array.isArray(o.material) && !o.material.transparent && o.material.visible !== false);
  const h = ray.intersectObjects(solid, false)[0];
  if (!h || !h.face || h.distance > 18 || h.face.normal.y < 0.8 || !FLOORS.some(f => Math.abs(h.point.y - f) < 0.12)) return;
  camera.getWorldDirection(dir); dir.y = 0; dir.normalize();
  const pos = V(h.point.x, h.point.y + EYE, h.point.z), look = pos.clone().addScaledVector(dir, 4); look.y -= 0.4;
  goTo(pos, look);
  ring.position.set(h.point.x, h.point.y + 0.02, h.point.z); ringK = 1;
}

export function initExplore() {
  // vòng sáng nhỏ trên sàn chỗ vừa chạm, mờ dần
  ring = new T.Mesh(new T.RingGeometry(0.16, 0.22, 32), new T.MeshBasicMaterial({ color: lin('#7fd6e0'), transparent: true, opacity: 0, depthWrite: false, toneMapped: false }));
  ring.rotation.x = -Math.PI / 2; ring.renderOrder = 4; ring.visible = false; ring.userData.sky = true; scene.add(ring);
  onFrame((t, dt) => {
    if (ringK <= 0) { ring.visible = false; return; }
    ringK = Math.max(0, ringK - dt * 1.4); ring.visible = true;
    ring.material.opacity = ringK * 0.85; ring.scale.setScalar(1 + (1 - ringK) * 1.6);
  });

  addEventListener('pointerdown', e => {
    if (e.button > 0 || e.target.closest(UI)) return;
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, t: performance.now(), mouse: e.pointerType === 'mouse', axis: null };
  });
  addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) {
      // rê chuột lên đồ vật chạm được thì đổi con trỏ
      if (e.pointerType === 'mouse' && !e.buttons) document.body.classList.toggle('pick', !e.target.closest(UI) && !!pickAt(e.clientX, e.clientY));
      return;
    }
    const tx = e.clientX - drag.x0, ty = e.clientY - drag.y0;
    if (!drag.axis) {
      if (Math.hypot(tx, ty) < (drag.mouse ? 5 : 9)) return;
      // màn cảm ứng: vuốt dọc vẫn là cuộn trang, chỉ vuốt ngang mới xoay nhìn
      drag.axis = drag.mouse ? 'both' : Math.abs(tx) > Math.abs(ty) * 1.15 ? 'h' : null;
      if (!drag.axis) { drag = null; return; }
    }
    const hfov = 2 * Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect);
    yaw = Math.max(-Math.PI, Math.min(Math.PI, yaw + (e.clientX - drag.x) * hfov / view.w));
    if (drag.axis === 'both') pitch = Math.max(-0.55, Math.min(0.55, pitch + (e.clientY - drag.y) * camera.fov * Math.PI / 180 / view.h));
    drag.x = e.clientX; drag.y = e.clientY; relax = 0;
  });
  addEventListener('pointerup', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const still = !drag.axis && Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 9 && performance.now() - drag.t < 450;
    drag = null; relax = 0;
    if (still && !e.target.closest(UI)) tap(e.clientX, e.clientY);
  });
  addEventListener('pointercancel', () => { drag = null; });
}
