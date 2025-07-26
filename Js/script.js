/* Mortgage Calculator */
const initializeCalculator = () => {
  const form = document.getElementById("calculator-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const principal = parseFloat(document.getElementById("homePrice").value) - parseFloat(document.getElementById("downPayment").value);
    const years = parseFloat(document.getElementById("loanTerm").value);
    const monthlyRate = parseFloat(document.getElementById("interestRate").value) / 100 / 12;
    const totalPayments = years * 12;

    const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalPayments));
    const result = isFinite(monthlyPayment) ? `$${monthlyPayment.toFixed(2)} / month` : "Please check your inputs";

    const resultElement = document.getElementById("monthlyPayment");
    resultElement.textContent = `Estimated Monthly Payment: ${result}`;

    setTimeout(() => {
      resultElement.textContent = "";
      form.reset();
    }, 10000); // Reduced from 20s to 10s for better UX
  });
};

/* Testimonial Scrolling */
const scrollTestimonials = (direction) => {
  const container = document.getElementById("testimonialContainer");
  if (!container) return;
  container.scrollBy({ left: direction * 320, behavior: "smooth" });
};

/* Carousel Functionality */
const initializeCarousel = () => {
  const thumbnails = document.getElementById("thumbnails");
  const bgImage = document.querySelector(".background-image");
  if (!thumbnails || !bgImage) return;

  const images = thumbnails.getElementsByTagName("img");
  let currentCenterIndex = 1;

  const updateCarousel = () => {
    Array.from(images).forEach((img, i) => {
      img.classList.remove("active");
      img.style.display = "none";
    });

    const indices = [
      (currentCenterIndex - 1 + images.length) % images.length,
      currentCenterIndex,
      (currentCenterIndex + 1) % images.length,
    ];

    indices.forEach((i, idx) => {
      images[i].style.display = "block";
      if (idx === 1) {
        images[i].classList.add("active");
        bgImage.src = images[i].src;
      }
    });
  };

  document.querySelector(".scroll-btn.left")?.addEventListener("click", () => {
    currentCenterIndex = (currentCenterIndex - 1 + images.length) % images.length;
    updateCarousel();
  });

  document.querySelector(".scroll-btn.right")?.addEventListener("click", () => {
    currentCenterIndex = (currentCenterIndex + 1) % images.length;
    updateCarousel();
  });

  Array.from(images).forEach((img, i) => {
    img.addEventListener("click", () => {
      currentCenterIndex = i;
      updateCarousel();
    });
  });

  updateCarousel();
};

/* Video Playback */
const initializeVideo = () => {
  const video = document.getElementById("propertyVideo");
  const playBtn = document.getElementById("playButton");
  const seekBar = document.querySelector(".seek-bar");
  const videoTime = document.querySelector(".video-time");
  const videoContainer = document.querySelector(".video-container");
  if (!video || !playBtn || !seekBar || !videoTime || !videoContainer) return;

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const updateSeekBarStyle = () => {
    const percent = (seekBar.value / seekBar.max) * 100;
    seekBar.style.background = `linear-gradient(to right, #d4af37 0%, #d4af37 ${percent}%, #e0e0e0 ${percent}%, #e0e0e0 100%)`;
  };

  video.addEventListener("loadedmetadata", () => {
    if (video.videoWidth && video.videoHeight) {
      videoContainer.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
    }
    seekBar.max = video.duration || 100;
    seekBar.value = 0;
    videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    updateSeekBarStyle();
  });

  video.addEventListener("timeupdate", () => {
    seekBar.value = video.currentTime;
    videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    updateSeekBarStyle();
  });

  seekBar.addEventListener("input", () => {
    video.currentTime = seekBar.value;
    updateSeekBarStyle();
  });

  video.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch((error) => console.error("Play error:", error));
      playBtn.style.display = "none";
    } else {
      video.pause();
      playBtn.style.display = "";
    }
  });

  playBtn.addEventListener("click", () => {
    video.play().catch((error) => console.error("Play error:", error));
    playBtn.style.display = "none";
  });

  video.addEventListener("play", () => (playBtn.style.display = "none"));
  video.addEventListener("pause", () => (playBtn.style.display = ""));
  video.addEventListener("error", () => {
    console.error("Video load error:", video.error);
    videoTime.textContent = "Error loading video";
  });
};

/* Header and Footer Loading */
const loadHeader = () => {
  return fetch("header.html")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      const headerContent = doc.querySelector("header");
      if (headerContent) {
        document.getElementById("header").innerHTML = headerContent.outerHTML;
        initializeHeader();
        setTimeout(highlightActiveNavLink, 100);
      }
    })
    .catch((error) => {
      console.error("Error loading header:", error);
      setTimeout(highlightActiveNavLink, 200);
    });
};

