/**
 * PORTFOLIO WEBSITE JAVASCRIPT
 * Author: Alex Rivera
 * Description: Interactive functionality for portfolio website
 * Features: Navigation, form validation, animations, and user interactions
 */

// Wait for DOM to be fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeAnimations();
    initializeSkillBars();
    initializeFAQ();
    initializeContactForm();
    initializeScrollEffects();
    
    console.log('Portfolio website loaded successfully!');
});

/**
 * NAVIGATION FUNCTIONALITY
 * Handles mobile menu toggle and active states
 */
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down - hide header
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up - show header
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * SKILL BAR ANIMATIONS
 * Animates skill progress bars when they come into view
 */
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress, .level-bar');
    
    const animateSkillBar = (bar) => {
        const width = bar.getAttribute('data-width') || bar.getAttribute('data-level');
        if (width) {
            bar.style.width = width + '%';
        }
    };
    
    // Intersection Observer for skill bars
    const skillBarObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBar(entry.target);
                skillBarObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    skillBars.forEach(bar => {
        skillBarObserver.observe(bar);
    });
}

/**
 * SCROLL-TRIGGERED ANIMATIONS
 * Adds fade-in and slide-up animations as elements come into view
 */
function initializeAnimations() {
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .timeline-item, .faq-item');
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                animationObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        animationObserver.observe(element);
    });
}

/**
 * FAQ FUNCTIONALITY
 * Handles expanding/collapsing FAQ items
 */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // Open clicked item if it wasn't already active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/**
 * CONTACT FORM FUNCTIONALITY
 * Handles form validation and submission
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    const submitButton = contactForm.querySelector('#submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    /**
     * Validates individual form field
     */
    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Clear previous error state
        clearError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${getFieldLabel(fieldName)} is required.`;
        }
        
        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }
        
        // Name validation
        if (fieldName === 'name' && value) {
            if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long.';
            }
        }
        
        // Message validation
        if (fieldName === 'message' && value) {
            if (value.length < 10) {
                isValid = false;
                errorMessage = 'Please provide more details about your project (minimum 10 characters).';
            }
        }
        
        if (!isValid) {
            showError(field, errorMessage);
        }
        
        return isValid;
    }
    
    /**
     * Validates entire form
     */
    function validateForm() {
        let isFormValid = true;
        const requiredFields = contactForm.querySelectorAll('input[required], textarea[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    /**
     * Shows error message for field
     */
    function showError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    /**
     * Clears error state for field
     */
    function clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    /**
     * Gets user-friendly field label
     */
    function getFieldLabel(fieldName) {
        const labels = {
            'name': 'Full Name',
            'email': 'Email Address',
            'message': 'Project Details'
        };
        return labels[fieldName] || fieldName;
    }
    
    /**
     * Simulates form submission
     */
    function submitForm() {
        // Show loading state
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitButton.disabled = false;
            
            // Log form data (in real implementation, this would be sent to server)
            console.log('Form submission successful:', {
                name: contactForm.name.value,
                email: contactForm.email.value,
                company: contactForm.company.value,
                project: contactForm.project.value,
                budget: contactForm.budget.value,
                timeline: contactForm.timeline.value,
                message: contactForm.message.value,
                newsletter: contactForm.newsletter.checked
            });
            
        }, 2000);
    }
}

/**
 * SCROLL EFFECTS
 * Handles various scroll-based interactions
 */
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Parallax effect for hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection && scrolled < window.innerHeight) {
            heroSection.style.transform = `translateY(${rate}px)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
    
    // Add scroll progress indicator
    createScrollProgress();
}

/**
 * Creates a scroll progress indicator
 */
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

/**
 * UTILITY FUNCTIONS
 */

/**
 * Resets the contact form (called from success message)
 */
