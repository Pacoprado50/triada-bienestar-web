// Triada Bienestar - JavaScript Mejorado
// =====================================

// Configuración global
const CONFIG = {
    whatsappNumber: '5214581019800',
    animationDuration: 300,
    scrollOffset: 80,
    debounceDelay: 10
};

// Utilidades
const Utils = {
    // Debounce function para optimizar eventos
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
    },

    // Throttle function para scroll events
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
    },

    // Smooth scroll mejorado
    smoothScrollTo(target, offset = CONFIG.scrollOffset) {
        const element = document.querySelector(target);
        if (element) {
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Generar mensaje de WhatsApp personalizado
    generateWhatsAppMessage(serviceName = '') {
        const baseMessage = 'Hola, me gustaría agendar una cita para un masaje';
        return serviceName 
            ? `${baseMessage} de ${serviceName}. ¿Podrían ayudarme con la información y disponibilidad?`
            : `${baseMessage}. ¿Podrían ayudarme con la información y disponibilidad?`;
    },

    // Detectar si es dispositivo móvil
    isMobile() {
        return window.innerWidth <= 768;
    },

    // Lazy loading para imágenes
    lazyLoadImage(img) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.classList.remove('lazy');
                        observer.unobserve(image);
                    }
                }
            });
        });
        imageObserver.observe(img);
    }
};

// Navegación móvil mejorada
class MobileNavigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-menu a');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggle());
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.close());
            });
            
            // Cerrar menú al hacer click fuera
            document.addEventListener('click', (e) => {
                if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                    this.close();
                }
            });

            // Cerrar menú con tecla Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.hamburger.classList.add('active');
        this.navMenu.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    close() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = ''; // Restaurar scroll
    }
}

// Header con efectos de scroll
class HeaderEffects {
    constructor() {
        this.header = document.querySelector('.header');
        this.lastScrollY = window.scrollY;
        
        this.init();
    }

    init() {
        if (this.header) {
            const throttledScroll = Utils.throttle(() => this.handleScroll(), 16);
            window.addEventListener('scroll', throttledScroll);
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Agregar clase 'scrolled' cuando se hace scroll
        if (currentScrollY > 100) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }

        this.lastScrollY = currentScrollY;
    }
}

// Animaciones de elementos al entrar en viewport
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );

        // Observar elementos para animación
        const animatedElements = document.querySelectorAll(
            '.service-card, .contact-card, .social-link, .location-image, .section-header'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('loading');
            this.observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                // Dejar de observar el elemento una vez animado
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// Gestión de servicios
class ServiceManager {
    constructor() {
        this.serviceCards = document.querySelectorAll('.service-card');
        this.init();
    }

    init() {
        this.serviceCards.forEach(card => {
            // Efecto hover mejorado
            card.addEventListener('mouseenter', () => this.handleHover(card, true));
            card.addEventListener('mouseleave', () => this.handleHover(card, false));
            
            // Click para WhatsApp
            card.addEventListener('click', () => this.handleServiceClick(card));
            
            // Accesibilidad con teclado
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleServiceClick(card);
                }
            });
        });
    }

    handleHover(card, isHovering) {
        const overlay = card.querySelector('.service-overlay');
        if (overlay) {
            overlay.style.opacity = isHovering ? '1' : '0';
        }
    }

    handleServiceClick(card) {
        const serviceName = card.querySelector('h3')?.textContent || '';
        const message = Utils.generateWhatsAppMessage(serviceName);
        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Efecto visual de click
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Abrir WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Analytics (si se implementa)
        this.trackServiceClick(serviceName);
    }

    trackServiceClick(serviceName) {
        console.log(`Servicio clickeado: ${serviceName}`);
        // Aquí se puede agregar tracking de analytics
    }
}

// Navegación suave mejorada
class SmoothNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.scrollIndicator = document.querySelector('.hero-scroll-indicator');
        
        this.init();
    }

    init() {
        // Enlaces de navegación
        this.navLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleNavClick(e, anchor));
        });

        // Indicador de scroll en hero
        if (this.scrollIndicator) {
            this.scrollIndicator.addEventListener('click', () => {
                Utils.smoothScrollTo('#servicios');
            });
        }
    }

    handleNavClick(e, anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        
        if (targetId && targetId !== '#') {
            Utils.smoothScrollTo(targetId);
            
            // Cerrar menú móvil si está abierto
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.querySelector('.hamburger')?.classList.remove('active');
            }
        }
    }
}

// Gestión de enlaces externos
class ExternalLinksManager {
    constructor() {
        this.externalLinks = document.querySelectorAll('a[target="_blank"]');
        this.whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        this.socialLinks = document.querySelectorAll('.social-link');
        
        this.init();
    }

    init() {
        // Enlaces externos con efecto de loading
        this.externalLinks.forEach(link => {
            link.addEventListener('click', () => this.handleExternalClick(link));
        });

        // Enlaces de WhatsApp con tracking
        this.whatsappLinks.forEach(link => {
            link.addEventListener('click', () => this.trackWhatsAppClick());
        });

        // Enlaces sociales con tracking
        this.socialLinks.forEach(link => {
            link.addEventListener('click', () => this.trackSocialClick(link));
        });
    }

