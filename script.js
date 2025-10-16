// Global state
let currentData = initializeData();
let currentDay = 1;
let editingLocation = null;
let showingRoute = false;

// DOM elements
const tabs = document.querySelectorAll('.tab');
const dayTitle = document.getElementById('dayTitle');
const locationList = document.getElementById('locationList');
const totalDistance = document.getElementById('totalDistance');
const totalTime = document.getElementById('totalTime');
const totalStops = document.getElementById('totalStops');
const resetBtn = document.getElementById('resetBtn');
const addLocationBtn = document.getElementById('addLocationBtn');
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const editForm = document.getElementById('editForm');

// Initialize app
function init() {
    updateMap();
    renderDay(currentDay);
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const day = parseInt(tab.dataset.day);
            switchDay(day);
        });
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn khôi phục dữ liệu ban đầu? Tất cả thay đổi sẽ bị mất.')) {
            currentData = resetData();
            renderDay(currentDay);
        }
    });

    addLocationBtn.addEventListener('click', () => {
        addNewLocation();
    });

    document.getElementById('showRouteBtn').addEventListener('click', () => {
        toggleRoute();
    });

    document.getElementById('openMapsBtn').addEventListener('click', () => {
        openInGoogleMaps();
    });

    closeModal.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveLocationEdit();
    });

    // Close modal when clicking outside
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeEditModal();
        }
    });
}

