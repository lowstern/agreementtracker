'use client';

import { useState } from 'react';
import ContactModal from '../../components/ContactModal';
import ImageCarousel from '../../components/ImageCarousel';
import StructuredData from '../../components/StructuredData';
import './styles.css';

export default function Version5EnterpriseDashboard() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <>
      <StructuredData />
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-left">
            <div className="logo">Termifi</div>
            <div className="nav-menu">
              <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer">Demo</a>
              <a href="#solution">Solution</a>
              <a href="#platform">Platform</a>
            </div>
          </div>
          <div className="nav-right">
            <a href="#" onClick={handleContactClick} className="nav-action">Contact</a>
          </div>
        </div>
      </nav>
      
      <section className="dashboard-hero">
        <div className="hero-container">
          <div className="hero-header">
            <div className="hero-title-group">
              <div className="hero-label">Enterprise Platform</div>
              <h1>Contract Intelligence Platform</h1>
              <div className="hero-subtitle">Enterprise Agreement Management Infrastructure</div>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-box">
              <div className="stat-value">50%</div>
              <div className="stat-label">Review Time Reduction</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">82%</div>
              <div className="stat-label">Workload Reduction</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">8–9%</div>
              <div className="stat-label">Value Recovery</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Market Context</div>
            <h2>Overview</h2>
          </div>
          <div className="content-panel">
            <div className="panel-row">
              <div className="panel-content">
                <p>AI creates value in asset management when it removes friction from regulated workflows.</p>
                <p>Most firms still rely on PDFs, inboxes, and disconnected systems to manage agreements. Termifi provides a living contract layer—allowing approved terms to be surfaced instantly while remaining anchored to the firm's authoritative contract record managed in Millie.</p>
              </div>
            </div>
            <div className="panel-row highlight">
              <div className="panel-content">
                <div className="highlight-badge">Industry Statistic</div>
                <p className="highlight-text">89% of businesses still lack a centralized contract system.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section alt-section" id="solution">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Solution</div>
            <h2>Platform Capabilities</h2>
          </div>
          <div className="content-panel">
            <div className="panel-row">
              <div className="panel-content">
                <div className="section-sub-label">Challenge</div>
                <p className="large-text">
                  Contract management inefficiencies create significant value leakage across asset management—up to 40% of contract value is lost, while 9 in 10 professionals struggle to locate agreements.
                </p>
              </div>
            </div>
            <div className="panel-row">
              <div className="panel-content">
                <div className="section-sub-label">Solution</div>
                <p className="solution-text">
                  Termifi solves this with a contract intelligence layer designed for asset managers operating at scale.
                </p>
              </div>
            </div>
          </div>
          <div className="capabilities-grid">
            <div className="capability-panel">
              <div className="capability-header">
                <div className="capability-icon">📁</div>
                <h3>Centralized Repository</h3>
              </div>
              <p>Portfolio agreements, side letters, and amendments governed within Millie</p>
            </div>
            <div className="capability-panel">
              <div className="capability-header">
                <div className="capability-icon">🔍</div>
                <h3>Clause Intelligence</h3>
              </div>
              <p>AI-driven extraction and normalization of key terms across funds and vehicles</p>
            </div>
            <div className="capability-panel">
              <div className="capability-header">
                <div className="capability-icon">🔔</div>
                <h3>Smart Alerts</h3>
              </div>
              <p>Automated monitoring of renewals, notice periods, and obligations</p>
            </div>
            <div className="capability-panel">
              <div className="capability-header">
                <div className="capability-icon">🔐</div>
                <h3>Controlled Access</h3>
              </div>
              <p>Permissioned views for business users and external stakeholders</p>
            </div>
          </div>
          <div className="system-note">
            <span className="note-label">System Note:</span>
            <span className="note-text">All contract logic and version control remain managed within Millie.</span>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section dark-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Platform</div>
            <h2>Interface Overview</h2>
          </div>
          <div className="content-panel">
            <p className="section-description">A unified platform for managing all LP agreements with complete transparency</p>
          </div>
          <ImageCarousel />
          <div className="features-grid">
            <div className="feature-panel">
              <div className="feature-icon">📄</div>
              <h3>Document Organization</h3>
              <p>All agreements, side letters, and amendments in one centralized view</p>
            </div>
            <div className="feature-panel">
              <div className="feature-icon">🔎</div>
              <h3>Clause Extraction</h3>
              <p>AI-powered extraction with source citations for every data point</p>
            </div>
            <div className="feature-panel">
              <div className="feature-icon">👁️</div>
              <h3>Live Preview</h3>
              <p>Instant access to original documents alongside structured data</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Governance</div>
            <h2>Access Model</h2>
          </div>
          <div className="content-panel">
            <div className="panel-row">
              <div className="panel-content">
                <div className="section-sub-label">Governance Principle</div>
                <p>Legal defines the rules. Everyone else operates within them.</p>
              </div>
            </div>
          </div>
          <div className="roles-grid">
            <div className="role-panel">
              <div className="role-header">
                <div className="role-badge">Legal</div>
                <h3>Legal Teams</h3>
              </div>
              <p>Configure approved language, fallback positions, and risk thresholds in Millie</p>
            </div>
            <div className="role-panel">
              <div className="role-header">
                <div className="role-badge">Operations</div>
                <h3>Asset Management</h3>
              </div>
              <p>Retrieve answers without reopening agreements</p>
            </div>
            <div className="role-panel">
              <div className="role-header">
                <div className="role-badge">Compliance</div>
                <h3>Compliance & Risk</h3>
              </div>
              <p>Retain full auditability and evidence trails</p>
            </div>
          </div>
          <div className="system-note">
            <span className="note-label">Policy:</span>
            <span className="note-text">No shadow systems. No duplicated contracts.</span>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section alt-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Differentiators</div>
            <h2>Key Attributes</h2>
          </div>
          <div className="attributes-grid">
            <div className="attribute-panel">
              <div className="attribute-number">01</div>
              <h3>Flexible Flat Fee Pricing</h3>
              <p>Not taking a percentage of AUM</p>
            </div>
            <div className="attribute-panel">
              <div className="attribute-number">02</div>
              <h3>No Contract Duplication</h3>
              <p>Always reflects the authoritative agreement record in Millie</p>
            </div>
            <div className="attribute-panel">
              <div className="attribute-number">03</div>
              <h3>Retail-Ready by Design</h3>
              <p>Structured outputs for non-legal users</p>
            </div>
            <div className="attribute-panel">
              <div className="attribute-number">04</div>
              <h3>Governance-First</h3>
              <p>Permissions, lineage, and controls embedded from the start</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section" id="platform">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Architecture</div>
            <h2>System Foundation</h2>
          </div>
          <div className="content-panel">
            <div className="panel-row">
              <div className="panel-content">
                <div className="section-sub-label">Foundation</div>
                <h3>Built on Millie</h3>
                <p>
                  Termifi is a dedicated access layer built on top of Millie, the enterprise contract platform 
                  already used by asset managers to govern agreements firmwide.
                </p>
              </div>
            </div>
            <div className="panel-row">
              <div className="panel-content">
                <div className="section-sub-label">Capabilities</div>
                <p>This allows Termifi to:</p>
                <ul className="system-list">
                  <li>Expose investor-relevant terms without distributing full contracts</li>
                  <li>Stay synchronized with legal-approved source documents</li>
                  <li>Maintain compliance, version control, and regulatory traceability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-cta">
        <div className="cta-container">
          <div className="cta-header">
            <div className="cta-label">Get Started</div>
            <h2>Ready to Transform Your Contract Management?</h2>
          </div>
          <p>Built for asset managers expanding retail access—without compromising control.</p>
          <div className="cta-actions">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">VIEW DEMO</a>
            <a href="#" className="btn-secondary" onClick={handleContactClick}>CONTACT</a>
          </div>
        </div>
      </section>
      
      <footer className="dashboard-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-text">© 2026 Termifi | Contract Intelligence Platform</div>
          </div>
          <div className="footer-right">
            <div className="footer-links">
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