    handleExternalClick(link) {
        // Efecto visual de loading
        const originalOpacity = link.style.opacity;
        link.style.opacity = '0.7';
        
        setTimeout(() => {
            link.style.opacity = originalOpacity;
        }, 1000);
    }

    trackWhatsAppClick() {
        console.log('WhatsApp link clicked');
        // Analytics tracking
    }

    trackSocialClick(link) {
        const platform = link.classList.contains('facebook') ? 'Facebook' : 
                         link.classList.contains('instagram') ? 'Instagram' : 'Google Maps';
        console.log(`${platform} link clicked`);
        // Analytics tracking
    }
}

// Efectos visuales avanzados
class VisualEffects {
    constructor() {
        this.init();
    }

    init() {
        this.initParallaxEffects();
        this.initHoverEffects();
        this.initLoadingStates();
    }

    initParallaxEffects() {
        // Efecto parallax sutil para elementos decorativos
        const decorativeElements = document.querySelectorAll('.decoration-circle, .decoration-triangle');
        
        if (decorativeElements.length > 0) {
            const handleParallax = Utils.throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                decorativeElements.forEach(element => {
                    element.style.transform = `translateY(${rate}px)`;
                });
            }, 16);

            window.addEventListener('scroll', handleParallax);
        }
    }

    initHoverEffects() {
        // Efectos hover para tarjetas
        const cards = document.querySelectorAll('.service-card, .contact-card, .location-image');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    initLoadingStates() {
        // Estados de carga para elementos
        const loadingElements = document.querySelectorAll('.loading');
        
        // Agregar delay escalonado para animaciones
        loadingElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('loaded');
            }, index * 100);
        });
    }
}

// Optimizaciones de rendimiento
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.preloadCriticalResources();
        this.setupIntersectionObserver();
    }

    optimizeImages() {
        // Lazy loading para imágenes
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => Utils.lazyLoadImage(img));

        // Optimizar imágenes existentes
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            img.loading = 'lazy';
        });
    }

    preloadCriticalResources() {
        // Precargar recursos críticos
        const criticalImages = [
            'images/logo_triada.png',
            'images/imagen_masajes_profesionales_nueva.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    setupIntersectionObserver() {
        // Observer para elementos que requieren carga diferida
        const lazyElements = document.querySelectorAll('.lazy-load');
        
        if (lazyElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('loaded');
                        observer.unobserve(entry.target);
                    }
                });
            });

            lazyElements.forEach(el => observer.observe(el));
        }
    }
}

// Gestión de errores y fallbacks
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        // Manejo de errores de imágenes
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('error', () => this.handleImageError(img));
        });

        // Manejo de errores globales
        window.addEventListener('error', (e) => this.handleGlobalError(e));
    }

    handleImageError(img) {
        console.warn(`Error loading image: ${img.src}`);
        img.style.display = 'none';
    }

    handleGlobalError(error) {
        console.error('Global error:', error);
        // Aquí se puede implementar reporting de errores
    }
}

// Inicialización principal
class TriadaBienestarApp {
    constructor() {
        this.components = [];
        this.init();
    }

    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        try {
            // Inicializar todos los componentes
            this.components = [
                new MobileNavigation(),
                new HeaderEffects(),
                new ScrollAnimations(),
                new ServiceManager(),
                new SmoothNavigation(),
                new ExternalLinksManager(),
                new VisualEffects(),
                new PerformanceOptimizer(),
                new ErrorHandler()
            ];

            console.log('Triada Bienestar website initialized successfully');
            this.setupAccessibility();
            this.setupAnalytics();
            
        } catch (error) {
            console.error('Error initializing Triada Bienestar app:', error);
        }
    }

    setupAccessibility() {
        // Mejorar accesibilidad
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--primary-color)';
                element.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }

    setupAnalytics() {
        // Configurar analytics básico
        const trackPageView = () => {
            console.log('Page view tracked');
            // Implementar tracking real aquí
        };

        const trackUserInteraction = (action, element) => {
            console.log(`User interaction: ${action} on ${element}`);
            // Implementar tracking real aquí
        };

        // Track page view
        trackPageView();

        // Track scroll depth
        let maxScrollDepth = 0;
        const trackScrollDepth = Utils.throttle(() => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                if (scrollDepth % 25 === 0) {
                    console.log(`Scroll depth: ${scrollDepth}%`);
                }
            }
        }, 1000);

        window.addEventListener('scroll', trackScrollDepth);
    }
}

// Inicializar la aplicación
const app = new TriadaBienestarApp();

// Exportar para uso global si es necesario
window.TriadaBienestar = {
    app,
    utils: Utils,
    config: CONFIG
};

// Service Worker registration (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-NNR778R8HX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-NNR778R8HX');
</script>

