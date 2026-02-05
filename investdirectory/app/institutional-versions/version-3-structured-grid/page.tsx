'use client';

import { useState } from 'react';
import ContactModal from '../../components/ContactModal';
import ImageCarousel from '../../components/ImageCarousel';
import StructuredData from '../../components/StructuredData';
import './styles.css';

export default function Version3StructuredGrid() {
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <>
      <StructuredData />
      <nav className="grid-nav">
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
      
      <section className="hero-grid">
        <div className="hero-container">
          <div className="hero-grid-layout">
            <div className="hero-label">PLATFORM</div>
            <h1>Contract Intelligence<br />for Asset Management</h1>
            <div className="hero-meta">
              <div className="meta-item">
                <span className="meta-label">Type</span>
                <span className="meta-value">Enterprise Infrastructure</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Sector</span>
                <span className="meta-value">Financial Services</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="content-grid">
        <div className="section-container">
          <div className="section-label">METRICS</div>
          <h2>Impact</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Contract Review Time</td>
                <td className="value-cell">50%</td>
                <td>Reduction in contract review time</td>
              </tr>
              <tr>
                <td>Administrative Workload</td>
                <td className="value-cell">82%</td>
                <td>Reduction in administrative workload</td>
              </tr>
              <tr>
                <td>Contract Value Recovery</td>
                <td className="value-cell">8–9%</td>
                <td>Annual contract value recovered through improved enforcement</td>
              </tr>
            </tbody>
          </table>
          <div className="table-note">
            Result: Faster investor responses, fewer bottlenecks, and stronger governance.
          </div>
        </div>
      </section>
      
      <section className="content-grid alt-grid">
        <div className="section-container">
          <div className="section-label">CONTEXT</div>
          <h2>Market Context</h2>
          <div className="text-grid">
            <div className="text-column">
              <p>AI creates value in asset management when it removes friction from regulated workflows.</p>
            </div>
            <div className="text-column">
              <p>Most firms still rely on PDFs, inboxes, and disconnected systems to manage agreements. Termifi provides a living contract layer—allowing approved terms to be surfaced instantly while remaining anchored to the firm's authoritative contract record managed in Millie.</p>
            </div>
          </div>
          <div className="highlight-box">
            <span className="highlight-label">STATISTIC</span>
            <p>89% of businesses still lack a centralized contract system.</p>
          </div>
        </div>
      </section>
      
      <section className="content-grid" id="solution">
        <div className="section-container">
          <div className="section-label">SOLUTION</div>
          <h2>Solution</h2>
          <div className="text-grid">
            <div className="text-column">
              <p className="text-large">
                Contract management inefficiencies create significant value leakage across asset management—up to 40% of contract value is lost, while 9 in 10 professionals struggle to locate agreements.
              </p>
            </div>
            <div className="text-column">
              <p className="text-emphasis">
                Termifi solves this with a contract intelligence layer designed for asset managers operating at scale.
              </p>
            </div>
          </div>
          <table className="features-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="capability-name">Centralized Repository</td>
                <td>Portfolio agreements, side letters, and amendments governed within Millie</td>
              </tr>
              <tr>
                <td className="capability-name">Clause Intelligence</td>
                <td>AI-driven extraction and normalization of key terms across funds and vehicles</td>
              </tr>
              <tr>
                <td className="capability-name">Smart Alerts</td>
                <td>Automated monitoring of renewals, notice periods, and obligations</td>
              </tr>
              <tr>
                <td className="capability-name">Controlled Access</td>
                <td>Permissioned views for business users and external stakeholders</td>
              </tr>
            </tbody>
          </table>
          <div className="table-note">
            All contract logic and version control remain managed within Millie.
          </div>
        </div>
      </section>
      
      <section className="content-grid dark-grid">
        <div className="section-container">
          <div className="section-label">PLATFORM</div>
          <h2>Platform Overview</h2>
          <p className="section-subtitle">A unified platform for managing all LP agreements with complete transparency</p>
          <ImageCarousel />
          <table className="capabilities-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="capability-name">Document Organization</td>
                <td>All agreements, side letters, and amendments in one centralized view</td>
              </tr>
              <tr>
                <td className="capability-name">Clause Extraction</td>
                <td>AI-powered extraction with source citations for every data point</td>
              </tr>
              <tr>
                <td className="capability-name">Live Preview</td>
                <td>Instant access to original documents alongside structured data</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="content-grid">
        <div className="section-container">
          <div className="section-label">GOVERNANCE</div>
          <h2>Governance Model</h2>
          <p className="section-subtitle">Legal defines the rules. Everyone else operates within them.</p>
          <table className="roles-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Function</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="role-name">Legal Teams</td>
                <td>Configure approved language, fallback positions, and risk thresholds in Millie</td>
              </tr>
              <tr>
                <td className="role-name">Asset Management</td>
                <td>Retrieve answers without reopening agreements</td>
              </tr>
              <tr>
                <td className="role-name">Compliance & Risk</td>
                <td>Retain full auditability and evidence trails</td>
              </tr>
            </tbody>
          </table>
          <div className="table-note">
            No shadow systems. No duplicated contracts.
          </div>
        </div>
      </section>
      
      <section className="content-grid alt-grid">
        <div className="section-container">
          <div className="section-label">DIFFERENTIATORS</div>
          <h2>Differentiators</h2>
          <table className="differentiators-table">
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="attr-name">Pricing Model</td>
                <td>Flexible flat fee pricing — not taking a percentage of AUM</td>
              </tr>
              <tr>
                <td className="attr-name">Contract Management</td>
                <td>No contract duplication — always reflects the authoritative agreement record in Millie</td>
              </tr>
              <tr>
                <td className="attr-name">Design Philosophy</td>
                <td>Retail-ready by design — structured outputs for non-legal users</td>
              </tr>
              <tr>
                <td className="attr-name">Architecture</td>
                <td>Governance-first — permissions, lineage, and controls embedded from the start</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="content-grid" id="platform">
        <div className="section-container">
          <div className="section-label">ARCHITECTURE</div>
          <h2>Architecture</h2>
          <div className="architecture-grid">
            <div className="arch-label">Foundation</div>
            <h3>Built on Millie</h3>
            <div className="text-grid">
              <div className="text-column">
                <p>
                  Termifi is a dedicated access layer built on top of Millie, the enterprise contract platform already used by asset managers to govern agreements firmwide.
                </p>
              </div>
              <div className="text-column">
                <p className="text-label">This allows Termifi to:</p>
                <ul className="list-grid">
                  <li>Expose investor-relevant terms without distributing full contracts</li>
                  <li>Stay synchronized with legal-approved source documents</li>
                  <li>Maintain compliance, version control, and regulatory traceability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cta-grid">
        <div className="cta-container">
          <div className="cta-label">ACTION</div>
          <h2>Get Started</h2>
          <p>Built for asset managers expanding retail access—without compromising control.</p>
          <div className="cta-actions">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">View Demo</a>
            <a href="#" className="btn-secondary" onClick={handleContactClick}>Contact</a>
          </div>
        </div>
      </section>
      
      <footer className="grid-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-text">© 2026 Termifi · Contract Intelligence Platform</div>
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
