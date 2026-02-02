'use client';

import { useState } from 'react';
import ContactModal from '../../components/ContactModal';
import ImageCarousel from '../../components/ImageCarousel';
import StructuredData from '../../components/StructuredData';
import './styles.css';

export default function Version2MinimalistAuthority() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <>
      <StructuredData />
      <nav className="minimal-nav">
        <div className="nav-container">
          <div className="logo">TERMIFI</div>
          <div className="nav-links">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer">Demo</a>
            <a href="#solution">Solution</a>
            <a href="#platform">Platform</a>
            <a href="#" onClick={handleContactClick}>Contact</a>
          </div>
        </div>
      </nav>
      
      <section className="hero-minimal">
        <div className="hero-container">
          <h1>Contract Intelligence<br />for Asset Management</h1>
          <p className="hero-subtitle">Enterprise agreement management infrastructure</p>
        </div>
      </section>
      
      <section className="content-minimal">
        <div className="section-container">
          <div className="section-header">
            <h2>Impact</h2>
          </div>
          <div className="stats-minimal">
            <div className="stat-minimal">
              <div className="stat-number">50%</div>
              <div className="stat-desc">Reduction in contract review time</div>
            </div>
            <div className="stat-minimal">
              <div className="stat-number">82%</div>
              <div className="stat-desc">Reduction in administrative workload</div>
            </div>
            <div className="stat-minimal">
              <div className="stat-number">8–9%</div>
              <div className="stat-desc">Annual contract value recovered</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="content-minimal">
        <div className="section-container">
          <div className="section-header">
            <h2>Market Context</h2>
          </div>
          <div className="text-content">
            <p>AI creates value in asset management when it removes friction from regulated workflows.</p>
            <p>Most firms still rely on PDFs, inboxes, and disconnected systems to manage agreements. Termifi provides a living contract layer—allowing approved terms to be surfaced instantly while remaining anchored to the firm's authoritative contract record managed in Millie.</p>
            <p className="text-emphasis">89% of businesses still lack a centralized contract system.</p>
          </div>
        </div>
      </section>
      
      <section className="content-minimal" id="solution">
        <div className="section-container">
          <div className="section-header">
            <h2>Solution</h2>
          </div>
          <div className="text-content">
            <p className="text-large">
              Contract management inefficiencies create significant value leakage across asset management—up to 40% of contract value is lost, while 9 in 10 professionals struggle to locate agreements.
            </p>
            <p className="text-highlight">
              Termifi solves this with a contract intelligence layer designed for asset managers operating at scale.
            </p>
          </div>
          <div className="features-minimal">
            <div className="feature-minimal">
              <h3>Centralized Repository</h3>
              <p>Portfolio agreements, side letters, and amendments governed within Millie</p>
            </div>
            <div className="feature-minimal">
              <h3>Clause Intelligence</h3>
              <p>AI-driven extraction and normalization of key terms across funds and vehicles</p>
            </div>
            <div className="feature-minimal">
              <h3>Smart Alerts</h3>
              <p>Automated monitoring of renewals, notice periods, and obligations</p>
            </div>
            <div className="feature-minimal">
              <h3>Controlled Access</h3>
              <p>Permissioned views for business users and external stakeholders</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="content-minimal dark-minimal">
        <div className="section-container">
          <div className="section-header">
            <h2>Platform Overview</h2>
          </div>
          <ImageCarousel />
          <div className="capabilities-minimal">
            <div className="capability-minimal">
              <h3>Document Organization</h3>
              <p>All agreements, side letters, and amendments in one centralized view</p>
            </div>
            <div className="capability-minimal">
              <h3>Clause Extraction</h3>
              <p>AI-powered extraction with source citations for every data point</p>
            </div>
            <div className="capability-minimal">
              <h3>Live Preview</h3>
              <p>Instant access to original documents alongside structured data</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="content-minimal">
        <div className="section-container">
          <div className="section-header">
            <h2>Governance Model</h2>
          </div>
          <div className="text-content">
            <p className="text-subtitle">Legal defines the rules. Everyone else operates within them.</p>
          </div>
          <div className="roles-minimal">
            <div className="role-minimal">
              <h3>Legal Teams</h3>
              <p>Configure approved language, fallback positions, and risk thresholds in Millie</p>
            </div>
            <div className="role-minimal">
              <h3>Asset Management</h3>
              <p>Retrieve answers without reopening agreements</p>
            </div>
            <div className="role-minimal">
              <h3>Compliance & Risk</h3>
              <p>Retain full auditability and evidence trails</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="content-minimal">
        <div className="section-container">
          <div className="section-header">
            <h2>Differentiators</h2>
          </div>
          <div className="differentiators-minimal">
            <div className="differentiator-minimal">
              <h3>Flexible flat fee pricing</h3>
              <p>Not taking a percentage of AUM</p>
            </div>
            <div className="differentiator-minimal">
              <h3>No contract duplication</h3>
              <p>Always reflects the authoritative agreement record in Millie</p>
            </div>
            <div className="differentiator-minimal">
              <h3>Retail-ready by design</h3>
              <p>Structured outputs for non-legal users</p>
            </div>
            <div className="differentiator-minimal">
              <h3>Governance-first</h3>
              <p>Permissions, lineage, and controls embedded from the start</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="content-minimal" id="platform">
        <div className="section-container">
          <div className="section-header">
            <h2>Architecture</h2>
          </div>
          <div className="text-content">
            <h3>Built on Millie</h3>
            <p>
              Termifi is a dedicated access layer built on top of Millie, the enterprise contract platform already used by asset managers to govern agreements firmwide.
            </p>
            <p className="text-label">This allows Termifi to:</p>
            <ul className="list-minimal">
              <li>Expose investor-relevant terms without distributing full contracts</li>
              <li>Stay synchronized with legal-approved source documents</li>
              <li>Maintain compliance, version control, and regulatory traceability</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="cta-minimal">
        <div className="cta-container">
          <h2>Get Started</h2>
          <p>Built for asset managers expanding retail access—without compromising control.</p>
          <div className="cta-links">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer">View Demo</a>
            <a href="#" onClick={handleContactClick}>Contact</a>
          </div>
        </div>
      </section>
      
      <footer className="minimal-footer">
        <div className="footer-container">
          <div className="footer-text">© 2026 Termifi</div>
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
