// Enhanced NextTrip JavaScript - Full functionality with dark theme support

document.addEventListener('DOMContentLoaded', () => {
  
  // ===== THEME MANAGEMENT =====
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  
  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
  
  themeToggle && themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  // ===== MOBILE NAVIGATION =====
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.getElementById('mobileNav');
  
  mobileToggle && mobileToggle.addEventListener('click', () => {
    const isOpen = !mobileNav.hasAttribute('hidden');
    
    if (isOpen) {
      mobileNav.setAttribute('hidden', '');
      mobileToggle.setAttribute('aria-expanded', 'false');
    } else {
      mobileNav.removeAttribute('hidden');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
  });

  // ===== SEARCH FORM TABS =====
  const tabButtons = document.querySelectorAll('.tabs .tab');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all tabs
      tabButtons.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      });
      
      // Add active class to clicked tab
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      // Update search button text based on selected tab
      const target = btn.dataset.target;
      const searchButton = document.querySelector('.btn.primary.full');
      if (searchButton) {
        const icon = searchButton.querySelector('i');
        const text = searchButton.querySelector('i').nextSibling;
        
        switch(target) {
          case 'flights':
            icon.className = 'fas fa-search';
            searchButton.innerHTML = '<i class="fas fa-search"></i> Search Flights';
            break;
          case 'hotels':
            icon.className = 'fas fa-bed';
            searchButton.innerHTML = '<i class="fas fa-bed"></i> Find Hotels';
            break;
          case 'cars':
            icon.className = 'fas fa-car';
            searchButton.innerHTML = '<i class="fas fa-car"></i> Rent Car';
            break;
          case 'packages':
            icon.className = 'fas fa-gift';
            searchButton.innerHTML = '<i class="fas fa-gift"></i> View Packages';
            break;
        }
      }
    });
  });

  // ===== SEARCH FORM HANDLING =====
  const searchForm = document.getElementById('searchForm');
  searchForm && searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(searchForm);
    const searchData = Object.fromEntries(formData);
    
    // Get active tab to determine search type
    const activeTab = document.querySelector('.tab.active');
    const searchType = activeTab ? activeTab.dataset.target : 'flights';
    
    // Show loading state
    const submitBtn = searchForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    submitBtn.disabled = true;
    
    // Simulate search (in real app, this would call an API)
    setTimeout(() => {
      showSearchResults(searchType, searchData);
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
  
  function showSearchResults(type, data) {
    const resultsMessage = `
      Searching for ${type}...
      From: ${data.from || 'Any'}
      To: ${data.to || 'Any'}
      Departure: ${data.departure || 'Flexible'}
      Return: ${data.return || 'One way'}
      Passengers: ${data.passengers || '1'}
    `;
    
    alert(`Search Results:\n${resultsMessage}\n\nThis would normally redirect to results page.`);
  }
  function handleImageError() {
    document.addEventListener('error', (e) => {
      if (e.target.tagName === 'IMG') {
        // Create a fallback with a gradient background and icon
        const img = e.target;
        const fallback = document.createElement('div');
        fallback.className = 'image-fallback';
        fallback.style.cssText = `
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3rem;
          border-radius: inherit;
        `;
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-image';
        fallback.appendChild(icon);
        
        // Replace the broken image with fallback
        img.parentNode.replaceChild(fallback, img);
      }
    }, true);
  }
  
  handleImageError();
  const swapBtn = document.querySelector('.swap-btn');
  swapBtn && swapBtn.addEventListener('click', () => {
    const fromInput = document.querySelector('input[name="from"]');
    const toInput = document.querySelector('input[name="to"]');
    
    if (fromInput && toInput) {
      const temp = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = temp;
      
      // Add visual feedback
      swapBtn.style.transform = 'rotate(180deg)';
      setTimeout(() => {
        swapBtn.style.transform = 'rotate(0deg)';
      }, 300);
    }
  });
  
  // ===== BUTTON FUNCTIONALITY =====
  
  // Start Adventure button
  const startAdventureBtn = document.getElementById('startAdventure');
  startAdventureBtn && startAdventureBtn.addEventListener('click', () => {
    const destinations = document.getElementById('destinations');
    if (destinations) {
      destinations.scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Watch Story button
  const watchStoryBtn = document.getElementById('watchStory');
  watchStoryBtn && watchStoryBtn.addEventListener('click', () => {
    alert('🎬 Video player would open here\n\nIn a real application, this would show a promotional video about NextTrip.');
  });
  
  // Sign In button
  const signinBtn = document.getElementById('signinBtn');
  signinBtn && signinBtn.addEventListener('click', () => {
    alert('🔐 Sign In form would appear here\n\nIn a real application, this would open a login modal or redirect to login page.');
  });
  
  // Get Started button
  const getStartedBtn = document.getElementById('getStarted');
  getStartedBtn && getStartedBtn.addEventListener('click', () => {
    alert('🚀 Registration form would appear here\n\nIn a real application, this would open a signup modal or redirect to registration page.');
  });

  // ===== DESTINATIONS DATA AND RENDERING =====
  const destinations = [
    {
      title: 'Santorini, Greece',
      category: 'beach',
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      price: '$1,299',
      rating: 4.9,
      description: 'Stunning sunsets and white-washed architecture'
    },
    {
      title: 'Swiss Alps, Switzerland',
      category: 'mountains',
      img: 'https://images.unsplash.com/photo-1464822759844-d150ad6cbf17?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      price: '$1,599',
      rating: 4.9,
      description: 'Breathtaking alpine views and pristine slopes'
    },
    {
      title: 'Paris, France',
      category: 'city',
      img: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      price: '$899',
      rating: 4.8,
      description: 'The city of love, lights, and romance'
    },
    {
      title: 'Maldives',
      category: 'beach',
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      price: '$2,299',
      rating: 5.0,
      description: 'Crystal clear waters and luxury overwater bungalows'
    },
    {
      title: 'Iceland',
      category: 'adventure',
      img: 'https://images.unsplash.com/photo-1539066746042-8c4ae3af73fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      price: '$2,499',
      rating: 4.6,
      description: 'Northern lights and dramatic volcanic landscapes'
    },
    {
      title: 'Tokyo, Japan',
      category: 'city',
      img: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
      price: '$1,199',
      rating: 4.7,
      description: 'Modern metropolis meets ancient traditions'
    }
  ];

  const destGrid = document.getElementById('destGrid');

  function renderDestinations(destinationList) {
    const destGridEl = document.getElementById('destGrid');
    if (!destGridEl) {
      console.error('Destinations grid element not found!');
      return;
    }
    
    console.log('Rendering', destinationList.length, 'destinations');
    destGridEl.innerHTML = '';
    
    if (destinationList.length === 0) {
      destGridEl.innerHTML = '<p class="no-results">No destinations found matching your criteria.</p>';
      return;
    }
    
    destinationList.forEach(dest => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${dest.img}" alt="${dest.title}" loading="lazy" onerror="handleImageError(this)" />
        <div class="card-body">
          <h3>${dest.title}</h3>
          <p class="muted">${dest.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
            <div>
              <strong style="color: var(--accent-1); font-size: 1.1rem;">${dest.price}</strong>
              <div style="color: var(--muted); font-size: 0.9rem;">
                ⭐ ${dest.rating} • per person
              </div>
            </div>
            <div>
              <button class="btn outline small" style="margin-right: 0.5rem;" onclick="viewDestination('${dest.title}')">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn primary small book" data-title="${dest.title}">
                <i class="fas fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      `;
      destGridEl.appendChild(card);
    });
  }

  // Global function for destination viewing
  window.viewDestination = function(title) {
    alert(`Viewing details for ${title}. Full destination page coming soon!`);
  };

  // Enhanced initialization with DOM ready check
  function initializeContent() {
    console.log('🚀 Initializing NextTrip content...');
    
    // Initialize destinations
    const destGridEl = document.getElementById('destGrid');
    if (destGridEl) {
      console.log('✅ Destinations grid found, rendering destinations...');
      renderDestinations(destinations);
    } else {
      console.error('❌ Destinations grid element not found!');
    }
    
    // Initialize tours
    setTimeout(() => {
      console.log('🎯 Rendering tours...');
      renderTours();
    }, 50);
  }
  
  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContent);
  } else {
    initializeContent();
  }
  
  // Fallback initialization with longer timeout
  setTimeout(initializeContent, 500);

  // ===== DESTINATION FILTERING =====
  const filterChips = document.querySelectorAll('.filter-buttons .chip');
  
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Update active state
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      // Filter destinations
      const category = chip.dataset.category;
      const filteredDest = category === 'all' 
        ? destinations 
        : destinations.filter(d => d.category === category);
      
      renderDestinations(filteredDest);
    });
  });

  // ===== DESTINATION SEARCH =====
  const searchInput = document.getElementById('destSearch');
  searchInput && searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const filteredDest = destinations.filter(dest => 
      dest.title.toLowerCase().includes(query) ||
      dest.description.toLowerCase().includes(query)
    );
    renderDestinations(filteredDest);
  });

  // ===== TOURS DATA AND RENDERING =====
  const tours = [
    {
      title: 'Iceland Northern Lights & Glaciers',
      days: 7,
      price: '$2,499',
      img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=600&q=80',
      description: 'Witness the magical Aurora Borealis and explore ice caves'
    },
    {
      title: 'Japan Cultural Immersion',
      days: 10,
      price: '$3,299',
      img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=600&q=80',
      description: 'Traditional temples, modern cities, and authentic experiences'
    },
    {
      title: 'African Safari Adventure',
      days: 8,
      price: '$4,199',
      img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=600&q=80',
      description: 'Big Five wildlife encounters in pristine national parks'
    },
    {
      title: 'European Grand Tour',
      days: 14,
      price: '$2,899',
      img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=600&q=80',
      description: 'Historic cities, cultural landmarks, and culinary delights'
    }
  ];

  function renderTours() {
    const toursListEl = document.getElementById('toursList');
    
    if (!toursListEl) {
      console.error('Tours list element not found!');
      return;
    }
    
    console.log('Rendering', tours.length, 'tours');
    toursListEl.innerHTML = '';
    
    tours.forEach(tour => {
      const tourElement = document.createElement('div');
      tourElement.className = 'tour';
      tourElement.innerHTML = `
        <img src="${tour.img}" alt="${tour.title}" loading="lazy" onerror="handleImageError(this)">
        <div class="meta">
          <h4>${tour.title}</h4>
          <p class="muted">${tour.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
            <div class="price">${tour.price} / person</div>
            <div style="color: var(--muted); font-size: 0.9rem;">${tour.days} days</div>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <button class="btn outline small" onclick="viewTourDetails('${tour.title}')">
            <i class="fas fa-info-circle"></i> Details
          </button>
          <button class="btn primary small book" data-title="${tour.title}">
            <i class="fas fa-calendar-check"></i> Book Now
          </button>
        </div>
      `;
      toursListEl.appendChild(tourElement);
    });
  }
  
  // Render tours
  renderTours();

  // Global function for tour details
  window.viewTourDetails = function(title) {
    alert(`Viewing detailed itinerary for ${title}. Full tour page coming soon!`);
  };

  // ===== BOOKING MODAL SYSTEM =====
  const modal = document.getElementById('modal');
  const modalClose = document.querySelector('.modal-close');
  const modalTitle = document.getElementById('modalTitle');
  const bookForm = document.getElementById('bookForm');

  function openModal(itemTitle = '') {
    if (!modal) return;
    
    modal.removeAttribute('aria-hidden');
    modalTitle.textContent = itemTitle ? `Book ${itemTitle}` : 'Book Experience';
    
    // Focus first input
    const firstInput = bookForm.querySelector('input[name="name"]');
    setTimeout(() => firstInput && firstInput.focus(), 100);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    bookForm && bookForm.reset();
  }

  // Event delegation for booking buttons
  document.addEventListener('click', (e) => {
    if (e.target.closest('.book')) {
      const bookBtn = e.target.closest('.book');
      const title = bookBtn.dataset.title || 'Experience';
      openModal(title);
    }
    
    if (e.target === modal || e.target === modalClose) {
      closeModal();
    }
  });

  // ===== BOOKING FORM SUBMISSION =====
  bookForm && bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(bookForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const date = formData.get('date');

    // Basic validation
    if (!name || !email || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Date validation (must be future date)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('Please select a future date for your travel.');
      return;
    }

    // Simulate booking process
    const submitBtn = bookForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
      closeModal();
      alert(`🎉 Booking confirmed for ${name}!\n\nWe'll send confirmation details to ${email}.\nTravel date: ${new Date(date).toLocaleDateString()}\n\nThank you for choosing NextTrip!`);
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });

  // ===== SEARCH FORM SUBMISSION =====
  const searchForm = document.getElementById('searchForm');
  searchForm && searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(searchForm);
    const from = formData.get('from');
    const to = formData.get('to');
    const departure = formData.get('departure');
    const passengers = formData.get('passengers');

    if (!from || !to || !departure) {
      alert('Please fill in all required fields.');
      return;
    }

    // Get active tab for search type
    const activeTab = document.querySelector('.tab.active');
    const searchType = activeTab ? activeTab.dataset.target : 'flights';

    // Show search results
    const departureDate = new Date(departure).toLocaleDateString();
    alert(`🔍 Searching ${searchType}...\n\nFrom: ${from}\nTo: ${to}\nDeparture: ${departureDate}\nPassengers: ${passengers}\n\nRedirecting to results page...`);
  });

  // ===== HEADER CTA BUTTONS =====
  const getStartedBtn = document.getElementById('getStarted');
  const signInBtn = document.getElementById('signinBtn');
  const startAdventureBtn = document.getElementById('startAdventure');
  const watchStoryBtn = document.getElementById('watchStory');

  getStartedBtn && getStartedBtn.addEventListener('click', () => {
    document.getElementById('searchForm').scrollIntoView({ 
      behavior: 'smooth',
      block: 'center' 
    });
  });

  signInBtn && signInBtn.addEventListener('click', () => {
    alert('Sign In feature coming soon!\n\nFor now, you can book experiences without an account.');
  });

  startAdventureBtn && startAdventureBtn.addEventListener('click', () => {
    document.getElementById('destinations').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    });
  });

  watchStoryBtn && watchStoryBtn.addEventListener('click', () => {
    alert('🎬 NextTrip Story\n\nOur video story is coming soon!\nFor now, explore our amazing destinations below.');
  });

  // ===== SMOOTH SCROLLING FOR NAVIGATION =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        if (mobileNav && !mobileNav.hasAttribute('hidden')) {
          mobileNav.setAttribute('hidden', '');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  // ===== ACCESSIBILITY: ESC KEY SUPPORT =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      
      // Close mobile nav
      if (mobileNav && !mobileNav.hasAttribute('hidden')) {
        mobileNav.setAttribute('hidden', '');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // ===== AUTO-SET MINIMUM DATE =====
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(input => {
    input.min = today;
  });

  // ===== PERFORMANCE: LAZY LOADING =====
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    // Observe images with loading="lazy"
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  console.log('✈️ NextTrip initialized successfully!');
});

