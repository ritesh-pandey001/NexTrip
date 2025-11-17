// Main Application JavaScript

class NexTripApp {
    constructor() {
        this.user = null;
        this.trips = [];
        this.memories = [];
        this.map = null;
        this.routeLine = null;
        this.isTracking = false;
        this.watchId = null;
        
        this.init();
    }

    init() {
        // Initialize the application
        this.loadData();
        this.initEventListeners();
        this.initUI();
        this.checkAuthState();
    }

    loadData() {
        // Load data from localStorage
        this.user = JSON.parse(localStorage.getItem('nextrip_user')) || null;
        this.trips = JSON.parse(localStorage.getItem('nextrip_trips')) || [];
        this.memories = JSON.parse(localStorage.getItem('nextrip_memories')) || [];
    }

    saveData() {
        // Save data to localStorage
        localStorage.setItem('nextrip_user', JSON.stringify(this.user));
        localStorage.setItem('nextrip_trips', JSON.stringify(this.trips));
        localStorage.setItem('nextrip_memories', JSON.stringify(this.memories));
    }

    initEventListeners() {
        // Header navigation
        document.getElementById('signInBtn')?.addEventListener('click', () => this.showSignInModal());
        document.getElementById('getStartedBtn')?.addEventListener('click', () => this.handleGetStarted());
        document.getElementById('mobileSignIn')?.addEventListener('click', () => this.showSignInModal());
        document.getElementById('mobileGetStarted')?.addEventListener('click', () => this.handleGetStarted());
        document.getElementById('heroGetStarted')?.addEventListener('click', () => this.handleGetStarted());
        
        // Mobile menu toggle
        document.getElementById('mobileMenuToggle')?.addEventListener('click', () => this.toggleMobileMenu());
        
        // Trip management
        document.getElementById('addTripBtn')?.addEventListener('click', () => this.showAddTripModal());
        
        // Map and tracking
        document.getElementById('startTrackingBtn')?.addEventListener('click', () => this.startTracking());
        document.getElementById('stopTrackingBtn')?.addEventListener('click', () => this.stopTracking());
        document.getElementById('simulateRouteBtn')?.addEventListener('click', () => this.simulateRoute());
        document.getElementById('exportGpxBtn')?.addEventListener('click', () => this.exportGPX());
        
        // AI suggestions
        document.getElementById('aiSuggestBtn')?.addEventListener('click', () => this.generateAISuggestions());
        
        // Hotel search
        document.getElementById('searchHotelsBtn')?.addEventListener('click', () => this.searchHotels());
        
        // Photo memories
        document.getElementById('photoInput')?.addEventListener('change', (e) => this.handlePhotoUpload(e));
        
        // Rewards
        document.getElementById('claimRewardBtn')?.addEventListener('click', () => this.claimReward());
        
        // Forms
        document.getElementById('signInForm')?.addEventListener('submit', (e) => this.handleSignIn(e));
        document.getElementById('signUpForm')?.addEventListener('submit', (e) => this.handleSignUp(e));
        document.getElementById('addTripForm')?.addEventListener('submit', (e) => this.handleAddTrip(e));
    }

    initUI() {
        // Initialize UI components
        if (this.user) {
            this.showDashboard();
            this.updateUserDisplay();
            this.renderTrips();
            this.renderStats();
            this.renderTimeline();
            this.renderBadges();
            this.renderHotels();
        } else {
            this.showLandingPage();
        }
    }

    checkAuthState() {
        // Check if user is authenticated
        const authState = this.user !== null;
        this.updateUIForAuthState(authState);
    }

    updateUIForAuthState(isAuthenticated) {
        const signInBtn = document.getElementById('signInBtn');
        const getStartedBtn = document.getElementById('getStartedBtn');
        
        if (isAuthenticated && signInBtn) {
            signInBtn.innerHTML = '<i class="fas fa-user-circle"></i> Dashboard';
            signInBtn.onclick = () => this.showDashboard();
        }
        
        if (isAuthenticated && getStartedBtn) {
            getStartedBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i> Dashboard';
            getStartedBtn.onclick = () => this.showDashboard();
        }
    }

