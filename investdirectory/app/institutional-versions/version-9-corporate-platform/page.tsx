'use client';

import { useState } from 'react';
import ContactModal from '../../components/ContactModal';
import ImageCarousel from '../../components/ImageCarousel';
import StructuredData from '../../components/StructuredData';
import './styles.css';

export default function Version9CorporatePlatform() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <>
      <StructuredData />
      <nav className="platform-nav">
        <div className="nav-container">
          <div className="nav-left">
            <div className="logo">Termifi</div>
            <div className="nav-items">
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
      
      <section className="platform-hero">
        <div className="hero-container">
          <div className="hero-wrapper">
            <div className="hero-category">Enterprise Platform</div>
            <h1>Contract Intelligence<br />for Asset Management</h1>
            <p className="hero-description">
              Enterprise agreement management infrastructure designed for institutional asset managers
            </p>
            <div className="hero-metrics">
              <div className="metric-tile">
                <div className="metric-value">50%</div>
                <div className="metric-description">Faster Review</div>
              </div>
              <div className="metric-tile">
                <div className="metric-value">82%</div>
                <div className="metric-description">Less Admin</div>
              </div>
              <div className="metric-tile">
                <div className="metric-value">8–9%</div>
                <div className="metric-description">Value Recovery</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="platform-section">
        <div className="section-container">
          <div className="section-title-block">
            <div className="section-category">Market Context</div>
            <h2>Industry Overview</h2>
          </div>
          <div className="content-block">
            <div className="block-content">
              <p>
                AI creates value in asset management when it removes friction from regulated workflows. 
                Most firms still rely on PDFs, inboxes, and disconnected systems to manage agreements.
              </p>
              <p>
                Termifi provides a living contract layer—allowing approved terms to be surfaced instantly 
                while remaining anchored to the firm's authoritative contract record managed in Millie.
              </p>
            </div>
            <div className="block-alert">
              <div className="alert-header">
                <div className="alert-label">Industry Statistic</div>
              </div>
              <p>89% of businesses still lack a centralized contract system</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="platform-section alt-section" id="solution">
        <div className="section-container">
          <div className="section-title-block">
            <div className="section-category">Solution</div>
            <h2>Platform Capabilities</h2>
          </div>
          <div className="content-block">
            <div className="block-section">
              <div className="section-header-label">Challenge</div>
              <p>
                Contract management inefficiencies create significant value leakage across asset management—up to 40% 
                of contract value is lost, while 9 in 10 professionals struggle to locate agreements.
              </p>
            </div>
            <div className="block-section highlight">
              <div className="section-header-label">Solution</div>
              <p>
                Termifi solves this with a contract intelligence layer designed for asset managers operating at scale.
              </p>
            </div>
          </div>
          <div className="capabilities-block">
            <div className="capability-tile">
              <div className="tile-header">
                <div className="tile-icon">📁</div>
                <h3>Centralized Repository</h3>
              </div>
              <p>Portfolio agreements, side letters, and amendments governed within Millie</p>
            </div>
            <div className="capability-tile">
              <div className="tile-header">
                <div className="tile-icon">🔍</div>
                <h3>Clause Intelligence</h3>
              </div>
              <p>AI-driven extraction and normalization of key terms across funds and vehicles</p>
            </div>
            <div className="capability-tile">
              <div className="tile-header">
                <div className="tile-icon">🔔</div>
                <h3>Smart Alerts</h3>
              </div>
              <p>Automated monitoring of renewals, notice periods, and obligations</p>
            </div>
            <div className="capability-tile">
              <div className="tile-header">
                <div className="tile-icon">🔐</div>
                <h3>Controlled Access</h3>
              </div>
              <p>Permissioned views for business users and external stakeholders</p>
            </div>
          </div>
          <div className="system-alert">
            <div className="alert-label">System Note</div>
            <p>All contract logic and version control remain managed within Millie.</p>
          </div>
        </div>
      </section>
      
      <section className="platform-section dark-section">
        <div className="section-container">
          <div className="section-title-block">
            <div className="section-category">Platform</div>
            <h2>Interface Overview</h2>
          </div>
          <p className="section-intro-text">
            A unified platform for managing all LP agreements with complete transparency
          </p>
          <ImageCarousel />
          <div className="features-block">
            <div className="feature-tile">
              <div className="feature-icon">📄</div>
              <h3>Document Organization</h3>
              <p>All agreements, side letters, and amendments in one centralized view</p>
            </div>
            <div className="feature-tile">
              <div className="feature-icon">🔎</div>
              <h3>Clause Extraction</h3>
              <p>AI-powered extraction with source citations for every data point</p>
            </div>
            <div className="feature-tile">
              <div className="feature-icon">👁️</div>
              <h3>Live Preview</h3>
              <p>Instant access to original documents alongside structured data</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="platform-section">
        <div className="section-container">
          <div className="section-title-block">
            <div className="section-category">Governance</div>
            <h2>Access Model</h2>
          </div>
          <div className="content-block">
            <div className="principle-tile">
              <div className="principle-label">Governance Principle</div>
              <p>Legal defines the rules. Everyone else operates within them.</p>
            </div>
          </div>
          <div className="roles-block">
            <div className="role-tile">
              <div className="role-header-section">
                <div className="role-tag">Legal</div>
                <h3>Legal Teams</h3>
              </div>
              <p>Configure approved language, fallback positions, and risk thresholds in Millie</p>
            </div>
            <div className="role-tile">
              <div className="role-header-section">
                <div className="role-tag">Operations</div>
                <h3>Asset Management</h3>
              </div>
              <p>Retrieve answers without reopening agreements</p>
            </div>
            <div className="role-tile">
              <div className="role-header-section">
                <div className="role-tag">Compliance</div>
                <h3>Compliance & Risk</h3>
              </div>
              <p>Retain full auditability and evidence trails</p>
            </div>
          </div>
          <div className="system-alert">
            <div className="alert-label">Policy</div>
            <p>No shadow systems. No duplicated contracts.</p>
          </div>
        </div>
      </section>
      
      <section className="platform-section alt-section">
        <div className="section-container">
          <div className="section-title-block">
            <div className="section-category">Differentiators</div>
            <h2>Key Attributes</h2>
          </div>
          <div className="attributes-block">
            <div className="attribute-tile">
              <div className="attribute-number">01</div>
              <h3>Flexible Flat Fee Pricing</h3>
              <p>Not taking a percentage of AUM</p>
            </div>
            <div className="attribute-tile">
              <div className="attribute-number">02</div>
              <h3>No Contract Duplication</h3>
              <p>Always reflects the authoritative agreement record in Millie</p>
            </div>
            <div className="attribute-tile">
              <div className="attribute-number">03</div>
              <h3>Retail-Ready by Design</h3>
              <p>Structured outputs for non-legal users</p>
            </div>
            <div className="attribute-tile">
              <div className="attribute-number">04</div>
              <h3>Governance-First</h3>
              <p>Permissions, lineage, and controls embedded from the start</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="platform-section" id="platform">
        <div className="section-container">
          <div className="section-title-block">
            <div className="section-category">Architecture</div>
            <h2>System Foundation</h2>
          </div>
          <div className="content-block">
            <div className="architecture-tile">
              <h3>Built on Millie</h3>
              <p>
                Termifi is a dedicated access layer built on top of Millie, the enterprise contract platform 
                already used by asset managers to govern agreements firmwide.
              </p>
              <div className="capabilities-section">
                <div className="capabilities-header">This architecture enables:</div>
                <ul>
                  <li>Expose investor-relevant terms without distributing full contracts</li>
                  <li>Stay synchronized with legal-approved source documents</li>
                  <li>Maintain compliance, version control, and regulatory traceability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="platform-cta">
        <div className="cta-container">
          <div className="cta-category">Get Started</div>
          <h2>Ready to Transform Your Contract Management?</h2>
          <p>Built for asset managers expanding retail access—without compromising control.</p>
          <div className="cta-actions">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">View Demo</a>
            <a href="#" className="btn-secondary" onClick={handleContactClick}>Contact Sales</a>
          </div>
        </div>
      </section>
      
      <footer className="platform-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">Termifi</div>
            <div className="footer-copyright">© 2026 Termifi. Contract Intelligence Platform.</div>
          </div>
          <div className="footer-right">
            <div className="footer-menu">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/security">Security</a>
              <a href="#" onClick={handleContactClick}>Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </>
  );
}
