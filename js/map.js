// Map Management

class MapManager {
    constructor() {
        this.map = null;
        this.routeLine = null;
        this.markers = [];
        this.init();
    }

    init() {
        this.initializeMap();
        this.setupRouteLine();
    }

    initializeMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        // Initialize Leaflet map
        this.map = L.map('map', {
            center: [20, 0], // World view
            zoom: 2,
            zoomControl: true,
            attributionControl: true
        });

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Custom map controls
        this.addCustomControls();
    }

    setupRouteLine() {
        if (!this.map) return;

        // Create route line
        this.routeLine = L.polyline([], {
            color: '#2563eb',
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1
        }).addTo(this.map);
    }

    addCustomControls() {
        // Add custom zoom control styling
        const zoomControl = this.map.zoomControl;
        if (zoomControl) {
            zoomControl.setPosition('topright');
        }

        // Add scale control
        L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: false
        }).addTo(this.map);

        // Add custom location button
        this.addLocationControl();
    }

    addLocationControl() {
        const locationControl = L.Control.extend({
            onAdd: () => {
                const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                container.style.backgroundColor = 'white';
                container.style.width = '34px';
                container.style.height = '34px';
                container.style.cursor = 'pointer';
                container.innerHTML = '<i class="fas fa-location-arrow" style="line-height: 34px; text-align: center; display: block; color: #333;"></i>';
                
                container.onclick = () => {
                    this.getUserLocation();
                };

                return container;
            }
        });

        new locationControl({ position: 'topright' }).addTo(this.map);
    }

    getUserLocation() {
        if (!navigator.geolocation) {
            this.showLocationError('Geolocation not supported');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                this.map.setView([lat, lng], 15);
                
                // Add marker for current location
                this.addMarker([lat, lng], 'Your Location', 'current-location');
            },
            (error) => {
                this.showLocationError('Unable to get your location');
            }
        );
    }

    addMarker(coords, title, className = '') {
        const marker = L.marker(coords)
            .bindPopup(title)
            .addTo(this.map);
        
        if (className) {
            marker.getElement()?.classList.add(className);
        }
        
        this.markers.push(marker);
        return marker;
    }

    addDestinationMarker(coords, destination) {
        const marker = this.addMarker(coords, destination.name, 'destination-marker');
        
        // Custom popup content
        const popupContent = `
            <div class="map-popup">
                <h4>${destination.name}</h4>
                <p>${destination.description || 'Explore this destination'}</p>
                ${destination.image ? `<img src="${destination.image}" alt="${destination.name}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 4px; margin-top: 8px;">` : ''}
                <div class="popup-actions" style="margin-top: 8px;">
                    <button class="btn btn-small btn-primary" onclick="mapManager.planRoute([${coords[0]}, ${coords[1]}])">
                        Plan Route
                    </button>
                    <button class="btn btn-small" onclick="mapManager.getDirections([${coords[0]}, ${coords[1]}])">
                        Directions
                    </button>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup'
        });
        
        return marker;
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }

    clearRoute() {
        if (this.routeLine) {
            this.routeLine.setLatLngs([]);
        }
    }

    addRoutePoint(coords) {
        if (this.routeLine) {
            this.routeLine.addLatLng(coords);
        }
    }

    planRoute(destination) {
        if (!navigator.geolocation) {
            this.showLocationError('Geolocation required for route planning');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const start = [position.coords.latitude, position.coords.longitude];
                this.calculateRoute(start, destination);
            },
            (error) => {
                this.showLocationError('Unable to get your location for route planning');
            }
        );
    }

    calculateRoute(start, end) {
        // Clear existing route
        this.clearRoute();
        
        // Add start and end markers
        this.addMarker(start, 'Start', 'start-marker');
        this.addMarker(end, 'Destination', 'end-marker');
        
        // Simple straight line route (in a real app, use routing service)
        const routePoints = this.generateSimpleRoute(start, end);
        
        routePoints.forEach(point => {
            this.addRoutePoint(point);
        });
        
        // Fit map to show entire route
        const group = new L.featureGroup([
            L.marker(start),
            L.marker(end),
            this.routeLine
        ]);
        this.map.fitBounds(group.getBounds().pad(0.1));
        
        // Show route info
        this.showRouteInfo(start, end);
    }

    generateSimpleRoute(start, end) {
        // Generate intermediate points for a smooth route
        const points = [];
        const steps = 10;
        
        for (let i = 0; i <= steps; i++) {
            const ratio = i / steps;
            const lat = start[0] + (end[0] - start[0]) * ratio;
            const lng = start[1] + (end[1] - start[1]) * ratio;
            points.push([lat, lng]);
        }
        
        return points;
    }

    getDirections(destination) {
        // Open directions in external service
        const url = `https://www.google.com/maps/dir/?api=1&destination=${destination[0]},${destination[1]}`;
        window.open(url, '_blank');
    }

    showRouteInfo(start, end) {
        // Calculate approximate distance
        const distance = this.calculateDistance(start, end);
        
        // Show notification with route info
        if (window.app) {
            window.app.showNotification('success', 
                `Route planned! Approximate distance: ${distance.toFixed(1)} km`
            );
        }
    }

    calculateDistance(coord1, coord2) {
        // Haversine formula for calculating distance between two coordinates
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.toRadians(coord2[0] - coord1[0]);
        const dLon = this.toRadians(coord2[1] - coord1[1]);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(coord1[0])) * Math.cos(this.toRadians(coord2[0])) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    showLocationError(message) {
        if (window.app) {
            window.app.showNotification('error', message);
        }
    }

    addPopularDestinations() {
        // Add some popular destinations to the map
        const destinations = [
            {
                name: 'Paris, France',
                coords: [48.8566, 2.3522],
                description: 'The City of Light',
                image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200&h=120&fit=crop'
            },
            {
                name: 'Tokyo, Japan',
                coords: [35.6762, 139.6503],
                description: 'Modern metropolis meets tradition',
                image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=120&fit=crop'
            },
            {
                name: 'New York, USA',
                coords: [40.7128, -74.0060],
                description: 'The Big Apple',
                image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&h=120&fit=crop'
            },
            {
                name: 'London, UK',
                coords: [51.5074, -0.1278],
                description: 'Royal city with rich history',
                image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&h=120&fit=crop'
            },
            {
                name: 'Sydney, Australia',
                coords: [-33.8688, 151.2093],
                description: 'Harbor city down under',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop'
            }
        ];

        destinations.forEach(destination => {
            this.addDestinationMarker(destination.coords, destination);
        });
    }

    searchLocation(query) {
        // Simple geocoding simulation
        // In a real app, use a geocoding service like Nominatim or Google Geocoding
        
        const commonLocations = {
            'paris': [48.8566, 2.3522],
            'london': [51.5074, -0.1278],
            'tokyo': [35.6762, 139.6503],
            'new york': [40.7128, -74.0060],
            'sydney': [-33.8688, 151.2093],
            'rome': [41.9028, 12.4964],
            'barcelona': [41.3851, 2.1734],
            'amsterdam': [52.3676, 4.9041],
            'berlin': [52.5200, 13.4050],
            'istanbul': [41.0082, 28.9784]
        };

        const normalizedQuery = query.toLowerCase().trim();
        const coords = commonLocations[normalizedQuery];

        if (coords) {
            this.map.setView(coords, 12);
            this.addMarker(coords, query, 'search-result');
            
            if (window.app) {
                window.app.showNotification('success', `Found: ${query}`);
            }
        } else {
            if (window.app) {
                window.app.showNotification('error', `Location "${query}" not found`);
            }
        }
    }

    getMap() {
        return this.map;
    }

    getRouteLine() {
        return this.routeLine;
    }

    getMapBounds() {
        return this.map ? this.map.getBounds() : null;
    }

    fitBounds(bounds, options = {}) {
        if (this.map && bounds) {
            this.map.fitBounds(bounds, options);
        }
    }

    setView(coords, zoom) {
        if (this.map) {
            this.map.setView(coords, zoom);
        }
    }

    addHeatmap(data) {
        // Add heatmap layer for travel frequency data
        // This would require a heatmap plugin like Leaflet.heat
        if (window.L && window.L.heatLayer) {
            const heatLayer = L.heatLayer(data, {
                radius: 20,
                blur: 15,
                maxZoom: 17
            });
            heatLayer.addTo(this.map);
        }
    }
}

// Initialize map manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if map container exists
    if (document.getElementById('map')) {
        window.mapManager = new MapManager();
        
        // Add popular destinations after a short delay
        setTimeout(() => {
            if (window.mapManager) {
                window.mapManager.addPopularDestinations();
            }
        }, 1000);
    }
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapManager;
}