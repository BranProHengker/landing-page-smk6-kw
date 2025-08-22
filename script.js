const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const contactForm = document.getElementById("contact-form");
const toast = document.getElementById("toast");
const loadingScreen = document.getElementById("loading-screen");

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    setupScrollAnimations();
    setupParallaxEffects();
    setupSkillCardAnimations();
});

// Initialize all features
function initializeWebsite() {
    // Hide loading screen after page loads
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);

    // Setup navigation
    setupNavigation();
    
    // Setup form handling
    setupContactForm();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    console.log("SMKN6 Malang website initialized successfully!");
}

// Navigation functionality
function setupNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener("click", toggleMobileMenu);
    
    // Close mobile menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });
    
    // Navbar scroll effect
    window.addEventListener("scroll", handleNavbarScroll);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
    
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = navMenu.classList.contains("active") ? 'hidden' : '';
}

function closeMobileMenu() {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    document.body.style.overflow = '';
}

function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
    
    // Update active nav link based on current section
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
        
        if (scrollPos >= top && scrollPos <= bottom) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Smooth scrolling functionality
function setupSmoothScrolling() {
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
                
                // Close mobile menu if open
                closeMobileMenu();
            }
        });
    });
}

// Contact form functionality
function setupContactForm() {
    contactForm.addEventListener("submit", handleFormSubmission);
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    const message = formData.get("message").trim();
    
    // Validate form
    if (!validateForm(name, email, message)) {
        return;
    }
    
    // Simulate form submission with loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalHTML = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
        
        // Show success message
        showToast("Message sent successfully! We'll get back to you soon.");
        
        // Reset form
        contactForm.reset();
        
        // Add success animation to form
        contactForm.style.transform = 'scale(0.98)';
        setTimeout(() => {
            contactForm.style.transform = 'scale(1)';
        }, 150);
        
    }, 2000);
}

function validateForm(name, email, message) {
    // Basic validation
    if (!name || !email || !message) {
        showToast("Please fill in all fields", "error");
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast("Please enter a valid email address", "error");
        return false;
    }
    
    // Message length validation
    if (message.length < 10) {
        showToast("Message must be at least 10 characters long", "error");
        return false;
    }
    
    return true;
}

// Toast notification system
function showToast(message, type = "success") {
    const toastContent = toast.querySelector('.toast-content');
    const icon = type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle";
    const iconColor = type === "success" ? "#059669" : "#ef4444";
    
    toastContent.innerHTML = `
        <i class="${icon}" style="color: ${iconColor}"></i>
        <span>${message}</span>
    `;
    
    // Show toast
    toast.classList.add('show');
    
    // Hide toast after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Scroll animations
function setupScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for skill cards
                if (entry.target.classList.contains('skills-grid')) {
                    animateSkillCards(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(`
        .card, 
        .skill-card, 
        .contact-item, 
        .hero-text,
        .hero-image,
        .profile-text,
        .profile-image,
        .skills-header,
        .skills-grid
    `);
    
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Skill cards animation
function animateSkillCards(skillsGrid) {
    const skillCards = skillsGrid.querySelectorAll('.skill-card');
    
    skillCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function setupSkillCardAnimations() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        // Initially hide cards
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Parallax effects
function setupParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-shapes .shape');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// Advanced scroll effects
window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset;
    
    // Hero parallax effect
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.transform = `translateY(${scrollTop * 0.5}px)`;
    }
    
    // Floating shapes animation
    const shapes = document.querySelectorAll('.floating-shapes .shape');
    shapes.forEach((shape, index) => {
        const speed = 0.3 + (index * 0.1);
        const rotation = scrollTop * 0.05;
        shape.style.transform = `translateY(${scrollTop * speed}px) rotate(${rotation}deg)`;
    });
});

// Enhanced form interactions
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Add CSS for focused state
const style = document.createElement('style');
style.textContent = `
    .form-group.focused label {
        color: var(--primary);
        transform: translateY(-2px);
        transition: all 0.2s ease;
    }
`;
document.head.appendChild(style);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Performance optimization
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Update scroll-based animations here
    ticking = false;
}

window.addEventListener('scroll', requestTick);

// Add loading states and error handling
window.addEventListener('error', function(e) {
    console.warn('SMKN6 Website Error:', e.error);
});

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Register service worker for offline functionality
        console.log('Service Worker support detected');
    });
}

console.log("🎓 SMKN6 Malang website loaded successfully!");
console.log("🚀 Enhanced with modern animations and interactions!");