import '../styles.css';

export default function PrivacyPolicy() {
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
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last Updated: February 1, 2026</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Termfi ("Company," "we," "us," or "our") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>Information You Provide</h3>
            <p>We may collect information you provide directly to us, including:</p>
            <ul>
              <li>Contact information (name, email address, phone number, company name)</li>
              <li>Account credentials</li>
              <li>Communications you send to us</li>
              <li>Information provided through forms on our website</li>
            </ul>

            <h3>Information Collected Automatically</h3>
            <p>When you access our services, we may automatically collect:</p>
            <ul>
              <li>Device information (browser type, operating system)</li>
              <li>Log information (access times, pages viewed, IP address)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent security incidents</li>
            </ul>
          </section>

          <section>
            <h2>4. Information Sharing</h2>
            <p>We do not sell your personal information. We may share information in the following circumstances:</p>
            <ul>
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
              <li>With your consent or at your direction</li>
            </ul>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information against unauthorized access, alteration, disclosure, or destruction. 
              These measures include encryption, access controls, and regular security assessments.
            </p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>
              We retain personal information for as long as necessary to fulfill the purposes for which 
              it was collected, including to satisfy legal, accounting, or reporting requirements.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have rights regarding your personal information, including:</p>
            <ul>
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Objection to processing</li>
              <li>Data portability</li>
            </ul>
            <p>To exercise these rights, please contact us at privacy@gettermfi.com.</p>
          </section>

          <section>
            <h2>8. Cookies</h2>
            <p>
              We use cookies and similar technologies to collect information and improve our services. 
              You can control cookies through your browser settings. For more information, see our cookie preferences.
            </p>
          </section>

          <section>
            <h2>9. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices of these external sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2>10. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under 18 years of age. We do not knowingly 
              collect personal information from children.
            </p>
          </section>

          <section>
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: privacy@gettermfi.com<br />
              Address: Termfi, Inc.
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