// Switch to a different day
function switchDay(day) {
    currentDay = day;
    
    // Update active tab
    tabs.forEach(tab => {
        if (parseInt(tab.dataset.day) === day) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    renderDay(day);
}

// Render a specific day
function renderDay(day) {
    const dayData = currentData.days[day - 1];
    
    // Update title
    dayTitle.textContent = dayData.title;
    
    // Render locations
    renderLocations(dayData.locations);
    
    // Update summary
    updateSummary(dayData.locations);
    
    // Update map
    updateMap();
}

// Render locations list
function renderLocations(locations) {
    locationList.innerHTML = '';
    
    // Sort locations by time before rendering
    const sortedLocations = sortLocationsByTime(locations);
    
    sortedLocations.forEach((location, index) => {
        const locationItem = createLocationElement(location, index);
        locationList.appendChild(locationItem);
    });
}

// Sort locations by time
function sortLocationsByTime(locations) {
    return [...locations].sort((a, b) => {
        // Extract start time from time string (e.g., "05:00" or "13:30-18:30")
        const getStartTime = (timeStr) => {
            if (!timeStr) return '99:99'; // Put items without time at the end
            
            // Handle range format like "13:30-18:30"
            const startTime = timeStr.split('-')[0].trim();
            
            // Handle "HH:MM" format
            const match = startTime.match(/(\d{1,2}):(\d{2})/);
            if (match) {
                const hours = match[1].padStart(2, '0');
                const minutes = match[2];
                return `${hours}:${minutes}`;
            }
            
            return '99:99';
        };
        
        const timeA = getStartTime(a.time);
        const timeB = getStartTime(b.time);
        
        return timeA.localeCompare(timeB);
    });
}

// Create location element
function createLocationElement(location, index) {
    const div = document.createElement('div');
    div.className = 'location-item';
    
    const hasDistance = location.distance > 0;
    
    div.innerHTML = `
        <div class="location-header">
            <div class="location-number">${location.id}</div>
            <div class="location-info">
                <h3 class="location-name">${location.name}</h3>
                <div class="location-details">
                    ${location.time ? `
                        <div class="location-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            <span>${location.time}</span>
                        </div>
                    ` : ''}
                    ${location.activities ? `
                        <div class="location-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>${location.activities}</span>
                        </div>
                    ` : ''}
                    ${location.meals ? `
                        <div class="location-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
                                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                                <line x1="6" y1="1" x2="6" y2="4"/>
                                <line x1="10" y1="1" x2="10" y2="4"/>
                                <line x1="14" y1="1" x2="14" y2="4"/>
                            </svg>
                            <span>${location.meals}</span>
                        </div>
                    ` : ''}
                    ${location.accommodation ? `
                        <div class="location-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M2 4v16"/>
                                <path d="M2 8h18a2 2 0 0 1 2 2v10"/>
                                <path d="M2 17h20"/>
                                <path d="M6 8v9"/>
                            </svg>
                            <span>${location.accommodation}</span>
                        </div>
                    ` : ''}
                    ${location.clothing ? `
                        <div class="location-detail clothing-detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                            <span><strong>Trang phục:</strong> ${location.clothing}</span>
                        </div>
                    ` : ''}
                    ${location.note ? `
                        <div class="location-detail location-note">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10 9 9 9 8 9"/>
                            </svg>
                            <span>${location.note}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="location-actions">
                <button class="btn-edit" data-index="${index}" title="Chỉnh sửa">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                </button>
                <button class="btn-delete" data-index="${index}" title="Xóa">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            </div>
        </div>
        ${hasDistance ? `
            <div class="location-distance">
                <div class="distance-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span>${location.distance} km</span>
                </div>
                <div class="distance-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 11 12 14 22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    <span>~${location.duration} phút</span>
                </div>
            </div>
        ` : ''}
    `;
    
    // Attach edit button listener
    const editBtn = div.querySelector('.btn-edit');
    editBtn.addEventListener('click', () => {
        openEditModal(location, index);
    });
    
    // Attach delete button listener
    const deleteBtn = div.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => {
        deleteLocation(index);
    });
    
    return div;
}

// Update summary
function updateSummary(locations) {
    const total = locations.reduce((acc, loc) => {
        return {
            distance: acc.distance + (loc.distance || 0),
            duration: acc.duration + (loc.duration || 0)
        };
    }, { distance: 0, duration: 0 });
    
    totalDistance.textContent = `${total.distance.toFixed(1)} km`;
    
    const hours = Math.floor(total.duration / 60);
    const minutes = total.duration % 60;
    if (hours > 0) {
        totalTime.textContent = `~${hours} giờ ${minutes} phút`;
    } else {
        totalTime.textContent = `~${minutes} phút`;
    }
    
    totalStops.textContent = `${locations.length} điểm`;
}

// Open edit modal
function openEditModal(location, index) {
    editingLocation = { ...location, index };
    
    document.getElementById('editName').value = location.name || '';
    document.getElementById('editTime').value = location.time || '';
    document.getElementById('editActivities').value = location.activities || '';
    document.getElementById('editMeals').value = location.meals || '';
    document.getElementById('editAccommodation').value = location.accommodation || '';
    document.getElementById('editClothing').value = location.clothing || '';
    document.getElementById('editNote').value = location.note || '';
    document.getElementById('editLat').value = location.lat || '';
    document.getElementById('editLng').value = location.lng || '';
    
    editModal.classList.add('active');
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('active');
    editingLocation = null;
    editForm.reset();
}

// Save location edit
function saveLocationEdit() {
    if (!editingLocation) return;
    
    const dayData = currentData.days[currentDay - 1];
    const location = dayData.locations[editingLocation.index];
    
    location.name = document.getElementById('editName').value;
    location.time = document.getElementById('editTime').value;
    location.activities = document.getElementById('editActivities').value;
    location.meals = document.getElementById('editMeals').value;
    location.accommodation = document.getElementById('editAccommodation').value;
    location.clothing = document.getElementById('editClothing').value;
    location.note = document.getElementById('editNote').value;
    location.lat = parseFloat(document.getElementById('editLat').value) || null;
    location.lng = parseFloat(document.getElementById('editLng').value) || null;
    
    // Re-number locations after sorting
    renumberLocations(dayData.locations);
    
    saveData(currentData);
    renderDay(currentDay);
    closeEditModal();
}

// Renumber locations based on sorted order
function renumberLocations(locations) {
    // Sort by time
    const sorted = sortLocationsByTime(locations);
    
    // Update IDs
    sorted.forEach((loc, index) => {
        loc.id = index + 1;
    });
    
    // Update the original array
    locations.length = 0;
    locations.push(...sorted);
}

// Add new location
function addNewLocation() {
    const dayData = currentData.days[currentDay - 1];
    const newLocation = {
        id: dayData.locations.length + 1, // Temporary ID, will be renumbered
        name: "Địa điểm mới",
        time: "",
        activities: "",
        meals: "",
        accommodation: "",
        clothing: "",
        note: "",
        lat: null,
        lng: null,
        distance: 0,
        duration: 0
    };
    
    dayData.locations.push(newLocation);
    
    // Renumber after adding
    renumberLocations(dayData.locations);
    
    saveData(currentData);
    renderDay(currentDay);
    
    // Open edit modal for the new location (find it by time since index may change)
    const newIndex = dayData.locations.findIndex(loc => loc.name === "Địa điểm mới" && loc.time === "");
    if (newIndex !== -1) {
        openEditModal(dayData.locations[newIndex], newIndex);
    }
}

// Update map with current day locations using Google Maps
function updateMap() {
    const dayData = currentData.days[currentDay - 1];
    const validLocations = dayData.locations.filter(loc => loc.lat && loc.lng);
    
    const mapIframe = document.getElementById('map');
    
    if (validLocations.length === 0) {
        // Show default Ha Giang location on Google Maps
        const defaultUrl = `https://www.google.com/maps?q=22.8230,104.9784&hl=vi&z=10&output=embed`;
        mapIframe.src = defaultUrl;
        return;
    }
    
    if (showingRoute && validLocations.length > 1) {
        // Show directions with waypoints
        const origin = `${validLocations[0].lat},${validLocations[0].lng}`;
        const destination = `${validLocations[validLocations.length - 1].lat},${validLocations[validLocations.length - 1].lng}`;
        
        // Build waypoints for middle locations
        let waypointsParam = '';
        if (validLocations.length > 2) {
            const waypoints = validLocations.slice(1, -1)
                .map(loc => `${loc.lat},${loc.lng}`)
                .join('|');
            waypointsParam = `&waypoints=${waypoints}`;
        }
        
        // Google Maps Directions URL with embed
        const directionsUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${origin}&destination=${destination}${waypointsParam}&mode=driving&language=vi`;
        
        mapIframe.src = directionsUrl;
    } else {
        // For multiple markers, create a search query with all locations
        if (validLocations.length === 1) {
            // Single location - simple marker
            const loc = validLocations[0];
            const mapUrl = `https://www.google.com/maps?q=${loc.lat},${loc.lng}&hl=vi&z=13&output=embed`;
            mapIframe.src = mapUrl;
        } else {
            // Multiple locations - use search with place names to show multiple markers
            const locationNames = validLocations
                .map(loc => `${loc.name}, Ha Giang`)
                .join('|');
            
            // Calculate center point
            const centerLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
            const centerLng = validLocations.reduce((sum, loc) => sum + loc.lng, 0) / validLocations.length;
            
            // Build URL with all coordinates as search query
            const coordinates = validLocations
                .map((loc, idx) => `${loc.lat},${loc.lng}`)
                .join('+to:');
            
            // Use Google Maps search mode which shows multiple pins
            const searchUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Ha+Giang+attractions&center=${centerLat},${centerLng}&zoom=10&language=vi`;
            
            // Alternative: Use simple embed with center
            const mapUrl = `https://www.google.com/maps?q=${centerLat},${centerLng}&hl=vi&z=10&output=embed`;
            
            mapIframe.src = mapUrl;
            
            // Show info message
            console.log('Hiển thị bản đồ với', validLocations.length, 'địa điểm');
        }
    }
}

