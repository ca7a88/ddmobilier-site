/* ==========================================================================
   ACTIVE NAVIGATION HIGHLIGHTING
   ========================================================================== */
(function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();

    if (linkPage === currentPage) {
      link.classList.add("active");
    }

    if (currentPage === "index.html" && linkPage === "index.html") {
      link.classList.add("active");
    }
  });
})();

/* ==========================================================================
   SCROLL REVEAL
   ========================================================================== */
(function () {
  const reveals = document.querySelectorAll(".reveal");

  function revealElements() {
    const windowHeight = window.innerHeight;
    const revealPoint = 120;

    reveals.forEach((el) => {
      if (el.getBoundingClientRect().top < windowHeight - revealPoint) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealElements);
  window.addEventListener("load", revealElements);
})();

/* ==========================================================================
   GALLERY SLIDER - WITH MOBILE AUTO-SLIDE & SWIPE
   ========================================================================== */
(function () {
  const track = document.querySelector(".slider-track");

  if (!track) return;

  const slides = document.querySelectorAll(".slide");
  const leftArrow = document.querySelector(".gallery-arrow.left");
  const rightArrow = document.querySelector(".gallery-arrow.right");
  const gallerySlider = document.querySelector(".gallery-slider");

  let currentIndex = 0;
  let autoSlideInterval;
  let isMobile = false;
  let touchStartX = 0;
  let touchEndX = 0;

  function checkMobile() {
    isMobile = window.innerWidth <= 768;
  }

  function updateGallery() {
    if (!slides.length) return;

    const slideWidth = slides[0].offsetWidth;
    const gap = 16; // matches CSS gap

    if (isMobile) {
      // Mobile: calculate center position
      const containerWidth = gallerySlider.offsetWidth;
      const offset = (containerWidth - slideWidth) / 2;
      const transformValue = -(slideWidth + gap) * currentIndex + offset;
      track.style.transform = `translateX(${transformValue}px)`;
    } else {
      // Desktop: normal slider
      const transformValue = -(slideWidth + gap) * currentIndex;
      track.style.transform = `translateX(${transformValue}px)`;
    }
  }

  function moveSlide(direction) {
    const maxIndex = Math.ceil(slides.length / 2) - 1;
    currentIndex += direction;

    if (currentIndex < 0) currentIndex = maxIndex;
    if (currentIndex > maxIndex) currentIndex = 0;

    updateGallery();
  }

  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    // Auto-slide on BOTH desktop AND mobile
    autoSlideInterval = setInterval(() => moveSlide(1), 3000);
  }

  function stopAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }

  // SWIPE DETECTION
  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    stopAutoSlide();
  }

  function handleTouchMove(e) {
    touchEndX = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 50; // minimum pixels to trigger swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe right → previous slide
        moveSlide(-1);
      } else {
        // Swipe left → next slide
        moveSlide(1);
      }
    }

    // Restart auto-slide after swipe
    startAutoSlide();
  }

  // Initialize
  checkMobile();
  updateGallery();
  startAutoSlide();

  // Arrow click events
  if (leftArrow) {
    leftArrow.addEventListener("click", () => {
      moveSlide(-1);
      stopAutoSlide();
      startAutoSlide();
    });
  }

  if (rightArrow) {
    rightArrow.addEventListener("click", () => {
      moveSlide(1);
      stopAutoSlide();
      startAutoSlide();
    });
  }

  // SWIPE EVENTS (ONLY FOR MOBILE)
  if (gallerySlider) {
    gallerySlider.addEventListener("touchstart", handleTouchStart);
    gallerySlider.addEventListener("touchmove", handleTouchMove);
    gallerySlider.addEventListener("touchend", handleTouchEnd);
  }

  // Pause on hover (desktop only)
  if (!isMobile) {
    track.addEventListener("mouseenter", stopAutoSlide);
    track.addEventListener("mouseleave", startAutoSlide);
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    checkMobile();
    updateGallery();
    stopAutoSlide();
    startAutoSlide();
  });
})();

/* ==========================================================================
   GALLERY LIGHTBOX - FOR ALL PAGES
   ========================================================================== */
(function () {
  // Wait for page to fully load
  function initLightbox() {
    // Target ALL images that should open lightbox
    const allImages = document.querySelectorAll(
      ".slide img, .gallery-item img, .product-item img, .product-card img",
    );

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.querySelector(".lightbox-img");
    const closeLightbox = document.querySelector(".lightbox-close");

    if (!lightbox || !lightboxImg || !closeLightbox) {
      console.log("Lightbox elements not found");
      return;
    }

    console.log("Found " + allImages.length + " images for lightbox");

    function openLightbox(imgSrc, imgAlt) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt || "";
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function closeLightboxFunction() {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    }

    // Add click event to each image
    allImages.forEach(function (img) {
      img.style.cursor = "pointer";
      img.addEventListener("click", function (e) {
        e.stopPropagation();
        openLightbox(this.src, this.alt);
      });
    });

    // Close events
    closeLightbox.addEventListener("click", closeLightboxFunction);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) {
        closeLightboxFunction();
      }
    });

    // Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightboxFunction();
      }
    });
  }

  // Run when page loads
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightbox);
  } else {
    initLightbox();
  }
})();

/* ==========================================================================
   WHATSAPP FORM
   ========================================================================== */
(function () {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const message = document.getElementById("message").value;

      const whatsappMessage = `Bună! Vă contactez de pe site.\n\nNume: ${name}\nTelefon: ${phone}\n\nMesaj:\n${message}`;
      const url = `https://wa.me/40756938133?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(url, "_blank");
      form.reset();
    });
  }
})();

/* ==========================================================================
   WHATSAPP BUTTON
   ========================================================================== */
(function () {
  const whatsappBtn = document.querySelector(".whatsapp-button");

  if (whatsappBtn) {
    const filename = window.location.pathname.split("/").pop() || "index.html";

    if (filename === "contact.html") {
      whatsappBtn.classList.add("show");
    } else {
      whatsappBtn.classList.remove("show");

      if (window.scrollY > 50) {
        whatsappBtn.classList.add("show");
      }

      const onScroll = () => {
        if (window.scrollY > 50) {
          whatsappBtn.classList.add("show");
          window.removeEventListener("scroll", onScroll);
        }
      };

      window.addEventListener("scroll", onScroll);
    }
  }
})();

/* ==========================================================================
   IMAGE PATH FALLBACK
   ========================================================================== */
(function () {
  function checkAndFixImages() {
    const testImg = new Image();
    testImg.onerror = function () {
      const isInSubfolder = window.location.pathname.includes("/pages/");
      const prefix = isInSubfolder ? ".." : ".";

      const style = document.createElement("style");
      style.textContent = `
        .hero::after, .about-hero::after, .products-hero::after, .contact-hero::after {
          background-image: url("${prefix}/images/hero/603799320_4622795021280975_3147762570423294780_n.jpg") !important;
        }
      `;
      document.head.appendChild(style);
    };
    testImg.src =
      "images/hero/603799320_4622795021280975_3147762570423294780_n.jpg";
  }

  if (document.readyState === "loading") {
    window.addEventListener("load", checkAndFixImages);
  } else {
    checkAndFixImages();
  }
})();
