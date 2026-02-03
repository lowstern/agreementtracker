'use client';

import { useState } from 'react';
import ContactModal from '../../components/ContactModal';
import ImageCarousel from '../../components/ImageCarousel';
import StructuredData from '../../components/StructuredData';
import './styles.css';

export default function Version1ClassicCorporate() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <>
      <StructuredData />
      <nav className="institutional-nav">
        <div className="nav-container">
          <div className="logo">TERMIFI</div>
          <div className="nav-links">
            <a href="https://agreement-tracker-frontend.onrender.com/" target="_blank" rel="noopener noreferrer">Demo</a>
            <a href="#solution">Solution</a>
            <a href="#platform">Platform</a>
            <a href="#" className="btn-nav" onClick={handleContactClick}>Contact</a>
          </div>
        </div>
      </nav>
      
      <section className="hero-section">
        <div className="hero-container">
          <h1>Contract Intelligence for Asset Management</h1>
          <p className="hero-subtitle">Enterprise agreement management infrastructure</p>
          <p className="hero-description">
            Termifi provides secure, permissioned access to contract terms for asset managers 
            expanding customized, retail-facing offerings—without duplicating agreements, processes, or controls.
          </p>
          <div className="hero-actions">
            <a href="https://agreement-tracker-frontend.onrender.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">View Demo</a>
            <a href="#" className="btn-secondary" onClick={handleContactClick}>Contact</a>
          </div>
        </div>
      </section>
      
      <section className="content-section">
        <div className="section-container">
          <h2>Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">50%</div>
              <div className="stat-label">Reduction in contract review time</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">82%</div>
              <div className="stat-label">Reduction in administrative workload</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">8–9%</div>
              <div className="stat-label">Annual contract value recovered</div>
            </div>
          </div>
          <div className="section-note">
            Faster investor responses, fewer bottlenecks, and stronger governance.
          </div>
        </div>
      </section>
      
      <section className="content-section alt-section">
        <div className="section-container">
          <h2>Market Context</h2>
          <div className="text-block">
            <p>AI creates value in asset management when it removes friction from regulated workflows.</p>
            <p>Most firms still rely on PDFs, inboxes, and disconnected systems to manage agreements. Termifi provides a living contract layer—allowing approved terms to be surfaced instantly while remaining anchored to the firm's authoritative contract record managed in Millie.</p>
            <p className="emphasis">89% of businesses still lack a centralized contract system.</p>
          </div>
        </div>
      </section>
      
      <section className="content-section" id="solution">
        <div className="section-container">
          <h2>Solution</h2>
          <div className="intro-text">
            <p className="large-text">
              Contract management inefficiencies create significant value leakage across asset management—up to 40% of contract value is lost, while 9 in 10 professionals struggle to locate agreements.
            </p>
            <p className="highlight-text">
              Termifi solves this with a contract intelligence layer designed for asset managers operating at scale.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Centralized Repository</h3>
              <p>Portfolio agreements, side letters, and amendments governed within Millie</p>
            </div>
            <div className="feature-item">
              <h3>Clause Intelligence</h3>
              <p>AI-driven extraction and normalization of key terms across funds and vehicles</p>
            </div>
            <div className="feature-item">
              <h3>Smart Alerts</h3>
              <p>Automated monitoring of renewals, notice periods, and obligations</p>
            </div>
            <div className="feature-item">
              <h3>Controlled Access</h3>
              <p>Permissioned views for business users and external stakeholders</p>
            </div>
          </div>
          <div className="section-note">
            All contract logic and version control remain managed within Millie.
          </div>
        </div>
      </section>
      
      <section className="content-section dark-section">
        <div className="section-container">
          <h2>Platform Overview</h2>
          <p className="section-subtitle">A unified platform for managing all LP agreements with complete transparency</p>
          <ImageCarousel />
          <div className="capabilities-grid">
            <div className="capability-item">
              <h3>Document Organization</h3>
              <p>All agreements, side letters, and amendments in one centralized view</p>
            </div>
            <div className="capability-item">
              <h3>Clause Extraction</h3>
              <p>AI-powered extraction with source citations for every data point</p>
            </div>
            <div className="capability-item">
              <h3>Live Preview</h3>
              <p>Instant access to original documents alongside structured data</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="content-section">
        <div className="section-container">
          <h2>Governance Model</h2>
          <p className="section-subtitle">Legal defines the rules. Everyone else operates within them.</p>
          <div className="roles-grid">
            <div className="role-item">
              <h3>Legal Teams</h3>
              <p>Configure approved language, fallback positions, and risk thresholds in Millie</p>
            </div>
            <div className="role-item">
              <h3>Asset Management</h3>
              <p>Retrieve answers without reopening agreements</p>
            </div>
            <div className="role-item">
              <h3>Compliance & Risk</h3>
              <p>Retain full auditability and evidence trails</p>
            </div>
          </div>
          <div className="section-note">
            No shadow systems. No duplicated contracts.
          </div>
        </div>
      </section>
      
      <section className="content-section alt-section">
        <div className="section-container">
          <h2>Differentiators</h2>
          <div className="differentiators-grid">
            <div className="differentiator-item">
              <h3>Flexible flat fee pricing</h3>
              <p>Not taking a percentage of AUM</p>
            </div>
            <div className="differentiator-item">
              <h3>No contract duplication</h3>
              <p>Always reflects the authoritative agreement record in Millie</p>
            </div>
            <div className="differentiator-item">
              <h3>Retail-ready by design</h3>
              <p>Structured outputs for non-legal users</p>
            </div>
            <div className="differentiator-item">
              <h3>Governance-first</h3>
              <p>Permissions, lineage, and controls embedded from the start</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="content-section" id="platform">
        <div className="section-container">
          <h2>Architecture</h2>
          <div className="architecture-block">
            <h3>Built on Millie</h3>
            <p className="intro">
              Termifi is a dedicated access layer built on top of Millie, the enterprise contract platform already used by asset managers to govern agreements firmwide.
            </p>
            <p className="list-title">This allows Termifi to:</p>
            <ul>
              <li>Expose investor-relevant terms without distributing full contracts</li>
              <li>Stay synchronized with legal-approved source documents</li>
              <li>Maintain compliance, version control, and regulatory traceability</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="cta-section">
        <div className="cta-container">
          <h2>Get Started</h2>
          <p>Built for asset managers expanding retail access—without compromising control.</p>
          <div className="cta-actions">
            <a href="https://agreement-tracker-frontend.onrender.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">View Demo</a>
            <a href="#" className="btn-secondary" onClick={handleContactClick}>Contact</a>
          </div>
        </div>
      </section>
      
      <footer className="institutional-footer">
        <div className="footer-container">
          <div className="footer-text">© 2026 Termifi · Contract Intelligence Platform</div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
            <a href="#" onClick={handleContactClick}>Contact</a>
          </div>
        </div>
      </footer>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </>
  );
}