    showLandingPage() {
        const landingPage = document.getElementById('landingPage');
        const dashboard = document.getElementById('dashboard');
        
        if (landingPage) landingPage.style.display = 'block';
        if (dashboard) dashboard.style.display = 'none';
    }

    showDashboard() {
        const landingPage = document.getElementById('landingPage');
        const dashboard = document.getElementById('dashboard');
        
        if (landingPage) landingPage.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
        
        // Initialize map if not already done
        if (!this.map) {
            this.initMap();
        }
    }

    handleGetStarted() {
        if (!this.user) {
            this.showSignUpModal();
        } else {
            this.showDashboard();
        }
    }

    toggleMobileMenu() {
        const mobileNav = document.getElementById('mobileNav');
        if (mobileNav) {
            mobileNav.classList.toggle('active');
        }
    }

    showSignInModal() {
        this.showModal('signInModal');
    }

    showSignUpModal() {
        this.showModal('signUpModal');
    }

    showAddTripModal() {
        this.showModal('addTripModal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }

    handleSignIn(e) {
        e.preventDefault();
        
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;
        
        if (!email || !password) {
            this.showNotification('error', 'Please fill in all fields');
            return;
        }
        
        // Simulate sign in
        this.user = {
            id: Date.now(),
            name: email.split('@')[0],
            email: email,
            tier: 'Free',
            points: 0,
            joinDate: new Date().toISOString()
        };
        
        this.saveData();
        this.closeModal('signInModal');
        this.showDashboard();
        this.updateUserDisplay();
        this.updateUIForAuthState(true);
        this.showNotification('success', 'Welcome back!');
    }

    handleSignUp(e) {
        e.preventDefault();
        
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        
        if (!name || !email || !password) {
            this.showNotification('error', 'Please fill in all fields');
            return;
        }
        
        // Simulate sign up
        this.user = {
            id: Date.now(),
            name: name,
            email: email,
            tier: 'Free',
            points: 50, // Welcome bonus
            joinDate: new Date().toISOString()
        };
        
        this.saveData();
        this.closeModal('signUpModal');
        this.showDashboard();
        this.updateUserDisplay();
        this.updateUIForAuthState(true);
        this.showNotification('success', `Welcome to NexTrip, ${name}!`);
    }

    handleAddTrip(e) {
        e.preventDefault();
        
        const tripData = {
            id: Date.now(),
            name: document.getElementById('tripName').value,
            destination: document.getElementById('tripDestination').value,
            startDate: document.getElementById('tripStartDate').value,
            endDate: document.getElementById('tripEndDate').value,
            budget: document.getElementById('tripBudget').value,
            travelClass: document.getElementById('tripClass').value,
            description: document.getElementById('tripDescription').value,
            createdAt: new Date().toISOString(),
            status: 'planned'
        };
        
        if (!tripData.name || !tripData.destination) {
            this.showNotification('error', 'Please fill in the required fields');
            return;
        }
        
        this.trips.push(tripData);
        this.user.points += 10; // Points for adding trip
        this.saveData();
        this.closeModal('addTripModal');
        this.renderTrips();
        this.renderStats();
        this.renderBadges();
        this.showNotification('success', 'Trip added successfully!');
        
        // Reset form
        document.getElementById('addTripForm').reset();
    }

    updateUserDisplay() {
        const usernameEl = document.getElementById('username');
        const userAvatarEl = document.getElementById('userAvatar');
        const userTierEl = document.getElementById('userTier');
        
        if (this.user) {
            if (usernameEl) usernameEl.textContent = this.user.name;
            if (userAvatarEl) userAvatarEl.textContent = this.user.name.charAt(0).toUpperCase();
            if (userTierEl) userTierEl.textContent = this.user.tier;
        }
    }

    renderTrips() {
        const tripsListEl = document.getElementById('tripsList');
        if (!tripsListEl) return;
        
        if (this.trips.length === 0) {
            tripsListEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map"></i>
                    <h3>No trips yet</h3>
                    <p>Start planning your first adventure!</p>
                </div>
            `;
            return;
        }
        
        tripsListEl.innerHTML = this.trips.map(trip => `
            <div class="trip-item">
                <div class="trip-info">
                    <div class="trip-details">
                        <h4>${trip.name}</h4>
                        <p>${trip.destination} • ${this.formatDate(trip.startDate)} - ${this.formatDate(trip.endDate)}</p>
                    </div>
                    <div class="trip-actions">
                        <button class="btn btn-small" onclick="app.viewTrip(${trip.id})">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        <button class="btn btn-small btn-danger" onclick="app.deleteTrip(${trip.id})">
                            <i class="fas fa-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderStats() {
        const statTripsEl = document.getElementById('statTrips');
        const statCountriesEl = document.getElementById('statCountries');
        const statPointsEl = document.getElementById('statPoints');
        
        if (statTripsEl) statTripsEl.textContent = this.trips.length;
        if (statPointsEl) statPointsEl.textContent = this.user?.points || 0;
        
        // Calculate unique countries
        const countries = new Set(
            this.trips.map(trip => {
                const parts = trip.destination.split(',');
                return parts.length > 1 ? parts[1].trim() : trip.destination;
            })
        );
        
        if (statCountriesEl) statCountriesEl.textContent = countries.size;
    }

    renderTimeline() {
        const timelineEl = document.getElementById('timeline');
        if (!timelineEl) return;
        
        if (this.memories.length === 0) {
            timelineEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-camera"></i>
                    <h3>No memories yet</h3>
                    <p>Start tracking your journey to create memories!</p>
                </div>
            `;
            return;
        }
        
        timelineEl.innerHTML = this.memories.map(memory => `
            <div class="timeline-item">
                <div class="timeline-image">
                    ${memory.image ? `<img src="${memory.image}" alt="Memory">` : '<i class="fas fa-map-pin"></i>'}
                </div>
                <div class="timeline-content">
                    <h4>${memory.caption || 'Travel Memory'}</h4>
                    <p>${memory.location || 'Location unknown'} • ${this.formatDate(memory.timestamp)}</p>
                </div>
            </div>
        `).join('');
    }

    renderBadges() {
        const badgesGridEl = document.getElementById('badgesGrid');
        if (!badgesGridEl) return;
        
        const badges = this.calculateBadges();
        
        if (badges.length === 0) {
            badgesGridEl.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <h3>No badges yet</h3>
                    <p>Complete trips and activities to earn badges!</p>
                </div>
            `;
            return;
        }
        
        badgesGridEl.innerHTML = badges.map(badge => `
            <div class="badge-item">
                <div class="badge-icon">
                    <i class="${badge.icon}"></i>
                </div>
                <div class="badge-name">${badge.name}</div>
            </div>
        `).join('');
    }

    calculateBadges() {
        const badges = [];
        
        if (this.trips.length >= 1) {
            badges.push({ name: 'Explorer', icon: 'fas fa-compass' });
        }
        
        if (this.trips.length >= 5) {
            badges.push({ name: 'Adventurer', icon: 'fas fa-hiking' });
        }
        
        if (this.user && this.user.points >= 100) {
            badges.push({ name: 'Point Collector', icon: 'fas fa-star' });
        }
        
        if (this.memories.length >= 10) {
            badges.push({ name: 'Memory Keeper', icon: 'fas fa-camera' });
        }
        
        return badges;
    }

    renderHotels() {
        const hotelsListEl = document.getElementById('hotelsList');
        if (!hotelsListEl) return;
        
        // Sample hotel data
        const hotels = [
            {
                id: 1,
                name: 'Grand Plaza Hotel',
                location: 'New York, USA',
                price: 249,
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
            },
            {
                id: 2,
                name: 'Seaside Resort',
                location: 'Bali, Indonesia',
                price: 189,
                image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
            },
            {
                id: 3,
                name: 'Mountain Lodge',
                location: 'Swiss Alps, Switzerland',
                price: 329,
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop'
            }
        ];
        
        hotelsListEl.innerHTML = hotels.map(hotel => `
            <div class="hotel-item">
                <div class="hotel-image">
                    <img src="${hotel.image}" alt="${hotel.name}">
                </div>
                <div class="hotel-details">
                    <div class="hotel-info">
                        <h4>${hotel.name}</h4>
                        <p>${hotel.location}</p>
                    </div>
                    <div class="hotel-pricing">
                        <span class="hotel-price">$${hotel.price}/night</span>
                        <button class="btn btn-small btn-primary" onclick="app.bookHotel(${hotel.id})">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    searchHotels() {
        const searchInput = document.getElementById('hotelSearchInput');
        const query = searchInput?.value || '';
        
        // Simulate hotel search
        this.showNotification('success', `Searching for hotels in "${query}"...`);
        
        // In a real app, this would make an API call
        setTimeout(() => {
            this.renderHotels();
        }, 1000);
    }

    bookHotel(hotelId) {
        // Simulate hotel booking
        this.showNotification('success', 'Redirecting to booking page...');
        
        if (this.user) {
            this.user.points += 25; // Points for booking
            this.saveData();
            this.renderStats();
            this.renderBadges();
        }
    }

    viewTrip(tripId) {
        const trip = this.trips.find(t => t.id === tripId);
        if (trip) {
            this.showNotification('success', `Viewing ${trip.name}`);
            // In a real app, this would navigate to trip details page
        }
    }

    deleteTrip(tripId) {
        if (confirm('Are you sure you want to delete this trip?')) {
            this.trips = this.trips.filter(t => t.id !== tripId);
            this.saveData();
            this.renderTrips();
            this.renderStats();
            this.renderBadges();
            this.showNotification('success', 'Trip deleted successfully');
        }
    }

    generateAISuggestions() {
        // Simulate AI suggestions
        const destinations = [
            'Paris, France',
            'Tokyo, Japan',
            'Santorini, Greece',
            'Machu Picchu, Peru',
            'Iceland Highlands'
        ];
        
        const randomDestinations = destinations
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        
        this.showNotification('success', `AI suggests: ${randomDestinations.join(', ')}`);
    }

    handlePhotoUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const memory = {
                id: Date.now(),
                image: event.target.result,
                caption: 'New Memory',
                location: 'Current Location',
                timestamp: new Date().toISOString()
            };
            
            this.memories.push(memory);
            this.user.points += 5; // Points for adding memory
            this.saveData();
            this.renderTimeline();
            this.renderStats();
            this.renderBadges();
            this.showNotification('success', 'Memory added successfully!');
        };
        
        reader.readAsDataURL(file);
    }

    claimReward() {
        if (!this.user) return;
        
        if (this.user.points >= 100) {
            this.user.points -= 100;
            this.saveData();
            this.renderStats();
            this.showNotification('success', 'Reward claimed! You earned a special badge.');
        } else {
            this.showNotification('error', `You need ${100 - this.user.points} more points to claim this reward.`);
        }
    }

    startTracking() {
        if (!navigator.geolocation) {
            this.showNotification('error', 'Geolocation is not supported by this browser');
            return;
        }
        
        this.isTracking = true;
        document.getElementById('startTrackingBtn').disabled = true;
        document.getElementById('stopTrackingBtn').disabled = false;
        
        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.handleLocationUpdate(position),
            (error) => this.handleLocationError(error),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
        
        this.showNotification('success', 'Location tracking started');
    }

    stopTracking() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        
        this.isTracking = false;
        document.getElementById('startTrackingBtn').disabled = false;
        document.getElementById('stopTrackingBtn').disabled = true;
        
        if (this.routeLine) {
            this.routeLine.setLatLngs([]);
        }
        
        this.showNotification('success', 'Location tracking stopped');
    }

    handleLocationUpdate(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const coords = [lat, lng];
        
        if (this.map) {
            this.map.setView(coords, 15);
            
            if (this.routeLine) {
                this.routeLine.addLatLng(coords);
            }
        }
        
        // Add to memories
        const memory = {
            id: Date.now(),
            location: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            timestamp: new Date().toISOString(),
            caption: 'Tracked Location'
        };
        
        this.memories.push(memory);
        this.user.points += 1; // Points for tracking
        this.saveData();
        this.renderTimeline();
        this.renderStats();
    }

    handleLocationError(error) {
        let message = 'Location error occurred';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'Location access denied by user';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Location information unavailable';
                break;
            case error.TIMEOUT:
                message = 'Location request timed out';
                break;
        }
        
        this.showNotification('error', message);
        this.stopTracking();
    }

    simulateRoute() {
        // Simulate a route for demo purposes
        const parisRoute = [
            [48.8566, 2.3522], // Notre-Dame
            [48.8584, 2.2945], // Eiffel Tower
            [48.8606, 2.3376], // Louvre
            [48.8529, 2.3499]  // Latin Quarter
        ];
        
        let index = 0;
        const interval = setInterval(() => {
            if (index >= parisRoute.length) {
                clearInterval(interval);
                this.showNotification('success', 'Route simulation completed!');
                this.user.points += 20;
                this.saveData();
                this.renderStats();
                this.renderBadges();
                return;
            }
            
            const coords = parisRoute[index];
            
            if (this.map) {
                this.map.setView(coords, 15);
                
                if (this.routeLine) {
                    this.routeLine.addLatLng(coords);
                }
            }
            
            // Add memory
            const memory = {
                id: Date.now() + index,
                location: `Paris Stop ${index + 1}`,
                timestamp: new Date().toISOString(),
                caption: `Simulated route point ${index + 1}`
            };
            
            this.memories.push(memory);
            this.renderTimeline();
            
            index++;
        }, 2000);
        
        this.showNotification('success', 'Starting route simulation...');
    }

    exportGPX() {
        if (this.memories.length === 0) {
            this.showNotification('error', 'No route data to export');
            return;
        }
        
        const gpxData = this.generateGPXData();
        const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nextrip-route.gpx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('success', 'GPX file exported successfully');
    }

    generateGPXData() {
        let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="NexTrip">
    <metadata>
        <name>NexTrip Route Export</name>
        <time>${new Date().toISOString()}</time>
    </metadata>
    <trk>
        <name>Travel Route</name>
        <trkseg>
`;
        
        this.memories.forEach(memory => {
            if (memory.location && memory.location.includes(',')) {
                const [lat, lng] = memory.location.split(',').map(coord => parseFloat(coord.trim()));
                if (!isNaN(lat) && !isNaN(lng)) {
                    gpx += `            <trkpt lat="${lat}" lon="${lng}">
                <time>${memory.timestamp}</time>
                <name>${memory.caption}</name>
            </trkpt>
`;
                }
            }
        });
        
        gpx += `        </trkseg>
    </trk>
</gpx>`;
        
        return gpx;
    }

    showNotification(type, message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas ${type === 'success' ? 'fa-check' : type === 'error' ? 'fa-exclamation' : 'fa-info'}"></i>
                </div>
                <div class="notification-text">
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    initMap() {
        // Initialize map will be handled in map.js
        if (window.MapManager) {
            this.mapManager = new MapManager();
            this.map = this.mapManager.getMap();
            this.routeLine = this.mapManager.getRouteLine();
        }
    }
}

// Global functions for HTML onclick handlers
window.closeModal = (modalId) => {
    if (window.app) {
        window.app.closeModal(modalId);
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NexTripApp();
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NexTripApp;
}