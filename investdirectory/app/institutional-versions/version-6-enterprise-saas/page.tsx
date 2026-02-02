'use client';

import { useState } from 'react';
import ContactModal from '../../components/ContactModal';
import ImageCarousel from '../../components/ImageCarousel';
import StructuredData from '../../components/StructuredData';
import './styles.css';

export default function Version6EnterpriseSaaS() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <>
      <StructuredData />
      <nav className="saas-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="logo">Termifi</div>
          </div>
          <div className="nav-menu">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer">Demo</a>
            <a href="#solution">Solution</a>
            <a href="#platform">Platform</a>
            <a href="#" onClick={handleContactClick} className="nav-cta">Contact</a>
          </div>
        </div>
      </nav>
      
      <section className="saas-hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">Enterprise Platform</div>
            <h1>Contract Intelligence<br />for Asset Management</h1>
            <p className="hero-description">
              Enterprise agreement management infrastructure designed for institutional asset managers
            </p>
            <div className="hero-metrics">
              <div className="metric-card">
                <div className="metric-value">50%</div>
                <div className="metric-label">Faster Review</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">82%</div>
                <div className="metric-label">Less Admin Work</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">8–9%</div>
                <div className="metric-label">Value Recovery</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="saas-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Market Context</span>
            <h2>Industry Overview</h2>
          </div>
          <div className="content-card">
            <div className="card-content">
              <p>
                AI creates value in asset management when it removes friction from regulated workflows. 
                Most firms still rely on PDFs, inboxes, and disconnected systems to manage agreements.
              </p>
              <p>
                Termifi provides a living contract layer—allowing approved terms to be surfaced instantly 
                while remaining anchored to the firm's authoritative contract record managed in Millie.
              </p>
            </div>
            <div className="card-highlight">
              <div className="highlight-icon">📊</div>
              <div className="highlight-content">
                <div className="highlight-label">Industry Statistic</div>
                <p>89% of businesses still lack a centralized contract system</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="saas-section alt-section" id="solution">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Solution</span>
            <h2>Platform Capabilities</h2>
          </div>
          <div className="content-card">
            <div className="problem-statement">
              <h3>The Challenge</h3>
              <p>
                Contract management inefficiencies create significant value leakage across asset management—up to 40% 
                of contract value is lost, while 9 in 10 professionals struggle to locate agreements.
              </p>
            </div>
            <div className="solution-statement">
              <h3>Our Solution</h3>
              <p>
                Termifi solves this with a contract intelligence layer designed for asset managers operating at scale.
              </p>
            </div>
          </div>
          <div className="capabilities-grid">
            <div className="capability-card">
              <div className="capability-header">
                <div className="capability-icon">📁</div>
                <h3>Centralized Repository</h3>
              </div>
              <p>Portfolio agreements, side letters, and amendments governed within Millie</p>
            </div>
            <div className="capability-card">
              <div className="capability-header">
                <div className="capability-icon">🔍</div>
                <h3>Clause Intelligence</h3>
              </div>
              <p>AI-driven extraction and normalization of key terms across funds and vehicles</p>
            </div>
            <div className="capability-card">
              <div className="capability-header">
                <div className="capability-icon">🔔</div>
                <h3>Smart Alerts</h3>
              </div>
              <p>Automated monitoring of renewals, notice periods, and obligations</p>
            </div>
            <div className="capability-card">
              <div className="capability-header">
                <div className="capability-icon">🔐</div>
                <h3>Controlled Access</h3>
              </div>
              <p>Permissioned views for business users and external stakeholders</p>
            </div>
          </div>
          <div className="info-banner">
            <span className="info-label">System Note</span>
            <p>All contract logic and version control remain managed within Millie.</p>
          </div>
        </div>
      </section>
      
      <section className="saas-section dark-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Platform</span>
            <h2>Interface Overview</h2>
          </div>
          <p className="section-description">
            A unified platform for managing all LP agreements with complete transparency
          </p>
          <ImageCarousel />
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Document Organization</h3>
              <p>All agreements, side letters, and amendments in one centralized view</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔎</div>
              <h3>Clause Extraction</h3>
              <p>AI-powered extraction with source citations for every data point</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👁️</div>
              <h3>Live Preview</h3>
              <p>Instant access to original documents alongside structured data</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="saas-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Governance</span>
            <h2>Access Model</h2>
          </div>
          <div className="content-card">
            <div className="governance-principle">
              <h3>Governance Principle</h3>
              <p>Legal defines the rules. Everyone else operates within them.</p>
            </div>
          </div>
          <div className="roles-grid">
            <div className="role-card">
              <div className="role-badge">Legal</div>
              <h3>Legal Teams</h3>
              <p>Configure approved language, fallback positions, and risk thresholds in Millie</p>
            </div>
            <div className="role-card">
              <div className="role-badge">Operations</div>
              <h3>Asset Management</h3>
              <p>Retrieve answers without reopening agreements</p>
            </div>
            <div className="role-card">
              <div className="role-badge">Compliance</div>
              <h3>Compliance & Risk</h3>
              <p>Retain full auditability and evidence trails</p>
            </div>
          </div>
          <div className="info-banner">
            <span className="info-label">Policy</span>
            <p>No shadow systems. No duplicated contracts.</p>
          </div>
        </div>
      </section>
      
      <section className="saas-section alt-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Differentiators</span>
            <h2>Key Attributes</h2>
          </div>
          <div className="attributes-grid">
            <div className="attribute-card">
              <div className="attribute-number">01</div>
              <h3>Flexible Flat Fee Pricing</h3>
              <p>Not taking a percentage of AUM</p>
            </div>
            <div className="attribute-card">
              <div className="attribute-number">02</div>
              <h3>No Contract Duplication</h3>
              <p>Always reflects the authoritative agreement record in Millie</p>
            </div>
            <div className="attribute-card">
              <div className="attribute-number">03</div>
              <h3>Retail-Ready by Design</h3>
              <p>Structured outputs for non-legal users</p>
            </div>
            <div className="attribute-card">
              <div className="attribute-number">04</div>
              <h3>Governance-First</h3>
              <p>Permissions, lineage, and controls embedded from the start</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="saas-section" id="platform">
        <div className="section-container">
          <div className="section-header">
            <span className="section-badge">Architecture</span>
            <h2>System Foundation</h2>
          </div>
          <div className="content-card">
            <div className="architecture-content">
              <h3>Built on Millie</h3>
              <p>
                Termifi is a dedicated access layer built on top of Millie, the enterprise contract platform 
                already used by asset managers to govern agreements firmwide.
              </p>
              <div className="capabilities-list">
                <h4>This architecture enables:</h4>
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
      
      <section className="saas-cta">
        <div className="cta-container">
          <div className="cta-content">
            <span className="cta-badge">Get Started</span>
            <h2>Ready to Transform Your Contract Management?</h2>
            <p>Built for asset managers expanding retail access—without compromising control.</p>
            <div className="cta-actions">
              <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">View Demo</a>
              <a href="#" className="btn-secondary" onClick={handleContactClick}>Contact Sales</a>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="saas-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">Termifi</div>
            <div className="footer-text">© 2026 Termifi. Contract Intelligence Platform.</div>
          </div>
          <div className="footer-right">
            <div className="footer-links">
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
