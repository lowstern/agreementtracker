'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import './styles.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    companySize: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          company: formData.company,
          jobTitle: formData.jobTitle,
          companySize: formData.companySize,
          message: formData.message
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);
    } catch (err) {
      setError('We encountered an issue processing your request. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <nav className="contact-nav">
        <div className="nav-container">
          <div className="nav-left">
            <Link href="/" className="logo">Termfi</Link>
          </div>
          <div className="nav-right">
            <Link href="/" className="btn-back">← Back to Home</Link>
          </div>
        </div>
      </nav>

      <main className="contact-main">
        {!submitted ? (
          <div className="contact-layout">
            <div className="contact-info">
              <div className="info-content">
                <div className="info-label">Get In Touch</div>
                <h1>Talk to Our Sales Team</h1>
                <p className="info-subtitle">
                  Ready to transform your contract management? Our enterprise sales team is here to understand your needs and demonstrate how Termfi can deliver value to your organization.
                </p>

                <div className="process-section">
                  <h3>What Happens Next</h3>
                  <div className="process-steps">
                    <div className="process-step">
                      <div className="step-number">1</div>
                      <div className="step-content">
                        <h4>We'll Review Your Inquiry</h4>
                        <p>A member of our team will review your submission and follow up shortly.</p>
                      </div>
                    </div>
                    <div className="process-step">
                      <div className="step-number">2</div>
                      <div className="step-content">
                        <h4>Schedule a Conversation</h4>
                        <p>We'll reach out to find a time that works for you to discuss your needs.</p>
                      </div>
                    </div>
                    <div className="process-step">
                      <div className="step-number">3</div>
                      <div className="step-content">
                        <h4>Explore the Platform</h4>
                        <p>See how Termfi can work for your organization.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="trust-section">
                  <div className="trust-item">
                    <div className="trust-icon">⚡</div>
                    <div className="trust-text">
                      <strong>Quick Response</strong>
                      <span>We'll get back to you promptly</span>
                    </div>
                  </div>
                  <div className="trust-item">
                    <div className="trust-icon">🤝</div>
                    <div className="trust-text">
                      <strong>Personalized Attention</strong>
                      <span>Speak directly with our team</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="contact-form-section">
              <div className="form-container">
                <div className="form-header">
                  <h2>Request a Consultation</h2>
                  <p>Complete the form below and a member of our sales team will be in touch shortly.</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="John"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Business Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john.doe@company.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">Company Name *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      placeholder="Acme Capital Partners"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="jobTitle">Job Title *</label>
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        placeholder="Director of Operations"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="companySize">Company Size</label>
                      <select
                        id="companySize"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                      >
                        <option value="">Select...</option>
                        <option value="1-50">1-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1,000 employees</option>
                        <option value="1001+">1,000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">How can we help you? (Optional)</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your current contract management challenges or what you're looking to achieve..."
                    />
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <button type="submit" className="submit-btn" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Request Consultation'}
                  </button>

                  <p className="form-disclaimer">
                    By submitting this form, you agree to be contacted by a Termfi sales representative. 
                    We respect your privacy and will never share your information with third parties.
                  </p>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="success-container">
            <div className="success-content">
              <div className="success-icon-large">✓</div>
              <h1>Thank You for Your Interest</h1>
              <p className="success-subtitle">
                Your inquiry has been received and logged in our system.
              </p>
              
              <div className="success-details">
                <div className="detail-card">
                  <div className="detail-icon">📧</div>
                  <h3>Check Your Inbox</h3>
                  <p>You'll receive a confirmation email at <strong>{formData.email}</strong> shortly.</p>
                </div>
                <div className="detail-card">
                  <div className="detail-icon">👤</div>
                  <h3>We'll Be in Touch</h3>
                  <p>A member of our team will reach out to follow up on your inquiry.</p>
                </div>
                <div className="detail-card">
                  <div className="detail-icon">📅</div>
                  <h3>Next Steps</h3>
                  <p>We'll schedule a time to discuss how Termfi can help your organization.</p>
                </div>
              </div>

              <div className="success-actions">
                <Link href="/" className="btn-primary">Return to Homepage</Link>
                <a href="https://agreement-tracker-frontend.onrender.com/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Explore Demo
                </a>
              </div>

            </div>
          </div>
        )}
      </main>

      <footer className="contact-footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">Termfi</div>
            <div className="footer-copyright">© 2026 Termfi. Contract Intelligence Platform.</div>
          </div>
          <div className="footer-right">
            <div className="footer-menu">
              <Link href="/">Home</Link>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
