// Kích thước xưởng và cao độ các tầng (mét).
// Trục: x -10 → 10 (trái → phải khi đứng ngoài nhìn vào), z 0 → -30 (mặt tiền → tường sau), y là chiều cao.

export const HALL = { x0: -10, x1: 10, z0: 0, z1: -30, eave: 8.2, ridge: 10, parapet: 10.2 };   // parapet: đỉnh mặt tiền phẳng che mái dốc
export const LV = { date: 1.0, t2: 2.6, t3: 3.3 };

// Khối cuối xưởng: tường mặt trước của xưởng rang / sân tầng 3 (z) và mép phải khối tầng 3 trong nhà (x)
export const BACK = { zFront: -25.7, xRoom: -3.8 };