function resetForm() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm && successMessage) {
        contactForm.reset();
        contactForm.style.display = 'block';
        successMessage.style.display = 'none';
        
        // Clear any error states
        const errorMessages = contactForm.querySelectorAll('.error-message');
        const errorFields = contactForm.querySelectorAll('.error');
        
        errorMessages.forEach(msg => {
            msg.textContent = '';
            msg.classList.remove('show');
        });
        
        errorFields.forEach(field => {
            field.classList.remove('error');
        });
    }
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
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

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
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

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Smooth scroll to element
 */
function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

/**
 * PERFORMANCE OPTIMIZATIONS
 */

// Lazy load images when they come into view
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * ACCESSIBILITY ENHANCEMENTS
 */

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Enter key activates FAQ items
    if (e.key === 'Enter' && e.target.classList.contains('faq-question')) {
        e.target.click();
    }
});

// Focus management for better keyboard navigation
function manageFocus() {
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.classList.add('keyboard-focus');
        });
        
        element.addEventListener('blur', function() {
            this.classList.remove('keyboard-focus');
        });
    });
}

// Initialize focus management
manageFocus();

/**
 * PROGRESSIVE ENHANCEMENT
 * Ensures functionality works even with JavaScript disabled
 */

// Add 'js-enabled' class to body for CSS targeting
document.body.classList.add('js-enabled');

// Fallback for non-JS users
const noJsElements = document.querySelectorAll('.no-js-hidden');
noJsElements.forEach(element => {
    element.classList.remove('no-js-hidden');
});

/**
 * ERROR HANDLING AND LOGGING
 */

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript error occurred:', e.error);
    
    // In production, you might want to send this to an error tracking service
    // trackError(e.error);
});

// Console welcome message for developers
console.log(`
🎨 Portfolio Website by Alex Rivera
📧 Contact: alex.rivera@email.com
🔧 Built with: HTML5, CSS3, Vanilla JavaScript
⚡ Features: Responsive Design, Form Validation, Smooth Animations
🚀 Performance Optimized with Intersection Observer API

Thanks for checking out my code! 
Feel free to reach out if you have any questions.
`);

/**
 * ANIMATION TIMING ADJUSTMENTS
 * Respects user's motion preferences
 */
function respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable smooth scrolling for users who prefer reduced motion
        document.documentElement.style.scrollBehavior = 'auto';
        
        // Reduce animation durations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize motion preferences
respectMotionPreferences();

/**
 * THEME MANAGEMENT (Optional Enhancement)
 * Detects and respects user's color scheme preference
 */
function initializeTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function updateTheme(e) {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }
    
    // Set initial theme
    updateTheme(prefersDark);
    
    // Listen for changes
    prefersDark.addEventListener('change', updateTheme);
}

// Initialize theme management
initializeTheme();

/**
 * FORM ENHANCEMENT FEATURES
 */
function enhanceFormExperience() {
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on page load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Auto-resize textarea
    const textareas = document.querySelectorAll('.form-textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
}

// Initialize form enhancements
enhanceFormExperience();

/**
 * PERFORMANCE MONITORING
 */
function monitorPerformance() {
    // Log page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Track Core Web Vitals if supported
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            }).observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Cumulative Layout Shift
            new PerformanceObserver((entryList) => {
                let clsValue = 0;
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    });
}

// Initialize performance monitoring
monitorPerformance();

/**
 * SERVICE WORKER REGISTRATION (Optional PWA Feature)
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed');
                });
        });
    }
}

// Uncomment to enable service worker
// registerServiceWorker();

/**
 * FINAL INITIALIZATION
 * Ensures all components are properly initialized
 */
function finalizeInitialization() {
    // Add loaded class to body for CSS animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Log successful initialization
    console.log('✅ All portfolio features initialized successfully!');
    
    // Dispatch custom event for other scripts
    const initEvent = new CustomEvent('portfolioInitialized', {
        detail: {
            timestamp: Date.now(),
            features: [
                'navigation',
                'animations', 
                'skillBars',
                'FAQ',
                'contactForm',
                'scrollEffects',
                'accessibility',
                'performance'
            ]
        }
    });
    
    document.dispatchEvent(initEvent);
}

// Run final initialization
finalizeInitialization();