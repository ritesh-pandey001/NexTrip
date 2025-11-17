// Enhanced Hotel Booking System JavaScript

// Location Services
class LocationService {
    constructor() {
        this.currentLocation = null;
        this.nearbyHotels = [];
    }

    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(this.currentLocation);
                },
                (error) => reject(error),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }

    async findNearbyHotels(radius = 50) {
        if (!this.currentLocation) {
            await this.getCurrentLocation();
        }
        
        // Simulate finding nearby hotels
        this.nearbyHotels = this.generateNearbyHotels();
        return this.nearbyHotels;
    }

    generateNearbyHotels() {
        const sampleHotels = [
            {
                id: 1,
                name: "Grand Palace Hotel",
                location: "2.5 km away",
                rating: 4.8,
                price: 120,
                image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                amenities: ["WiFi", "Pool", "Gym", "Spa"]
            },
            {
                id: 2,
                name: "Boutique Resort & Spa",
                location: "3.2 km away",
                rating: 4.6,
                price: 95,
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                amenities: ["WiFi", "Spa", "Restaurant", "Beach"]
            },
            {
                id: 3,
                name: "Urban Business Hotel",
                location: "1.8 km away",
                rating: 4.4,
                price: 85,
                image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                amenities: ["WiFi", "Business Center", "Gym", "Parking"]
            }
        ];
        return sampleHotels;
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

// Search Form Handler
class SearchFormHandler {
    constructor() {
        this.activeTab = 'hotels';
        this.guests = {
            adults: 2,
            children: 0,
            rooms: 1
        };
        this.selectedRating = 0;
        this.selectedAmenities = [];
        this.locationService = new LocationService();
        this.init();
    }

    init() {
        this.bindEvents();
        this.initLocationFinder();
        this.initGuestSelector();
        this.initRatingFilter();
        this.initAmenityFilters();
        this.initDestinationSuggestions();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Search form submission
        const searchForm = document.querySelector('.advanced-search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch();
            });
        }
    }

    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        this.activeTab = tabName;
        console.log(`Switched to ${tabName} tab`);
    }

    initLocationFinder() {
        const findLocationBtn = document.querySelector('.find-location-btn');
        const locationStatus = document.querySelector('.location-status');
        
        if (findLocationBtn) {
            findLocationBtn.addEventListener('click', async () => {
                findLocationBtn.disabled = true;
                locationStatus.textContent = 'Finding your location...';
                
                try {
                    const location = await this.locationService.getCurrentLocation();
                    locationStatus.textContent = `Location found: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
                    
                    // Find nearby hotels
                    const nearbyHotels = await this.locationService.findNearbyHotels();
                    this.displayNearbyHotels(nearbyHotels);
                    
                } catch (error) {
                    locationStatus.textContent = 'Unable to find location. Please enter manually.';
                    console.error('Location error:', error);
                } finally {
                    findLocationBtn.disabled = false;
                }
            });
        }
    }

    displayNearbyHotels(hotels) {
        const resultsContainer = document.querySelector('.hotels-grid') || this.createResultsContainer();
        resultsContainer.innerHTML = '';
        
        hotels.forEach(hotel => {
            const hotelCard = this.createHotelCard(hotel);
            resultsContainer.appendChild(hotelCard);
        });
        
        // Update results header
        const resultsHeader = document.querySelector('.results-header h2');
        if (resultsHeader) {
            resultsHeader.textContent = `${hotels.length} Hotels Found Near You`;
        }
    }

    createResultsContainer() {
        const container = document.createElement('div');
        container.className = 'hotels-grid';
        container.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: var(--spacing-lg);
            margin-top: var(--spacing-xl);
        `;
        
        const searchResults = document.querySelector('.search-results') || document.querySelector('.hotels-section');
        if (searchResults) {
            searchResults.appendChild(container);
        }
        
        return container;
    }

    createHotelCard(hotel) {
        const card = document.createElement('div');
        card.className = 'hotel-card';
        card.innerHTML = `
            <div class="hotel-card-header">
                <img src="${hotel.image}" alt="${hotel.name}" class="hotel-card-image">
                <div class="hotel-price-badge">$${hotel.price}/night</div>
                <button class="hotel-favorite" data-hotel-id="${hotel.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="hotel-card-content">
                <div class="hotel-basic-info">
                    <h3 class="hotel-name">${hotel.name}</h3>
                    <div class="hotel-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${hotel.location}
                    </div>
                    <div class="hotel-rating">
                        <div class="hotel-stars">
                            ${'★'.repeat(Math.floor(hotel.rating))}
                        </div>
                        <span class="hotel-rating-text">${hotel.rating}/5</span>
                    </div>
                </div>
                <div class="hotel-amenities">
                    ${hotel.amenities.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                </div>
                <div class="hotel-actions">
                    <button class="btn btn-outline" onclick="viewHotelDetails(${hotel.id})">
                        View Details
                    </button>
                    <button class="btn btn-primary" onclick="bookHotel(${hotel.id})">
                        Book Now
                    </button>
                </div>
            </div>
        `;
        
        // Add favorite functionality
        const favoriteBtn = card.querySelector('.hotel-favorite');
        favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleFavorite(favoriteBtn, hotel.id);
        });
        
        return card;
    }

    toggleFavorite(btn, hotelId) {
        const icon = btn.querySelector('i');
        const isFavorited = btn.classList.contains('active');
        
        if (isFavorited) {
            btn.classList.remove('active');
            icon.className = 'far fa-heart';
        } else {
            btn.classList.add('active');
            icon.className = 'fas fa-heart';
        }
        
        console.log(`Hotel ${hotelId} ${isFavorited ? 'removed from' : 'added to'} favorites`);
    }

    initGuestSelector() {
        const guestBtn = document.querySelector('.guest-selector-btn');
        const dropdown = document.querySelector('.guest-dropdown');
        const guestText = guestBtn?.querySelector('.guest-text');
        
        if (!guestBtn || !dropdown) return;
        
        // Toggle dropdown
        guestBtn.addEventListener('click', () => {
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.guest-selector')) {
                dropdown.classList.remove('active');
            }
        });
        
        // Counter buttons
        dropdown.querySelectorAll('.counter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                const action = btn.dataset.action;
                
                if (action === 'increment') {
                    this.guests[type]++;
                } else if (action === 'decrement' && this.guests[type] > 0) {
                    this.guests[type]--;
                    if (type === 'adults' && this.guests[type] === 0) {
                        this.guests[type] = 1; // Minimum 1 adult
                    }
                    if (type === 'rooms' && this.guests[type] === 0) {
                        this.guests[type] = 1; // Minimum 1 room
                    }
                }
                
                this.updateGuestDisplay();
            });
        });
        
        this.updateGuestDisplay();
    }

    updateGuestDisplay() {
        const guestText = document.querySelector('.guest-text');
        const counters = document.querySelectorAll('.counter-value');
        
        if (guestText) {
            guestText.textContent = `${this.guests.adults + this.guests.children} Guests, ${this.guests.rooms} Room${this.guests.rooms > 1 ? 's' : ''}`;
        }
        
        counters.forEach(counter => {
            const type = counter.dataset.type;
            counter.textContent = this.guests[type];
        });
    }

    initRatingFilter() {
        const stars = document.querySelectorAll('.star');
        const ratingText = document.querySelector('.rating-text');
        
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.selectedRating = index + 1;
                this.updateStarDisplay();
            });
            
            star.addEventListener('mouseenter', () => {
                this.highlightStars(index + 1);
            });
        });
        
        const ratingFilter = document.querySelector('.rating-filter');
        ratingFilter?.addEventListener('mouseleave', () => {
            this.updateStarDisplay();
        });
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.classList.toggle('active', index < rating);
        });
    }

    updateStarDisplay() {
        this.highlightStars(this.selectedRating);
        const ratingText = document.querySelector('.rating-text');
        if (ratingText) {
            ratingText.textContent = this.selectedRating ? `${this.selectedRating}+ stars` : 'Any rating';
        }
    }

    initAmenityFilters() {
        const amenityCheckboxes = document.querySelectorAll('.amenity-checkbox');
        
        amenityCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                const input = checkbox.querySelector('input');
                const amenity = input.value;
                
                input.checked = !input.checked;
                
                if (input.checked) {
                    if (!this.selectedAmenities.includes(amenity)) {
                        this.selectedAmenities.push(amenity);
                    }
                } else {
                    this.selectedAmenities = this.selectedAmenities.filter(a => a !== amenity);
                }
                
                console.log('Selected amenities:', this.selectedAmenities);
            });
        });
    }

    initDestinationSuggestions() {
        const destinationInput = document.querySelector('input[placeholder*="destination"]');
        const suggestionsContainer = this.createSuggestionsDropdown(destinationInput);
        
        if (!destinationInput) return;
        
        const suggestions = [
            { name: "Paris, France", type: "city", icon: "fas fa-city" },
            { name: "Tokyo, Japan", type: "city", icon: "fas fa-city" },
            { name: "Bali, Indonesia", type: "island", icon: "fas fa-island-tropical" },
            { name: "New York, USA", type: "city", icon: "fas fa-city" },
            { name: "Rome, Italy", type: "city", icon: "fas fa-city" },
            { name: "Maldives", type: "island", icon: "fas fa-island-tropical" }
        ];
        
        destinationInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) {
                suggestionsContainer.style.display = 'none';
                return;
            }
            
            const filtered = suggestions.filter(s => 
                s.name.toLowerCase().includes(query)
            );
            
            this.displaySuggestions(suggestionsContainer, filtered, destinationInput);
        });
    }

    createSuggestionsDropdown(input) {
        const container = document.createElement('div');
        container.className = 'suggestions-dropdown';
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(container);
        return container;
    }

    displaySuggestions(container, suggestions, input) {
        container.innerHTML = '';
        
        if (suggestions.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        suggestions.forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <i class="${suggestion.icon}"></i>
                <span>${suggestion.name}</span>
            `;
            
            item.addEventListener('click', () => {
                input.value = suggestion.name;
                container.style.display = 'none';
            });
            
            container.appendChild(item);
        });
        
        container.style.display = 'block';
    }

    performSearch() {
        const searchData = {
            destination: document.querySelector('input[placeholder*="destination"]')?.value,
            checkIn: document.querySelector('input[type="date"]:first-of-type')?.value,
            checkOut: document.querySelector('input[type="date"]:last-of-type')?.value,
            guests: this.guests,
            rating: this.selectedRating,
            amenities: this.selectedAmenities,
            tab: this.activeTab
        };
        
        console.log('Performing search with:', searchData);
        
        // Simulate search results
        setTimeout(() => {
            this.displaySearchResults(searchData);
        }, 1000);
    }

    displaySearchResults(searchData) {
        // Generate sample results based on search criteria
        const sampleResults = this.generateSearchResults(searchData);
        this.displayNearbyHotels(sampleResults);
    }

    generateSearchResults(searchData) {
        const baseHotels = [
            {
                id: 1,
                name: "Luxury Beach Resort",
                location: `${searchData.destination}`,
                rating: 4.9,
                price: 180,
                image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                amenities: ["WiFi", "Pool", "Beach", "Spa", "Restaurant"]
            },
            {
                id: 2,
                name: "Downtown Business Hotel",
                location: `${searchData.destination}`,
                rating: 4.5,
                price: 120,
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                amenities: ["WiFi", "Gym", "Business Center", "Restaurant"]
            },
            {
                id: 3,
                name: "Boutique City Hotel",
                location: `${searchData.destination}`,
                rating: 4.7,
                price: 95,
                image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                amenities: ["WiFi", "Restaurant", "Bar", "Concierge"]
            }
        ];
        
        // Filter results based on criteria
        return baseHotels.filter(hotel => {
            if (searchData.rating > 0 && hotel.rating < searchData.rating) {
                return false;
            }
            
            if (searchData.amenities.length > 0) {
                const hasRequiredAmenities = searchData.amenities.every(amenity => 
                    hotel.amenities.some(hotelAmenity => 
                        hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
                    )
                );
                if (!hasRequiredAmenities) {
                    return false;
                }
            }
            
            return true;
        });
    }
}

// Booking Modal Handler
class BookingModal {
    constructor() {
        this.currentStep = 1;
        this.maxStep = 4;
        this.bookingData = {
            hotel: null,
            room: null,
            guests: null,
            personal: {},
            payment: {}
        };
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Step navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-step-btn')) {
                this.nextStep();
            } else if (e.target.classList.contains('prev-step-btn')) {
                this.prevStep();
            } else if (e.target.classList.contains('room-option')) {
                this.selectRoom(e.target);
            }
        });

        // Form validation
        document.addEventListener('input', (e) => {
            if (e.target.closest('.step-content.active')) {
                this.validateCurrentStep();
            }
        });
    }

    nextStep() {
        if (this.currentStep < this.maxStep && this.validateCurrentStep()) {
            this.currentStep++;
            this.updateStepDisplay();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    updateStepDisplay() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            } else if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            }
        });

        // Update step content
        document.querySelectorAll('.step-content').forEach((content, index) => {
            content.classList.toggle('active', index + 1 === this.currentStep);
        });

        // Update buttons
        this.updateNavigationButtons();
    }

    updateNavigationButtons() {
        const prevBtn = document.querySelector('.prev-step-btn');
        const nextBtn = document.querySelector('.next-step-btn');
        
        if (prevBtn) prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
        if (nextBtn) nextBtn.textContent = this.currentStep === this.maxStep ? 'Complete Booking' : 'Next Step';
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateRoomSelection();
            case 2:
                return this.validateGuestDetails();
            case 3:
                return this.validatePaymentDetails();
            case 4:
                return true;
            default:
                return false;
        }
    }

    validateRoomSelection() {
        const selectedRoom = document.querySelector('.room-option.selected');
        return !!selectedRoom;
    }

    validateGuestDetails() {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
        return requiredFields.every(field => {
            const input = document.querySelector(`input[name="${field}"]`);
            return input && input.value.trim() !== '';
        });
    }

    validatePaymentDetails() {
        const requiredFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        return requiredFields.every(field => {
            const input = document.querySelector(`input[name="${field}"]`);
            return input && input.value.trim() !== '';
        });
    }

    selectRoom(roomElement) {
        document.querySelectorAll('.room-option').forEach(room => {
            room.classList.remove('selected');
        });
        roomElement.classList.add('selected');
        
        this.bookingData.room = {
            id: roomElement.dataset.roomId,
            name: roomElement.querySelector('.room-name').textContent,
            price: roomElement.querySelector('.room-price').textContent
        };
        
        this.updateBookingSummary();
    }

    updateBookingSummary() {
        // Update booking summary with selected options
        const summaryContainer = document.querySelector('.booking-summary');
        if (!summaryContainer) return;
        
        // Update summary items based on selections
        console.log('Updating booking summary with:', this.bookingData);
    }
}

// Global Functions
window.viewHotelDetails = function(hotelId) {
    const modal = document.getElementById('hotelDetailsModal');
    if (modal) {
        // Populate modal with hotel details
        modal.style.display = 'block';
    }
};

window.bookHotel = function(hotelId) {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'block';
        // Initialize booking process
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SearchFormHandler();
    new BookingModal();
    
    console.log('Booking system initialized');
});