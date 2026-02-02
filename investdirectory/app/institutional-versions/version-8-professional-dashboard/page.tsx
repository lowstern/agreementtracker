'use client';

import { useState } from 'react';
import ContactModal from '../../components/ContactModal';
import ImageCarousel from '../../components/ImageCarousel';
import StructuredData from '../../components/StructuredData';
import './styles.css';

export default function Version8ProfessionalDashboard() {
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
          <div className="nav-brand">
            <div className="logo">Termifi</div>
          </div>
          <div className="nav-menu">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer">Demo</a>
            <a href="#solution">Solution</a>
            <a href="#platform">Platform</a>
            <a href="#" onClick={handleContactClick} className="nav-button">Contact</a>
          </div>
        </div>
      </nav>
      
      <section className="dashboard-hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-tag">Enterprise Platform</div>
            <h1>Contract Intelligence<br />for Asset Management</h1>
            <p className="hero-subtitle">Enterprise agreement management infrastructure</p>
            <div className="metrics-dashboard">
              <div className="metric-widget">
                <div className="metric-value">50%</div>
                <div className="metric-label">Review Time Reduction</div>
              </div>
              <div className="metric-widget">
                <div className="metric-value">82%</div>
                <div className="metric-label">Admin Workload Reduction</div>
              </div>
              <div className="metric-widget">
                <div className="metric-value">8–9%</div>
                <div className="metric-label">Contract Value Recovery</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Market Context</div>
            <h2>Industry Overview</h2>
          </div>
          <div className="content-widget">
            <div className="widget-content">
              <p>
                AI creates value in asset management when it removes friction from regulated workflows. 
                Most firms still rely on PDFs, inboxes, and disconnected systems to manage agreements.
              </p>
              <p>
                Termifi provides a living contract layer—allowing approved terms to be surfaced instantly 
                while remaining anchored to the firm's authoritative contract record managed in Millie.
              </p>
            </div>
            <div className="widget-insight">
              <div className="insight-header">
                <div className="insight-icon">📈</div>
                <div className="insight-title">Industry Statistic</div>
              </div>
              <p>89% of businesses still lack a centralized contract system</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section alt-section" id="solution">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Solution</div>
            <h2>Platform Capabilities</h2>
          </div>
          <div className="content-widget">
            <div className="widget-section">
              <div className="section-label">Challenge</div>
              <p>
                Contract management inefficiencies create significant value leakage across asset management—up to 40% 
                of contract value is lost, while 9 in 10 professionals struggle to locate agreements.
              </p>
            </div>
            <div className="widget-section highlight">
              <div className="section-label">Solution</div>
              <p>
                Termifi solves this with a contract intelligence layer designed for asset managers operating at scale.
              </p>
            </div>
          </div>
          <div className="capabilities-dashboard">
            <div className="capability-widget">
              <div className="widget-header">
                <div className="widget-icon">📁</div>
                <h3>Centralized Repository</h3>
              </div>
              <p>Portfolio agreements, side letters, and amendments governed within Millie</p>
            </div>
            <div className="capability-widget">
              <div className="widget-header">
                <div className="widget-icon">🔍</div>
                <h3>Clause Intelligence</h3>
              </div>
              <p>AI-driven extraction and normalization of key terms across funds and vehicles</p>
            </div>
            <div className="capability-widget">
              <div className="widget-header">
                <div className="widget-icon">🔔</div>
                <h3>Smart Alerts</h3>
              </div>
              <p>Automated monitoring of renewals, notice periods, and obligations</p>
            </div>
            <div className="capability-widget">
              <div className="widget-header">
                <div className="widget-icon">🔐</div>
                <h3>Controlled Access</h3>
              </div>
              <p>Permissioned views for business users and external stakeholders</p>
            </div>
          </div>
          <div className="info-widget">
            <div className="info-label">System Note</div>
            <p>All contract logic and version control remain managed within Millie.</p>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section dark-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Platform</div>
            <h2>Interface Overview</h2>
          </div>
          <p className="section-description">
            A unified platform for managing all LP agreements with complete transparency
          </p>
          <ImageCarousel />
          <div className="features-dashboard">
            <div className="feature-widget">
              <div className="feature-icon">📄</div>
              <h3>Document Organization</h3>
              <p>All agreements, side letters, and amendments in one centralized view</p>
            </div>
            <div className="feature-widget">
              <div className="feature-icon">🔎</div>
              <h3>Clause Extraction</h3>
              <p>AI-powered extraction with source citations for every data point</p>
            </div>
            <div className="feature-widget">
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
            <div className="section-tag">Governance</div>
            <h2>Access Model</h2>
          </div>
          <div className="content-widget">
            <div className="governance-statement">
              <div className="statement-label">Governance Principle</div>
              <p>Legal defines the rules. Everyone else operates within them.</p>
            </div>
          </div>
          <div className="roles-dashboard">
            <div className="role-widget">
              <div className="role-badge">Legal</div>
              <h3>Legal Teams</h3>
              <p>Configure approved language, fallback positions, and risk thresholds in Millie</p>
            </div>
            <div className="role-widget">
              <div className="role-badge">Operations</div>
              <h3>Asset Management</h3>
              <p>Retrieve answers without reopening agreements</p>
            </div>
            <div className="role-widget">
              <div className="role-badge">Compliance</div>
              <h3>Compliance & Risk</h3>
              <p>Retain full auditability and evidence trails</p>
            </div>
          </div>
          <div className="info-widget">
            <div className="info-label">Policy</div>
            <p>No shadow systems. No duplicated contracts.</p>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section alt-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Differentiators</div>
            <h2>Key Attributes</h2>
          </div>
          <div className="attributes-dashboard">
            <div className="attribute-widget">
              <div className="attribute-index">01</div>
              <h3>Flexible Flat Fee Pricing</h3>
              <p>Not taking a percentage of AUM</p>
            </div>
            <div className="attribute-widget">
              <div className="attribute-index">02</div>
              <h3>No Contract Duplication</h3>
              <p>Always reflects the authoritative agreement record in Millie</p>
            </div>
            <div className="attribute-widget">
              <div className="attribute-index">03</div>
              <h3>Retail-Ready by Design</h3>
              <p>Structured outputs for non-legal users</p>
            </div>
            <div className="attribute-widget">
              <div className="attribute-index">04</div>
              <h3>Governance-First</h3>
              <p>Permissions, lineage, and controls embedded from the start</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="dashboard-section" id="platform">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">Architecture</div>
            <h2>System Foundation</h2>
          </div>
          <div className="content-widget">
            <div className="architecture-widget">
              <h3>Built on Millie</h3>
              <p>
                Termifi is a dedicated access layer built on top of Millie, the enterprise contract platform 
                already used by asset managers to govern agreements firmwide.
              </p>
              <div className="capabilities-list">
                <div className="list-label">This architecture enables:</div>
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
      
      <section className="dashboard-cta">
        <div className="cta-container">
          <div className="cta-tag">Get Started</div>
          <h2>Ready to Transform Your Contract Management?</h2>
          <p>Built for asset managers expanding retail access—without compromising control.</p>
          <div className="cta-buttons">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn-primary">View Demo</a>
            <a href="#" className="btn-secondary" onClick={handleContactClick}>Contact Sales</a>
          </div>
        </div>
      </section>
      
      <footer className="dashboard-footer">
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