// Additional utility functions for better functionality
function validateSearchForm() {
    const destination = document.getElementById('destination') || document.querySelector('input[placeholder*="destination"]');
    const dates = document.getElementById('dates') || document.querySelector('input[type="date"]');
    const guests = document.getElementById('guests') || document.querySelector('select');
    
    let isValid = true;
    let messages = [];
    
    if (!destination || !destination.value.trim()) {
        messages.push('Please enter a destination');
        isValid = false;
    }
    
    if (!dates || !dates.value) {
        messages.push('Please select travel dates');
        isValid = false;
    }
    
    if (!guests || !guests.value || guests.value < 1) {
        messages.push('Please select number of guests');
        isValid = false;
    }
    
    if (!isValid) {
        alert(messages.join('\n'));
    }
    
    return isValid;
}

// Global image error handler
function setupImageErrorHandling() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.onerror) {
            img.onerror = function() {
                console.log('Image failed to load:', this.src);
                
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.innerHTML = '<i class="fas fa-image"></i>';
                fallback.style.width = (this.offsetWidth || 300) + 'px';
                fallback.style.height = (this.offsetHeight || 200) + 'px';
                
                if (this.parentNode) {
                    this.parentNode.insertBefore(fallback, this);
                    this.style.display = 'none';
                }
            };
        }
    });
}

