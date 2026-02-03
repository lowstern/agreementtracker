import '../styles.css';

export default function TermsOfService() {
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
          <h1>Terms of Service</h1>
          <p className="legal-updated">Last Updated: February 1, 2026</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Termfi website and services ("Services"), you agree to be bound 
              by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not 
              use our Services.
            </p>
          </section>

          <section>
            <h2>2. Description of Services</h2>
            <p>
              Termfi provides a contract intelligence platform designed for financial services organizations. 
              Our Services include document management, contract analysis, and related tools for managing 
              LP agreements and other financial documents.
            </p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>
              To access certain features of our Services, you may be required to create an account. 
              You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Services for any unlawful purpose</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Services</li>
              <li>Upload malicious code or content</li>
              <li>Use the Services to transmit spam or unsolicited communications</li>
            </ul>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>
              The Services and all content, features, and functionality are owned by Termfi and are 
              protected by copyright, trademark, and other intellectual property laws. You may not 
              reproduce, distribute, modify, or create derivative works without our express permission.
            </p>
          </section>

          <section>
            <h2>6. User Content</h2>
            <p>
              You retain ownership of any content you upload to the Services. By uploading content, 
              you grant us a limited license to use, store, and process that content solely to provide 
              the Services to you.
            </p>
          </section>

          <section>
            <h2>7. Confidentiality</h2>
            <p>
              We understand that you may upload confidential business documents. We maintain strict 
              confidentiality measures and will not disclose your content to third parties except 
              as necessary to provide the Services or as required by law.
            </p>
          </section>

          <section>
            <h2>8. Service Availability</h2>
            <p>
              We strive to maintain high availability of our Services but do not guarantee uninterrupted 
              access. We may modify, suspend, or discontinue the Services at any time with reasonable notice.
            </p>
          </section>

          <section>
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TERMFI SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR 
              REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
            </p>
          </section>

          <section>
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Termfi and its officers, directors, employees, 
              and agents from any claims, damages, or expenses arising from your use of the Services 
              or violation of these Terms.
            </p>
          </section>

          <section>
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the 
              State of Delaware, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>13. Dispute Resolution</h2>
            <p>
              Any disputes arising from these Terms or your use of the Services shall be resolved 
              through binding arbitration in accordance with the rules of the American Arbitration 
              Association.
            </p>
          </section>

          <section>
            <h2>14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of 
              material changes by posting the updated Terms and revising the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2>15. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <p>
              Email: legal@gettermfi.com<br />
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
