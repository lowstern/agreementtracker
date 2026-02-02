'use client';

import Link from 'next/link';
import './styles.css';

export default function InstitutionalVersionsIndex() {
  return (
    <div className="versions-index">
      <div className="index-container">
        <h1>Institutional Design Versions</h1>
        <p className="subtitle">Five distinct approaches to institutional, PE-credible design</p>
        
        <div className="versions-grid">
          <Link href="/institutional-versions/version-1-classic-corporate" className="version-card">
            <div className="version-number">01</div>
            <h2>Classic Corporate</h2>
            <p>Traditional, formal, document-like aesthetic with serif headings and structured layouts</p>
            <div className="version-tags">
              <span>Serif Typography</span>
              <span>Formal Structure</span>
              <span>Document Aesthetic</span>
            </div>
          </Link>
          
          <Link href="/institutional-versions/version-2-minimalist-authority" className="version-card">
            <div className="version-number">02</div>
            <h2>Minimalist Authority</h2>
            <p>Ultra-clean design with maximum white space and restrained typography</p>
            <div className="version-tags">
              <span>Maximum White Space</span>
              <span>Restrained</span>
              <span>Ultra-Clean</span>
            </div>
          </Link>
          
          <Link href="/institutional-versions/version-3-structured-grid" className="version-card">
            <div className="version-number">03</div>
            <h2>Structured Grid</h2>
            <p>Strong grid system with data-table aesthetic, Bloomberg Terminal-inspired</p>
            <div className="version-tags">
              <span>Data Tables</span>
              <span>Grid System</span>
              <span>Terminal Aesthetic</span>
            </div>
          </Link>
          
          <Link href="/institutional-versions/version-4-legal-document" className="version-card">
            <div className="version-number">04</div>
            <h2>Legal Document</h2>
            <p>Regulatory filing aesthetic with numbered sections and formal structure</p>
            <div className="version-tags">
              <span>Regulatory Filing</span>
              <span>Numbered Sections</span>
              <span>Legal Brief</span>
            </div>
          </Link>
          
          <Link href="/institutional-versions/version-5-enterprise-dashboard" className="version-card">
            <div className="version-number">05</div>
            <h2>Enterprise Dashboard</h2>
            <p>Terminal-like, enterprise software feel with dark theme and system indicators</p>
            <div className="version-tags">
              <span>Dark Theme</span>
              <span>Terminal UI</span>
              <span>Enterprise Software</span>
            </div>
          </Link>
          
          <Link href="/institutional-versions/version-6-enterprise-saas" className="version-card">
            <div className="version-number">06</div>
            <h2>Enterprise SaaS</h2>
            <p>Salesforce/Microsoft-style polished UI with clean cards and professional styling</p>
            <div className="version-tags">
              <span>Polished UI</span>
              <span>Clean Cards</span>
              <span>Professional</span>
            </div>
          </Link>
          
          <Link href="/institutional-versions/version-7-business-application" className="version-card">
            <div className="version-number">07</div>
            <h2>Business Application</h2>
            <p>SAP/Oracle-style structured interface with organized panels and clear hierarchy</p>
            <div className="version-tags">
              <span>Structured</span>
              <span>Organized Panels</span>
              <span>Clear Hierarchy</span>
            </div>
          </Link>
          
          <Link href="/institutional-versions/version-8-professional-dashboard" className="version-card">
            <div className="version-number">08</div>
            <h2>Professional Dashboard</h2>
            <p>Tableau/Power BI-style analytics feel with widget-based layout</p>
            <div className="version-tags">
              <span>Analytics Feel</span>
              <span>Widget Layout</span>
              <span>Data-Focused</span>
            </div>
          </Link>
          
          <Link href="/institutional-versions/version-9-corporate-platform" className="version-card">
            <div className="version-number">09</div>
            <h2>Corporate Platform</h2>
            <p>Workday/ServiceNow-style enterprise software with tile-based design</p>
            <div className="version-tags">
              <span>Tile Design</span>
              <span>Enterprise Software</span>
              <span>Corporate</span>
            </div>
          </Link>
        </div>
        
        <div className="back-link">
          <Link href="/">← Back to Main Site</Link>
        </div>
      </div>
    </div>
  );
}
