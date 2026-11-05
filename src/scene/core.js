// Lõi cảnh 3D: renderer, scene, camera, hiệu ứng chạy mỗi khung hình.
// renderer / scene / camera là biến export dạng let: module khác import sẽ thấy giá trị mới sau initCore().
import * as THREE from 'three';
import { small } from '../env.js';

export const T = THREE;
export let renderer, scene, camera, maxAniso = 1;
export const SHADOWS = !small;
export const frameFns = [];
export const onFrame = fn => frameFns.push(fn);
export const runFrame = (t, dt) => { for (const f of frameFns) f(t, dt); };
// sRGB (màu viết trong code) → tuyến tính (màu renderer dùng)
export const lin = h => new T.Color(h).convertSRGBToLinear();
// vật thể bấm được trong cảnh (khối vô hình trùm quầy order để mở menu)
export const PICK = {};

export function initCore(canvas) {
  renderer = new T.WebGLRenderer({ canvas, antialias: devicePixelRatio < 2, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.4 : 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.toneMapping = T.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = SHADOWS;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  maxAniso = renderer.capabilities.getMaxAnisotropy();
  scene = new T.Scene();
  scene.fog = new T.Fog(lin('#dfe7e6'), 55, 170);
  camera = new T.PerspectiveCamera(55, innerWidth / innerHeight, 0.05, 260);
}
