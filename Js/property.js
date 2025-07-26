// Preload header and footer for performance
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

// CAROUSEL FUNCTIONALITY
function initializeCarousel() {
  const thumbnails = document.getElementById('thumbnails');
  const images = thumbnails.getElementsByTagName('img');
  const bgImage = document.querySelector('.background-image');
  let currentCenterIndex = 1;

  function updateCarousel() {
    // Hide all images first
    for (let i = 0; i < images.length; i++) {
      images[i].classList.remove('active');
      images[i].style.display = 'none';
    }

    // Show only 3 images: previous, current, next
    let indices = [
      (currentCenterIndex - 1 + images.length) % images.length,
      currentCenterIndex,
      (currentCenterIndex + 1) % images.length
    ];

    indices.forEach((i, idx) => {
      images[i].style.display = 'block';
      if (idx === 1) {
        images[i].classList.add('active');
        bgImage.src = images[i].src;
      }
    });
  }

  // Left arrow click
  document.querySelector('.scroll-btn.left').addEventListener('click', () => {
    currentCenterIndex--;
    if (currentCenterIndex < 0) currentCenterIndex = images.length - 1;
    updateCarousel();
  });

  // Right arrow click
  document.querySelector('.scroll-btn.right').addEventListener('click', () => {
    currentCenterIndex++;
    if (currentCenterIndex >= images.length) currentCenterIndex = 0;
    updateCarousel();
  });

  // Image click to center
  for (let i = 0; i < images.length; i++) {
    images[i].addEventListener('click', () => {
      currentCenterIndex = i;
      updateCarousel();
    });
  }

  // Initialize carousel
  updateCarousel();
}

// VIDEO PLAYER FUNCTIONALITY
function initializeVideo() {
  const video = document.getElementById('propertyVideo');
  const playBtn = document.getElementById('playButton');
  const seekBar = document.querySelector('.seek-bar');
  const videoTime = document.querySelector('.video-time');
  const videoContainer = document.querySelector('.video-container');

  // Format time as MM:SS
  function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Update seek bar visual progress
  function updateSeekBarStyle() {
    const percent = (seekBar.value / seekBar.max) * 100;
    seekBar.style.background = `linear-gradient(to right, #d4af37 0%, #d4af37 ${percent}%, #e0e0e0 ${percent}%, #e0e0e0 100%)`;
  }

  // Set video aspect ratio and initialize seek bar
  video.addEventListener('loadedmetadata', () => {
    // Set aspect ratio based on video dimensions
    if (video.videoWidth && video.videoHeight) {
      videoContainer.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
    }
    seekBar.max = video.duration || 100;
    seekBar.value = 0;
    videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    updateSeekBarStyle();
  });

  // Update seek bar and time display during playback
  video.addEventListener('timeupdate', () => {
    seekBar.value = video.currentTime;
    videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    updateSeekBarStyle();
  });

  // Seek to position on drag/click
  seekBar.addEventListener('input', () => {
    video.currentTime = seekBar.value;
    updateSeekBarStyle();
  });

  // Toggle play/pause on video click
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(error => console.error('Play error:', error));
      playBtn.style.display = 'none';
    } else {
      video.pause();
      playBtn.style.display = '';
    }
  });

  // Play button click
  playBtn.addEventListener('click', () => {
    video.play().catch(error => console.error('Play error:', error));
    playBtn.style.display = 'none';
  });

  // Update button visibility on play/pause
  video.addEventListener('play', () => {
    playBtn.style.display = 'none';
  });

  video.addEventListener('pause', () => {
    playBtn.style.display = '';
  });

  // Handle video load failure
  video.addEventListener('error', () => {
    console.error('Video load error:', video.error);
    videoTime.textContent = 'Error loading video';
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
          setTimeout(highlightActiveNavLink, 100);
        }
      })
      .catch(error => {
        console.error('Error loading header:', error);
        setTimeout(highlightActiveNavLink, 500);
      });
  } else {
    // Fallback if preloading didn't work
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

// Header Functionality (Hamburger Menu)
function initializeHeader() {
  const hamburger = document.querySelector('.hamburger');
  const navbar = document.querySelector('.navbar');
  
  if (hamburger && navbar) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      navbar.classList.toggle('active');
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
    // Fallback if preloading didn't work
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

// Footer Functionality (Newsletter Form)
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

// NAVIGATION LINK HIGHLIGHTING
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
      ((currentPage === '' || currentPath === '/') && href === 'index.html') ||
      currentPath.endsWith('/' + href) ||
      currentPath === '/' + href
    ) {
      link.classList.add('active');
      console.log('Active link set for:', href);
    }
  });
}


// BACK TO TOP BUTTON

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

// Start preloading immediately
startPreloading();

// Initialize all functionality on DOM load
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  loadHeader();
  loadFooter();
  initializeCarousel();
  initializeVideo();
  initializeBackToTop();
});

// Fallback for Active Link highlighting
window.addEventListener('load', () => {
  console.log('Window loaded, checking active link...');
  setTimeout(highlightActiveNavLink, 200);
});