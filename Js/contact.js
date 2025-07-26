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
    .catch(error => console.error('Error loading footer:', error));
}

// Initialize header functionality (hamburger menu)
function initializeHeader() {
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  if (hamburger && navbar) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      navbar.classList.toggle('active');
      hamburger.textContent = navbar.classList.contains('active') ? '✕' : '☰';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        hamburger.textContent = '☰';
      });
    });

    document.addEventListener('click', (event) => {
      if (!hamburger.contains(event.target) && !navbar.contains(event.target)) {
        navbar.classList.remove('active');
        hamburger.textContent = '☰';
      }
    });
  }
}

// Initialize footer functionality (newsletter form)
function initializeFooter() {
  const newsletterForm = document.querySelector('.footer-section.newsletter form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('Newsletter signup submitted');
    });
  }
}

// Highlight active navigation link
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  console.log('Current path:', currentPath, 'Current page:', currentPage);

  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) {
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
        setTimeout(() => backToTopButton.style.animation = '', 600);
      }
    } else {
      backToTopButton.classList.remove('visible');
      hasAnimated = false;
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// FAQ Toggle Functionality
function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('open');
      const icon = item.querySelector('.faq-icon');
      icon.textContent = item.classList.contains('open') ? '–' : '+';
    });
  });
}

// Contact Form Submission
function initializeContactForm() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyVdQfUPoxOU8ezk4dhwn9ZFEiNgYDK36ES719NLVEEV0Dz_1GRyO6jViKVcqzlcVJb/exec';
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch(scriptURL, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      Swal.fire('✅ Success!', 'Your message was sent.', 'success');
      form.reset();
    })
    .catch(error => {
      console.error('Error!', error.message);
      Swal.fire('❌ Error!', 'There was a problem sending your message.', 'error');
    });
  });
}

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

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, loading header and footer...');
  loadHeader();
  loadFooter();
  initializeBackToTop();
  initializeFAQ();
  initializeContactForm();
  startPreloading();
});

// Fallback for active link after full page load
window.addEventListener('load', () => {
  console.log('Window loaded, attempting fallback active link...');
  setTimeout(highlightActiveNavLink, 200);
});