// Initialize image error handling
document.addEventListener('DOMContentLoaded', setupImageErrorHandling);

// Make search form actually work
document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.querySelector('.search-btn') || document.querySelector('button[type="submit"]');
    const searchForm = document.querySelector('.search-form') || document.querySelector('form');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (validateSearchForm()) {
                const destination = (document.getElementById('destination') || document.querySelector('input[placeholder*="destination"]'))?.value || 'your destination';
                alert(`✈️ Searching for trips to ${destination}...`);
                console.log('Search initiated for:', destination);
            }
        });
    }
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateSearchForm()) {
                const destination = (document.getElementById('destination') || document.querySelector('input[placeholder*="destination"]'))?.value || 'your destination';
                alert(`✈️ Searching for trips to ${destination}...`);
                console.log('Form submitted for:', destination);
            }
        });
    }
    
    // Make all buttons work
    document.querySelectorAll('button').forEach(btn => {
        if (!btn.onclick && !btn.getAttribute('data-processed')) {
            btn.setAttribute('data-processed', 'true');
            
            if (btn.textContent.toLowerCase().includes('book')) {
                btn.onclick = () => alert('🎫 Booking functionality coming soon!');
            } else if (btn.textContent.toLowerCase().includes('view') || btn.textContent.toLowerCase().includes('explore')) {
                btn.onclick = () => alert('🔍 Detailed view coming soon!');
            } else if (btn.textContent.toLowerCase().includes('contact')) {
                btn.onclick = () => alert('📞 Contact: support@nexttrip.com');
            }
        }
    });
});