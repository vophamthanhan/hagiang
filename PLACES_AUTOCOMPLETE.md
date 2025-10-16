# 🗺️ Hướng dẫn sử dụng Google Places Autocomplete

## ✅ Đã cập nhật thành công!

### Thay đổi chính:
- ❌ **Xóa**: Ô "Google Maps Link" + nút "Lấy tọa độ"
- ✅ **Thêm**: Ô tìm kiếm địa điểm tích hợp Google Places Autocomplete

---

## 📍 Cách sử dụng

### Bước 1: Mở modal chỉnh sửa địa điểm
- Nhấn vào biểu tượng ✏️ bên cạnh địa điểm cần sửa

### Bước 2: Tìm kiếm địa điểm
1. Nhìn thấy ô **"📍 Tìm kiếm địa điểm trên Google Maps"**
2. Gõ tên địa điểm (ví dụ: "Cột cờ Lũng Cú", "Mã Pí Lèng", "TP Hà Giang")
3. Danh sách gợi ý sẽ hiện ra tự động
4. Chọn địa điểm từ danh sách

### Bước 3: Tự động điền tọa độ
- ✅ Vĩ độ (Latitude) tự động điền
- ✅ Kinh độ (Longitude) tự động điền
- ✅ Tên địa điểm tự động điền (nếu chưa có)
- ✅ Bản đồ tự động cập nhật ngay lập tức

### Bước 4: Lưu thay đổi
- Nhấn nút **"Lưu thay đổi"** để lưu vào GitHub

---

## 🎯 Ưu điểm so với cách cũ

| Cách cũ (Maps Link) | Cách mới (Places Search) |
|---------------------|--------------------------|
| Phải copy link từ Google Maps | Gõ tên trực tiếp |
| Phải mở Google Maps riêng | Tìm ngay trong ứng dụng |
| Link có thể sai format | Luôn đúng tọa độ |
| Nhiều bước | 1 bước duy nhất |

---

## 🔧 Kỹ thuật

### API sử dụng:
- **Google Maps JavaScript API**
- **Places Library (Autocomplete)**
- **API Key**: AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8

### Tính năng:
- **Component Restrictions**: Giới hạn kết quả ở Việt Nam
- **Fields**: place_id, geometry, name, formatted_address
- **Language**: Tiếng Việt (vi)
- **Real-time Map Update**: Bản đồ cập nhật ngay khi chọn địa điểm

### Code thay đổi:
1. ✅ Thêm Google Places API script vào `index.html`
2. ✅ Thay thế input field trong modal
3. ✅ Xóa `extractCoordinatesFromLink()` function
4. ✅ Thêm `initAutocomplete()` function
5. ✅ Thêm `showNotification()` helper
6. ✅ Thêm CSS animations cho notification

---

## ⚠️ Lưu ý quan trọng

### ✅ Data KHÔNG bị ảnh hưởng:
- File `data.json` không thay đổi
- Các địa điểm đã nhập vẫn giữ nguyên
- Chỉ thay đổi cách nhập tọa độ mới

### 🔒 Bảo mật:
- API Key đã được giới hạn domain
- Chỉ hoạt động trên `vophamthanhan.github.io`
- Giới hạn số lượng request mỗi ngày

---

## 🚀 Deploy

**GitHub Pages**: https://vophamthanhan.github.io/hagiang/

### Commit message:
```
Replace Google Maps link input with Places Autocomplete search for better UX - no data changes
```

### Files changed:
- `index.html` (thêm script, thay form field)
- `script.js` (xóa extract functions, thêm autocomplete)
- `styles.css` (thêm animations)

---

## 📊 Test checklist

- [x] Mở modal edit
- [x] Gõ tên địa điểm
- [x] Danh sách gợi ý hiện ra
- [x] Chọn địa điểm từ danh sách
- [x] Tọa độ tự động điền
- [x] Bản đồ cập nhật real-time
- [x] Lưu thành công
- [x] Data không bị mất

---

## 🐛 Troubleshooting

### Không hiện danh sách gợi ý?
- Kiểm tra internet connection
- Kiểm tra API Key còn quota
- Mở Console (F12) xem error

### Tọa độ không chính xác?
- Chọn đúng địa điểm từ danh sách
- Không tự gõ tọa độ vào ô readonly

### Bản đồ không cập nhật?
- Đảm bảo đã chọn địa điểm (không chỉ gõ)
- Chờ 1-2 giây sau khi chọn

---

Tạo bởi: GitHub Copilot
Ngày: 16/10/2025
