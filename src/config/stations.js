// Các trạm dừng khi cuộn, theo thứ tự camera đi qua.
//   camera.pos / camera.look : vị trí camera và điểm nhìn, viết theo toạ độ thiết kế (xem PLAN trong levels.js)
//   via    : các điểm camera đi ngang qua trước khi tới trạm (lối đi, bậc thang), không dừng
//   menu   : true thì trạm có nút và chấm "Xem menu"
//   dusk   : true thì trời chuyển dần sang hoàng hôn khi dừng ở trạm này
//   side   : chú thích nằm góc trái hay phải

export const STATIONS = [
  { id: 'ven-de', kind: 'hero', label: 'Ven đê',
    camera: { pos: [-0.5, 5.9, 19.3], look: [1.2, 5.0, -6] },
    cameraPortrait: { pos: [1.4, 7.6, 24], look: [1.4, 5.0, -6] },
    hero: { eyebrow: ['280 Ngọc Thụy', '·', 'Long Biên · Hà Nội'],
      titleHtml: 'Cà phê rang tại xưởng, <em>ven đê</em> Ngọc Thụy.',
      lede: 'Bên kia sông Hồng, sau con đê Ngọc Thụy, có một nhà xưởng mái cao. Cà phê được rang và pha ngay trong đó.',
      hint: 'Cuộn để vào xưởng' } },
  { id: 'cua-vao', label: 'Cửa vào', side: 'right',
    camera: { pos: [6.15, 1.65, 3.4], look: [6.4, 1.5, -10] },
    title: 'Cửa lùa mở, hơi mát ùa ra',
    body: 'Ngoài kia là nắng và tiếng xe trên đê, trong này là điều hoà và mùi cà phê. Ô tô đỗ ngay trước cửa, xe máy để trên vỉa hè.' },
  { id: 'quay', label: 'Quầy order', side: 'left', menu: true,
    camera: { pos: [4.6, 1.6, -7.2], look: [8.2, 1.25, -15.5] },
    title: 'Quầy gỗ xanh, nơi mọi ly bắt đầu',
    body: 'Hạt rang ở phía sau xưởng đi thẳng vào cối xay, rồi xuống chiếc Faema đỏ. Chạm vào máy pha để pha thử một ly. Trả bằng chuyển khoản hoặc tiền mặt.' },
  { id: 'camping', label: 'Khu camping', side: 'left',
    camera: { pos: [6.0, 1.5, -15], look: [-6, 2.7, -13.6] },
    title: 'Một gốc cây giữa nhà xưởng',
    body: 'Kéo một chiếc ghế xếp lại gần gốc cây, như đi cắm trại mà không cần rời thành phố.' },
  { id: 'xuong-rang', label: 'Xưởng rang', side: 'right',
    camera: { pos: [2.5, 1.5, -21.4], look: [2.5, 1.35, -29.5] },
    title: 'Nơi hạt xanh hoá nâu',
    body: 'Sau bức tường gạch, chiếc máy rang xanh rêu chạy từng mẻ nhỏ. Chạm vào máy rang để tự rang thử một mẻ.' },
  { id: 'dating', label: 'Góc dating', side: 'left', dusk: true,
    // đi ngược lên đầu xưởng rồi leo cầu thang từ tầng 1 lên dating
    via: [
      { pos: [3.4, 1.65, -16.0], look: [-1.0, 1.9, -8.6] },
      { pos: [3.0, 1.65, -8.5], look: [-2.0, 2.3, -8.5] },
      { pos: [0.4, 2.15, -8.5], look: [-4.0, 2.6, -8.0] },
      { pos: [-1.2, 2.65, -8.4], look: [-5.0, 2.5, -4.0] }
    ],
    camera: { pos: [-3.7, 2.2, -4.6], look: [-5.3, 2.85, 6] },
    title: 'Khung kính nhìn ra đê',
    body: 'Sàn nâng cao một mét, vừa đủ để thấy mái đê xanh qua ô kính dài. Ngồi tới chiều, nắng sẽ ngả vàng trên từng mặt bàn.' },
  { id: 'tang-2', label: 'Tầng 2', side: 'right',
    via: [   // cầu thang từ dating lên tầng 2
      { pos: [-9.2, 2.65, -5.4], look: [-9.2, 3.5, -10] },
      { pos: [-9.2, 3.45, -8.1], look: [-9.0, 4.2, -12] },
      { pos: [-8.9, 4.25, -10.6], look: [-7.2, 4.1, -16] }
    ],
    camera: { pos: [-7.6, 4.15, -22.4], look: [-3.6, 2.3, -10] },
    title: 'Sàn lửng nhìn xuống cả quán',
    body: 'Ngồi cao hơn một chút, cả nhà xưởng hiện ra bên dưới: tiếng máy xay, ánh đèn vàng, người ra vào.' },
  { id: 'ban-lam-viec', label: 'Bàn làm việc', side: 'right',
    via: [   // vài bậc từ tầng 2 lên tầng 3
      { pos: [-9.2, 4.3, -22.6], look: [-9.2, 4.8, -27] },
      { pos: [-9.2, 4.95, -25.3], look: [-7.0, 4.6, -27.5] }
    ],
    camera: { pos: [-4.9, 4.75, -29.4], look: [-6.6, 3.95, -24.7] },
    title: 'Góc cho những ngày cần tập trung',
    body: 'Quầy dài sát mép tầng 3, bốn ghế bành xám, có ổ cắm. Mở laptop, gọi một ly, rồi quên mất giờ.' },
  { id: 'san-t3', label: 'Sân tầng 3', side: 'right',
    via: [   // qua cửa kính ra sân
      { pos: [-6.6, 4.95, -27.9], look: [2.0, 4.85, -29.6] },
      { pos: [-4.8, 4.95, -28.3], look: [2.0, 4.9, -28.3] },
      { pos: [-2.4, 4.95, -28.3], look: [6.0, 4.6, -27.2] }
    ],
    camera: { pos: [-0.6, 5.0, -28.0], look: [8.8, 4.6, -27.2] },
    title: 'Sân nửa ngoài trời, dưới tán cây',
    body: 'Ngay trên xưởng rang, mái tôn che nắng, phía sau là tán cây lớn. Gió lùa qua, đủ để quên mình đang giữa phố.' },
  { id: 'hen-o-xuong', kind: 'outro', label: 'Hẹn ở xưởng', side: 'left',
    camera: { pos: [9.2, 6.1, -1.3], look: [-2.2, 1.4, -19] },
    eyebrow: 'Hẹn ở xưởng', title: 'Gia Lâm Coffee Roaster',
    fine: '· dựng bởi ThaiTT' }
];
