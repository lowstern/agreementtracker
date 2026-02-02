'use client';

import { useState, useEffect } from 'react';
import './styles.css';

export default function Home() {
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    try {
      const cookiesAccepted = sessionStorage.getItem('termfi-cookies');
      if (!cookiesAccepted) {
        setTimeout(() => setShowCookieBanner(true), 800);
      }
    } catch (e) {
      setTimeout(() => setShowCookieBanner(true), 800);
    }
  }, []);

  const handleAcceptCookies = () => {
    try {
      sessionStorage.setItem('termfi-cookies', 'accepted');
    } catch (e) {
      // sessionStorage may be unavailable
    }
    setShowCookieBanner(false);
  };

  // Role selector splash - links go to actual routes
  return (
    <div className="role-splash">
      <div className="splash-container">
        <div className="splash-logo-container">
          <img src="/logo.svg" alt="Termfi" className="splash-logo" />
          <div className="splash-brand">
            <span className="splash-brand-name">Termfi</span>
            <span className="splash-brand-parent">by Millie</span>
          </div>
        </div>
        <h1 className="splash-title">Contract Intelligence for Financial Services</h1>
        <p className="splash-subtitle">Select your role to see how Termfi can help your team</p>
        
        <div className="role-selector">
          <a href="/legal" className="role-option">
            <div className="role-option-tag">Legal</div>
            <h3>Lawyers</h3>
            <p>Clause comparison and deviation analysis</p>
            <div className="role-arrow">→</div>
          </a>
          
          <a href="/wealth" className="role-option">
            <div className="role-option-tag">Distribution</div>
            <h3>Wealth & IR Teams</h3>
            <p>Visibility into bespoke fees and terms</p>
            <div className="role-arrow">→</div>
          </a>
          
          <a href="/ops" className="role-option">
            <div className="role-option-tag">Operations</div>
            <h3>Ops, Finance & Compliance</h3>
            <p>Audit-ready oversight with minimal friction</p>
            <div className="role-arrow">→</div>
          </a>
        </div>
      </div>
      
      {showCookieBanner && (
        <div className="cookie-banner">
          <div className="cookie-content">
            <p>We use cookies to enhance your experience and analyze site traffic. By continuing, you agree to our use of cookies.</p>
            <div className="cookie-buttons">
              <button className="cookie-btn-secondary" onClick={handleAcceptCookies}>Manage Preferences</button>
              <button className="cookie-btn-primary" onClick={handleAcceptCookies}>Accept All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
