// ==========================================
// MyHealthPrac - Main JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lenis Smooth Scroll
  initLenis();

  // Initialize Split-Type and GSAP
  initAnimations();

  // Initialize Header Behavior
  initHeader();

  // Initialize Modal
  initModal();

  // Initialize FAQ Accordion
  initFAQ();

  // Initialize Circle Timeline
  initCircleTimeline();

  // Initialize Mobile Menu
  initMobileMenu();

  // Initialize Vanta Fog
  initVantaFog();

  // Initialize Waitlist Forms
  initWaitlistForms();

  // Update Copyright Year
  updateCopyrightYear();
});

// ==========================================
// Smooth Scroll
// ==========================================
function initLenis() {
  // Normal scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Close mobile menu if open
          document.getElementById('mobileMenu')?.classList.remove('active');
        }
      }
    });
  });
}

// ==========================================
// Split-Type and GSAP Animations
// ==========================================
function initAnimations() {
  // Wait for Split-Type to load
  if (typeof SplitType === 'undefined') {
    console.warn('Split-Type not loaded');
    return;
  }

  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Split text into spans
  const splitElements = document.querySelectorAll('[text-split]');
  splitElements.forEach(el => {
    if (!el.querySelector('.char')) {
      new SplitType(el, {
        types: 'words, chars',
        tagName: 'span'
      });
    }
  });

  // Create scroll-triggered animations
  function createScrollTrigger(triggerElement, timeline) {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top bottom',
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      }
    });
    ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top 90%',
      onEnter: () => timeline.play()
    });
  }

  // Animate elements with letters-slide-up
  document.querySelectorAll('[text-split]').forEach(el => {
    const chars = el.querySelectorAll('.char');
    if (chars.length === 0) return;

    const tl = gsap.timeline({ paused: true });
    tl.from(chars, {
      yPercent: 100,
      duration: 0.35,
      ease: 'power1.out',
      stagger: { amount: 0.6 }
    });
    createScrollTrigger(el, tl);
  });

  // Avoid flash of unstyled content
  gsap.set('[text-split]', { opacity: 1 });
}

// ==========================================
// Header Scroll Behavior
// ==========================================
function initHeader() {
  const header = document.getElementById('header');
  const trigger = document.getElementById('light-header-trigger');
  const logoWhite = document.querySelector('.logo-white');
  const logoBlack = document.querySelector('.logo-black');

  if (!header || !trigger) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        header.classList.add('header--light');
        if (logoWhite) logoWhite.style.display = 'block';
        if (logoBlack) logoBlack.style.display = 'none';
      } else {
        header.classList.remove('header--light');
        if (logoWhite) logoWhite.style.display = 'none';
        if (logoBlack) logoBlack.style.display = 'block';
      }
    },
    {
      rootMargin: '0px',
      threshold: 0.1
    }
  );

  observer.observe(trigger);
}

