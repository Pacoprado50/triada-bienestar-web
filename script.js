// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header Background on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .contact-item, .social-link, .location-image');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
});

// Service Cards Hover Effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// WhatsApp Button Click Tracking
document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function() {
        // You can add analytics tracking here
        console.log('WhatsApp link clicked');
    });
});

// Social Media Links Click Tracking
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function() {
        const platform = this.classList.contains('facebook') ? 'Facebook' : 
                         this.classList.contains('instagram') ? 'Instagram' : 'Google Maps';
        console.log(`${platform} link clicked`);
    });
});

// Form Validation (if needed for future contact forms)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Lazy Loading for Images
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

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Service Card Click to WhatsApp
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        const serviceName = this.querySelector('h3').textContent;
        const whatsappUrl = `https://wa.me/5214581019800?text=Hola,%20me%20interesa%20el%20servicio%20de%20${encodeURIComponent(serviceName)}`;
        window.open(whatsappUrl, '_blank');
    });
});

// Add loading states for external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        this.style.opacity = '0.7';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 1000);
    });
});

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Performance Optimization: Debounce Scroll Events
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

// Apply debounce to scroll events
const debouncedScrollHandler = debounce(function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add touch support for mobile devices
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could trigger some action
            console.log('Swiped up');
        } else {
            // Swipe down - could trigger some action
            console.log('Swiped down');
        }
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Triada Bienestar website loaded successfully');
    
    // Add any initialization code here
    const loadingElements = document.querySelectorAll('.loading');
    setTimeout(() => {
        loadingElements.forEach(el => {
            el.classList.add('loaded');
        });
    }, 100);
});


