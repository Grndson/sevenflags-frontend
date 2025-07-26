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

// Initialize form submission
function initializeForm() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyVdQfUPoxOU8ezk4dhwn9ZFEiNgYDK36ES719NLVEEV0Dz_1GRyO6jViKVcqzlcVJb/exec';
  const form = document.getElementById('visitForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      fetch(scriptURL, {
        method: 'POST',
        body: formData
      })
      .then(response => response.text())
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Your viewing request was sent.',
          timer: 1500,
          showConfirmButton: false
        });
        form.reset();
      })
      .catch(error => {
        console.error('Error:', error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a problem sending your request.',
          timer: 1500,
          showConfirmButton: false
        });
      });
    });
  }
}

// Initialize page functionality
function initializePage() {
  loadHeader(); // From featured.js
  loadFooter(); // From featured.js
  initializeForm();
  initializeBackToTop(); // From featured.js
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Make startPreloading globally available
window.startPreloading = startPreloading;