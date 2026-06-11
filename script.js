/* ==========================================================================
   Neptune Realtors - Interactive Landing Page Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Navbar Scroll State ---
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check scroll on initial load


  // --- 2. Mobile Menu Toggle ---
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });


  // --- 3. Scroll-Driven Zoom (Parallax Zoom) on Hero ---
  const heroBgImg = document.querySelector('.hero-bg-img');
  
  if (heroBgImg) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      const heroHeight = document.getElementById('hero').offsetHeight;
      
      // Calculate scroll progress percentage through the hero section
      if (scrollPos <= heroHeight) {
        const scaleVal = 1.05 + (scrollPos / heroHeight) * 0.15; // scales from 1.05 to 1.20
        heroBgImg.style.transform = `scale(${scaleVal})`;
      }
    });
  }


  // --- 4. Intersection Observer for Zoom & Fade reveals ---
  const revealElements = document.querySelectorAll('.scroll-trigger-zoom, .detail-card, .feature-item, .gallery-item');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px' // triggers slightly before elements enter full view
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // --- 5. Dynamic Photo Array Definition ---
  const photos = [
    { src: 'house1.jpg', caption: 'Villa Front Exterior View - Premium 4 BHK Villa' },
    { src: 'house2.jpg', caption: 'Villa Side Elevation View - Independent Compound' },
    { src: 'house3.jpg', caption: 'Villa Overall View - Modern Architecture' }
  ];

  // Dynamically add the 47 interior pictures to the array
  const totalInteriors = 47;
  for (let i = 1; i <= totalInteriors; i++) {
    let caption = `Interior View ${i} - Premium Villa Interior Details`;
    if (i === 1) caption = 'Foyer & Entrance Doorway - Clean Finished Design';
    if (i === 2) caption = 'Kitchen View from Doorway - Open Modular Kitchen Layout';
    if (i === 3) caption = 'Staircase & Upper Hallway - Premium Finished Wooden Rails';
    if (i === 4) caption = 'Designer Bathroom - Fully Tiled & Fitted attached Baths';
    if (i === 5) caption = 'Modern Modular Kitchen close up - Beautiful Teal & Pink Color Scheme';
    
    photos.push({
      src: `inside${i}.jpg`,
      caption: caption
    });
  }

  // --- 6. Toggle & Load More Interior Photos ---
  const btnToggleInterior = document.getElementById('btn-toggle-interior');
  const interiorGrid = document.getElementById('interior-gallery-grid');
  const loadMoreWrapper = document.getElementById('load-more-wrapper');
  const loadMoreCount = document.getElementById('load-more-count');
  const btnLoadMore = document.getElementById('btn-load-more');

  const batchSize = 12;
  let loadedCount = 0; // Tracks how many interior photos are currently rendered in the DOM

  const loadNextBatch = () => {
    const startIdx = 3 + loadedCount; // Interiors start at index 3 in photos array
    const endIdx = Math.min(startIdx + batchSize, photos.length);

    if (startIdx >= photos.length) {
      loadMoreWrapper.classList.add('hidden');
      return;
    }

    for (let idx = startIdx; idx < endIdx; idx++) {
      const item = document.createElement('div');
      item.className = 'gallery-item scroll-trigger-zoom revealed'; // auto reveal on append
      item.setAttribute('data-index', idx);
      item.innerHTML = `
        <div class="gallery-img-wrapper">
          <img src="${photos[idx].src}" alt="${photos[idx].caption}" class="gallery-img" loading="lazy">
          <div class="gallery-overlay-hover">
            <span class="zoom-icon">🔍</span>
            <span class="img-label">Interior Detail</span>
          </div>
        </div>
      `;

      // Attach dynamic click event to open lightbox
      item.addEventListener('click', () => {
        openLightbox(idx);
      });

      interiorGrid.appendChild(item);
      loadedCount++;
    }

    // Update remaining count
    const remaining = totalInteriors - loadedCount;
    if (remaining > 0) {
      loadMoreCount.textContent = remaining;
      loadMoreWrapper.classList.remove('hidden');
    } else {
      loadMoreWrapper.classList.add('hidden');
    }
  };

  btnToggleInterior.addEventListener('click', () => {
    const isHidden = interiorGrid.classList.contains('hidden');

    if (isHidden) {
      // Expand interior gallery
      interiorGrid.classList.remove('hidden');
      loadNextBatch(); // load first batch of 12
      btnToggleInterior.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-btn"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        Hide Interior Photos
      `;
      setTimeout(() => {
        interiorGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } else {
      // Collapse interior gallery
      interiorGrid.classList.add('hidden');
      loadMoreWrapper.classList.add('hidden');
      interiorGrid.innerHTML = ''; // Clear loaded DOM nodes to save memory
      loadedCount = 0; // Reset count
      btnToggleInterior.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-btn"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        Show All 47 Interior Photos
      `;
      document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Attach Load More click event
  btnLoadMore.addEventListener('click', loadNextBatch);


  // --- 7. Lightbox Gallery Modal ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentPhotoIndex = 0;

  // Open Lightbox
  const openLightbox = (index) => {
    currentPhotoIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable page scroll while viewing images
  };

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable page scroll
  };

  // Update Lightbox image & caption
  const updateLightboxContent = () => {
    const photo = photos[currentPhotoIndex];
    lightboxImg.style.opacity = '0';

    // Smooth transition
    setTimeout(() => {
      lightboxImg.src = photo.src;
      lightboxImg.alt = photo.caption;
      lightboxCaption.textContent = photo.caption;
      lightboxImg.style.opacity = '1';
    }, 150);
  };

  // Prev / Next functions
  const showPrevPhoto = () => {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    updateLightboxContent();
  };

  const showNextPhoto = () => {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    updateLightboxContent();
  };

  // Attach event listeners to main (initially visible) gallery items
  document.querySelectorAll('#main-gallery-grid .gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'), 10);
      openLightbox(index);
    });
  });

  // Modal control buttons
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevPhoto);
  lightboxNext.addEventListener('click', showNextPhoto);

  // Close when clicking background overlay
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrevPhoto();
    } else if (e.key === 'ArrowRight') {
      showNextPhoto();
    }
  });

});
