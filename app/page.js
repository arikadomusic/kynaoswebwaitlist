'use client';

import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [ctaOpen, setCtaOpen] = useState(false);
  const buttonRef = useRef(null);
  const overlayRef = useRef(null);
  const formContainerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const splashRef = useRef(null);
  const introTextRef = useRef(null);
  const brandRevealRef = useRef(null);
  const successDialogRef = useRef(null);

  useEffect(() => {
    // Create GSAP ease
    gsap.defaults({ ease: 'power3.out' });

    // Splash screen intro animation
    if (splashRef.current && introTextRef.current && brandRevealRef.current) {
      const tl = gsap.timeline();

      // Phase 1: Animate intro text in
      tl.to(introTextRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      // Phase 2: Animate brand name in (slightly delayed)
      .to(brandRevealRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5')
      // Phase 3: Hold for a moment
      .to({}, { duration: 0.6 })
      // Phase 4: Slide splash up and away
      .to(splashRef.current, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.2,
        ease: 'power4.inOut'
      })
      .set(splashRef.current, { display: 'none' }, '-=0.1');
    }

    // Set initial states
    if (formContainerRef.current) {
      gsap.set(formContainerRef.current, { opacity: 0, scale: 0.9 });
    }
    if (closeBtnRef.current) {
      gsap.set(closeBtnRef.current, { opacity: 0, rotation: -90 });
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleCtaClick = () => {
    if (!buttonRef.current || !overlayRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const overlay = overlayRef.current;

    // Reset form container and close button before animating
    if (formContainerRef.current) {
      gsap.set(formContainerRef.current, { opacity: 0, scale: 0.9 });
    }
    if (closeBtnRef.current) {
      gsap.set(closeBtnRef.current, { opacity: 0, rotation: -90 });
    }

    // Create expansion timeline
    const tl = gsap.timeline();

    // Position overlay at button's exact position (top-left corner of button)
    // Using x/y to offset from the default top:0, left:0 position
    gsap.set(overlay, {
      visibility: 'visible',
      opacity: 1,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      scaleX: 1,
      scaleY: 1,
      transformOrigin: 'center center'
    });

    // Phase 1: Expand horizontally first (0 to full width)
    tl.to(overlay, {
      x: 0,
      y: 0,
      width: '100vw',
      height: '100vh',
      duration: 0.35,
      ease: 'power3.inOut'
    });

    // Phase 2: Expand vertically (0 to full height)
    tl.to(overlay, {
      duration: 0.45,
      ease: 'power3.inOut'
    }, '-=0.15');

    // Fade in form content
    tl.to(formContainerRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.3');

    // Animate close button
    tl.to(closeBtnRef.current, {
      opacity: 1,
      rotation: 0,
      duration: 0.3,
      ease: 'power2.out'
    }, '-=0.2');

    setCtaOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseCta = () => {
    if (!buttonRef.current || !overlayRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const tl = gsap.timeline({ onComplete: () => {
      setCtaOpen(false);
      document.body.style.overflow = '';
      gsap.set(overlayRef.current, { visibility: 'hidden' });
    }});

    // Fade out form content
    tl.to(formContainerRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.2,
      ease: 'power2.in'
    });

    // Hide close button
    tl.to(closeBtnRef.current, {
      opacity: 0,
      rotation: -90,
      duration: 0.15,
      ease: 'power2.in'
    }, '-=0.1');

    // Collapse back to button position
    tl.to(overlayRef.current, {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      duration: 0.3,
      ease: 'power3.inOut'
    }, '+=0.1');

    // Final collapse to nothing
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        // Reset form state for next open
        const form = document.querySelector('.cta-form');
        if (form) {
          const formBox = form.querySelector('.form-box');
          if (formBox) formBox.style.display = 'flex';
          form.reset();
        }
        if (successDialogRef.current) {
          successDialogRef.current.style.display = 'none';
          gsap.set(successDialogRef.current, { opacity: 0, scale: 0.8, y: 20 });
        }
      }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      company: formData.get('company'),
      message: formData.get('message')
    };

    const submitBtn = form.querySelector('.submit-btn');
    const successMsg = document.getElementById('ctaSuccessMsg');
    const errorMsg = document.getElementById('ctaErrorMsg');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    try {
      const response = await fetch('https://formspree.io/f/xwvdnbka', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Hide form box and show success dialog
        const formBox = form.querySelector('.form-box');
        if (formBox) formBox.style.display = 'none';

        // Show success dialog
        if (successDialogRef.current) {
          successDialogRef.current.style.display = 'flex';
          gsap.fromTo(successDialogRef.current,
            { opacity: 0, scale: 0.8, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          );
        }
      } else {
        const result = await response.json();
        if (errorMsg) {
          errorMsg.textContent = result.error || 'Something went wrong.';
          errorMsg.classList.add('active');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }
      }
    } catch (error) {
      if (errorMsg) {
        errorMsg.textContent = 'Connection error. Please try again.';
        errorMsg.classList.add('active');
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      firstName: formData.get('firstName'),
      email: formData.get('email')
    };

    const submitBtn = form.querySelector('.subscribe-footer');
    const successMsg = document.querySelector('.newsletter-success');
    const errorMsg = document.querySelector('.newsletter-error');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '...';
    }

    try {
      const response = await fetch('https://formspree.io/f/xwvdnbka', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        form.reset();
        if (successMsg) successMsg.style.display = 'block';
        if (errorMsg) errorMsg.style.display = 'none';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }
      }
    } catch (error) {
      if (errorMsg) errorMsg.style.display = 'block';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: var(--font-plus), 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0a0a0a;
          color: #fff;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        ul {
          list-style: none;
        }

        /* Header */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 1.5rem 3rem;
          display: flex;
          align-items: center;
          z-index: 100;
        }

        .header__logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header__logo img {
          height: 32px;
          width: auto;
        }

        .header__logo-text {
          height: 24px;
          width: auto;
        }

        /* Splash Screen */
        .splash {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          clip-path: inset(0 0 0 0);
        }

        .splash-text {
          font-family: var(--font-plus), 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2rem, 6vw, 4rem);
          font-weight: 600;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(0.5rem, 2vw, 1.5rem);
        }

        .intro-text {
          opacity: 0;
          transform: translateX(-20px);
        }

        .brand-reveal {
          color: #004dff;
          opacity: 0;
          transform: translateX(20px);
        }

        /* Hero Section */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .background-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .overlay-video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }

        .video-box {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .video-box video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .wrapper-hero {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 12rem 2rem 6rem;
          text-align: center;
        }

        .wrapper-hero h1 {
          font-family: var(--font-plus), 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 700;
          line-height: 1.05;
          margin-bottom: 2rem;
          letter-spacing: -0.03em;
          color: #fff;
        }

        .brand-blue {
          color: #004dff;
        }

        .bottom-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3rem;
        }

        .cms-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
        }

        .list-hero {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          max-width: 280px;
          text-align: left;
        }

        .icon-box {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-box svg {
          width: 100%;
          height: 100%;
          stroke: #ffffff;
          fill: none;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .flexbox-title {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .title-txt {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
        }

        .descript-txt {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
        }

        .subhead-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .heading {
          font-family: var(--font-plus), 'Plus Jakarta Sans', sans-serif;
          font-size: 1.5rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.4;
        }

        .button-link {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          background: #004dff;
          color: #ffffff;
          font-size: 0.9375rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .button-link:hover {
          background: #000;
        }

        .circle-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          margin-left: 0.5rem;
          transition: transform 0.5s cubic-bezier(0.625, 0.05, 0, 1);
        }

        .button-link:hover .circle-link {
          transform: translateX(4px);
        }

        .arrow-icon img {
          filter: brightness(0) invert(1);
        }

        /* CTA Overlay */
        .cta-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background: #0a0a0a;
          overflow: hidden;
          visibility: hidden;
        }

        .cta-form-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cta-close {
          position: absolute;
          top: 2rem;
          right: 2rem;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10001;
          background: #000;
          border-radius: 50%;
        }

        .cta-close svg {
          stroke: #fff;
        }

        .cta-close:hover {
          background: #333;
        }

        .cta-form {
          max-width: 500px;
          width: 100%;
          padding: 2rem;
        }

        .cta-form h2 {
          font-size: 2rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .cta-form p {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 2rem;
        }

        .cta-form .form-box {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cta-form .input-field {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .cta-form .input-field::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .cta-form .input-field:focus {
          border-color: #004dff;
          background: rgba(255, 255, 255, 0.08);
          outline: none;
        }

        .cta-form .submit-btn {
          padding: 1rem 2rem;
          background: #004dff;
          color: #fff;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .cta-form .submit-btn:hover {
          background: #000;
        }

        /* Footer Section */
        .footer {
          position: relative;
          background: #0a0a0a;
          padding: 4rem 2rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .wrapper-footer {
          max-width: 1400px;
          margin: 0 auto;
        }

        .grid-footer {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
          align-items: start;
        }

        .newsletter {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .separator {
          width: 1px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
        }

        .right-text {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .right-text h3 {
          font-size: 2rem;
          font-weight: 600;
          color: #fff;
          line-height: 1.3;
        }

        .right-text p {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }

        .sitemap, .company, .additional {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .title-box {
          margin-bottom: 0.5rem;
        }

        .title-footer {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.5);
        }

        .list-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: #fff;
        }

        .inputs-newsletter {
          display: flex;
          gap: 0.75rem;
        }

        .inputs-newsletter .field-box {
          flex: 2;
        }

        .input-field {
          width: 100%;
          padding: 0.875rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 0.875rem;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .input-field:focus {
          border-color: #004dff;
          background: rgba(255, 255, 255, 0.08);
          outline: none;
        }

        .subscribe-footer {
          padding: 0.875rem 1.5rem;
          background: #004dff;
          color: #fff;
          border: none;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .subscribe-footer:hover {
          background: #0033cc;
          transform: translateY(-1px);
        }

        .newsletter-success, .newsletter-error {
          display: none;
          margin-top: 1rem;
          font-size: 0.875rem;
        }

        .newsletter-success {
          color: #4ade80;
        }

        .newsletter-error {
          color: #ef4444;
        }

        .socials-circles {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .social-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .social-circle:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .social-circle img {
          width: 20px;
          height: 20px;
          object-fit: contain;
        }

        .last-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 2rem;
        }

        .flex-footer-line {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .typo-kynaos {
          position: relative;
          overflow: hidden;
        }

        .kynaos-typo {
          font-family: var(--font-plus), 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(4rem, 15vw, 12rem);
          font-weight: 700;
          background: linear-gradient(to right, #004dff 50%, rgba(255, 255, 255, 0.1) 50%);
          background-size: 200% 100%;
          background-position: right bottom;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 0.9;
          text-align: right;
          user-select: none;
          transition: background-position 0.6s ease;
        }

        .kynaos-typo:hover {
          background-position: left bottom;
        }

        .typo-kynaos-full {
          width: 100%;
          overflow: hidden;
        }

        .kynaos-typo-full {
          font-family: var(--font-plus), 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(6rem, 20vw, 16rem);
          font-weight: 700;
          background: linear-gradient(to right, #004dff 50%, rgba(255, 255, 255, 0.1) 50%);
          background-size: 200% 100%;
          background-position: right bottom;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 0.85;
          text-align: center;
          user-select: none;
          transition: background-position 0.6s ease;
        }

        .kynaos-typo-full:hover {
          background-position: left bottom;
        }

        .success-message, .error-message {
          display: none;
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
        }

        .success-message {
          background: rgba(74, 222, 128, 0.1);
          color: #4ade80;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .success-dialog {
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 2rem;
          opacity: 0;
        }

        .success-dialog.active {
          display: flex;
        }

        .success-dialog__icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(74, 222, 128, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .success-dialog h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .success-dialog p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        .back-home-btn {
          padding: 0.875rem 2rem;
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-home-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .mobile-only {
          display: none;
        }

        @media screen and (max-width: 1024px) {
          .grid-footer {
            grid-template-columns: repeat(2, 1fr);
          }

          .newsletter {
            grid-column: span 2;
          }
        }

        @media screen and (max-width: 768px) {
          .grid-footer {
            grid-template-columns: 1fr;
          }

          .newsletter {
            grid-column: span 1;
          }

          .inputs-newsletter {
            flex-direction: column;
          }

          .kynaos-typo {
            font-size: clamp(3rem, 20vw, 8rem);
          }

          .last-line {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: flex;
          }
        }
      `}</style>

      {/* Splash Screen */}
      <div className="splash" ref={splashRef}>
        <div className="splash-text">
          <span className="intro-text" ref={introTextRef}>Introducing</span>
          <span className="brand-reveal" ref={brandRevealRef}>KYNAos</span>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header__logo">
          <img src="/kynalogoo.png" alt="KYNAos Logo" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="background-video">
          <div className="overlay-video"></div>
          <div className="video-box">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            >
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="wrapper-hero">
          <div>
            <h1 className="h1">Introducing <span className="brand-blue">KYNAos</span></h1>
          </div>
          <div className="bottom-hero">
            <div className="cms-list">
              <div className="list-hero">
                <div className="icon-box">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="flexbox-title">
                  <div className="title-txt">No Code / Low Code AI</div>
                  <div className="descript-txt">Build powerful automations without writing a single line of code.</div>
                </div>
              </div>
              <div className="list-hero">
                <div className="icon-box">
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18"/>
                    <path d="M9 21V9"/>
                  </svg>
                </div>
                <div className="flexbox-title">
                  <div className="title-txt">The Simplest Workspace</div>
                  <div className="descript-txt">Everything you need, nothing you don't. Designed for clarity.</div>
                </div>
              </div>
              <div className="list-hero">
                <div className="icon-box">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 3v18h18"/>
                    <path d="M18 9l-5 5-4-4-3 3"/>
                  </svg>
                </div>
                <div className="flexbox-title">
                  <div className="title-txt">The Useful ERP</div>
                  <div className="descript-txt">Real automation that actually works. No complexity, just results.</div>
                </div>
              </div>
            </div>
            <div className="subhead-link">
              <h2 className="heading">The simplest way to automate<br/>your business with AI.</h2>
              <button ref={buttonRef} onClick={handleCtaClick} className="button-link">
                <span>Join the Waitlist</span>
                <div className="circle-link">
                  <div className="arrow-icon">
                    <img src="https://cdn.prod.website-files.com/679d8b01c23ed7847fc5108f/6819ec297e6347786f9815eb_arrow_button.svg" alt="Arrow" width="16" height="16" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="wrapper-footer">
          <div className="grid-footer">
            {/* Newsletter */}
            <div className="newsletter">
              <div className="title-box">
                <div className="title-footer">Newsletter</div>
              </div>
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="inputs-newsletter">
                  <div className="field-box">
                    <input name="firstName" className="input-field" type="text" placeholder="First name" required />
                  </div>
                  <div className="field-box">
                    <input name="email" className="input-field" type="email" placeholder="E-mail address" required />
                  </div>
                </div>
                <button type="submit" className="subscribe-footer">Submit</button>
              </form>
              <div className="newsletter-success">Thank you! Your submission has been received!</div>
              <div className="newsletter-error">Oops! Something went wrong while submitting the form.</div>
            </div>

            {/* Vertical Separator */}
            <div className="separator"></div>

            {/* Right Content - Text */}
            <div className="right-text">
              <h3>Unified Business Intelligence</h3>
              <p>Workflow, Workspace, and ERP unified, seamless, powerful.</p>
              <p>From daily tasks to enterprise decisions, KYNA OS runs it all.</p>
              <p>Stop switching tools. Start running smarter.</p>
            </div>
          </div>

          {/* Full Width KYNAos */}
          <div className="typo-kynaos-full">
            <div className="kynaos-typo-full">KYNAos</div>
          </div>

          {/* Last Line */}
          <div className="last-line">
            <div className="flex-footer-line">
              2026 © KYNAos
            </div>
          </div>
        </div>
      </footer>

      {/* CTA Expand Overlay */}
      <div className="cta-overlay" ref={overlayRef}>
        <div className="cta-form-container" ref={formContainerRef}>
          <button className="cta-close" ref={closeBtnRef} onClick={handleCloseCta}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <form className="cta-form" onSubmit={handleFormSubmit}>
            <h2>Join the Waitlist</h2>
            <p>Be the first to experience KYNAos when we launch.</p>
            <div className="form-box">
              <input type="text" name="firstName" className="input-field" placeholder="First name" required />
              <input type="text" name="lastName" className="input-field" placeholder="Last name" required />
              <input type="email" name="email" className="input-field" placeholder="E-mail address" required />
              <input type="text" name="company" className="input-field" placeholder="Company name" />
              <textarea name="message" className="input-field" placeholder="Tell us about your business needs..." style={{ minHeight: '120px', resize: 'vertical' }}></textarea>
              <button type="submit" className="submit-btn">Submit</button>
            </div>
            <div className="success-dialog" ref={successDialogRef}>
              <div className="success-dialog__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>You're on the list!</h3>
              <p>We'll be in touch soon. Thank you for your interest in KYNAos.</p>
              <button className="back-home-btn" onClick={handleCloseCta}>Back to Home</button>
            </div>
            <div className="error-message" id="ctaErrorMsg"></div>
          </form>
        </div>
      </div>
    </>
  );
}
