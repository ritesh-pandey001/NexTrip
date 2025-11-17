// ========================================
//   NEXTTRIP - MODERN APP JAVASCRIPT
//   Premium Travel Website - 2025
// ========================================

class NextTripApp {
    constructor() {
        this.init();
        this.bindEvents();
        this.initializeComponents();
    }

    init() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-out',
                once: true,
                offset: 100
            });
        }

        // Initialize Swiper for testimonials
        this.initSwiper();
        
        // Initialize loading screen
        this.handleLoadingScreen();
        
        // Initialize navbar
        this.initNavbar();
        
        // Initialize search functionality
        this.initSearch();
        
        // Initialize theme toggle
        this.initTheme();
        
        // Initialize booking system
        this.initBookingSystem();
        
        // Initialize back to top button
        this.initBackToTop();
        
        // Initialize destination filters
        this.initDestinationFilters();
        
        // Initialize mobile menu
        this.initMobileMenu();
    }

    bindEvents() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll);
        });

        // Window scroll event
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Window resize event
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });
    }

    initializeComponents() {
        // Initialize all interactive components
        this.initAccordions();
        this.initModals();
        this.initTooltips();
        this.initDropdowns();
        this.initTabs();
    }

    // ========================================
    //   LOADING SCREEN
    // ========================================
    
    handleLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;

        // Simulate loading progress
        const progressBar = loadingScreen.querySelector('.loading-progress');
        let progress = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 200);
            } else {
                progressBar.style.width = progress + '%';
                setTimeout(updateProgress, 100 + Math.random() * 200);
            }
        };

        updateProgress();
    }

    // ========================================
    //   NAVIGATION
    // ========================================
    
    initNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        // Add scrolled class based on scroll position
        this.updateNavbar();
        
        // Active link highlighting
        this.updateActiveNavLink();
    }

    updateNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    initMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.getElementById('navMenu');
        
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            }
        });
    }

    // ========================================
    //   SEARCH FUNCTIONALITY
    // ========================================
    
    initSearch() {
        const searchBtn = document.getElementById('searchBtn');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.querySelector('.search-input');

        if (!searchBtn || !searchOverlay) return;

        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => {
                searchInput?.focus();
            }, 300);
        });

        searchClose?.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        // Close on overlay click
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });

        // Search suggestions
        this.initSearchSuggestions(searchInput);
    }

    initSearchSuggestions(searchInput) {
        if (!searchInput) return;

        const suggestions = [
            { name: 'Paris, France', type: 'City', icon: 'fa-city' },
            { name: 'Tokyo, Japan', type: 'City', icon: 'fa-city' },
            { name: 'Santorini, Greece', type: 'Island', icon: 'fa-umbrella-beach' },
            { name: 'Swiss Alps', type: 'Mountain', icon: 'fa-mountain' },
            { name: 'Maldives', type: 'Beach', icon: 'fa-umbrella-beach' },
            { name: 'New York, USA', type: 'City', icon: 'fa-city' }
        ];

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const suggestionsContainer = document.querySelector('.search-suggestions');
            
            if (!query || !suggestionsContainer) return;

            const filtered = suggestions.filter(item => 
                item.name.toLowerCase().includes(query) || 
                item.type.toLowerCase().includes(query)
            );

            suggestionsContainer.innerHTML = filtered.map(item => `
                <div class="suggestion-item">
                    <i class="fas ${item.icon}"></i>
                    <div>
                        <span class="suggestion-name">${item.name}</span>
                        <span class="suggestion-type">${item.type}</span>
                    </div>
                </div>
            `).join('');
        });
    }

    // ========================================
    //   THEME SYSTEM
    // ========================================
    
    initTheme() {
        const themeBtn = document.getElementById('themeBtn');
        if (!themeBtn) return;

        // Load saved theme
        const savedTheme = localStorage.getItem('nexttrip-theme') || 'light';
        this.setTheme(savedTheme);

        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('nexttrip-theme', theme);
        
        const themeBtn = document.getElementById('themeBtn');
        const icon = themeBtn?.querySelector('i');
        
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    // ========================================
    //   BOOKING SYSTEM
    // ========================================
    
    initBookingSystem() {
        this.initBookingTabs();
        this.initBookingForm();
        this.initDatePickers();
        this.initLocationAutocomplete();
    }

    initBookingTabs() {
        const tabs = document.querySelectorAll('.tab-btn');
        const contents = document.querySelectorAll('.form-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                contents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === target) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    initBookingForm() {
        const swapBtn = document.querySelector('.swap-btn');
        if (!swapBtn) return;

        swapBtn.addEventListener('click', () => {
            const fromInput = document.getElementById('from');
            const toInput = document.getElementById('to');
            
            if (fromInput && toInput) {
                const temp = fromInput.value;
                fromInput.value = toInput.value;
                toInput.value = temp;
            }
        });
    }

    initDatePickers() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const today = new Date().toISOString().split('T')[0];
        
        dateInputs.forEach(input => {
            input.setAttribute('min', today);
            
            if (input.id === 'departure') {
                input.value = today;
            }
        });

        // Update return date minimum when departure changes
        const departureInput = document.getElementById('departure');
        const returnInput = document.getElementById('return');
        
        if (departureInput && returnInput) {
            departureInput.addEventListener('change', () => {
                returnInput.setAttribute('min', departureInput.value);
                if (returnInput.value < departureInput.value) {
                    returnInput.value = departureInput.value;
                }
            });
        }
    }

    initLocationAutocomplete() {
        const locationInputs = document.querySelectorAll('#from, #to');
        
        locationInputs.forEach(input => {
            input.addEventListener('input', this.handleLocationSearch.bind(this));
        });
    }

    handleLocationSearch(e) {
        const query = e.target.value;
        if (query.length < 2) return;

        // Mock location data - in real app, this would be an API call
        const locations = [
            'New York, NY, USA',
            'Los Angeles, CA, USA',
            'London, UK',
            'Paris, France',
            'Tokyo, Japan',
            'Sydney, Australia',
            'Dubai, UAE',
            'Singapore'
        ].filter(location => 
            location.toLowerCase().includes(query.toLowerCase())
        );

        this.showLocationSuggestions(e.target, locations);
    }

    showLocationSuggestions(input, locations) {
        // Remove existing suggestions
        const existing = document.querySelector('.location-suggestions');
        if (existing) existing.remove();

        if (locations.length === 0) return;

        const suggestions = document.createElement('div');
        suggestions.className = 'location-suggestions';
        suggestions.innerHTML = locations.map(location => `
            <div class="location-item" data-location="${location}">
                <i class="fas fa-map-marker-alt"></i>
                <span>${location}</span>
            </div>
        `).join('');

        input.parentNode.appendChild(suggestions);

        // Handle suggestion clicks
        suggestions.querySelectorAll('.location-item').forEach(item => {
            item.addEventListener('click', () => {
                input.value = item.getAttribute('data-location');
                suggestions.remove();
            });
        });

        // Remove suggestions when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function removeSuggestions(e) {
                if (!input.contains(e.target) && !suggestions.contains(e.target)) {
                    suggestions.remove();
                    document.removeEventListener('click', removeSuggestions);
                }
            });
        }, 100);
    }

    // ========================================
    //   DESTINATION FILTERS
    // ========================================
    
    initDestinationFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const destinationCards = document.querySelectorAll('.destination-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter destinations
                destinationCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ========================================
    //   SWIPER INITIALIZATION
    // ========================================
    
    initSwiper() {
        if (typeof Swiper === 'undefined') return;

        // Testimonials Swiper
        const testimonialsSwiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // ========================================
    //   UTILITY FUNCTIONS
    // ========================================
    
    initBackToTop() {
        const backToTopBtn = document.getElementById('backToTop');
        if (!backToTopBtn) return;

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    initAccordions() {
        const accordions = document.querySelectorAll('.accordion-header');
        
        accordions.forEach(header => {
            header.addEventListener('click', () => {
                const accordion = header.parentElement;
                const content = accordion.querySelector('.accordion-content');
                const icon = header.querySelector('.accordion-icon');
                
                // Toggle active state
                accordion.classList.toggle('active');
                
                // Animate content
                if (accordion.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                } else {
                    content.style.maxHeight = '0';
                    if (icon) icon.style.transform = 'rotate(0deg)';
                }
            });
        });
    }

    initModals() {
        const modalTriggers = document.querySelectorAll('[data-modal]');
        const modals = document.querySelectorAll('.modal');
        const closeBtns = document.querySelectorAll('.modal-close');

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close on overlay click
        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    initTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', () => {
                const text = element.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = text;
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
                
                setTimeout(() => tooltip.classList.add('visible'), 10);
            });
            
            element.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (!trigger || !menu) return;

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
                
                dropdown.classList.toggle('active');
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', () => {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    }

    initTabs() {
        const tabGroups = document.querySelectorAll('.tab-group');
        
        tabGroups.forEach(group => {
            const tabs = group.querySelectorAll('.tab');
            const contents = group.querySelectorAll('.tab-content');
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-tab');
                    
                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Update active content
                    contents.forEach(content => {
                        content.classList.remove('active');
                        if (content.getAttribute('data-content') === target) {
                            content.classList.add('active');
                        }
                    });
                });
            });
        });
    }

    // ========================================
    //   EVENT HANDLERS
    // ========================================
    
    handleSmoothScroll(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offset = 80; // Account for fixed header
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        // Update navbar
        this.updateNavbar();
        
        // Update back to top button
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // Parallax effects
        this.handleParallax();
    }

    handleParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    }

    handleResize() {
        // Update AOS on resize
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // Close mobile menu on desktop
        if (window.innerWidth >= 1024) {
            const toggle = document.getElementById('mobileMenuToggle');
            const menu = document.getElementById('navMenu');
            
            if (toggle && menu) {
                toggle.classList.remove('active');
                menu.classList.remove('active');
            }
        }
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        // Add loading state
        const submitBtn = form.querySelector('[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            this.showNotification('Form submitted successfully!', 'success');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // ========================================
    //   UTILITY METHODS
    // ========================================
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Handle close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    formatDate(date, options = {}) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        }).format(new Date(date));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ========================================
//   INITIALIZE APP
// ========================================

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NextTripApp();
});

// Export for use in other files
window.NextTripApp = NextTripApp;