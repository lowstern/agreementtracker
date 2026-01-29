'use client';

import { useState } from 'react';
import ContactModal from './components/ContactModal';
import ImageCarousel from './components/ImageCarousel';
import './styles.css';

export default function Home() {
  const [showNav, setShowNav] = useState(false);
  const [showPersona, setShowPersona] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);

  const selectPersona = (role: string) => {
    setShowPersona(false);
    setTimeout(() => {
      setShowNav(true);
    }, 300);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContactModal(true);
  };

  return (
    <>
      <nav className={showNav ? 'show' : ''}>
        <div className="nav-container">
          <div className="logo">Termifi</div>
          <div className="nav-links">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer">View Demo</a>
            <a href="#solution">Solution</a>
            <a href="#platform">Platform</a>
            <a href="#" className="btn-nav" onClick={handleContactClick}>Contact Us</a>
          </div>
        </div>
      </nav>
      
      {showPersona && (
        <section className="persona-selector fade-in" id="persona-selector">
          <div className="persona-container">
            <div className="persona-logo">Termifi</div>
            <h2>Select Your Role</h2>
            <p className="persona-description">Choose your area to access the right product for your needs</p>
            <div className="persona-buttons">
              <button className="persona-btn" onClick={() => selectPersona('counsel')}>
                <div style={{fontSize: '16px', opacity: 0.7, marginBottom: '8px'}}>FOR</div>
                Counsel
              </button>
              <button className="persona-btn" onClick={() => selectPersona('asset-manager')}>
                <div style={{fontSize: '16px', opacity: 0.7, marginBottom: '8px'}}>FOR</div>
                Asset Manager
              </button>
              <button className="persona-btn" onClick={() => selectPersona('compliance')}>
                <div style={{fontSize: '16px', opacity: 0.7, marginBottom: '8px'}}>FOR</div>
                Legal / Compliance<br/>Risk Function
              </button>
            </div>
          </div>
        </section>
      )}
      
      <section className="hero">
        <div className="hero-container">
          <h1>Transform Contract Chaos<br/>Into Strategic Clarity</h1>
          <p className="tagline">The agreement intelligence platform built for asset managers</p>
          <p className="description">As asset managers expand customized, retail-facing offerings, Termifi enables secure, permissioned access to contract terms—without duplicating agreements, processes, or controls.</p>
          <div className="hero-buttons">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Live Demo</a>
            <a href="#" className="btn btn-secondary" onClick={handleContactClick}>Contact Us</a>
          </div>
        </div>
      </section>
      
      
      <section className="section" style={{background: '#f8fafc'}}>
        <div className="section-container">
          <h2>The <span className="accent">Impact</span></h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">50%</div>
              <div className="stat-text">reduction in contract review time</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">82%</div>
              <div className="stat-text">reduction in administrative workload</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">8–9%</div>
              <div className="stat-text">of annual contract value recovered through improved enforcement</div>
            </div>
          </div>
          <div className="impact-summary">
            <p>Faster investor responses, fewer bottlenecks, and stronger governance.</p>
          </div>
        </div>
      </section>
      
      <section className="section">
        <div className="section-container">
          <h2>The <span className="accent">Market</span></h2>
          <div className="market-quote">
            <p>AI creates value in asset management when it removes friction from regulated workflows.</p>
            <p>Most firms still rely on PDFs, inboxes, and disconnected systems to manage agreements. Termifi provides a living contract layer—allowing approved terms to be surfaced instantly while remaining anchored to the firm's authoritative contract record managed in Millie.</p>
            <p className="market-stat">89% of businesses still lack a centralized contract system.</p>
          </div>
        </div>
      </section>
      
      <section className="section" id="solution">
        <div className="section-container">
          <h2>The <span className="accent">Solution</span></h2>
          <div className="solution-intro">
            <p className="intro-large">Contract management inefficiencies create significant value leakage across asset management—up to 40% of contract value is lost, while 9 in 10 professionals struggle to locate agreements.</p>
            <p className="intro-highlight">Termifi solves this with a contract intelligence layer designed for asset managers operating at scale.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Centralized Repository</h3>
              <p>Portfolio agreements, side letters, and amendments governed within Millie</p>
            </div>
            <div className="feature-card">
              <h3>Clause Intelligence</h3>
              <p>AI-driven extraction and normalization of key terms across funds and vehicles</p>
            </div>
            <div className="feature-card">
              <h3>Smart Alerts</h3>
              <p>Automated monitoring of renewals, notice periods, and obligations</p>
            </div>
            <div className="feature-card">
              <h3>Controlled Access</h3>
              <p>Permissioned views for business users and external stakeholders</p>
            </div>
          </div>
          <div className="feature-note">
            <p>All contract logic and version control remain managed within Millie.</p>
          </div>
        </div>
      </section>
      
      <section className="product-showcase">
        <div className="section-container">
          <h2>See It In <span className="accent">Action</span></h2>
          <p className="section-subtitle">A unified platform for managing all your LP agreements with complete transparency</p>
          
          <ImageCarousel />
          
          <div className="screenshot-features">
            <div className="screenshot-feature">
              <div className="screenshot-feature-icon">📄</div>
              <h3>Document Organization</h3>
              <p>All agreements, side letters, and amendments in one centralized view</p>
            </div>
            <div className="screenshot-feature">
              <div className="screenshot-feature-icon">🔍</div>
              <h3>Clause Extraction</h3>
              <p>AI-powered extraction with source citations for every data point</p>
            </div>
            <div className="screenshot-feature">
              <div className="screenshot-feature-icon">📊</div>
              <h3>Live Preview</h3>
              <p>Instant access to original documents alongside structured data</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section dark-section">
        <div className="section-container">
          <h2>Built for Lawyers,<br/><span className="accent">Used by Many</span></h2>
          <p className="section-subtitle">Legal defines the rules. Everyone else operates within them.</p>
          <div className="roles-grid">
            <div className="role-card">
              <h3>Legal Teams</h3>
              <p>Configure approved language, fallback positions, and risk thresholds in Millie</p>
            </div>
            <div className="role-card">
              <h3>Asset Management</h3>
              <p>Retrieve answers without reopening agreements</p>
            </div>
            <div className="role-card">
              <h3>Compliance & Risk</h3>
              <p>Retain full auditability and evidence trails</p>
            </div>
          </div>
          <div className="role-note">
            <p>No shadow systems. No duplicated contracts.</p>
          </div>
        </div>
      </section>
      
      <section className="section">
        <div className="section-container">
          <h2>Why <span className="accent">Termifi</span></h2>
          <div className="why-grid">
            <div className="why-card">
              <h3>Flexible flat fee pricing</h3>
              <p>Not taking a percentage of AUM</p>
            </div>
            <div className="why-card">
              <h3>No contract duplication</h3>
              <p>Always reflects the authoritative agreement record in Millie</p>
            </div>
            <div className="why-card">
              <h3>Retail-ready by design</h3>
              <p>Structured outputs for non-legal users</p>
            </div>
            <div className="why-card">
              <h3>Governance-first</h3>
              <p>Permissions, lineage, and controls embedded from the start</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="section" style={{background: '#f8fafc'}} id="platform">
        <div className="section-container">
          <h2>How It <span className="accent">Fits</span></h2>
          <div className="how-it-fits">
            <h3>Built on Millie</h3>
            <p className="intro">Termifi is a dedicated access layer built on top of Millie, the enterprise contract platform already used by asset managers to govern agreements firmwide.</p>
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
          <div className="hero-buttons">
            <a href="http://demo.gettermfi.com/" target="_blank" rel="noopener noreferrer" className="btn btn-primary">View Live Demo</a>
            <a href="#" className="btn btn-secondary" onClick={handleContactClick}>Contact Us</a>
          </div>
        </div>
      </section>
      
      <footer>
        <div className="footer-container">
          <div className="footer-text">© 2026 Termifi · Contract Intelligence Platform</div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </>
  );
}
