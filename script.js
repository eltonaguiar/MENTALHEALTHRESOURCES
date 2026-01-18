// ==========================================
// Service Worker Registration (PWA Support)
// ==========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// ==========================================
// Smooth scrolling for navigation links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.6s ease-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.resource-card, .emergency-card, .feature').forEach(card => {
    observer.observe(card);
});

// Add click feedback for emergency buttons
document.querySelectorAll('.emergency-btn, .card-link, .cta-button').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// Keyboard accessibility - allow Enter key on any clickable element
document.querySelectorAll('[role="button"], a').forEach(element => {
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.click();
        }
    });
});

// Add visual feedback for links
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        if (!this.classList.contains('emergency-btn') && 
            !this.classList.contains('card-link') && 
            !this.classList.contains('cta-button')) {
            this.style.textDecoration = 'underline';
        }
    });
    
    link.addEventListener('mouseleave', function() {
        this.style.textDecoration = '';
    });
});

// Log to console on page load for debugging
console.log('Mental Health Resources landing page loaded successfully');
console.log('Emergency hotlines are accessible via the red banner at the top');
