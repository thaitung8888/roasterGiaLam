// Menu hiện khi bấm vào quầy order. Mỗi món: [tên, mô tả, giá]. Giá hiện là ví dụ, chờ menu thật.

export const MENU = [
  { id: 'ca-phe', name: 'Cà phê', note: 'Hạt rang tại xưởng', items: [
    ['Espresso', 'Một shot, hạt rang mộc tuần này', 40000],
    ['Americano', 'Nóng hoặc đá', 45000],
    ['Cà phê sữa đá', 'Phin, sữa đặc', 40000],
    ['Bạc xỉu', 'Nhiều sữa, ít cà phê', 45000],
    ['Latte', 'Sữa tươi đánh nóng', 55000],
    ['Cold brew', 'Ủ lạnh 16 giờ', 55000],
    ['Pour over', 'Chọn hạt đơn nguồn tại quầy', 65000]
  ] },
  { id: 'khong-ca-phe', name: 'Không cà phê', note: 'Trà, cacao, nước ép', items: [
    ['Trà đào cam sả', '', 45000],
    ['Matcha latte', 'Nóng hoặc đá', 55000],
    ['Cacao sữa', '', 50000],
    ['Nước ép cam', 'Cam vắt tươi', 45000]
  ] },
  { id: 'banh', name: 'Bánh ngọt', note: 'Trong tủ kính ở quầy', items: [
    ['Croissant bơ', '', 35000],
    ['Tiramisu', 'Cốt cà phê nhà rang', 45000],
    ['Bánh chuối nướng', '', 35000]
  ] },
  { id: 'toi', name: 'Buổi tối', note: 'Từ tủ rượu sau quầy', items: [
    ['Highball', 'Whisky, soda, chanh', 85000],
    ['Rượu vang ly', 'Đỏ hoặc trắng', 90000],
    ['Espresso tonic', '', 55000]
  ] },
  { id: 'hat', name: 'Hạt rang', note: 'Mang về, túi 250 g', items: [
    ['Robusta Cầu Đất', 'Rang vừa, đậm, hợp pha phin', 120000],
    ['Arabica Sơn La', 'Rang sáng, chua nhẹ', 160000]
  ] }
];
