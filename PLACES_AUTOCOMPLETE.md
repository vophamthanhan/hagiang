# 🗺️ Hướng dẫn sử dụng Google Places Search

## ✅ Đã cập nhật thành công! (v2 - với nút Tìm)

### Thay đổi chính:
- ❌ **Xóa**: Google Maps Link input cũ
- ❌ **Xóa**: Autocomplete tự động (v1)
- ✅ **Thêm**: Search box + nút "Tìm" + danh sách kết quả (v2)

---

## 📍 Cách sử dụng mới (v2)

### Bước 1: Mở modal chỉnh sửa địa điểm
- Nhấn vào biểu tượng ✏️ bên cạnh địa điểm cần sửa

### Bước 2: Nhập tên địa điểm
1. Nhìn thấy ô **"📍 Tìm kiếm địa điểm trên Google Maps"**
2. Gõ tên địa điểm (ví dụ: "Cột cờ Lũng Cú")
3. **Nhấn nút "Tìm"** (hoặc Enter)

### Bước 3: Chọn từ danh sách kết quả
- 📋 Danh sách địa điểm hiện ra bên dưới
- Mỗi kết quả hiển thị: **Tên** + **Địa chỉ đầy đủ**
- Click vào kết quả muốn chọn

### Bước 4: Tự động điền thông tin
- ✅ Vĩ độ (Latitude) tự động điền
- ✅ Kinh độ (Longitude) tự động điền
- ✅ Tên địa điểm tự động điền (nếu chưa có)
- ✅ Bản đồ tự động cập nhật ngay lập tức

### Bước 5: Lưu thay đổi
- Nhấn nút **"Lưu thay đổi"** để lưu vào GitHub

---

## 🎯 Ưu điểm so với cách cũ

| v1 (Autocomplete) | v2 (Search + Results) |
|-------------------|----------------------|
| Tự động gợi ý khi gõ | Chủ động tìm khi sẵn sàng |
| Dropdown nhỏ, khó chọn | Danh sách lớn, dễ xem |
| Không thấy địa chỉ đầy đủ | Hiện cả tên + địa chỉ |
| Đôi khi chọn nhầm | Chọn chính xác hơn |
| Gõ sai là phải gõ lại | Có thể edit và tìm lại |

---

## 🔧 Kỹ thuật (v2)

### API sử dụng:
- **Google Maps JavaScript API**
- **Places Library (TextSearch)** - Thay vì Autocomplete
- **API Key**: AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8

### Tính năng:
- **Text Search**: Tìm kiếm địa điểm theo text query
- **Location Bias**: Ưu tiên kết quả gần Hà Giang (22.5°N, 105.0°E, bán kính 200km)
- **Fields**: name, formatted_address, geometry, place_id
- **Results List**: Hiển thị nhiều kết quả cùng lúc
- **Real-time Map Update**: Bản đồ cập nhật ngay khi chọn

### UI/UX:
1. **Search Container**: Input + Button layout
2. **Results Container**: Dropdown với scroll
3. **Result Item**: Icon + Tên + Địa chỉ (hover effect)
4. **Empty State**: Loading / No results / Error messages
5. **Keyboard Support**: Enter để tìm kiếm

### Code changes:
1. ✅ Thêm search button vào HTML
2. ✅ Thêm results container
3. ✅ Thay `initAutocomplete()` → `initPlacesService()`
4. ✅ Thêm `searchPlaces()` function
5. ✅ Thêm `displayResults()` function
6. ✅ Thêm `selectPlace()` function
7. ✅ CSS cho results list (hover, scroll, empty states)
8. ✅ Event listeners cho search button + Enter key

---

## ⚠️ Lưu ý quan trọng

### ✅ Data KHÔNG bị ảnh hưởng:
- File `data.json` không thay đổi
- Các địa điểm đã nhập vẫn giữ nguyên
- Chỉ thay đổi cách tìm và chọn tọa độ mới

### 🔒 Bảo mật:
- API Key đã được giới hạn domain
- Chỉ hoạt động trên `vophamthanhan.github.io`
- Giới hạn số lượng request mỗi ngày

### 📍 Location Bias:
- Tìm kiếm ưu tiên kết quả ở Hà Giang
- Bán kính 200km từ trung tâm
- Có thể tìm được cả địa điểm xa hơn

---

## 🚀 Deploy

**GitHub Pages**: https://vophamthanhan.github.io/hagiang/

### Commit messages:
```
v1: Replace Google Maps link input with Places Autocomplete search
v2: Replace autocomplete with search button and results list for better control and accuracy
```

### Files changed:
- `index.html` (thêm button, results container)
- `script.js` (PlacesService thay vì Autocomplete, thêm search/display functions)
- `styles.css` (results list styling, hover effects)

---

## 📊 Test checklist

- [x] Mở modal edit
- [x] Nhập tên địa điểm
- [x] Nhấn nút "Tìm"
- [x] Danh sách kết quả hiện ra
- [x] Hover vào kết quả (highlight)
- [x] Click chọn 1 kết quả
- [x] Tọa độ tự động điền
- [x] Bản đồ cập nhật real-time
- [x] Lưu thành công
- [x] Data không bị mất
- [x] Enter key hoạt động
- [x] Scroll trong results list
- [x] Empty state khi không có kết quả

---

## 🐛 Troubleshooting

### Nhấn "Tìm" nhưng không có gì?
- Kiểm tra internet connection
- Mở Console (F12) xem error
- Kiểm tra API Key còn quota

### Kết quả không chính xác?
- Nhập tên cụ thể hơn (VD: "Cột cờ Lũng Cú Hà Giang")
- Thử từ khóa khác
- Chọn kết quả phù hợp nhất trong danh sách

### Không tìm thấy địa điểm?
- Google Maps có thể chưa có dữ liệu
- Thử tìm địa điểm gần đó
- Có thể nhập tọa độ thủ công

### Danh sách kết quả quá dài?
- Results list có scroll
- Kết quả sắp xếp theo độ liên quan
- Chọn kết quả đầu tiên thường chính xác nhất

---

## 🎨 UI Features

### Search Button:
- Icon: 🔍 (magnifying glass)
- Color: Blue gradient (#3b82f6 → #2563eb)
- Hover: Lift effect + shadow
- SVG icon cho độ nét cao

### Results List:
- Max height: 300px với scroll
- Border radius: 8px
- Each item: Icon 📍 + Name (bold) + Address (gray)
- Hover effect: Blue background (#f0f9ff) + blue border
- Smooth transitions

### Empty States:
- Loading: "🔄 Đang tìm kiếm..."
- No results: "❌ Không tìm thấy kết quả nào"
- Error: "❌ Lỗi khi tìm kiếm. Vui lòng thử lại"

---

## 💡 Tips sử dụng

1. **Nhập tên đầy đủ**: "Cột cờ Lũng Cú" tốt hơn "Lũng Cú"
2. **Xem kỹ địa chỉ**: Đảm bảo chọn đúng địa điểm (có thể có nhiều nơi cùng tên)
3. **Dùng Enter**: Nhanh hơn click chuột
4. **Xem nhiều kết quả**: Scroll xuống nếu kết quả đầu không phải
5. **Tên địa điểm khác**: Thử cả tiếng Việt có dấu và không dấu

---

Cập nhật lần cuối: 16/10/2025 (v2)
Tạo bởi: GitHub Copilot
