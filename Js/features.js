function initializeFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      item.classList.toggle('open');
      const icon = item.querySelector('.faq-icon');
      if (icon) icon.textContent = item.classList.contains('open') ? '–' : '+';
    });
  });
}

function initializeContactForm() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyVdQfUPoxOU8ezk4dhwn9ZFEiNgYDK36ES719NLVEEV0Dz_1GRyO6jViKVcqzlcVJb/exec';
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch(scriptURL, { method: 'POST', body: formData })
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

function initializeInvestorForm() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyVdQfUPoxOU8ezk4dhwn9ZFEiNgYDK36ES719NLVEEV0Dz_1GRyO6jViKVcqzlcVJb/exec';
  const form = document.getElementById('investorForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => response.text())
      .then(() => {
        Swal.fire({ icon: 'success', title: 'Success', text: 'Submitted successfully!', timer: 1500, showConfirmButton: false });
        form.reset();
      })
      .catch(error => {
        console.error('Error!', error.message);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error sending message.', timer: 1500, showConfirmButton: false });
      });
  });
}

function initializeForm() {
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyVdQfUPoxOU8ezk4dhwn9ZFEiNgYDK36ES719NLVEEV0Dz_1GRyO6jViKVcqzlcVJb/exec';
  const form = document.getElementById('visitForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch(scriptURL, { method: 'POST', body: formData })
      .then(response => response.text())
      .then(() => {
        Swal.fire({ icon: 'success', title: 'Success', text: 'Your viewing request was sent.', timer: 1500, showConfirmButton: false });
        form.reset();
      })
      .catch(error => {
        console.error('Error:', error.message);
        Swal.fire({ icon: 'error', title: 'Error', text: 'There was a problem sending your request.', timer: 1500, showConfirmButton: false });
      });
  });
}

function initializeCalculator() {
  const form = document.getElementById('calculator-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const principal = parseFloat(document.getElementById('homePrice').value) - parseFloat(document.getElementById('downPayment').value);
    const years = parseFloat(document.getElementById('loanTerm').value);
    const monthlyRate = parseFloat(document.getElementById('interestRate').value) / 100 / 12;
    const totalPayments = years * 12;
    const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    const result = isFinite(monthlyPayment) ? `$${monthlyPayment.toFixed(2)} / month` : 'Please check your inputs';
    const resultElement = document.getElementById('monthlyPayment');
    resultElement.textContent = `Estimated Monthly Payment: ${result}`;
    setTimeout(() => {
      resultElement.textContent = '';
      form.reset();
    }, 10000);
  });
}

function scrollTestimonials(direction) {
  const container = document.getElementById('testimonialContainer');
  if (!container) return;
  container.scrollBy({ left: direction * 320, behavior: 'smooth' });
}

window.scrollTestimonials = scrollTestimonials;

function initializeCarousel() {
  const thumbnails = document.getElementById('thumbnails');
  const bgImage = document.querySelector('.background-image');
  if (!thumbnails || !bgImage) return;
  const images = thumbnails.getElementsByTagName('img');
  let currentCenterIndex = 1;

  function updateCarousel() {
    Array.from(images).forEach((img, i) => {
      img.classList.remove('active');
      img.style.display = 'none';
    });
    const indices = [
      (currentCenterIndex - 1 + images.length) % images.length,
      currentCenterIndex,
      (currentCenterIndex + 1) % images.length,
    ];
    indices.forEach((i, idx) => {
      images[i].style.display = 'block';
      if (idx === 1) {
        images[i].classList.add('active');
        bgImage.src = images[i].src;
      }
    });
  }

  document.querySelector('.scroll-btn.left')?.addEventListener('click', () => {
    currentCenterIndex = (currentCenterIndex - 1 + images.length) % images.length;
    updateCarousel();
  });
  document.querySelector('.scroll-btn.right')?.addEventListener('click', () => {
    currentCenterIndex = (currentCenterIndex + 1) % images.length;
    updateCarousel();
  });
  Array.from(images).forEach((img, i) => {
    img.addEventListener('click', () => {
      currentCenterIndex = i;
      updateCarousel();
    });
  });
  updateCarousel();
}

