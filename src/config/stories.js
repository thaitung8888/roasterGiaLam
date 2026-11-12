// Lời kể cho các thao tác: pha một ly ở quầy, rang một mẻ ở xưởng rang.
//   at     : vị trí chấm gợi ý trên đồ vật (toạ độ thiết kế)
//   camera : camera tiến lại gần đồ vật khi mở bảng (toạ độ thiết kế)

export const BENCH = {
  brew: {
    station: 'quay', at: [7.62, 1.72, -14.2], label: 'Pha một ly',
    camera: { pos: [8.75, 1.5, -13.55], look: [7.85, 1.18, -14.08] },
    eyebrow: 'Quầy pha', title: 'Pha một ly cho bạn',
    intro: 'Chọn một món, ly sẽ được rót ngay trên chiếc Faema.'
  },
  roast: {
    station: 'xuong-rang', at: [3.9, 2.2, -29.25], label: 'Rang một mẻ',
    camera: { pos: [2.75, 1.55, -27.2], look: [3.55, 1.1, -28.95] },
    eyebrow: 'Xưởng rang', title: 'Rang một mẻ hạt',
    intro: 'Kéo thanh nhiệt để xem hạt trong khay đổi màu, từ xanh sang nâu.'
  }
};

// mỗi món cà phê một câu, khớp đúng tên trong menu.js
export const DRINKS = {
  'Espresso': 'Ba mươi mililit đậm đặc, phủ lớp crema màu hạt dẻ. Cách nhanh nhất để biết mẻ hạt hôm nay ra sao.',
  'Americano': 'Một shot espresso pha loãng với nước. Nhẹ hơn, để ngồi nhâm nhi lâu hơn.',
  'Cappuccino': 'Espresso, sữa nóng và một lớp bọt dày. Đắng và béo vừa đủ cân nhau.',
  'Latte': 'Nhiều sữa hơn cappuccino, lớp bọt mỏng hơn. Dịu dàng cho buổi sáng.',
  'Cafe kem béo': 'Cà phê đậm ở dưới, lớp kem béo phủ trên. Khuấy đều hay uống từng lớp, tuỳ bạn.',
  'Mocha': 'Espresso gặp sô-cô-la và sữa. Ngọt vừa phải, hợp những ngày mưa.',
  'Caramel Cream Cheese Latte': 'Latte thêm caramel, phủ kem cheese mằn mặn. Dành cho người thích ngọt.'
};

// các giai đoạn khi rang, theo vị trí thanh nhiệt (0 đến 100)
export const ROAST_STAGES = [
  { to: 15, name: 'Hạt xanh', text: 'Hạt sống còn mùi cỏ, cứng như sỏi. Chưa thể pha.' },
  { to: 35, name: 'Sấy khô', text: 'Nước trong hạt bay hơi, hạt ngả vàng và thơm mùi bánh mì.' },
  { to: 55, name: 'Chuyển nâu', text: 'Đường trong hạt bắt đầu caramel hoá, mùi ngọt lan khắp phòng.' },
  { to: 68, name: 'Nổ lần một', text: 'Hạt nở ra và nổ lách tách. Từ đây mới thật sự là cà phê.' },
  { to: 82, name: 'Rang vừa', text: 'Chua dịu, ngọt và cân bằng. Hợp pha espresso và các món sữa.' },
  { to: 92, name: 'Nổ lần hai', text: 'Dầu bắt đầu rịn ra mặt hạt, vị đắng đậm dần lên.' },
  { to: 101, name: 'Rang đậm', text: 'Đắng sâu, thoảng mùi khói. Hợp pha phin kiểu Việt Nam.' }
];