// ==========================================
// Waitlist Modal Functions
// ==========================================
function initModal() {
  const modal = document.getElementById('waitlistModal');
  const expander = document.getElementById('waitlistExpander');
  const content = document.getElementById('waitlistContent');
  const overlay = document.getElementById('waitlistOverlay');
  const closeBtn = document.getElementById('closeWaitlistModal');
  const openBtns = document.querySelectorAll('#openModalBtn');

  if (!modal || !expander) return;

  let isAnimating = false;

  function openModal(event) {
    if (isAnimating) return;
    isAnimating = true;

    const btn = event ? event.currentTarget : openBtns[0];
    const btnRect = btn.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top + btnRect.height / 2;

    // Calculate the maximum dimension to cover the entire screen
    const maxDim = Math.max(
      Math.hypot(centerX, centerY),
      Math.hypot(window.innerWidth - centerX, centerY),
      Math.hypot(centerX, window.innerHeight - centerY),
      Math.hypot(window.innerWidth - centerX, window.innerHeight - centerY)
    ) * 2;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Position expander at button center
    gsap.set(expander, {
      x: centerX,
      y: centerY,
      width: btnRect.width,
      height: btnRect.height,
      borderRadius: btnRect.height / 2,
      scale: 0,
      opacity: 1
    });

    // Animate expander from button shape to full circle covering screen
    gsap.to(expander, {
      width: maxDim,
      height: maxDim,
      borderRadius: maxDim / 2,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out'
    });

    // Fade in overlay after expander starts
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.3,
      delay: 0.15,
      ease: 'power2.out'
    });

    // Scale up content
    gsap.to(content, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      delay: 0.35,
      ease: 'power2.out',
      onComplete: () => {
        isAnimating = false;
      }
    });
  }

  function closeModal() {
    if (isAnimating) return;
    isAnimating = true;

    const btn = openBtns[0];
    if (!btn) {
      isAnimating = false;
      return;
    }
    const btnRect = btn.getBoundingClientRect();
    const centerX = btnRect.left + btnRect.width / 2;
    const centerY = btnRect.top + btnRect.height / 2;

    // Reset content
    gsap.to(content, {
      scale: 0.9,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    });

    // Fade overlay
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    });

    // Collapse expander back to button
    gsap.to(expander, {
      width: btnRect.width,
      height: btnRect.height,
      borderRadius: btnRect.height / 2,
      x: centerX,
      y: centerY,
      scale: 0,
      duration: 0.5,
      delay: 0.1,
      ease: 'power3.in',
      onComplete: () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        resetForm();
        isAnimating = false;
      }
    });
  }

  function resetForm() {
    const form = document.getElementById('waitlistFormModal');
    if (form) form.reset();
    const successMsg = document.getElementById('successMessageModal');
    const errorMsg = document.getElementById('errorMessageModal');
    const formEl = document.querySelector('.waitlist-modal__form');
    if (successMsg) successMsg.classList.remove('active');
    if (errorMsg) errorMsg.classList.remove('active');
    if (formEl) formEl.style.display = 'flex';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// ==========================================
// FAQ Accordion
// ==========================================
function initFAQ() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-head-wrapper');
    const content = item.querySelector('.item-content-wrapper');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      accordionItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
        }
      });

      // Toggle current
      item.classList.toggle('active');
    });
  });
}

// ==========================================
// Circle Timeline
// ==========================================
function initCircleTimeline() {
  const circleParent = document.querySelector('.circle');
  const circleItems = document.querySelectorAll('.circle-item');
  const timelineSection = document.getElementById('circle-timeline');

  if (!circleParent || circleItems.length === 0 || !timelineSection) return;

  const itemLength = circleItems.length;
  const rotateAmount = 360 / itemLength;
  let previousIndex = 0;
  let currentRotation = 0;
  let isSectionInView = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      isSectionInView = entry.isIntersecting;
    },
    { threshold: 0.5 }
  );

  observer.observe(timelineSection);

  function makeItemActiveByIndex(index) {
    if (index < 0) index = itemLength - 1;
    if (index >= itemLength) index = 0;

    const item = circleItems.eq ? circleItems.eq(index) : circleItems[index];
    const difference = index - previousIndex;
    const clockwiseRotation = (difference + itemLength) % itemLength;
    const counterclockwiseRotation = (itemLength - difference) % itemLength;
    const isClockwise = clockwiseRotation <= counterclockwiseRotation;
    const amount = (isClockwise ? clockwiseRotation : -counterclockwiseRotation) * rotateAmount;
    const total = currentRotation + amount;

    circleItems.forEach(ci => ci.classList.remove('current'));
    item.classList.add('current');
    circleParent.style.transform = `translate(-50%, -50%) rotate(${total * -1}deg)`;

    previousIndex = index;
    currentRotation = total;
  }

  // Initialize first item as current
  makeItemActiveByIndex(0);

  // Position items around circle
  circleItems.forEach((item, index) => {
    const rotation = rotateAmount * index;
    item.style.transform = `rotate(${rotation}deg)`;
  });

  // Scroll-based activation
  function handleScroll() {
    const track = document.querySelector('.scroll-track');
    if (!track) return;

    const scrollY = window.scrollY + window.innerHeight / 2;
    const trackTop = track.offsetTop;
    const trackHeight = track.offsetHeight;

    if (scrollY < trackTop || scrollY > trackTop + trackHeight) return;

    const progress = (scrollY - trackTop) / trackHeight;
    const totalSteps = 5;
    const index = Math.floor(progress * totalSteps);

    makeItemActiveByIndex(index);
  }

  // Use IntersectionObserver for scroll-based timeline
  const scrollTrack = document.querySelector('.scroll_section');
  if (scrollTrack) {
    ScrollTrigger.create({
      trigger: scrollTrack,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.min(Math.floor(progress * itemLength), itemLength - 1);
        makeItemActiveByIndex(index);
      }
    });
  }
}

