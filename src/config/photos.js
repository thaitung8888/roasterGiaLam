// Ảnh thật của quán, mỗi ảnh là một chấm "Xem ảnh" gắn vào cảnh 3D ở trạm tương ứng.
// Khoá là id trạm trong stations.js. Ảnh đặt trong public/photos/.
//   at  : vị trí chấm, viết theo toạ độ thiết kế [x, y, z] như camera
//   text: chú thích hiện dưới ảnh

export const PHOTOS = {
  'ven-de': [
    { src: 'photos/cafe3.jpg', at: [4.6, 11.2, 0.1], text: 'Biển hiệu của quán lúc chiều tối' }
  ],
  quay: [
    { src: 'photos/cafe5.jpg', at: [9.6, 2.55, -18.6], text: 'Quầy pha: máy Faema và các máy xay hạt' }
  ],
  camping: [
    { src: 'photos/cafe2.jpg', at: [0.8, 2.9, -16.9], text: 'Cây giữa xưởng, ban ngày và lúc lên đèn' }
  ],
  'xuong-rang': [
    { src: 'photos/cafe4.jpg', at: [4.5, 1.45, -29.3], text: 'Máy rang của xưởng' },
    { src: 'photos/cafe1.jpg', at: [1.45, 2.0, -29.9], text: 'Hạt của tháng: Ethiopia Bench Maji Gesha' }
  ],
  dating: [
    { src: 'photos/cafe6.jpg', at: [-5.0, 1.95, -0.85], text: 'Ly cà phê đá với lát chanh' }
  ]
};
