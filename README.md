# Gia Lâm Coffee Roaster

Trang giới thiệu 3D của **Gia Lâm Coffee Roaster** (280 Ngọc Thụy, Long Biên, Hà Nội). Người xem cuộn trang và đi theo đúng hành trình của khách: từ ven đê vào cửa, qua quầy order, khu camping, xưởng rang, rồi leo cầu thang lên dating, tầng 2, bàn làm việc và sân tầng 3. Ở quầy order có thể bấm để xem menu.

Trang dựng bằng **Three.js** (cảnh 3D) và **Vite** (chạy thử và đóng gói), theo cùng cách làm với dự án [xom-le-15](https://github.com/thaitung8888/xom-le-15).

## Chạy thử

Cần Node.js 18 trở lên.

```bash
npm install
npm run dev       # mở http://localhost:5173, sửa code là trang tự tải lại
npm run build     # đóng gói ra thư mục dist/ để đưa lên mạng
npm run preview   # xem thử bản đã đóng gói
npm run lint      # báo lỗi biến chưa khai báo, import thừa
```

## Cấu trúc thư mục

```
gialam-coffee-roaster/
├─ index.html                 Khung trang: canvas, màn tải (logo), logo góc, thanh trạm, khung menu
├─ public/
│  ├─ logo.png                Logo GIALAM COFFEE ROASTER (nền trong suốt)
│  └─ photos/                 Ảnh thật hiện khi bấm chấm "Xem ảnh"
└─ src/
   ├─ main.js                 Điểm vào: dựng đường cuộn và giao diện, rồi tải cảnh 3D
   ├─ env.js                  Màn nhỏ, giảm chuyển động, hàm $ / esc / vnd
   │
   ├─ config/                 ★ NỘI DUNG — phần hay sửa nhất, không cần đụng code 3D
   │  ├─ shop.js              Địa chỉ, giờ mở cửa, giá, wifi
   │  ├─ stations.js          10 trạm: chữ hiển thị, vị trí camera, điểm đi qua (via)
   │  ├─ menu.js              Menu theo nhóm: [tên, mô tả, giá]
   │  ├─ levels.js            Tỉ lệ mặt bằng PLAN, kích thước xưởng, cao độ các tầng, khối cuối xưởng
   │  └─ photos.js            Ảnh thật: vị trí chấm "Xem ảnh" ở từng trạm, chú thích
   │
   ├─ styles/                 CSS tách theo phần, gom trong main.css
   │  ├─ tokens.css           Màu, phông, nền, kiểu chữ chung
   │  ├─ chrome.css           Logo góc, phần trăm, thanh trạm, màn tải
   │  ├─ track.css            Đường cuộn, màn mở đầu
   │  ├─ caption.css          Chú thích góc dưới (thông tin quán ở màn kết)
   │  ├─ hotspot.css          Chấm "Xem menu"
   │  ├─ menu.css             Khung menu
   │  ├─ lightbox.css         Khung xem ảnh
   │  ├─ turn.css             Lời nhắc xoay ngang
   │  └─ responsive.css       Điện thoại dọc, điện thoại ngang, màn cảm ứng, giảm chuyển động
   │
   ├─ ui/                     Giao diện HTML (không dính tới 3D)
   │  ├─ sections.js          Tạo <section> và HTML chú thích từ stations.js
   │  ├─ scroll.js            Vị trí cuộn → tiến độ qua các trạm
   │  ├─ hud.js               Phần trăm, thanh trạm, đổi chú thích
   │  ├─ loader.js            Màn tải, chờ phông chữ
   │  ├─ menu.js              Khung menu (tab nhóm, Esc để đóng)
   │  ├─ turn.js              Lời nhắc xoay ngang trên điện thoại
   │  ├─ clock.js             Nút Sáng, Chiều, Tối (tự chọn theo giờ Hà Nội) và nút Mưa
   │  ├─ lightbox.js          Khung xem ảnh toàn màn hình
   │  └─ hotspots.js          Chấm "Xem menu", chấm "Xem ảnh", bấm thẳng vào quầy
   │
   └─ scene/                  Cảnh 3D
      ├─ index.js             Dựng từng khu theo thứ tự, vòng lặp vẽ
      ├─ core.js              renderer / scene / camera, onFrame, PICK
      ├─ cameraRig.js         Đường bay camera qua trạm và điểm via, liếc theo chuột
      ├─ helpers.js           Hàm dựng nhanh: box, boxAt, cyl, plane, rod, beam, group…
      ├─ random.js            Số ngẫu nhiên có hạt giống (cảnh lần nào cũng giống nhau)
      ├─ materials.js         Vật liệu dùng chung (M.xxx)
      ├─ foliage.js           Lá cây gom vào InstancedMesh, lay trong gió
      ├─ atmosphere.js        Sáng, chiều, tối, mưa: trời, ánh sáng, vệt đèn, hạt mưa, nước trên kính
      ├─ lights.js            Trời, nắng, đèn điểm (điện thoại dùng ít đèn hơn)
      ├─ plan.js              Co mặt bằng cả cảnh theo PLAN, bàn ghế giữ kích thước thật
      ├─ quality.js           Tự hạ độ phân giải khi máy không theo kịp
      ├─ fx.js                Phản chiếu môi trường, vệt nắng qua mái, bụi sáng, hơi nước
      ├─ merge.js             Gộp khối tĩnh cùng vật liệu, UV theo mét
      ├─ textures/            Texture vẽ bằng canvas: tường, sàn, gạch, cỏ, lá, chữ nổi
      ├─ props/
      │  ├─ shadow.js         Bóng mềm dưới bàn ghế, chậu cây (thay bóng thật trên điện thoại)
      │  ├─ furniture.js      Ghế xếp, ghế quầy, bàn tròn, bàn nhôm, ghế gỗ ép…
      │  └─ plants.js         Bàng Singapore, ficus, monstera, môn, dương xỉ, bồn cây
      └─ zones/               ★ Mỗi khu trong quán một file
         ├─ index.js          Danh sách và thứ tự dựng các khu
         ├─ outside.js        Vỉa hè, đường, đê, tranh tường hoa sen, nhà bên
         ├─ shell.js          Vỏ xưởng, mặt tiền, cửa lùa, chữ nổi, mái vì kèo
         ├─ dating.js         Góc dating
         ├─ dike.js           Người đi bộ, xe đạp, đèn đường trên mặt đê
         ├─ floor2.js         Tầng 2 + cầu thang thép từ tầng 1
         ├─ bar.js            Quầy order
         ├─ camping.js        Khu camping, cột 4 đèn tuýp, cây ficus
         ├─ roastery.js       Kho hạt + xưởng rang + nhà vệ sinh
         └─ floor3.js         Phòng làm việc, vách kính, cửa lùa, sân tầng 3
```

Quy ước chia lớp giống xom-le-15: **config** chỉ chứa dữ liệu, **ui** chỉ lo HTML, **scene** chỉ lo 3D.

## Sửa nội dung thường gặp

**Đổi chữ ở một trạm**: sửa `title` / `body` trong `src/config/stations.js`.

**Đổi kích thước quán**: sửa `PLAN` trong `src/config/levels.js` (0.85 là chiều dài và rộng còn 85%). Chiều cao giữ nguyên. Toạ độ trong `zones/` và `stations.js` vẫn là toạ độ thiết kế, nên không cần sửa từng số.

**Chỉnh góc máy**: sửa `camera.pos` (vị trí) và `camera.look` (điểm nhìn) của trạm. Trục toạ độ thiết kế: `x` từ -10 (tường trái) tới 10 (tường phải, phía quầy); `z` từ 0 (mặt tiền) tới -30 (tường sau); `y` là chiều cao. Khi chạy `npm run dev`, gõ `window.__cam = { pos: [x, y, z], look: [x, y, z] }` trong console để thử một góc máy bất kỳ.

**Camera đi qua cầu thang hoặc lối đi**: thêm điểm vào `via` của trạm đích. Camera đi ngang các điểm này mà không dừng lại.

**Đổi trạm có hoàng hôn**: thêm `dusk: true` cho trạm đó trong `stations.js`.

**Chỉnh màu sáng, chiều, tối**: mỗi màu và độ sáng có ba giá trị theo thứ tự đó, nằm ở đầu `buildAtmosphere()` trong `src/scene/atmosphere.js`. Vệt sáng ban đêm là danh sách `POOLS` cùng file.

**Thêm hoặc đổi ảnh**: chép ảnh vào `public/photos/` (cạnh dài khoảng 2200px là đủ nét), rồi thêm một dòng vào `src/config/photos.js` với đường dẫn, vị trí chấm và chú thích.

**Đổi menu và giá**: sửa `src/config/menu.js`.

**Thông tin quán, wifi**: sửa `src/config/shop.js`.

**Thêm một khu mới**: tạo file trong `src/scene/zones/`, export hàm `buildTenKhu()`, rồi thêm vào `BUILD_STEPS` trong `zones/index.js`. Hiệu ứng chạy mỗi khung hình (cửa lùa, quạt…) thì đăng ký bằng `onFrame(fn)` từ `scene/core.js`. Vật chuyển động hoặc bấm được thì bọc bằng `live()`, để bước gộp mesh bỏ qua. Khi mặt bằng co, vật dựng bằng `group()` giữ nguyên kích thước thật; hình in và quả cầu thì bọc bằng `keep()`, còn cánh cửa hoặc nhóm dùng toạ độ tuyệt đối thì bọc bằng `fit()`.

## Đưa lên mạng (Vercel)

Đẩy repo lên GitHub, vào vercel.com → New Project → chọn repo. Vercel tự nhận Vite: build command `npm run build`, output `dist`.
