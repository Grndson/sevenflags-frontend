// GLOBAL VARIABLES AND PRELOADING
let headerPromise = null;
let footerPromise = null;
let hasBackToTopAnimated = false;

// Start preloading resources immediately for better performance
function startPreloading() {
  headerPromise = fetch('header.html').then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.text();
  });
  
  footerPromise = fetch('footer.html').then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.text();
  });
}

// HEADER LOADING AND FUNCTIONALITY
function loadHeader() {
  if (headerPromise) {
    headerPromise
      .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const headerContent = doc.querySelector('header');
        
        if (headerContent) {
          document.getElementById('header').innerHTML = headerContent.outerHTML;
          initializeHeader();
          // Small delay to ensure DOM is fully updated
          setTimeout(highlightActiveNavLink, 100);
        }
      })
      .catch(error => {
        console.error('Error loading header:', error);
        // Fallback attempt
        setTimeout(highlightActiveNavLink, 500);
      });
  } else {
    // Fallback if preloading failed
    fetch('header.html')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const headerContent = doc.querySelector('header');
        
        if (headerContent) {
          document.getElementById('header').innerHTML = headerContent.outerHTML;
          initializeHeader();
          setTimeout(highlightActiveNavLink, 100);
        }
      })
      .catch(error => {
        console.error('Error loading header:', error);
        setTimeout(highlightActiveNavLink, 500);
      });
  }
}

// Initialize hamburger menu and navigation functionality
function initializeHeader() {
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  
  if (hamburger && navbar) {
    // Hamburger menu toggle
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      navbar.classList.toggle('active');
      // Toggle hamburger icon
      hamburger.textContent = navbar.classList.contains('active') ? '✕' : '☰';
    });
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        hamburger.textContent = '☰';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (!hamburger.contains(event.target) && !navbar.contains(event.target)) {
        navbar.classList.remove('active');
        hamburger.textContent = '☰';
      }
    });
  }
}

// FOOTER LOADING AND FUNCTIONALITY
function loadFooter() {
  if (footerPromise) {
    footerPromise
      .then(data => {
        document.getElementById('footer').innerHTML = data;
        initializeFooter();
      })
      .catch(error => console.error('Error loading footer:', error));
  } else {
    // Fallback if preloading failed
    fetch('footer.html')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(data => {
        document.getElementById('footer').innerHTML = data;
        initializeFooter();
      })
      .catch(error => console.error('Error loading footer:', error));
  }
}

// Initialize footer functionality
function initializeFooter() {
  const newsletterForm = document.querySelector('.footer-section.newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Newsletter signup submitted');
      // Add your newsletter signup logic here
    });
  }
}

// NAVIGATION HIGHLIGHTING
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  console.log('Current path:', currentPath, 'Current page:', currentPage);
  
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (navLinks.length === 0) {
    console.log('No nav links found');
    return;
  }
  
  navLinks.forEach(link => {
    // Remove existing active class
    link.classList.remove('active');
    
    const href = link.getAttribute('href');
    
    // Check for matches
    if (
      href === currentPage ||
      // Handle home page cases
      ((currentPage === 'index.html' || currentPage === '' || currentPath === '/') && href === 'index.html') ||
      // Handle root path cases
      currentPath.endsWith('/' + href) ||
      currentPath === '/' + href
    ) {
      link.classList.add('active');
      console.log('✓ Active link set for:', href);
    }
  });
}

// Legacy function for backward compatibility with older pages
function toggleMenu() {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('active');
  }
}

// BACK TO TOP BUTTON
function initializeBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  
  if (!backToTopButton) return;
  
  // Show/hide button based on scroll position with animation
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
      
      // Add pulse animation on first appearance
      if (!hasBackToTopAnimated) {
        backToTopButton.style.animation = 'pulse 0.6s ease-in-out';
        hasBackToTopAnimated = true;
        setTimeout(() => {
          backToTopButton.style.animation = '';
        }, 600);
      }
    } else {
      backToTopButton.classList.remove('visible');
      hasBackToTopAnimated = false;
    }
  });
  
  // Smooth scroll to top when clicked
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// INITIALIZATION

// Start preloading immediately when script loads
startPreloading();

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing universal functionality...');
  
  // Load header and footer
  loadHeader();
  loadFooter();
  
  // Initialize back to top button
  initializeBackToTop();
  
  // Set active navigation link (fallback for pages without dynamic header loading)
  setTimeout(highlightActiveNavLink, 200);
});

// Additional fallback for active link highlighting after full page load
window.addEventListener('load', () => {
  console.log('Window fully loaded, final active link check...');
  setTimeout(highlightActiveNavLink, 300);
});