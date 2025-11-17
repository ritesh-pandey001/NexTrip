// ========================================
//   ANIMATIONS CONTROLLER
// ========================================

class AnimationController {
    constructor() {
        this.init();
    }

    init() {
        this.initScrollAnimations();
        this.initCounterAnimations();
        this.initTypingAnimations();
        this.initParticleEffects();
        this.initFloatingElements();
        this.initInteractiveHovers();
    }

    // ========================================
    //   SCROLL ANIMATIONS
    // ========================================

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ========================================
    //   COUNTER ANIMATIONS
    // ========================================

    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number, .counter');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    this.animateCounter(entry.target);
                    entry.target.dataset.counted = 'true';
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(element) {
        const target = this.extractNumber(element.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            element.textContent = this.formatCounterValue(current, element.textContent);
        }, 16);
    }

    extractNumber(text) {
        const match = text.match(/[\d,]+/);
        return match ? parseInt(match[0].replace(/,/g, '')) : 0;
    }

    formatCounterValue(value, originalText) {
        const formattedNumber = Math.floor(value).toLocaleString();
        
        if (originalText.includes('%')) {
            return formattedNumber + '%';
        } else if (originalText.includes('+')) {
            return formattedNumber + '+';
        } else if (originalText.includes('K')) {
            return Math.floor(value / 1000) + 'K+';
        }
        
        return formattedNumber;
    }

    // ========================================
    //   TYPING ANIMATIONS
    // ========================================

    initTypingAnimations() {
        const typingElements = document.querySelectorAll('.typing-effect');
        
        typingElements.forEach(element => {
            this.createTypingEffect(element);
        });
    }

    createTypingEffect(element) {
        const text = element.dataset.text || element.textContent;
        const speed = parseInt(element.dataset.speed) || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid var(--color-primary)';
        
        let index = 0;
        const timer = setInterval(() => {
            element.textContent += text[index];
            index++;
            
            if (index >= text.length) {
                clearInterval(timer);
                // Add blinking cursor animation
                setInterval(() => {
                    element.style.borderColor = element.style.borderColor === 'transparent' 
                        ? 'var(--color-primary)' 
                        : 'transparent';
                }, 500);
            }
        }, speed);
    }

    // ========================================
    //   PARTICLE EFFECTS
    // ========================================

    initParticleEffects() {
        const particleContainers = document.querySelectorAll('.particle-bg');
        
        particleContainers.forEach(container => {
            this.createParticles(container);
        });
    }

    createParticles(container) {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and animation duration
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = 10 + Math.random() * 20;
            const delay = Math.random() * 20;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 2px;
                height: 2px;
                background: rgba(37, 99, 235, 0.3);
                border-radius: 50%;
                animation: float ${duration}s ${delay}s infinite ease-in-out;
            `;
            
            container.appendChild(particle);
        }
    }

    // ========================================
    //   FLOATING ELEMENTS
    // ========================================

    initFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating');
        
        floatingElements.forEach((element, index) => {
            const delay = index * 0.2;
            const duration = 3 + Math.random() * 2;
            
            element.style.animation = `float ${duration}s ${delay}s infinite ease-in-out`;
        });
    }

    // ========================================
    //   INTERACTIVE HOVER EFFECTS
    // ========================================

    initInteractiveHovers() {
        const hoverCards = document.querySelectorAll('.interactive-card');
        
        hoverCards.forEach(card => {
            this.addInteractiveHover(card);
        });
    }

    addInteractiveHover(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    }

    // ========================================
    //   PARALLAX EFFECTS
    // ========================================

    initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;

        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = scrolled * (parseFloat(element.dataset.speed) || -0.5);
                const yPos = -(rate / 10);
                element.style.transform = `translateY(${yPos}px)`;
            });
        };

        window.addEventListener('scroll', this.throttle(handleScroll, 10));
    }

    // ========================================
    //   MORPHING SHAPES
    // ========================================

    initMorphingShapes() {
        const morphingElements = document.querySelectorAll('.morphing-shape');
        
        morphingElements.forEach(element => {
            this.createMorphingAnimation(element);
        });
    }

    createMorphingAnimation(element) {
        const shapes = [
            'M20,100 Q50,50 80,100 Q50,150 20,100',
            'M20,100 Q80,60 120,100 Q80,140 20,100',
            'M20,100 Q50,20 80,100 Q110,180 20,100'
        ];
        
        let currentShape = 0;
        
        setInterval(() => {
            const path = element.querySelector('path');
            if (path) {
                currentShape = (currentShape + 1) % shapes.length;
                path.style.d = shapes[currentShape];
            }
        }, 3000);
    }

    // ========================================
    //   STAGGER ANIMATIONS
    // ========================================

    initStaggerAnimations() {
        const staggerGroups = document.querySelectorAll('.stagger-animate');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateStagger(entry.target);
                }
            });
        }, { threshold: 0.2 });

        staggerGroups.forEach(group => {
            observer.observe(group);
        });
    }

    animateStagger(group) {
        const items = group.children;
        const delay = parseInt(group.dataset.staggerDelay) || 100;
        
        Array.from(items).forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-fadeInUp');
            }, index * delay);
        });
    }

    // ========================================
    //   MAGNETIC CURSOR EFFECT
    // ========================================

    initMagneticCursor() {
        const magneticElements = document.querySelectorAll('.magnetic');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const strength = 0.3;
                element.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });

            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px)';
            });
        });
    }

    // ========================================
    //   LIQUID BUTTON EFFECT
    // ========================================

    initLiquidButtons() {
        const liquidButtons = document.querySelectorAll('.liquid-btn');
        
        liquidButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'liquid-ripple';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // ========================================
    //   UTILITIES
    // ========================================

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

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    easeOutBounce(t) {
        if (t < (1 / 2.75)) {
            return 7.5625 * t * t;
        } else if (t < (2 / 2.75)) {
            return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
        } else if (t < (2.5 / 2.75)) {
            return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
        } else {
            return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
        }
    }

    // ========================================
    //   GSAP INTEGRATION (if available)
    // ========================================

    initGSAPAnimations() {
        if (typeof gsap === 'undefined') return;

        // Hero animation
        gsap.timeline()
            .from('.hero-title', { duration: 1, y: 100, opacity: 0, ease: 'power3.out' })
            .from('.hero-description', { duration: 0.8, y: 50, opacity: 0, ease: 'power2.out' }, '-=0.5')
            .from('.hero-actions .btn', { duration: 0.6, y: 30, opacity: 0, stagger: 0.2, ease: 'back.out(1.7)' }, '-=0.3');

        // Card animations
        gsap.from('.feature-card', {
            duration: 0.8,
            y: 100,
            opacity: 0,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.features',
                start: 'top 80%'
            }
        });

        // Destination cards
        gsap.from('.destination-card', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: '.destinations',
                start: 'top 70%'
            }
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationController();
});

// Export for use in other files
window.AnimationController = AnimationController;