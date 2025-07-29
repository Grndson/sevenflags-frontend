function initializeHeader() {
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  if (hamburger && navbar) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      navbar.classList.toggle('active');
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

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
        hamburger.textContent = '☰';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function(event) {
      if (!hamburger.contains(event.target) && !navbar.contains(event.target)) {
        navbar.classList.remove('active');
        hamburger.textContent = '☰';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        hamburger.textContent = '☰';
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });

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

function initializeNewsletterForm() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyVdQfUPoxOU8ezk4dhwn9ZFEiNgYDK36ES719NLVEEV0Dz_1GRyO6jViKVcqzlcVJb/exec';
  const form = document.getElementById('newsletter-form');
  const emailInput = document.getElementById('newsletter-email');
  const submitButton = form?.querySelector('button[type="submit"]');
  if (form && emailInput && submitButton) {
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

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

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter your email address.', timer: 1500, showConfirmButton: false });
        emailInput.focus();
        return;
      }
      if (!isValidEmail(email)) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Please enter a valid email address.', timer: 1500, showConfirmButton: false });
        emailInput.focus();
        return;
      }
      submitButton.textContent = 'Submitting...';
      submitButton.disabled = true;
      const formData = new FormData(form);
      fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => response.text())
        .then(() => {
          Swal.fire({ icon: 'success', title: 'Success', text: 'Thank you for subscribing to our newsletter!', timer: 1500, showConfirmButton: false });
          emailInput.value = '';
          emailInput.style.borderColor = '#ccc';
          emailInput.style.backgroundColor = '#fff';
          submitButton.textContent = 'Submit';
          submitButton.disabled = false;
        })
        .catch(error => {
          console.error('Error:', error.message);
          Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem subscribing.', timer: 1500, showConfirmButton: false });
          submitButton.textContent = 'Submit';
          submitButton.disabled = false;
        });
    });

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

function initializeSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initializeExternalLinks() {
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  externalLinks.forEach(link => {
    link.addEventListener('click', function() {
      console.log('External link clicked:', this.href);
    });
  });
}

function preloadResources() {
  const logoLink = document.createElement('link');
  logoLink.rel = 'preload';
  logoLink.href = '/Images/Icons/Seven Flags Logo 1.svg';
  logoLink.as = 'image';
  document.head.appendChild(logoLink);
}

function initializeFooter() {
  initializeNewsletterForm();
  initializeSmoothScroll();
  initializeExternalLinks();
  preloadResources();
}

export { initializeHeader, initializeFooter };