import { initializeHeader, initializeFooter } from './layout.js';
import * as features from './features.js';

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

function loadHeader() {
  headerPromise
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
  footerPromise
    .then(data => {
      document.getElementById('footer').innerHTML = data;
      initializeFooter();
    })
    .catch(error => console.error('Error loading footer:', error));
}

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

function initializeBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  if (!backToTopButton) return;
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

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  startPreloading();
  loadHeader();
  loadFooter();
  initializeBackToTop();
  features.initializeFeatures(window.location.pathname);
});

window.addEventListener('load', () => {
  console.log('Window loaded, checking active link...');
  setTimeout(highlightActiveNavLink, 200);
});

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

document.querySelectorAll('.day-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});
export { startPreloading };