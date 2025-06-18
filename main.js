// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.service-card, .gallery-item, .team-member, .info-item');
    
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Image lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        
        // If image is already loaded
        if (img.complete) {
            img.classList.add('loaded');
        }
    });
});

// Form submission handling
const appointmentForm = document.getElementById('appointmentForm');

appointmentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(appointmentForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Simple form validation
    if (!formObject.name || !formObject.email || !formObject.phone || !formObject.service) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formObject.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formObject.phone.replace(/\D/g, ''))) {
        showNotification('Please enter a valid phone number.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = appointmentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('Thank you! Your appointment request has been submitted. We will contact you soon.', 'success');
        appointmentForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Enhanced notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${type === 'success' ? '✓' : '⚠'}
            </div>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '20px 25px',
        borderRadius: '12px',
        color: 'white',
        zIndex: '10000',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(400px)',
        transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        maxWidth: '400px',
        fontSize: '1rem',
        fontWeight: '500'
    };
    
    Object.assign(notification.style, styles);
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
    }
    
    // Add internal styles for notification content
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .notification-icon {
            font-size: 1.2rem;
            font-weight: bold;
        }
        .notification-message {
            flex: 1;
            line-height: 1.4;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            margin-left: 10px;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(notificationStyle);
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    const closeButton = notification.querySelector('.notification-close');
    const closeNotification = () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            if (notificationStyle.parentNode) {
                notificationStyle.remove();
            }
        }, 400);
    };
    
    closeButton.addEventListener('click', closeNotification);
    
    // Auto remove after 5 seconds
    setTimeout(closeNotification, 5000);
}

// Service card interactions
document.querySelectorAll('.service-card .btn-outline').forEach(button => {
    button.addEventListener('click', (e) => {
        const serviceCard = e.target.closest('.service-card');
        const serviceName = serviceCard.querySelector('h3').textContent;
        
        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        const offsetTop = contactSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Pre-fill service selection
        setTimeout(() => {
            const serviceSelect = document.getElementById('service');
            const serviceValue = serviceName.toLowerCase().includes('general') ? 'general' :
                                serviceName.toLowerCase().includes('cosmetic') ? 'cosmetic' :
                                serviceName.toLowerCase().includes('restorative') ? 'general' :
                                serviceName.toLowerCase().includes('pediatric') ? 'general' : '';
            
            if (serviceValue) {
                serviceSelect.value = serviceValue;
                serviceSelect.focus();
            }
        }, 800);
    });
});

// Hero buttons functionality
document.querySelectorAll('.hero-buttons .btn-primary').forEach(button => {
    button.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        const offsetTop = contactSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    });
});

document.querySelectorAll('.hero-buttons .btn-secondary').forEach(button => {
    button.addEventListener('click', () => {
        const servicesSection = document.getElementById('services');
        const offsetTop = servicesSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    });
});

// Gallery image hover effects with enhanced animations
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
        item.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
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
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage && scrolled < window.innerHeight) {
        const rate = scrolled * -0.5;
        heroImage.style.transform = `translateY(${rate}px) scale(1.02)`;
    }
});

// Enhanced form interactions
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
    field.addEventListener('focus', () => {
        field.parentElement.style.transform = 'translateY(-2px)';
        field.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    field.addEventListener('blur', () => {
        field.parentElement.style.transform = 'translateY(0)';
    });
});

// Add loading states to buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('click', function() {
        if (this.type !== 'submit') {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        }
    });
});

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    // Navbar background change
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
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
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

console.log('SmileCare Dental Clinic website loaded successfully! 🦷✨');