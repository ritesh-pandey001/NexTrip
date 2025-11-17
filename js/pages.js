// Page Navigation and Content Management
class PageManager {
    constructor() {
        this.currentPage = 'landingPage';
        this.init();
        this.loadContent();
    }

    init() {
        // Handle navigation links
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('[data-page]').getAttribute('data-page');
                this.showPage(page);
            });
        });

        // Handle theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme);
        }

        // Handle mobile menu
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', this.toggleMobileMenu);
        }
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });

        // Show landing page by default, or specific page
        let targetPage;
        if (pageId === 'home') {
            targetPage = document.getElementById('landingPage');
        } else {
            targetPage = document.getElementById(pageId + 'Page');
        }

        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Update active nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelectorAll(`[data-page="${pageId}"]`).forEach(link => {
            link.classList.add('active');
        });
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleMobileMenu() {
        // Mobile menu functionality can be added here
        console.log('Mobile menu toggled');
    }

    loadContent() {
        this.loadDestinations();
        this.loadTours();
        this.loadHotels();
    }

    loadDestinations() {
        const destinations = [
            {
                id: 1,
                name: "Paris, France",
                description: "The City of Light awaits with its romantic atmosphere, world-class museums, and iconic landmarks.",
                image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop&crop=center",
                price: "$899",
                region: "europe",
                budget: "mid",
                features: ["Eiffel Tower", "Louvre Museum", "Seine River", "French Cuisine"]
            },
            {
                id: 2,
                name: "Tokyo, Japan",
                description: "A mesmerizing blend of ultra-modern life and traditional culture in the world's largest metropolitan area.",
                image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop&crop=center",
                price: "$1,299",
                region: "asia",
                budget: "luxury",
                features: ["Cherry Blossoms", "Temples", "Modern Architecture", "Amazing Food"]
            },
            {
                id: 3,
                name: "New York, USA",
                description: "The city that never sleeps offers endless possibilities, from Broadway shows to world-class dining.",
                image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop&crop=center",
                price: "$699",
                region: "americas",
                budget: "mid",
                features: ["Broadway", "Central Park", "Museums", "Skyline Views"]
            },
            {
                id: 4,
                name: "Bali, Indonesia",
                description: "Tropical paradise with stunning beaches, ancient temples, and lush rice terraces.",
                image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop&crop=center",
                price: "$799",
                region: "asia",
                budget: "budget",
                features: ["Beautiful Beaches", "Rice Terraces", "Temples", "Spa & Wellness"]
            },
            {
                id: 5,
                name: "London, England",
                description: "Rich history meets modern innovation in this vibrant capital city full of royal heritage.",
                image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop&crop=center",
                price: "$649",
                region: "europe",
                budget: "mid",
                features: ["Big Ben", "Buckingham Palace", "Thames River", "Museums"]
            },
            {
                id: 6,
                name: "Dubai, UAE",
                description: "Futuristic city of luxury, innovation, and desert adventures in the heart of the Middle East.",
                image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop&crop=center",
                price: "$1,199",
                region: "asia",
                budget: "luxury",
                features: ["Burj Khalifa", "Luxury Shopping", "Desert Safari", "Modern Architecture"]
            }
        ];

        const grid = document.getElementById('destinationsGrid');
        if (grid) {
            grid.innerHTML = destinations.map(dest => `
                <div class="destination-card" data-region="${dest.region}" data-budget="${dest.budget}">
                    <img src="${dest.image}" alt="${dest.name}" class="card-image">
                    <div class="card-content">
                        <h3 class="card-title">${dest.name}</h3>
                        <p class="card-description">${dest.description}</p>
                        <div class="card-price">${dest.price}</div>
                        <div class="card-features">
                            ${dest.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                        <button class="btn btn-primary" onclick="bookDestination(${dest.id})">
                            <i class="fas fa-plane"></i>
                            Book Now
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    loadTours() {
        const tours = [
            {
                id: 1,
                name: "European Grand Tour",
                description: "Explore the best of Europe with visits to Paris, Rome, Barcelona, and Amsterdam in 14 days.",
                image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop&crop=center",
                price: "$2,599",
                duration: "14 days",
                category: "cultural",
                features: ["4 Countries", "Guided Tours", "Luxury Hotels", "All Meals"]
            },
            {
                id: 2,
                name: "African Safari Adventure",
                description: "Witness the Big Five and experience the raw beauty of Kenya and Tanzania's national parks.",
                image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=300&fit=crop&crop=center",
                price: "$3,299",
                duration: "10 days",
                category: "wildlife",
                features: ["Big Five", "Professional Guide", "Luxury Camps", "Game Drives"]
            },
            {
                id: 3,
                name: "Himalayan Trekking",
                description: "Challenge yourself with breathtaking mountain views on this guided trek to Everest Base Camp.",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
                price: "$1,899",
                duration: "16 days",
                category: "adventure",
                features: ["Expert Guides", "Mountain Views", "Tea Houses", "Cultural Experience"]
            },
            {
                id: 4,
                name: "Mediterranean Culinary Tour",
                description: "Taste your way through Italy, Greece, and Spain with cooking classes and wine tastings.",
                image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop&crop=center",
                price: "$2,199",
                duration: "12 days",
                category: "culinary",
                features: ["Cooking Classes", "Wine Tasting", "Local Markets", "Chef Experiences"]
            }
        ];

        const grid = document.getElementById('toursGrid');
        if (grid) {
            grid.innerHTML = tours.map(tour => `
                <div class="tour-card" data-category="${tour.category}">
                    <img src="${tour.image}" alt="${tour.name}" class="card-image">
                    <div class="card-content">
                        <h3 class="card-title">${tour.name}</h3>
                        <p class="card-description">${tour.description}</p>
                        <div class="card-price">${tour.price}</div>
                        <div class="tour-duration">
                            <i class="fas fa-clock"></i>
                            ${tour.duration}
                        </div>
                        <div class="card-features">
                            ${tour.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                        <button class="btn btn-primary" onclick="bookTour(${tour.id})">
                            <i class="fas fa-calendar"></i>
                            Book Tour
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    loadHotels() {
        const hotels = [
            {
                id: 1,
                name: "The Ritz Paris",
                description: "Legendary luxury hotel in the heart of Paris with exquisite French elegance and service.",
                image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop&crop=center",
                price: "$599/night",
                location: "Paris, France",
                rating: 5,
                features: ["Spa & Wellness", "Michelin Dining", "Concierge", "Fitness Center"]
            },
            {
                id: 2,
                name: "Park Hyatt Tokyo",
                description: "Contemporary luxury with stunning city views and authentic Japanese hospitality.",
                image: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&h=300&fit=crop&crop=center",
                price: "$450/night",
                location: "Tokyo, Japan",
                rating: 5,
                features: ["City Views", "Japanese Cuisine", "Spa", "Business Center"]
            },
            {
                id: 3,
                name: "The Plaza New York",
                description: "Iconic luxury hotel offering timeless elegance in the heart of Manhattan.",
                image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center",
                price: "$399/night",
                location: "New York, USA",
                rating: 4,
                features: ["Central Park Views", "Fine Dining", "Shopping", "Historic Charm"]
            },
            {
                id: 4,
                name: "Four Seasons Bali",
                description: "Tropical paradise resort with overwater villas and world-class spa treatments.",
                image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=300&fit=crop&crop=center",
                price: "$299/night",
                location: "Bali, Indonesia",
                rating: 5,
                features: ["Beach Access", "Infinity Pool", "Spa Treatments", "Water Sports"]
            }
        ];

        const grid = document.getElementById('hotelsGrid');
        if (grid) {
            grid.innerHTML = hotels.map(hotel => `
                <div class="hotel-card">
                    <img src="${hotel.image}" alt="${hotel.name}" class="card-image">
                    <div class="card-content">
                        <h3 class="card-title">${hotel.name}</h3>
                        <p class="card-description">${hotel.description}</p>
                        <div class="hotel-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${hotel.location}
                        </div>
                        <div class="hotel-rating">
                            ${'★'.repeat(hotel.rating)}${'☆'.repeat(5-hotel.rating)}
                        </div>
                        <div class="card-price">${hotel.price}</div>
                        <div class="card-features">
                            ${hotel.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                        </div>
                        <button class="btn btn-primary" onclick="bookHotel(${hotel.id})">
                            <i class="fas fa-bed"></i>
                            Book Hotel
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Tour category filtering
function filterTours(category) {
    const tours = document.querySelectorAll('.tour-card');
    const categories = document.querySelectorAll('.category-card');
    
    // Update active category
    categories.forEach(cat => cat.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Filter tours
    tours.forEach(tour => {
        if (category === 'all' || tour.dataset.category === category) {
            tour.style.display = 'block';
        } else {
            tour.style.display = 'none';
        }
    });
}

// Booking functions
function bookDestination(id) {
    showNotification('Destination booking initiated! Redirecting to booking form...', 'success');
    setTimeout(() => {
        alert(`Booking destination ID: ${id}. This would normally open a booking form.`);
    }, 1000);
}

function bookTour(id) {
    showNotification('Tour booking initiated! Redirecting to booking form...', 'success');
    setTimeout(() => {
        alert(`Booking tour ID: ${id}. This would normally open a booking form.`);
    }, 1000);
}

function bookHotel(id) {
    showNotification('Hotel booking initiated! Redirecting to booking form...', 'success');
    setTimeout(() => {
        alert(`Booking hotel ID: ${id}. This would normally open a booking form.`);
    }, 1000);
}

// Contact form submission
function handleContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
        });
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page manager
    const pageManager = new PageManager();
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Add tour category event listeners
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterTours(category);
        });
    });
    
    // Initialize contact form
    handleContactForm();
    
    // Show home page by default
    pageManager.showPage('home');
});

// Export for use in other scripts
window.PageManager = PageManager;