// ==========================================
// Mobile Menu
// ==========================================
function initMobileMenu() {
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking links
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ==========================================
// Vanta Fog Effect
// ==========================================
function initVantaFog() {
  const vantaSection = document.getElementById('vanta-bg');
  if (!vantaSection) return;

  // Check if VANTA is available
  if (typeof VANTA === 'undefined') {
    console.warn('VANTA not loaded');
    return;
  }

  // Initialize Vanta Fog
  try {
    VANTA.FOG({
      el: vantaSection,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      highlightColor: 0xCAB190,
      midtoneColor: 0x874318,
      lowlightColor: 0x170903,
      baseColor: 0x170903,
      blurFactor: 1.0,
      speed: 1.5,
      zoom: 1.1
    });
  } catch (err) {
    console.warn('Vanta Fog initialization failed:', err);
  }
}

// ==========================================
// Waitlist Forms
// ==========================================
function initWaitlistForms() {
  // Modal form
  const modalForm = document.getElementById('waitlistFormModal');
  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleWaitlistSubmit(modalForm, 'modal');
    });
  }

  // Footer form
  const footerForm = document.getElementById('footerSubscribeForm');
  if (footerForm) {
    footerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = footerForm.querySelector('input[type="email"]')?.value;
      if (email) {
        await handleFooterSubmit(footerForm, email);
      }
    });
  }
}

async function handleWaitlistSubmit(form, type) {
  const firstName = form.querySelector('input[name="First-Name"]')?.value;
  const email = form.querySelector('input[type="email"]')?.value;
  const submitBtn = form.querySelector('.waitlist-form__submit');
  const successMsg = document.getElementById('successMessageModal');
  const errorMsg = document.getElementById('errorMessageModal');
  const formEl = document.querySelector('.waitlist-modal__form');

  if (!email) return;

  // Disable button
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Please wait...';
  }

  try {
    const response = await fetch('/api/waitlist/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstName })
    });

    const data = await response.json();

    if (response.ok) {
      if (formEl) formEl.style.display = 'none';
      if (successMsg) successMsg.classList.add('active');
    } else {
      if (errorMsg) {
        errorMsg.textContent = data.error || 'Something went wrong. Please try again.';
        errorMsg.classList.add('active');
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Join Waitlist';
      }
    }
  } catch (err) {
    if (errorMsg) {
      errorMsg.textContent = 'Connection error. Please try again.';
      errorMsg.classList.add('active');
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Join Waitlist';
    }
  }
}

async function handleFooterSubmit(form, email) {
  const submitBtn = form.querySelector('input[type="submit"]');
  const successMsg = document.getElementById('footerSuccessMsg');
  const errorMsg = document.getElementById('footerErrorMsg');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.value = '...';
  }

  try {
    const response = await fetch('/api/waitlist/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      form.style.display = 'none';
      if (successMsg) successMsg.classList.add('active');
    } else {
      if (errorMsg) errorMsg.classList.add('active');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.value = 'Ok';
      }
    }
  } catch (err) {
    if (errorMsg) errorMsg.classList.add('active');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.value = 'Ok';
    }
  }
}

// ==========================================
// Copyright Year
// ==========================================
function updateCopyrightYear() {
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(yearEl.getAttribute('data-year'), 10) || currentYear;
    if (currentYear > startYear) {
      yearEl.textContent = `${startYear}–${currentYear}`;
    } else {
      yearEl.textContent = `${currentYear}`;
    }
  }
}

// ==========================================
// Video Autoplay for Mobile
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  for (const video of document.getElementsByTagName('video')) {
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
  }
});
