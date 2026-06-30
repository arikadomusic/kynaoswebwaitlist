'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import SplashLoaderSwordReveal5 from '../../loader';

export default function EarlyAccess() {
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowLoader(true);
  };

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setShowSuccess(true);
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

        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .form-container {
          max-width: 600px;
          width: 100%;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .form-container.fade-out {
          opacity: 0;
          transform: translateY(-20px);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin-bottom: 2rem;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: #fff;
        }

        .form-header {
          margin-bottom: 2.5rem;
        }

        .form-header h1 {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
        }

        .brand-blue {
          color: #004dff;
        }

        .form-header p {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .form-box {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-field {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0;
          color: #fff;
          font-size: 1rem;
          font-family: inherit;
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

        .textarea-field {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0;
          color: #fff;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .textarea-field::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .textarea-field:focus {
          border-color: #004dff;
          background: rgba(255, 255, 255, 0.08);
          outline: none;
        }

        .submit-btn {
          padding: 1rem 2rem;
          background: #004dff;
          color: #fff;
          border: none;
          border-radius: 0;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
        }

        .submit-btn:hover {
          background: #000;
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .success-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem;
          animation: fadeIn 0.4s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: rgba(0, 77, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .success-icon svg {
          width: 32px;
          height: 32px;
          stroke: #004dff;
        }

        .success-message h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .success-message p {
          color: rgba(255, 255, 255, 0.6);
        }

        .back-btn {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: #004dff;
          color: #fff;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: 0;
          transition: background 0.2s ease;
        }

        .back-btn:hover {
          background: #003ecc;
        }
      `}</style>

      <AnimatePresence>
        {showLoader && <SplashLoaderSwordReveal5 onComplete={handleLoaderComplete} />}
      </AnimatePresence>

      {!showLoader && !showSuccess && (
      <div className="page">
        <div className="form-container">
          {!showSuccess ? (
            <>
              <Link href="/" className="back-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back to Home
              </Link>

              <div className="form-header">
                <h1>Join the Waitlist</h1>
                <p>Be the first to experience KYNAos when we launch.</p>
              </div>

              <form className="form-box" onSubmit={handleSubmit}>
                <input type="text" className="input-field" placeholder="First name" required />
                <input type="text" className="input-field" placeholder="Last name" required />
                <input type="email" className="input-field" placeholder="E-mail address" required />
                <input type="text" className="input-field" placeholder="Company name" />
                <textarea className="textarea-field" placeholder="Tell us about your business needs..."></textarea>
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </form>
            </>
          ) : (
            <div className="success-message">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h2>Thank You!</h2>
              <p>You have been added to the waitlist.</p>
              <Link href="/" className="back-btn">
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
      )}

      {showSuccess && (
      <div className="page">
        <div className="form-container">
            <div className="success-message">
              <div className="success-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h2>Thank You!</h2>
              <p>You have been added to the waitlist.</p>
              <Link href="/" className="back-btn">
                Back to Home
              </Link>
            </div>
        </div>
      </div>
      )}
    </>
  );
}
