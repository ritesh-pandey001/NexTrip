// Enhanced Header and Navigation JavaScript

class EnhancedNavigation {
    constructor() {
        this.init();
        this.bindEvents();
        this.initSearchFunctionality();
        this.initDropdowns();
        this.initMobileMenu();
    }

    init() {
        console.log('Enhanced Navigation initialized');
        this.setupScrollEffect();
    }

    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('headerThemeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Search toggle
        const searchToggle = document.getElementById('searchToggle');
        if (searchToggle) {
            searchToggle.addEventListener('click', this.toggleSearch.bind(this));
        }

        // Notification toggle
        const notificationToggle = document.getElementById('notificationToggle');
        if (notificationToggle) {
            notificationToggle.addEventListener('click', this.showNotifications.bind(this));
        }

        // Navigation links with enhanced active state
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavigation(e, link.dataset.page);
            });
        });

        // Dropdown items
        document.querySelectorAll('.dropdown-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleNavigation(e, item.dataset.page);
            });
        });
    }

    setupScrollEffect() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                header.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.98) 0%, rgba(6, 182, 212, 0.95) 50%, rgba(139, 92, 246, 0.98) 100%)';
                header.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            } else {
                header.classList.remove('scrolled');
                header.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.95) 0%, rgba(6, 182, 212, 0.9) 50%, rgba(139, 92, 246, 0.95) 100%)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    handleNavigation(e, page) {
        e.preventDefault();
        
        // Update active navigation state
        this.updateActiveNav(page);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.style.display = 'none';
        });
        
        // Show target page
        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.style.display = 'block';
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Hide mobile menu if open
        this.closeMobileMenu();
        
        // Close dropdowns
        this.closeAllDropdowns();
    }

    updateActiveNav(activePage) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page nav link
        const activeNavLink = document.querySelector(`.nav-link[data-page="${activePage}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
    }

    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('#headerThemeToggle i');
        
        body.classList.toggle('dark-theme');
        
        if (body.classList.contains('dark-theme')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        }
        
        this.animateThemeToggle();
    }

    animateThemeToggle() {
        const header = document.querySelector('.header');
        header.style.transform = 'scale(0.98)';
        header.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            header.style.transform = 'scale(1)';
        }, 200);
    }

    toggleSearch() {
        const searchBar = document.getElementById('quickSearchBar');
        const searchInput = searchBar?.querySelector('.search-input');
        
        if (searchBar) {
            searchBar.classList.toggle('active');
            
            if (searchBar.classList.contains('active')) {
                setTimeout(() => {
                    searchInput?.focus();
                }, 300);
            }
        }
    }

    initSearchFunctionality() {
        const searchInput = document.querySelector('.search-input');
        const searchClose = document.getElementById('searchClose');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearchInput.bind(this));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeSearch();
                }
            });
        }

        if (searchClose) {
            searchClose.addEventListener('click', this.closeSearch.bind(this));
        }

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            const searchBar = document.getElementById('quickSearchBar');
            const searchToggle = document.getElementById('searchToggle');
            
            if (searchBar && searchBar.classList.contains('active')) {
                if (!searchBar.contains(e.target) && !searchToggle.contains(e.target)) {
                    this.closeSearch();
                }
            }
        });
    }

    handleSearchInput(e) {
        const query = e.target.value.toLowerCase();
        const suggestions = document.querySelectorAll('.suggestion-item');
        
        if (query.length > 0) {
            suggestions.forEach(suggestion => {
                const text = suggestion.textContent.toLowerCase();
                if (text.includes(query)) {
                    suggestion.style.display = 'block';
                    suggestion.style.background = 'var(--primary-color)';
                    suggestion.style.color = 'white';
                } else {
                    suggestion.style.display = 'none';
                }
            });
        } else {
            suggestions.forEach(suggestion => {
                suggestion.style.display = 'block';
                suggestion.style.background = 'var(--bg-secondary)';
                suggestion.style.color = 'var(--text-primary)';
            });
        }
    }

    closeSearch() {
        const searchBar = document.getElementById('quickSearchBar');
        const searchInput = searchBar?.querySelector('.search-input');
        
        if (searchBar) {
            searchBar.classList.remove('active');
            if (searchInput) {
                searchInput.value = '';
                this.handleSearchInput({ target: searchInput });
            }
        }
    }

    showNotifications() {
        // Create notification dropdown
        const existingDropdown = document.querySelector('.notification-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }

        const notificationBtn = document.getElementById('notificationToggle');
        const dropdown = this.createNotificationDropdown();
        
        notificationBtn.parentElement.style.position = 'relative';
        notificationBtn.parentElement.appendChild(dropdown);
        
        // Position dropdown
        setTimeout(() => {
            dropdown.style.opacity = '1';
            dropdown.style.transform = 'translateY(0)';
        }, 10);

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeNotifications(e) {
                if (!dropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                    dropdown.remove();
                    document.removeEventListener('click', closeNotifications);
                }
            });
        }, 100);
    }

    createNotificationDropdown() {
        const dropdown = document.createElement('div');
        dropdown.className = 'notification-dropdown';
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 10px;
            background: var(--bg-card);
            border: 1px solid var(--border-primary);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-xl);
            min-width: 300px;
            max-height: 400px;
            overflow-y: auto;
            z-index: 1001;
            opacity: 0;
            transform: translateY(-10px);
            transition: all var(--transition-normal);
            backdrop-filter: blur(20px);
        `;

        const notifications = [
            { title: 'Welcome to NextTrip!', message: 'Start planning your next adventure', time: '5m ago', type: 'welcome' },
            { title: 'Special Offer', message: '20% off on beach destinations', time: '2h ago', type: 'offer' },
            { title: 'Trip Reminder', message: 'Your Paris trip is in 3 days', time: '1d ago', type: 'reminder' }
        ];

        dropdown.innerHTML = `
            <div style="padding: var(--spacing-lg); border-bottom: 1px solid var(--border-secondary);">
                <h3 style="margin: 0; color: var(--text-primary); font-size: 1.1rem;">Notifications</h3>
            </div>
            <div style="padding: var(--spacing-sm);">
                ${notifications.map(notif => `
                    <div style="padding: var(--spacing-md); border-radius: var(--radius-md); margin-bottom: var(--spacing-sm); cursor: pointer; transition: background var(--transition-fast);" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                        <div style="display: flex; align-items: flex-start; gap: var(--spacing-sm);">
                            <div style="width: 8px; height: 8px; background: var(--primary-color); border-radius: 50%; margin-top: 6px; flex-shrink: 0;"></div>
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 var(--spacing-xs) 0; font-size: 0.9rem; color: var(--text-primary);">${notif.title}</h4>
                                <p style="margin: 0 0 var(--spacing-xs) 0; font-size: 0.8rem; color: var(--text-secondary);">${notif.message}</p>
                                <span style="font-size: 0.7rem; color: var(--text-muted);">${notif.time}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="padding: var(--spacing-md); border-top: 1px solid var(--border-secondary); text-align: center;">
                <a href="#" style="color: var(--primary-color); text-decoration: none; font-size: 0.9rem; font-weight: var(--font-weight-medium);">View All Notifications</a>
            </div>
        `;

        return dropdown;
    }

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (trigger && menu) {
                let hoverTimeout;
                
                dropdown.addEventListener('mouseenter', () => {
                    clearTimeout(hoverTimeout);
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    hoverTimeout = setTimeout(() => {
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                        menu.style.transform = 'translateY(-10px)';
                    }, 150);
                });
            }
        });
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-10px)';
        });
    }

    initMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        
        if (mobileToggle) {
            mobileToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
    }

    toggleMobileMenu() {
        const mobileNav = document.getElementById('mobileNav');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileNav) {
            mobileNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Animate hamburger
            const spans = mobileToggle.querySelectorAll('span');
            if (mobileToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans.forEach(span => {
                    span.style.transform = '';
                    span.style.opacity = '';
                });
            }
        }
    }

    closeMobileMenu() {
        const mobileNav = document.getElementById('mobileNav');
        const mobileToggle = document.getElementById('mobileMenuToggle');
        
        if (mobileNav && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            mobileToggle.classList.remove('active');
            
            // Reset hamburger
            const spans = mobileToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = '';
                span.style.opacity = '';
            });
        }
    }

    // Initialize theme from localStorage
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const themeIcon = document.querySelector('#headerThemeToggle i');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        } else {
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        }
    }
}

// Initialize Enhanced Navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const enhancedNav = new EnhancedNavigation();
    enhancedNav.initTheme();
    
    // Make it globally accessible
    window.enhancedNav = enhancedNav;
    
    console.log('Enhanced Navigation system loaded successfully!');
});