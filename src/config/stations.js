// Các trạm dừng khi cuộn, theo thứ tự camera đi qua.
//   camera.pos / camera.look : vị trí camera và điểm nhìn
//   via    : các điểm camera đi ngang qua trước khi tới trạm (lối đi, bậc thang), không dừng
//   menu   : true thì trạm có nút và chấm "Xem menu"
//   side   : chú thích nằm góc trái hay phải

export const STATIONS = [
  { id: 'ven-de', kind: 'hero', label: 'Ven đê',
    camera: { pos: [-0.5, 5.9, 19.3], look: [1.2, 5.0, -6] },
    cameraPortrait: { pos: [1.4, 7.6, 24], look: [1.4, 5.0, -6] },
    hero: { eyebrow: ['280 Ngọc Thụy', '·', 'Long Biên · Hà Nội'],
      titleHtml: 'Cà phê rang tại xưởng, <em>ven đê</em> Ngọc Thụy.',
      lede: 'Một nhà xưởng mái cao 10 mét, bên trong có quầy pha chế, khu camping, góc dating nhìn ra đê và xưởng rang hạt.',
      hint: 'Cuộn để vào xưởng' } },
  { id: 'cua-vao', label: 'Cửa vào', side: 'right',
    camera: { pos: [6.15, 1.65, 3.4], look: [6.4, 1.5, -10] },
    title: 'Cửa kính, bên trong mát điều hoà',
    body: 'Ô tô đỗ ngay trước cửa, xe máy để trên vỉa hè. Quán không nhận chó mèo.' },
  { id: 'quay', label: 'Quầy order', side: 'left', menu: true,
    camera: { pos: [0.4, 2.8, -8.4], look: [8.4, 1.1, -13.6] },
    title: 'Quầy gỗ xanh, máy pha và tủ bánh',
    body: 'Bấm vào quầy để xem menu. Có bánh ngọt, thanh toán chuyển khoản.' },
  { id: 'camping', label: 'Khu camping', side: 'right',
    camera: { pos: [5.2, 1.75, -23.8], look: [-1.2, 2.0, -12.6] },
    title: 'Ghế xếp dã ngoại quanh gốc cây giữa xưởng',
    body: 'Vài bộ ghế xếp đặt rải rác, bàn nhôm gấp. Cột giữa có 4 đèn rọi ra 4 phía, bồn cây xanh chạy dọc dưới tầng 2.' },
  { id: 'xuong-rang', label: 'Xưởng rang', side: 'right',
    camera: { pos: [1.3, 1.8, -21.5], look: [1.9, 1.3, -29.5] },
    title: 'Hạt rang ngay trong quán',
    body: 'Cuối xưởng chia đôi: bên trái là kho hạt, bên phải là phòng rang mở với tường gạch, máy rang trên xe đẩy và sofa da ngồi chờ.' },
  { id: 'dating', label: 'Góc dating', side: 'left',
    // đi ngược lên đầu xưởng rồi leo cầu thang từ tầng 1 lên dating
    via: [
      { pos: [3.4, 1.65, -16.0], look: [-1.0, 1.9, -8.6] },
      { pos: [3.0, 1.65, -8.5], look: [-2.0, 2.3, -8.5] },
      { pos: [0.4, 2.15, -8.5], look: [-4.0, 2.6, -8.0] },
      { pos: [-1.2, 2.65, -8.4], look: [-5.0, 2.5, -4.0] }
    ],
    camera: { pos: [-3.0, 2.6, -7.0], look: [-5.6, 2.3, 0] },
    title: 'Khung kính lớn nhìn thẳng ra đê',
    body: 'Sàn nâng 1 mét, sơn xanh nước biển nhạt. Ô kính chạy hết chiều ngang, ba bàn hai người sát kính nhìn ra đê.' },
  { id: 'tang-2', label: 'Tầng 2', side: 'right',
    via: [   // cầu thang từ dating lên tầng 2
      { pos: [-9.2, 2.65, -5.4], look: [-9.2, 3.5, -10] },
      { pos: [-9.2, 3.45, -8.1], look: [-9.0, 4.2, -12] },
      { pos: [-8.9, 4.25, -10.6], look: [-7.2, 4.1, -16] }
    ],
    camera: { pos: [-7.6, 4.15, -22.4], look: [-3.6, 2.3, -10] },
    title: 'Sàn lửng chạy dọc xưởng, nhìn xuống cả quán',
    body: 'Bàn tròn dọc lan can kính, đèn tường vàng ấm, chậu bàng Singapore ở góc.' },
  { id: 'ban-lam-viec', label: 'Bàn làm việc', side: 'right',
    via: [   // vài bậc từ tầng 2 lên tầng 3
      { pos: [-9.2, 4.3, -22.6], look: [-9.2, 4.8, -27] },
      { pos: [-9.2, 4.95, -25.3], look: [-7.0, 4.6, -27.5] }
    ],
    camera: { pos: [-4.4, 4.85, -28.7], look: [-7.4, 3.95, -25.1] },
    title: 'Dãy bàn 4 chỗ trên tầng 3, có ổ cắm',
    body: 'Phần trong nhà của tầng 3, lên từ tầng 2 qua vài bậc. Góc yên tĩnh nhất để mở laptop.' },
  { id: 'san-t3', label: 'Sân tầng 3', side: 'left',
    via: [   // qua cửa kính ra sân
      { pos: [-6.6, 4.95, -27.9], look: [2.0, 4.85, -29.6] },
      { pos: [-4.8, 4.95, -28.3], look: [2.0, 4.9, -28.3] },
      { pos: [-2.4, 4.95, -28.3], look: [6.0, 4.6, -27.2] }
    ],
    camera: { pos: [5.4, 5.0, -25.95], look: [3.0, 4.55, -32.0] },
    title: 'Nửa ngoài trời, dưới tán cây lớn',
    body: 'Nằm trên xưởng rang. Mặt sau mở ra tán cây lớn, bồn bê tông trồng cây rậm, ghế băng xanh rêu và ghế gỗ ép.' },
  { id: 'hen-o-xuong', kind: 'outro', label: 'Hẹn ở xưởng', side: 'left',
    camera: { pos: [7.4, 7.0, -23.2], look: [-3.5, 0.6, -5] },
    eyebrow: 'Hẹn ở xưởng', title: 'Gia Lâm Coffee Roaster',
    fine: 'Bản demo · menu và giá là ví dụ · dựng bởi Thái Thanh Tùng' }
];
