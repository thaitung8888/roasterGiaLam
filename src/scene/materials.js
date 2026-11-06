// Vật liệu dùng chung (M.xxx). Vật liệu có tile là texture lặp theo mét thật.
import { T, lin } from './core.js';
import { leafKind } from './foliage.js';
import { glow, std, tmat } from './helpers.js';

import { TX } from './textures/index.js';

export const M = {};
export function buildMaterials() {
  M.steel = std('#1b1d1f', 0.55, 0.45);
  M.chrome = std('#c9cdd0', 0.25, 0.9);
  M.blackTop = std('#1e1f21', 0.6);
  M.woodDark = std('#2f2925', 0.7);
  M.wood = std('#a07a52', 0.65);
  M.trunk = std('#5d5146', 0.9);
  M.potConc = std('#b9b6ae', 0.9);
  M.potClay = std('#a9805e', 0.85);
  M.soil = std('#2a231c', 1);
  M.panel = tmat(TX.panel, [1.2, 2.4], 0.92);
  M.panelFacade = tmat(TX.panel, [1.2, 2.4], 0.92, '#d9d0c4');
  M.corr = tmat(TX.corr, [0.4, 1], 0.45, '#ffffff', { metalness: 0.45 });
  M.corrSide = tmat(TX.corr, [0.4, 1], 0.45, '#ffffff', { metalness: 0.45, side: T.DoubleSide });
  M.foil = tmat(TX.foil, [1.6, 1.6], 0.55, '#ffffff', { metalness: 0.25, side: T.DoubleSide });
  M.roofTop = tmat(TX.corr, [0.4, 1], 0.5, '#8e9396', { metalness: 0.4, side: T.DoubleSide });
  M.concrete = tmat(TX.concrete, [4, 4], 0.38, '#d6bf9f');
  M.terrazzo = tmat(TX.terrazzo, [2.5, 2.5], 0.35, '#ffffff', { metalness: 0.05 });
  M.epoxy = tmat(TX.epoxy, [3, 3], 0.5);
  M.tiles = tmat(TX.tiles, [1.2, 1.2], 0.6);
  M.white = tmat(TX.white, [2, 2], 0.9);
  M.asphalt = tmat(TX.asphalt, [4, 4], 0.95);
  M.pavers = tmat(TX.pavers, [1.2, 1.2], 0.9);
  M.grass = tmat(TX.grass, [3, 3], 1);
  M.mural = tmat(TX.mural, [6, 1.1], 0.9);
  M.tealWood = tmat(TX.tealWood, [1.6, 0.8], 0.6);
  M.ply = tmat(TX.ply, [0.8, 0.8], 0.7);
  M.jute = tmat(TX.jute, [0.3, 0.3], 1);
  M.house = tmat(TX.house, [4, 3.2], 0.9, '#ffffff', { emissiveMap: TX.houseLit, emissive: lin('#ffffff'), emissiveIntensity: 0 });
  M.corrGreen = tmat(TX.corr, [0.4, 1], 0.45, '#a3c4b2', { metalness: 0.3 });
  M.skyLight = glow('#f4f8f8', 1.0); M.skyLight.side = T.DoubleSide;
  M.lamp = glow('#ffd9a0', 1.4);
  leafKind('oval', TX.leafOval); leafKind('fig', TX.leafFig); leafKind('monstera', TX.leafMonstera); leafKind('blade', TX.leafBlade); leafKind('ficus', TX.leafFicus); leafKind('heart', TX.leafHeart);
}
