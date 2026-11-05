// Menu hiện khi bấm vào quầy order. Mỗi món: [tên, mô tả, giá]. Món chưa có giá thì để null, trang sẽ bỏ trống ô giá.

export const MENU = [
  { id: 'ca-phe', name: 'Cà phê', note: 'Hạt rang tại xưởng', items: [
    ['Espresso', '', 35000],
    ['Americano', '', 40000],
    ['Cappuccino', '', 45000],
    ['Latte', '', 45000],
    ['Cafe kem béo', '', 50000],
    ['Mocha', '', 55000],
    ['Caramel Cream Cheese Latte', '', 55000]
  ] },
  { id: 'kombucha', name: 'Kombucha', note: '', items: [
    ['Kombucha nguyên bản', '', 45000],
    ['Kombucha dâu tằm', '', 50000],
    ['Kombucha mơ', '', 50000],
    ['Kombucha chanh vàng', '', 50000]
  ] },
  { id: 'tra', name: 'Trà', note: '', items: [
    ['Trà đen quả mọng', '', 50000],
    ['Hồng trà xí muội mơ', '', 50000],
    ['Trà bá tước cam chanh leo', '', 50000],
    ['Trà bá tước chanh vàng', '', 50000]
  ] },
  { id: 'tra-sua', name: 'Trà sữa', note: '', items: [
    ['Hồng trà kem cheese', '', 45000],
    ['Trà nhài shan sữa', '', 45000],
    ['Trà sữa earlgrey caramel', '', 45000]
  ] },
  { id: 'matcha', name: 'Matcha', note: '', items: [
    ['Matcha dâu mọng kem cheese', '', 55000],
    ['Matcha earlgrey', '', 55000],
    ['Matcha latte', '', null]
  ] },
  { id: 'khac', name: 'Khác', note: '', items: [
    ['Chocolate', '', null],
    ['Sữa chua Hy Lạp', '', null],
    ['Le fruit', '', null]
  ] }
];
