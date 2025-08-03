// Eden Royal Prints and Color Solutions - Main JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeGallery();
    initializeForms();
    initializeAnimations();
    initializeScrollEffects();
    initializeWhatsApp();
});

// Mobile Navigation
function initializeNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    }

    // Active navigation highlighting
    updateActiveNavigation();
    window.addEventListener('hashchange', updateActiveNavigation);
}

function updateActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Gallery Lightbox
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.modal-close');

    if (galleryItems.length > 0 && modal && modalImg) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = item.querySelector('img');
                if (img) {
                    modalImg.src = img.src;
                    modalImg.alt = img.alt;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close modal events
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Form Validation and Handling
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    const orderForm = document.getElementById('order-form');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderForm);
    }

    // Real-time validation
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function handleContactForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    if (validateContactForm(form)) {
        showLoading(form);
        
        // Simulate form submission (replace with actual endpoint)
        fetch('php/contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoading(form);
            if (data.success) {
                showSuccessMessage('Thank you! Your message has been sent successfully.');
                form.reset();
            } else {
                showErrorMessage('Sorry, there was an error sending your message. Please try again.');
            }
        })
        .catch(error => {
            hideLoading(form);
            showErrorMessage('Sorry, there was an error sending your message. Please try again.');
        });
    }
}

function handleOrderForm(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    if (validateOrderForm(form)) {
        showLoading(form);
        
        // Simulate form submission (replace with actual endpoint)
        fetch('php/order.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoading(form);
            if (data.success) {
                showSuccessMessage('Thank you! Your order has been submitted successfully. We will contact you soon.');
                form.reset();
            } else {
                showErrorMessage('Sorry, there was an error submitting your order. Please try again.');
            }
        })
        .catch(error => {
            hideLoading(form);
            showErrorMessage('Sorry, there was an error submitting your order. Please try again.');
        });
    }
}

function validateContactForm(form) {
    let isValid = true;
    
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const subject = form.querySelector('[name="subject"]');
    const message = form.querySelector('[name="message"]');
    
    if (!validateRequired(name, 'Name is required')) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validateRequired(subject, 'Subject is required')) isValid = false;
    if (!validateRequired(message, 'Message is required')) isValid = false;
    
    return isValid;
}

function validateOrderForm(form) {
    let isValid = true;
    
    const name = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const phone = form.querySelector('[name="phone"]');
    const service = form.querySelector('[name="service"]');
    const description = form.querySelector('[name="description"]');
    
    if (!validateRequired(name, 'Name is required')) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (!validateRequired(phone, 'Phone number is required')) isValid = false;
    if (!validateRequired(service, 'Please select a service')) isValid = false;
    if (!validateRequired(description, 'Please describe your requirements')) isValid = false;
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const fieldType = field.type;
    const fieldName = field.name;
    
    if (fieldType === 'email') {
        validateEmail(field);
    } else if (field.hasAttribute('required')) {
        validateRequired(field, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
    }
}

function validateRequired(field, message) {
    if (!field || !field.value.trim()) {
        showFieldError(field, message);
        return false;
    }
    clearFieldError(field);
    return true;
}

function validateEmail(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!field || !field.value.trim()) {
        showFieldError(field, 'Email is required');
        return false;
    }
    
    if (!emailRegex.test(field.value.trim())) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#ef4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    if (typeof field === 'object' && field.target) {
        field = field.target;
    }
    
    field.style.borderColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showLoading(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    }
}

function hideLoading(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = submitBtn.dataset.originalText || 'Send Message';
    }
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#10b981';
    } else {
        notification.style.background = '#ef4444';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Scroll Effects and Animations
function initializeAnimations() {
    // Fade in animation for elements
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(2rem)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

function initializeScrollEffects() {
    // Header background on scroll
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'var(--white)';
                header.style.backdropFilter = 'none';
            }
        });
    }
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// WhatsApp Integration
function initializeWhatsApp() {
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const phoneNumber = this.dataset.phone || '254700000000'; // Replace with actual number
            const message = encodeURIComponent('Hello! I would like to inquire about your services.');
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
}

// Utility Functions
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

// Performance optimization for scroll events
const debouncedScrollHandler = debounce(function() {
    // Handle scroll events here if needed
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Preload images for better performance
function preloadImages() {
    const images = [
        'assets/gallery/sample1.jpg',
        'assets/gallery/sample2.jpg',
        'assets/gallery/sample3.jpg'
        // Add more image paths as needed
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading when page loads
window.addEventListener('load', preloadImages);

// Export functions for use in other scripts if needed
window.EdenRoyalPrints = {
    showNotification,
    showSuccessMessage,
    showErrorMessage,
    validateEmail,
    validateRequired
};