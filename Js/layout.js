// Enhanced hamburger menu functionality
function initializeHeader() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    
    if (hamburger && navbar) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            navbar.classList.toggle('active');
            
            // Change hamburger icon and aria-label for accessibility
            if (navbar.classList.contains('active')) {
                hamburger.textContent = '✕';
                hamburger.setAttribute('aria-label', 'Close navigation menu');
                hamburger.setAttribute('aria-expanded', 'true');
            } else {
                hamburger.textContent = '☰';
                hamburger.setAttribute('aria-label', 'Toggle navigation menu');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                hamburger.textContent = '☰';
                hamburger.setAttribute('aria-label', 'Toggle navigation menu');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navbar.contains(event.target)) {
                navbar.classList.remove('active');
                hamburger.textContent = '☰';
                hamburger.setAttribute('aria-label', 'Toggle navigation menu');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                hamburger.textContent = '☰';
                hamburger.setAttribute('aria-label', 'Toggle navigation menu');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.focus();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 900) {
                navbar.classList.remove('active');
                hamburger.textContent = '☰';
                hamburger.setAttribute('aria-label', 'Toggle navigation menu');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Export initializeHeader for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeHeader };
} else {
    // Run initialization when DOM is loaded if not imported as a module
    document.addEventListener('DOMContentLoaded', initializeHeader);
}

// Initialize footer functionality//
// Enhanced newsletter form functionality
function initializeNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const submitButton = form?.querySelector('button[type="submit"]');

    if (form && emailInput && submitButton) {
        // Email validation function
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        // Visual feedback for email input
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            
            if (email === '') {
                this.style.borderColor = '#ccc';
                this.style.backgroundColor = '#fff';
            } else if (isValidEmail(email)) {
                this.style.borderColor = '#28a745';
                this.style.backgroundColor = '#f8fff8';
            } else {
                this.style.borderColor = '#dc3545';
                this.style.backgroundColor = '#fff8f8';
            }
        });

        // Form submission handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (!email) {
                alert('Please enter your email address.');
                emailInput.focus();
                return;
            }

            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                emailInput.focus();
                return;
            }

            // Show loading state
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
                emailInput.style.borderColor = '#ccc';
                emailInput.style.backgroundColor = '#fff';
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 1500);
        });

        // Reset input styling on focus
        emailInput.addEventListener('focus', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#b8860b';
                this.style.backgroundColor = '#fff';
            }
        });

        emailInput.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.style.borderColor = '#ccc';
                this.style.backgroundColor = '#fff';
            }
        });
    }
}

// Smooth scroll for internal links
function initializeSmoothScroll() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add loading animation for external links
function initializeExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Optional: Add analytics tracking here
            console.log('External link clicked:', this.href);
        });
    });
}

// Performance optimization: Preload critical resources
function preloadResources() {
    // Preload logo for better performance on subsequent page loads
    const logoLink = document.createElement('link');
    logoLink.rel = 'preload';
    logoLink.href = '/Images/Icons/Seven Flags Logo 1.svg';
    logoLink.as = 'image';
    document.head.appendChild(logoLink);
}

// Initialize footer functionality
function initializeFooter() {
    initializeNewsletterForm();
    initializeSmoothScroll();
    initializeExternalLinks();
    preloadResources();
}

// Export initializeFooter for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeFooter };
} else {
    // Run initialization when DOM is loaded if not imported as a module
    document.addEventListener('DOMContentLoaded', initializeFooter);
}