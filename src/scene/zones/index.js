// Thứ tự dựng các khu. Thêm khu mới: tạo file trong zones/, export hàm buildXxx(), thêm vào đây.
import { flushFoliage } from '../foliage.js';
import { buildLights } from '../lights.js';
import { buildMaterials } from '../materials.js';
import { mergeStatic } from '../merge.js';
import { buildTextures } from '../textures/index.js';
import { buildBar } from './bar.js';
import { buildCamping } from './camping.js';
import { buildDating } from './dating.js';
import { buildFloor2 } from './floor2.js';
import { buildFloor3 } from './floor3.js';
import { buildOutside } from './outside.js';
import { buildRoastery } from './roastery.js';
import { buildShell } from './shell.js';

export const BUILD_STEPS = [buildTextures, buildMaterials, buildOutside, buildShell, buildDating, buildFloor2, buildBar, buildCamping, buildRoastery, buildFloor3, flushFoliage, buildLights, mergeStatic];
