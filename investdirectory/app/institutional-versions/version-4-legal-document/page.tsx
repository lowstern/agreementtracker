'use client';

import { useState } from 'react';
import ContactModal from '../../components/ContactModal';
import ImageCarousel from '../../components/ImageCarousel';
import StructuredData from '../../components/StructuredData';
import './styles.css';

export default function Version4LegalDocument() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <>
      <StructuredData />
      <nav className="legal-nav">
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
      
      <section className="legal-header">
        <div className="header-container">
          <div className="document-meta">
            <div className="meta-line">
              <span className="meta-label">Document Type:</span>
              <span className="meta-value">Platform Overview</span>
            </div>
            <div className="meta-line">
              <span className="meta-label">Entity:</span>
              <span className="meta-value">Termifi, Inc.</span>
            </div>
            <div className="meta-line">
              <span className="meta-label">Date:</span>
              <span className="meta-value">2026</span>
            </div>
          </div>
          <h1>Contract Intelligence Platform<br />for Asset Management</h1>
          <p className="document-subtitle">Enterprise Agreement Management Infrastructure</p>
        </div>
      </section>
      
      <section className="legal-content">
        <div className="content-container">
          <div className="section-number">1.</div>
          <div className="section-content">
            <h2>Impact Metrics</h2>
            <p className="intro-paragraph">
              The following metrics demonstrate the operational impact of the Termifi platform:
            </p>
            <div className="metrics-list">
              <div className="metric-item">
                <span className="metric-number">50%</span>
                <span className="metric-description">reduction in contract review time</span>
              </div>
              <div className="metric-item">
                <span className="metric-number">82%</span>
                <span className="metric-description">reduction in administrative workload</span>
              </div>
              <div className="metric-item">
                <span className="metric-number">8–9%</span>
                <span className="metric-description">of annual contract value recovered through improved enforcement</span>
              </div>
            </div>
            <p className="conclusion-paragraph">
              These improvements result in faster investor responses, fewer bottlenecks, and stronger governance.
            </p>
          </div>
        </div>
      </section>
      
      <section className="legal-content">
        <div className="content-container">
          <div className="section-number">2.</div>
          <div className="section-content">
            <h2>Market Context</h2>
            <p>
              Artificial intelligence creates value in asset management when it removes friction from regulated workflows. 
              Most firms continue to rely on PDFs, inboxes, and disconnected systems to manage agreements.
            </p>
            <p>
              Termifi provides a living contract layer—allowing approved terms to be surfaced instantly while remaining 
              anchored to the firm's authoritative contract record managed in Millie.
            </p>
            <div className="callout-box">
              <p className="callout-text">
                <strong>Note:</strong> 89% of businesses still lack a centralized contract system.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="legal-content" id="solution">
        <div className="content-container">
          <div className="section-number">3.</div>
          <div className="section-content">
            <h2>Solution Description</h2>
            <p className="intro-paragraph">
              Contract management inefficiencies create significant value leakage across asset management. 
              Up to 40% of contract value is lost, while 9 in 10 professionals struggle to locate agreements.
            </p>
            <p className="emphasis-paragraph">
              Termifi solves this with a contract intelligence layer designed for asset managers operating at scale.
            </p>
            <h3>3.1 Core Capabilities</h3>
            <div className="capabilities-list">
              <div className="capability-item">
                <h4>3.1.1 Centralized Repository</h4>
                <p>Portfolio agreements, side letters, and amendments governed within Millie.</p>
              </div>
              <div className="capability-item">
                <h4>3.1.2 Clause Intelligence</h4>
                <p>AI-driven extraction and normalization of key terms across funds and vehicles.</p>
              </div>
              <div className="capability-item">
                <h4>3.1.3 Smart Alerts</h4>
                <p>Automated monitoring of renewals, notice periods, and obligations.</p>
              </div>
              <div className="capability-item">
                <h4>3.1.4 Controlled Access</h4>
                <p>Permissioned views for business users and external stakeholders.</p>
              </div>
            </div>
            <p className="note-paragraph">
              <strong>Important:</strong> All contract logic and version control remain managed within Millie.
            </p>
          </div>
        </div>
      </section>
      
      <section className="legal-content dark-section">
        <div className="content-container">
          <div className="section-number">4.</div>
          <div className="section-content">
            <h2>Platform Overview</h2>
            <p className="intro-paragraph">
              Termifi provides a unified platform for managing all LP agreements with complete transparency.
            </p>
            <ImageCarousel />
            <h3>4.1 Key Features</h3>
            <div className="features-list">
              <div className="feature-item">
                <h4>4.1.1 Document Organization</h4>
                <p>All agreements, side letters, and amendments in one centralized view.</p>
              </div>
              <div className="feature-item">
                <h4>4.1.2 Clause Extraction</h4>
                <p>AI-powered extraction with source citations for every data point.</p>
              </div>
              <div className="feature-item">
                <h4>4.1.3 Live Preview</h4>
                <p>Instant access to original documents alongside structured data.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="legal-content">
        <div className="content-container">
          <div className="section-number">5.</div>
          <div className="section-content">
            <h2>Governance Model</h2>
            <p className="intro-paragraph">
              Legal defines the rules. Everyone else operates within them.
            </p>
            <h3>5.1 Role Definitions</h3>
            <div className="roles-list">
              <div className="role-item">
                <h4>5.1.1 Legal Teams</h4>
                <p>Configure approved language, fallback positions, and risk thresholds in Millie.</p>
              </div>
              <div className="role-item">
                <h4>5.1.2 Asset Management</h4>
                <p>Retrieve answers without reopening agreements.</p>
              </div>
              <div className="role-item">
                <h4>5.1.3 Compliance & Risk</h4>
                <p>Retain full auditability and evidence trails.</p>
              </div>
            </div>
            <p className="note-paragraph">
              <strong>Policy:</strong> No shadow systems. No duplicated contracts.
            </p>
          </div>
        </div>
      </section>
      
      <section className="legal-content">
        <div className="content-container">
          <div className="section-number">6.</div>
          <div className="section-content">
            <h2>Differentiators</h2>
            <div className="differentiators-list">
              <div className="differentiator-item">
                <h4>6.1 Flexible Flat Fee Pricing</h4>
                <p>Not taking a percentage of AUM.</p>
              </div>
              <div className="differentiator-item">
                <h4>6.2 No Contract Duplication</h4>
                <p>Always reflects the authoritative agreement record in Millie.</p>
              </div>
              <div className="differentiator-item">
                <h4>6.3 Retail-Ready by Design</h4>
                <p>Structured outputs for non-legal users.</p>
              </div>
              <div className="differentiator-item">
                <h4>6.4 Governance-First Architecture</h4>
                <p>Permissions, lineage, and controls embedded from the start.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="legal-content" id="platform">
        <div className="content-container">
          <div className="section-number">7.</div>
          <div className="section-content">
            <h2>Architecture</h2>
            <h3>7.1 Foundation</h3>
            <p>
              Termifi is a dedicated access layer built on top of Millie, the enterprise contract platform 
              already used by asset managers to govern agreements firmwide.
            </p>
            <h3>7.2 Capabilities Enabled</h3>
            <p>This architecture allows Termifi to:</p>
            <ol className="numbered-list">
              <li>Expose investor-relevant terms without distributing full contracts</li>
              <li>Stay synchronized with legal-approved source documents</li>
              <li>Maintain compliance, version control, and regulatory traceability</li>
            </ol>
          </div>
        </div>
      </section>
      
      <section className="legal-footer-section">
        <div className="footer-container">
          <h2>Next Steps</h2>
          <p>
            Built for asset managers expanding retail access—without compromising control.
          </p>
          <div className="footer-actions">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">View Demo</a>
            <a href="#" className="btn-secondary" onClick={handleContactClick}>Contact</a>
          </div>
        </div>
      </section>
      
      <footer className="legal-footer">
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