const loadFooter = () => {
  return fetch("footer.html")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      document.getElementById("footer").innerHTML = data;
      initializeFooter();
    })
    .catch((error) => console.error("Error loading footer:", error));
};

const startPreloading = () => {
  window.headerPromise = fetch("header.html").then((response) => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.text();
  });
  window.footerPromise = fetch("footer.html").then((response) => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.text();
  });
};

/* Header Functionality (Hamburger Menu) */
const initializeHeader = () => {
  const hamburger = document.querySelector(".hamburger");
  const navbar = document.querySelector(".navbar");
  if (!hamburger || !navbar) return;

  hamburger.addEventListener("click", (e) => {
    e.preventDefault();
    navbar.classList.toggle("active");
    hamburger.textContent = navbar.classList.contains("active") ? "✕" : "☰";
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("active");
      hamburger.textContent = "☰";
    });
  });

  document.addEventListener("click", (event) => {
    if (!hamburger.contains(event.target) && !navbar.contains(event.target)) {
      navbar.classList.remove("active");
      hamburger.textContent = "☰";
    }
  });
};

/* Mobile Menu Toggle */
const initializeMobileMenu = () => {
  const menuToggle = document.getElementById("mobile-menu");
  const navButtonsContainer = document.querySelector(".nav-buttons-container");
  if (!menuToggle || !navButtonsContainer) return;

  menuToggle.addEventListener("click", () => {
    navButtonsContainer.classList.toggle("show");
  });
};

/* Dropdown Menu */
const initializeDropdown = () => {
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown1-menu");
  if (!dropdownToggle || !dropdownMenu) return;

  dropdownToggle.addEventListener("click", (e) => {
    e.preventDefault();
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
  });
};

/* Footer Functionality (Newsletter Form) */
const initializeFooter = () => {
  const newsletterForm = document.querySelector(".footer-section.newsletter form");
  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Newsletter signup submitted");
  });
};

/* Navigation Link Highlighting */
const highlightActiveNavLink = () => {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop() || "index.html";
  console.log("Current path:", currentPath, "Current page:", currentPage);

  const navLinks = document.querySelectorAll(".nav-link");
  if (!navLinks.length) {
    console.log("No nav links found");
    return;
  }

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");
    if (
      href === currentPage ||
      ((currentPage === "" || currentPath === "/") && href === "index.html") ||
      currentPath.endsWith("/" + href) ||
      currentPath === "/" + href
    ) {
      link.classList.add("active");
      console.log("Active link set for:", href);
    }
  });
};

/* Back to Top Button */
const initializeBackToTop = () => {
  const backToTopButton = document.getElementById("backToTop");
  if (!backToTopButton) return;

  let hasAnimated = false;
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("visible");
      if (!hasAnimated) {
        backToTopButton.style.animation = "pulse 0.6s ease-in-out";
        hasAnimated = true;
        setTimeout(() => (backToTopButton.style.animation = ""), 600);
      }
    } else {
      backToTopButton.classList.remove("visible");
      hasAnimated = false;
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

/* FAQ Toggle */
const initializeFAQ = () => {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;

    question.addEventListener("click", () => {
      item.classList.toggle("open");
      const icon = item.querySelector(".faq-icon");
      if (icon) icon.textContent = item.classList.contains("open") ? "–" : "+";
    });
  });
};

/* Contact Form Submission */
const initializeContactForm = () => {
  const scriptURL = "https://script.google.com/macros/s/AKfycbyVdQfUPoxOU8ezk4dhwn9ZFEiNgYDK36ES719NLVEEV0Dz_1GRyO6jViKVcqzlcVJb/exec";
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch(scriptURL, { method: "POST", body: formData })
      .then((response) => {
        Swal.fire("✅ Success!", "Your message was sent.", "success");
        form.reset();
      })
      .catch((error) => {
        console.error("Error!", error.message);
        Swal.fire("❌ Error!", "There was a problem sending your message.", "error");
      });
  });
};

/* Swiper Carousel */
const initializeSwiper = () => {
  try {
    const swiper = new Swiper(".featuredSwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  } catch (error) {
    console.error("Swiper initialization failed:", error);
  }
};

/* Initialize All Features */
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing features...");
  startPreloading();
  loadHeader();
  loadFooter();
  initializeCalculator();
  initializeCarousel();
  initializeVideo();
  initializeMobileMenu();
  initializeDropdown();
  initializeBackToTop();
  initializeFAQ();
  initializeContactForm();
  initializeSwiper();
});

window.addEventListener("load", () => {
  console.log("Window loaded, checking active link...");
  setTimeout(highlightActiveNavLink, 200);
});