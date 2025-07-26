// Preload header and footer
let headerPromise = null;
let footerPromise = null;

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

// Load header and footer content
function loadHeader() {
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

function loadFooter() {
  fetch('footer.html')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then(data => {
      document.getElementById('footer').innerHTML = data;
      initializeFooter();
    })
    .catch(error => {
      console.error('Error loading footer:', error);
    });
}

// Initialize header functionality
function initializeHeader() {
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  
  if (hamburger && navbar) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      navbar.classList.toggle('active');
      hamburger.textContent = navbar.classList.contains('active') ? '✕' : '☰';
    });
    
    document.querySelectorAll('.nav-link, .navbar a').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        hamburger.textContent = '☰';
      });
    });
    
    document.addEventListener('click', function(event) {
      if (!hamburger.contains(event.target) && !navbar.contains(event.target)) {
        navbar.classList.remove('active');
        hamburger.textContent = '☰';
      }
    });
  }
}

// Toggle menu function
function toggleMenu() {
  document.getElementById('navbar').classList.toggle('active');
}

// Initialize footer functionality
function initializeFooter() {
  const newsletterForm = document.querySelector('.footer-section.newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Newsletter signup submitted');
    });
  }
}

// Highlight active navigation link
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  console.log('Current path:', currentPath);
  console.log('Current page:', currentPage);
  
  const navLinks = document.querySelectorAll('.nav-link, .navbar a');
  
  if (navLinks.length === 0) {
    console.log('No nav links found');
    return;
  }
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    if (
      href === currentPage ||
      (href === 'index.html' && (currentPage === '' || currentPath === '/')) ||
      currentPath.endsWith('/' + href) ||
      currentPath === '/' + href
    ) {
      link.classList.add('active');
      console.log('Active link set for:', href);
    }
  });
}

// Back to Top Button Functionality
function initializeBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  let hasAnimated = false;
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('visible');
      if (!hasAnimated) {
        backToTopButton.style.animation = 'pulse 0.6s ease-in-out';
        hasAnimated = true;
        setTimeout(() => {
          backToTopButton.style.animation = '';
        }, 600);
      }
    } else {
      backToTopButton.classList.remove('visible');
      hasAnimated = false;
    }
  });
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, loading header and footer...');
  loadHeader();
  loadFooter();
  initializeBackToTop();
});

// Fallback for active link after page load
window.addEventListener('load', function() {
  console.log('Window loaded, attempting fallback active link...');
  setTimeout(highlightActiveNavLink, 200);
});

// Make startPreloading globally available
window.startPreloading = startPreloading;