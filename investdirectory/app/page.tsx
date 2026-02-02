'use client';

import { useState } from 'react';
import ContactModal from './components/ContactModal';
import ImageCarousel from './components/ImageCarousel';
import StructuredData from './components/StructuredData';
import './styles.css';

export default function Home() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <>
      <StructuredData />
      <nav className="business-nav">
        <div className="nav-container">
          <div className="nav-left">
            <div className="logo">Termfi</div>
            <div className="nav-separator"></div>
            <div className="nav-menu">
              <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer">Demo</a>
              <a href="#solution">Solution</a>
              <a href="#platform">Platform</a>
            </div>
          </div>
          <div className="nav-right">
            <a href="#" onClick={handleContactClick} className="btn-contact">Contact</a>
          </div>
        </div>
      </nav>
      
      <section className="business-hero">
        <div className="hero-container">
          <div className="hero-layout">
            <div className="hero-logo-container">
              <img src="/logo.svg" alt="Termfi" className="hero-logo" />
            </div>
            <div className="hero-section">
              <div className="hero-label">Contract Intelligence for Financial Services</div>
              <h1>Fast, Data-Centric Contract Management</h1>
              <p className="hero-subtitle">Turn contracts into structured, usable data — quickly.</p>
              <p className="hero-description">
                Minimize manual inputs, no over-engineered workflows. We read contracts with AI and surface 
                the financial and non-financial terms that matter, so teams can understand and act on what was actually agreed.
              </p>
              <div className="hero-cta">
                <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn-hero-primary">View Demo</a>
                <a href="#" onClick={handleContactClick} className="btn-hero-secondary">Get in Touch</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="business-section">
        <div className="section-container">
          <div className="section-title-area">
            <div className="section-category">Who It's For</div>
            <h2>Built for Your Team</h2>
          </div>
          <div className="roles-section">
            <div className="role-item">
              <div className="role-header">
                <div className="role-tag">Legal</div>
                <h3>Lawyers</h3>
              </div>
              <p>Clause comparison and deviation analysis</p>
            </div>
            <div className="role-item">
              <div className="role-header">
                <div className="role-tag">Distribution</div>
                <h3>Wealth & IR Teams</h3>
              </div>
              <p>Visibility into bespoke fees and terms</p>
            </div>
            <div className="role-item">
              <div className="role-header">
                <div className="role-tag">Operations</div>
                <h3>Ops, Finance & Compliance</h3>
              </div>
              <p>Audit-ready oversight with minimal friction</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="business-section alt-section">
        <div className="section-container">
          <div className="section-title-area">
            <div className="section-category">The Challenge</div>
            <h2>Institutional to Wealth Distribution</h2>
          </div>
          <div className="content-panel">
            <div className="panel-section">
              <p>
                As large institutional investors expand into wealth, the operating model fundamentally changes. 
                Servicing twenty $1M accounts is operationally very different from servicing one $20M institutional investor.
              </p>
              <p>
                Manual input and spreadsheet-driven processes don't scale when contracts need to be applied consistently 
                across thousands of individual accounts.
              </p>
            </div>
            <div className="solution-box">
              <div className="box-label">How Termfi Helps</div>
              <p>
                Termfi is built to automate this complexity by reading contracts once and applying their terms 
                programmatically at scale — reducing operational risk while supporting growth into wealth distribution.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="business-section dark-section" id="solution">
        <div className="section-container">
          <div className="section-title-area">
            <div className="section-category">Platform Features</div>
            <h2>Interface Overview</h2>
          </div>
          <p className="section-intro">
            A unified platform for managing all LP agreements with complete transparency
          </p>
          <ImageCarousel />
          <div className="features-section">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📄</div>
              </div>
              <h3>Document Organization</h3>
              <p>All agreements, side letters, and amendments in one centralized view</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🔍</div>
              </div>
              <h3>Clause Extraction</h3>
              <p>AI-powered extraction with source citations for every data point</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">👁️</div>
              </div>
              <h3>Live Preview</h3>
              <p>Instant access to original documents alongside structured data</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="business-section">
        <div className="section-container">
          <div className="section-title-area">
            <div className="section-category">Implementation</div>
            <h2>Fast Implementation (We Hate Meetings)</h2>
          </div>
          <div className="content-panel">
            <div className="panel-section">
              <p className="panel-lead">Termfi is designed to move fast and stay focused.</p>
            </div>
          </div>
          <div className="capabilities-section">
            <div className="capability-row">
              <div className="capability-item">
                <div className="item-header">
                  <div className="item-number">1</div>
                  <h3>Streamlined Implementation</h3>
                </div>
                <p>Clear ownership and outcomes at every step</p>
              </div>
              <div className="capability-item">
                <div className="item-header">
                  <div className="item-number">2</div>
                  <h3>Minimal Standing Meetings</h3>
                </div>
                <p>We prioritize execution over ceremony</p>
              </div>
            </div>
            <div className="capability-row">
              <div className="capability-item">
                <div className="item-header">
                  <div className="item-number">3</div>
                  <h3>Dedicated Professional Services</h3>
                </div>
                <p>Configure rules and logic alongside your team</p>
              </div>
              <div className="capability-item">
                <div className="item-header">
                  <div className="item-number">4</div>
                  <h3>Account-Level Reconciliation</h3>
                </div>
                <p>Support accurate revenue aggregation across products and clients</p>
              </div>
            </div>
          </div>
          <div className="system-notice">
            <div className="notice-label">Outcome</div>
            <p>Faster time to value with a clean, auditable setup.</p>
          </div>
        </div>
      </section>
      
      <section className="business-section alt-section" id="platform">
        <div className="section-container">
          <div className="section-title-area">
            <div className="section-category">Platform Design</div>
            <h2>Configurable by Design</h2>
          </div>
          <div className="differentiators-grid">
            <div className="differentiator-item">
              <div className="diff-number">01</div>
              <h3>Flexible Data Models</h3>
              <p>Fees, rebates, obligations, and hierarchies</p>
            </div>
            <div className="differentiator-item">
              <div className="diff-number">02</div>
              <h3>Evolving Support</h3>
              <p>Supports evolving products, counterparties, and agreement structures</p>
            </div>
            <div className="differentiator-item">
              <div className="diff-number">03</div>
              <h3>AI from Day One</h3>
              <p>AI capabilities are available from day one</p>
            </div>
            <div className="differentiator-item">
              <div className="diff-number">04</div>
              <h3>Adaptive Configuration</h3>
              <p>Configuration adapts as your business changes</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="business-section">
        <div className="section-container">
          <div className="section-title-area">
            <div className="section-category">Validation</div>
            <h2>Hypothetical Test Cases (Validate Before Go-Live)</h2>
          </div>
          <div className="content-panel">
            <div className="panel-section">
              <p className="panel-lead">
                Termfi supports hypothetical scenarios so teams can validate behavior early.
              </p>
            </div>
          </div>
          <div className="content-panel">
            <div className="panel-section">
              <div className="box-label">We Help Identify:</div>
              <ul className="check-list">
                <li>Representative contract types (master, side letter, amendment)</li>
                <li>Key fee, rebate, and breakpoint scenarios</li>
                <li>Relevant edge cases (bespoke language, legacy contracts)</li>
              </ul>
            </div>
            <div className="panel-highlight">
              <div className="highlight-title">Your Role</div>
              <p>You bring the contracts that reflect real complexity — we walk through how Termfi handles them before production.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="business-cta">
        <div className="cta-container">
          <div className="cta-label">Get Started</div>
          <h2>Ready to Transform Your Contract Management?</h2>
          <p>Turn contracts into structured, actionable data — quickly.</p>
          <div className="cta-buttons">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">View Demo</a>
            <a href="#" className="btn-secondary" onClick={handleContactClick}>Contact Us</a>
          </div>
        </div>
      </section>
      
      <footer className="business-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">Termfi</div>
            <div className="footer-copyright">© 2026 Termfi. Contract Intelligence Platform.</div>
          </div>
          <div className="footer-right">
            <div className="footer-menu">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
              <a href="#" onClick={handleContactClick}>Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </>
  );
}