function initializeVideo() {
  const video = document.getElementById('propertyVideo');
  const playBtn = document.getElementById('playButton');
  const seekBar = document.querySelector('.seek-bar');
  const videoTime = document.querySelector('.video-time');
  const videoContainer = document.querySelector('.video-container');
  if (!video || !playBtn || !seekBar || !videoTime || !videoContainer) return;

  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function updateSeekBarStyle() {
    const percent = (seekBar.value / seekBar.max) * 100;
    seekBar.style.background = `linear-gradient(to right, #d4af37 0%, #d4af37 ${percent}%, #e0e0e0 ${percent}%, #e0e0e0 100%)`;
  }

  video.addEventListener('loadedmetadata', () => {
    if (video.videoWidth && video.videoHeight) {
      videoContainer.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
    }
    seekBar.max = video.duration || 100;
    seekBar.value = 0;
    videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    updateSeekBarStyle();
  });

  video.addEventListener('timeupdate', () => {
    seekBar.value = video.currentTime;
    videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    updateSeekBarStyle();
  });

  seekBar.addEventListener('input', () => {
    video.currentTime = seekBar.value;
    updateSeekBarStyle();
  });

  video.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(error => console.error('Play error:', error));
      playBtn.style.display = 'none';
    } else {
      video.pause();
      playBtn.style.display = '';
    }
  });

  playBtn.addEventListener('click', () => {
    video.play().catch(error => console.error('Play error:', error));
    playBtn.style.display = 'none';
  });

  video.addEventListener('play', () => (playBtn.style.display = 'none'));
  video.addEventListener('pause', () => (playBtn.style.display = ''));
  video.addEventListener('error', () => {
    console.error('Video load error:', video.error);
    videoTime.textContent = 'Error loading video';
  });
}

function initializeSwiper() {
  try {
    const swiper = new Swiper('.featuredSwiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
      },
    });
  } catch (error) {
    console.error('Swiper initialization failed:', error);
  }
}

function initializeMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu');
  const navButtonsContainer = document.querySelector('.nav-buttons-container');
  if (!menuToggle || !navButtonsContainer) return;
  menuToggle.addEventListener('click', () => {
    navButtonsContainer.classList.toggle('show');
  });
}

function initializeDropdown() {
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown1-menu');
  if (!dropdownToggle || !dropdownMenu) return;
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
  });
}

function initializeFeatures(pathname) {
  const currentPage = pathname.split('/').pop() || 'index.html';
  if (['about.html', 'contact.html'].includes(currentPage)) {
    initializeFAQ();
    initializeContactForm();
  }
  if (['invest.html'].includes(currentPage)) {
    initializeInvestorForm();
  }
  if (['properties.html'].includes(currentPage)) {
    initializeForm();
  }
  if (['index.html', '1870.html', 'boston.html', 'crystal.html', 'emerald.html', 'enrogue.html', 'gemini.html', 'grosvenor.html', 'neptune.html', 'oasis.html', 'platinum.html', 'saruni.html', 'symphony.html', 'venus.html', 'wilma.html'].includes(currentPage)) {
    initializeCalculator();
    initializeCarousel();
    initializeVideo();
    initializeSwiper();
    scrollTestimonials();
    initializeMobileMenu();
    initializeDropdown();
  }
  if (['buy-to-let.html', 'roi.html', 'commercial.html', 'off-plan.html', 'partnership.html', 'portfolio.html'].includes(currentPage)) {
    // Only external links and shared features (handled by main.js and layout.js)
  }
}

export {
  initializeFAQ,
  initializeContactForm,
  initializeInvestorForm,
  initializeForm,
  initializeCalculator,
  initializeCarousel,
  initializeVideo,
  initializeSwiper,
  scrollTestimonials,
  initializeMobileMenu,
  initializeDropdown,
  initializeFeatures
};