const fs = require('fs');

// Read kehoach.json
const kehoach = JSON.parse(fs.readFileSync('kehoach.json', 'utf8'));

// Group by date
const dayGroups = {};
kehoach.forEach(item => {
  const date = item['Ngày'];
  if (!dayGroups[date]) {
    dayGroups[date] = [];
  }
  dayGroups[date].push({
    name: item['Tên địa điểm'] || '',
    time: item['Giờ'] || '',
    activities: item['Hoạt động'] || '',
    meals: item['Bữa ăn'] || '',
    accommodation: item['Chỗ nghỉ'] || '',
    lat: item['Vĩ độ'],
    lng: item['Kinh độ'],
    note: item['Ghi chú'] || '',
    clothing: []
  });
});

// Convert to app format
const days = Object.keys(dayGroups).sort().map((date, index) => ({
  id: index + 1,
  date: date,
  title: `Ngày ${index + 1} - ${date}`,
  locations: dayGroups[date].map((loc, i) => ({
    id: i + 1,
    ...loc,
    distance: null,
    duration: null
  }))
}));

const result = { days };

// Write with UTF-8
fs.writeFileSync('data.json', JSON.stringify(result, null, 2), 'utf8');
console.log('✅ Đã tạo data.json với', days.length, 'ngày');
