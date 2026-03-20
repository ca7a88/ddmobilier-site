/* ==========================================================================
   MOBILE MENU TOGGLE
   ========================================================================== */
/* (function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      toggle.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        toggle.classList.remove("active");
      });
    });
  }
})(); */

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

    // Handle index page specially (since it might be just "/" or "index.html")
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
   GALLERY SLIDER (INDEX PAGE)
   ========================================================================== */
(function () {
  const track = document.querySelector(".slider-track");

  if (track) {
    const slides = Array.from(document.querySelectorAll(".slide"));
    const leftArrow = document.querySelector(".gallery-arrow.left");
    const rightArrow = document.querySelector(".gallery-arrow.right");

    let index = 0;
    let galleryInterval;
    const slideGap = 10;

    function updateGallery() {
      const slideWidth = slides[0].offsetWidth + slideGap;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }

    function moveGallery(step = 1) {
      index += step;
      const halfLength = slides.length / 2;

      if (index < 0) index = halfLength - 1;
      if (index >= halfLength) index = 0;

      updateGallery();
    }

    function startAutoSlide() {
      galleryInterval = setInterval(() => moveGallery(1), 3000);
    }

    startAutoSlide();

    if (leftArrow && rightArrow) {
      leftArrow.addEventListener("click", () => moveGallery(-1));
      rightArrow.addEventListener("click", () => moveGallery(1));
    }

    slides.forEach((slide) => {
      slide.addEventListener("mouseenter", () =>
        clearInterval(galleryInterval),
      );
      slide.addEventListener("mouseleave", () => startAutoSlide());
    });

    // Update gallery on window resize
    window.addEventListener("resize", updateGallery);
  }
})();

/* ==========================================================================
   WHATSAPP FORM (CONTACT PAGE)
   ========================================================================== */
(function () {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const phone = document.getElementById("phone").value;
      const message = document.getElementById("message").value;

      const whatsappMessage = `Bună! Vă contactez de pe site.

Nume: ${name}
Telefon: ${phone}

Mesaj:
${message}`;

      const url = `https://wa.me/40756938133?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(url, "_blank");
      form.reset();
    });
  }
})();

/* ==========================================================================
   WHATSAPP BUTTON VISIBILITY
   ========================================================================== */
(function () {
  const whatsappBtn = document.querySelector(".whatsapp-button");

  if (whatsappBtn) {
    const path = window.location.pathname;
    const filename = path.split("/").pop() || "index.html";

    // Show always on contact page
    if (filename === "contact.html") {
      whatsappBtn.classList.add("show");
    } else {
      // Remove any existing show class that might be forcing it visible
      whatsappBtn.classList.remove("show");

      // Check if page is already scrolled
      if (window.scrollY > 50) {
        whatsappBtn.classList.add("show");
      }

      // Show after scrolling
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
   GALLERY LIGHTBOX (FOR INDEX PAGE SLIDER)
   ========================================================================== */
(function () {
  // Target only slider images from index page
  const sliderImages = document.querySelectorAll(".slide img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const closeLightbox = document.querySelector(".lightbox-close");

  if (sliderImages.length && lightbox && lightboxImg && closeLightbox) {
    sliderImages.forEach((img) => {
      img.addEventListener("click", () => {
        lightbox.classList.add("active");
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      });
    });

    closeLightbox.addEventListener("click", () => {
      lightbox.classList.remove("active");
    });

    lightbox.addEventListener("click", (e) => {
      if (e.target !== lightboxImg) {
        lightbox.classList.remove("active");
      }
    });

    // Close lightbox with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        lightbox.classList.remove("active");
      }
    });
  }
})();

// ==========================================================================
// FALLBACK FOR IMAGE PATHS (runs only if images are broken)
// ==========================================================================
(function () {
  // Check if we're in a subfolder and images are failing
  function checkAndFixImages() {
    // Create a test image to see if the path works
    const testImg = new Image();
    testImg.onerror = function () {
      // Image failed to load - we need to fix paths
      console.log("🔧 Fixing image paths for subfolder...");

      // Determine correct path prefix
      const isInSubfolder = window.location.pathname.includes("/pages/");
      const prefix = isInSubfolder ? ".." : ".";

      // Create style override with ALL hero images
      const style = document.createElement("style");
      style.textContent = `
        /* Main hero sections */
        .hero::after,
        .about-hero::after,
        .products-hero::after,
        .contact-hero::after {
          background-image: url("${prefix}/images/hero/603799320_4622795021280975_3147762570423294780_n.jpg") !important;
        }
        
        /* Category hero sections */
        .category-hero.bucatarie-hero::after {
          background-image: url("${prefix}/images/bucatarie/ChatGPT Image Mar 17, 2026, 03_50_25 PM.jpg") !important;
        }
        
        .category-hero.tapiterie-hero::after {
          background-image: url("${prefix}/images/tapiterie/ChatGPT Image Mar 17, 2026, 03_56_53 PM.jpg") !important;
        }
        
        .category-hero.living-hero::after {
          background-image: url("${prefix}/images/livingbirou/ChatGPT Image Mar 17, 2026, 04_01_26 PM.jpg") !important;
        }
        
        .category-hero.dormitor-hero::after {
          background-image: url("${prefix}/images/dormitoare/ChatGPT Image Mar 18, 2026, 09_48_28 PM.jpg") !important;
        }
        
        .category-hero.altele-hero::after {
          background-image: url("${prefix}/images/altele/ChatGPT Image Mar 17, 2026, 04_07_09 PM.jpg") !important;
        }
      `;

      document.head.appendChild(style);
      console.log("✅ Image paths fixed successfully!");
    };

    testImg.onload = function () {
      console.log("✅ Images are loading correctly - no fix needed");
    };

    // Test with a relative path that might fail
    // Using a path that's likely to fail when in subfolder
    testImg.src =
      "images/hero/603799320_4622795021280975_3147762570423294780_n.jpg";
  }

  // Run after page loads
  if (document.readyState === "loading") {
    window.addEventListener("load", checkAndFixImages);
  } else {
    // DOM already loaded
    checkAndFixImages();
  }
})();
