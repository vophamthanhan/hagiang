// Global state
let currentData = initializeData();
let currentDay = 1;
let editingLocation = null;
let map = null;
let markers = [];
let routePolyline = null;
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
    initMap();
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
    
    locations.forEach((location, index) => {
        const locationItem = createLocationElement(location, index);
        locationList.appendChild(locationItem);
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
                </div>
            </div>
            <button class="btn-edit" data-index="${index}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
            </button>
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
    location.lat = parseFloat(document.getElementById('editLat').value) || null;
    location.lng = parseFloat(document.getElementById('editLng').value) || null;
    
    saveData(currentData);
    renderDay(currentDay);
    closeEditModal();
}

// Add new location
function addNewLocation() {
    const dayData = currentData.days[currentDay - 1];
    const newLocation = {
        id: dayData.locations.length + 1,
        name: "Địa điểm mới",
        time: "",
        activities: "",
        meals: "",
        accommodation: "",
        lat: null,
        lng: null,
        distance: 0,
        duration: 0
    };
    
    dayData.locations.push(newLocation);
    saveData(currentData);
    renderDay(currentDay);
    
    // Open edit modal for the new location
    openEditModal(newLocation, dayData.locations.length - 1);
}

// Initialize map
function initMap() {
    // Create map centered on Ha Giang
    map = L.map('map').setView([22.8230, 104.9784], 9);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Remove placeholder
    const placeholder = document.querySelector('.map-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
}

// Update map with current day locations
function updateMap() {
    if (!map) return;
    
    // Clear existing markers and route
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }
    
    const dayData = currentData.days[currentDay - 1];
    const validLocations = dayData.locations.filter(loc => loc.lat && loc.lng);
    
    if (validLocations.length === 0) return;
    
    // Add markers for each location
    validLocations.forEach((location, index) => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 700;">${location.id}. ${location.name}</h3>
                ${location.time ? `<p style="margin: 4px 0; font-size: 0.9rem;">⏰ ${location.time}</p>` : ''}
                ${location.activities ? `<p style="margin: 4px 0; font-size: 0.9rem;">📍 ${location.activities}</p>` : ''}
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push(marker);
    });
    
    // Fit map to show all markers
    if (validLocations.length > 0) {
        const bounds = L.latLngBounds(validLocations.map(loc => [loc.lat, loc.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // Show route if enabled
    if (showingRoute) {
        showRoute();
    }
}

// Show route between locations
function showRoute() {
    if (!map) return;
    
    const dayData = currentData.days[currentDay - 1];
    const validLocations = dayData.locations.filter(loc => loc.lat && loc.lng);
    
    if (validLocations.length < 2) {
        alert('Cần ít nhất 2 địa điểm có tọa độ để hiển thị tuyến đường');
        return;
    }
    
    // Remove existing route
    if (routePolyline) {
        map.removeLayer(routePolyline);
    }
    
    // Create route polyline
    const routeCoords = validLocations.map(loc => [loc.lat, loc.lng]);
    routePolyline = L.polyline(routeCoords, {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7,
        smoothFactor: 1
    }).addTo(map);
    
    showingRoute = true;
    document.getElementById('showRouteBtn').textContent = 'Ẩn tuyến đường';
}

// Hide route
function hideRoute() {
    if (routePolyline) {
        map.removeLayer(routePolyline);
        routePolyline = null;
    }
    showingRoute = false;
    document.getElementById('showRouteBtn').textContent = 'Hiện tuyến đường';
}

// Toggle route visibility
function toggleRoute() {
    if (showingRoute) {
        hideRoute();
    } else {
        showRoute();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);

