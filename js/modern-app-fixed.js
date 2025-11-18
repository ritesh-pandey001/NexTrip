// ========================================
// NEXTTRIP - MODERN JAVASCRIPT APPLICATION
// Premium Travel Website - 2025 - FIXED
// ========================================

class NextTripApp {
    constructor() {
        this.currentBookingTab = 'flights';
        this.isSearchActive = false;
        this.isMobileMenuOpen = false;
        this.theme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.setupNavigation();
        this.setupBookingWidget();
        this.setupSearch();
        this.setupTheme();
        this.setupAnimations();
        this.setupBackToTop();
        this.setupDestinationFilters();
        this.updateCurrentDate();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1500);
    }

    setupEventListeners() {
        // Navigation events
        const searchBtn = document.getElementById('searchBtn');
        const searchClose = document.getElementById('searchClose');
        const searchOverlay = document.getElementById('searchOverlay');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const themeBtn = document.getElementById('themeBtn');
        const backToTop = document.getElementById('backToTop');

        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.toggleSearch(true));
        }

        if (searchClose) {
            searchClose.addEventListener('click', () => this.toggleSearch(false));
        }

        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    this.toggleSearch(false);
                }
            });
        }

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        if (backToTop) {
            backToTop.addEventListener('click', () => this.scrollToTop());
        }

        // Window events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
        });

        // Close search on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isSearchActive) {
                this.toggleSearch(false);
            }
        });
    }

    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');

        // Handle nav link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        // Remove active class from all links
                        navLinks.forEach(l => l.classList.remove('active'));
                        // Add active class to clicked link
                        link.classList.add('active');
                        
                        // Smooth scroll to target
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });

                        // Close mobile menu if open
                        if (this.isMobileMenuOpen) {
                            this.toggleMobileMenu();
                        }
                    }
                }
            });
        });

        // Handle navbar scroll effect
        if (navbar) {
            this.handleScroll();
        }
    }

    setupBookingWidget() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const formContents = document.querySelectorAll('.form-content');
        const swapBtn = document.querySelector('.swap-btn');
        const bookingForm = document.querySelector('.booking-form');

        // Handle tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = btn.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                formContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                btn.classList.add('active');
                
                // Show corresponding content
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                this.currentBookingTab = tabId;
            });
        });

        // Handle swap button
        if (swapBtn) {
            swapBtn.addEventListener('click', () => {
                const fromInput = document.getElementById('from');
                const toInput = document.getElementById('to');
                
                if (fromInput && toInput) {
                    const fromValue = fromInput.value;
                    fromInput.value = toInput.value;
                    toInput.value = fromValue;
                    
                    // Add visual feedback
                    swapBtn.style.transform = 'rotate(180deg) scale(0.9)';
                    setTimeout(() => {
                        swapBtn.style.transform = '';
                    }, 200);
                }
            });
        }

        // Handle form submission
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleBookingSubmission();
            });
        }
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const suggestions = document.querySelectorAll('.suggestion-item');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });

            searchInput.addEventListener('focus', () => {
                searchInput.parentElement.classList.add('focused');
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => {
                    searchInput.parentElement.classList.remove('focused');
                }, 200);
            });
        }

        // Handle suggestion clicks
        suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                const suggestionName = suggestion.querySelector('.suggestion-name');
                if (suggestionName && searchInput) {
                    searchInput.value = suggestionName.textContent;
                    this.toggleSearch(false);
                }
            });
        });
    }

    setupTheme() {
        this.applyTheme(this.theme);
        
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    setupAnimations() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100
            });
        }

        // Initialize Swiper if available
        if (typeof Swiper !== 'undefined') {
            this.initializeSwiper();
        }

        // Setup counter animations
        this.setupCounterAnimations();
    }

    setupBackToTop() {
        this.handleScroll(); // Initial check
    }

    setupDestinationFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const destinationCards = document.querySelectorAll('.destination-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
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

    updateCurrentDate() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };

        // Update departure date
        const departureInput = document.getElementById('departure');
        if (departureInput) {
            departureInput.value = formatDate(today);
            departureInput.min = formatDate(today);
        }

        // Update return date
        const returnInput = document.getElementById('return');
        if (returnInput) {
            returnInput.value = formatDate(tomorrow);
            returnInput.min = formatDate(tomorrow);
        }
    }

    // Event Handlers
    toggleSearch(show) {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchInput = document.querySelector('.search-input');
        
        if (searchOverlay) {
            this.isSearchActive = show;
            
            if (show) {
                searchOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    if (searchInput) {
                        searchInput.focus();
                    }
                }, 300);
            } else {
                searchOverlay.classList.remove('active');
                document.body.style.overflow = '';
                
                if (searchInput) {
                    searchInput.blur();
                }
            }
        }
    }

    toggleMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');
        
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.toggle('active', this.isMobileMenuOpen);
        }
        
        if (navMenu) {
            navMenu.classList.toggle('mobile-active', this.isMobileMenuOpen);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.theme);
        localStorage.setItem('theme', this.theme);
        
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('backToTop');
        const scrolled = window.scrollY > 100;
        
        // Navbar scroll effect
        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled);
        }
        
        // Back to top button
        if (backToTop) {
            backToTop.classList.toggle('visible', window.scrollY > 300);
        }
        
        // Update active nav link based on scroll position
        this.updateActiveNavLink();
    }

    handleResize() {
        // Handle any resize-specific logic
        if (window.innerWidth > 768 && this.isMobileMenuOpen) {
            this.toggleMobileMenu();
        }
    }

    handleSearchInput(query) {
        // Implement search functionality
        if (query.length > 2) {
            this.performSearch(query);
        }
    }

    handleBookingSubmission() {
        // Collect form data
        const formData = this.collectBookingData();
        
        // Validate form data
        if (this.validateBookingData(formData)) {
            // Show success message
            this.showBookingSuccess(formData);
        } else {
            // Show error message
            this.showBookingError();
        }
    }

    // Utility Methods
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    initializeSwiper() {
        const testimonialsSwiper = document.querySelector('.testimonials-swiper');
        
        if (testimonialsSwiper) {
            new Swiper(testimonialsSwiper, {
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
    }

    setupCounterAnimations() {
        const stats = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        stats.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent.replace(/\D/g, ''));
        const suffix = element.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.ceil(current) + suffix;
            }
        }, 40);
    }

    performSearch(query) {
        // Implement search logic
        console.log('Searching for:', query);
    }

    collectBookingData() {
        return {
            type: this.currentBookingTab,
            from: document.getElementById('from')?.value || '',
            to: document.getElementById('to')?.value || '',
            departure: document.getElementById('departure')?.value || '',
            return: document.getElementById('return')?.value || '',
            passengers: document.getElementById('passengers')?.value || ''
        };
    }

    validateBookingData(data) {
        return data.from && data.to && data.departure;
    }

    showBookingSuccess(data) {
        // Create a simple success message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 10000;
            font-weight: 600;
        `;
        message.textContent = `Searching for ${data.type} from ${data.from} to ${data.to}...`;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }

    showBookingError() {
        // Create a simple error message
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 10000;
            font-weight: 600;
        `;
        message.textContent = 'Please fill in all required fields.';
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(message);
            }, 300);
        }, 3000);
    }
}

// Initialize the application
const nextTripApp = new NextTripApp();