// Toggle route visibility
function toggleRoute() {
    showingRoute = !showingRoute;
    document.getElementById('showRouteBtn').textContent = showingRoute ? 'Ẩn tuyến đường' : 'Hiện tuyến đường';
    updateMap();
}

// Open current day locations in Google Maps app/website
function openInGoogleMaps() {
    const dayData = currentData.days[currentDay - 1];
    const validLocations = dayData.locations.filter(loc => loc.lat && loc.lng);
    
    if (validLocations.length === 0) {
        alert('Chưa có địa điểm nào có tọa độ để hiển thị');
        return;
    }
    
    if (validLocations.length === 1) {
        // Single location - open in Google Maps
        const loc = validLocations[0];
        const url = `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`;
        window.open(url, '_blank');
    } else {
        // Multiple locations - open directions
        const origin = `${validLocations[0].lat},${validLocations[0].lng}`;
        const destination = `${validLocations[validLocations.length - 1].lat},${validLocations[validLocations.length - 1].lng}`;
        
        // Build waypoints
        let waypointsParam = '';
        if (validLocations.length > 2) {
            const waypoints = validLocations.slice(1, -1)
                .map(loc => `${loc.lat},${loc.lng}`)
                .join('|');
            waypointsParam = `&waypoints=${waypointsParam}`;
        }
        
        // Open Google Maps directions
        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsParam}&travelmode=driving`;
        window.open(url, '_blank');
    }
}

// Delete location
function deleteLocation(index) {
    const dayData = currentData.days[currentDay - 1];
    const location = dayData.locations[index];
    
    // Confirm deletion
    if (!confirm(`Bạn có chắc chắn muốn xóa địa điểm "${location.name}"?`)) {
        return;
    }
    
    // Remove location
    dayData.locations.splice(index, 1);
    
    // Renumber remaining locations
    renumberLocations(dayData.locations);
    
    // Save and re-render
    saveData(currentData);
    renderDay(currentDay);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);