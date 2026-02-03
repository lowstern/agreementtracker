import '../styles.css';

export default function Security() {
  return (
    <div className="legal-page">
      <nav className="business-nav">
        <div className="nav-container">
          <div className="nav-left">
            <a href="/" className="logo">Termfi</a>
          </div>
          <div className="nav-right">
            <a href="/contact" className="btn-contact">Contact</a>
          </div>
        </div>
      </nav>

      <main className="legal-content">
        <div className="legal-container">
          <h1>Security</h1>
          <p className="legal-updated">Last Updated: February 1, 2026</p>

          <section className="security-overview">
            <p className="security-intro">
              At Termfi, security is foundational to everything we do. We understand that our customers 
              trust us with sensitive financial documents and data. This page outlines our commitment 
              to protecting that information.
            </p>
          </section>

          <section>
            <h2>Infrastructure Security</h2>
            <h3>Cloud Hosting</h3>
            <p>
              Our infrastructure is hosted on enterprise-grade cloud platforms with SOC 2 Type II 
              certification. Data centers maintain physical security controls including biometric 
              access, 24/7 surveillance, and environmental protections.
            </p>

            <h3>Network Security</h3>
            <ul>
              <li>Web Application Firewall (WAF) protection</li>
              <li>DDoS mitigation</li>
              <li>Intrusion detection and prevention systems</li>
              <li>Regular vulnerability scanning</li>
            </ul>
          </section>

          <section>
            <h2>Data Protection</h2>
            <h3>Encryption</h3>
            <ul>
              <li><strong>In Transit:</strong> All data transmitted to and from Termfi is encrypted using TLS 1.2 or higher</li>
              <li><strong>At Rest:</strong> Data is encrypted using AES-256 encryption</li>
              <li><strong>Key Management:</strong> Encryption keys are managed through secure key management services</li>
            </ul>

            <h3>Data Isolation</h3>
            <p>
              Customer data is logically separated and isolated. Each customer's data is accessible 
              only to authorized users within that organization.
            </p>

            <h3>Backup and Recovery</h3>
            <p>
              We maintain regular automated backups with point-in-time recovery capabilities. 
              Backups are encrypted and stored in geographically separate locations.
            </p>
          </section>

          <section>
            <h2>Application Security</h2>
            <h3>Secure Development</h3>
            <ul>
              <li>Security-focused code reviews</li>
              <li>Static and dynamic application security testing (SAST/DAST)</li>
              <li>Dependency vulnerability monitoring</li>
              <li>Regular penetration testing by third parties</li>
            </ul>

            <h3>Authentication</h3>
            <ul>
              <li>Strong password requirements</li>
              <li>Multi-factor authentication (MFA) support</li>
              <li>Session management and automatic timeout</li>
              <li>SSO integration capabilities (SAML 2.0, OAuth)</li>
            </ul>

            <h3>Access Controls</h3>
            <ul>
              <li>Role-based access control (RBAC)</li>
              <li>Principle of least privilege</li>
              <li>Audit logging of all access and changes</li>
            </ul>
          </section>

          <section>
            <h2>Operational Security</h2>
            <h3>Monitoring</h3>
            <p>
              We maintain 24/7 monitoring of our systems with automated alerting for security 
              events and anomalies.
            </p>

            <h3>Incident Response</h3>
            <p>
              We have a documented incident response plan that includes identification, containment, 
              eradication, recovery, and post-incident analysis. Customers are notified of security 
              incidents that affect their data in accordance with applicable regulations.
            </p>

            <h3>Employee Security</h3>
            <ul>
              <li>Background checks for all employees</li>
              <li>Security awareness training</li>
              <li>Access provisioned on need-to-know basis</li>
              <li>Secure remote work policies</li>
            </ul>
          </section>

          <section>
            <h2>Compliance</h2>
            <p>
              Termfi is committed to meeting industry security standards and regulatory requirements:
            </p>
            <ul>
              <li>SOC 2 Type II (in progress)</li>
              <li>GDPR compliance</li>
              <li>CCPA compliance</li>
            </ul>
          </section>

          <section>
            <h2>Vendor Security</h2>
            <p>
              We carefully evaluate third-party vendors and service providers for their security 
              practices. Vendors with access to customer data must meet our security requirements 
              and are bound by data protection agreements.
            </p>
          </section>

          <section>
            <h2>Security Assessments</h2>
            <p>
              We welcome security questionnaires and assessments from customers. For enterprise 
              customers, we can provide additional security documentation and participate in 
              vendor security reviews.
            </p>
          </section>

          <section>
            <h2>Responsible Disclosure</h2>
            <p>
              If you discover a security vulnerability, we encourage you to report it to us 
              responsibly. Please email security@gettermfi.com with details of the vulnerability. 
              We commit to:
            </p>
            <ul>
              <li>Acknowledging receipt within 24 hours</li>
              <li>Providing regular updates on our investigation</li>
              <li>Not pursuing legal action against good-faith security researchers</li>
            </ul>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For security inquiries or to request additional security documentation:
            </p>
            <p>
              Email: security@gettermfi.com
            </p>
          </section>
        </div>
      </main>

      <footer className="legal-footer">
        <div className="footer-container">
          <div className="footer-menu">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/security">Security</a>
            <a href="/contact">Contact</a>
          </div>
          <p>© 2026 Termfi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
