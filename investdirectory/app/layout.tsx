import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.gettermfi.com'),
  title: "Termifi - Contract Intelligence for Asset Managers | AI-Powered Agreement Management",
  description: "Transform contract chaos into strategic clarity with Termifi's agreement intelligence platform built for asset managers. AI-driven contract extraction, centralized repository, and smart alerts for LP agreements.",
  keywords: [
    "contract management",
    "asset management",
    "LP agreements",
    "contract intelligence",
    "AI contract extraction",
    "agreement tracking",
    "investment management",
    "contract automation",
    "legal tech",
    "fintech",
    "Termifi",
    "GetTermfi"
  ],
  authors: [{ name: "Termifi" }],
  creator: "Termifi",
  publisher: "Termifi",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.gettermfi.com",
    siteName: "Termifi",
    title: "Termifi - Contract Intelligence for Asset Managers",
    description: "AI-powered agreement intelligence platform for asset managers. Centralize LP agreements, automate contract extraction, and gain instant insights.",
    images: [
      {
        url: "/app-screenshot.png",
        width: 1200,
        height: 630,
        alt: "Termifi Platform Screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Termifi - Contract Intelligence for Asset Managers",
    description: "AI-powered agreement intelligence platform for asset managers. Transform contract chaos into strategic clarity.",
    images: ["/app-screenshot.png"],
  },
  verification: {
    google: "ADD_YOUR_GOOGLE_SEARCH_CONSOLE_CODE",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <noscript>
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            color: '#1e293b',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
            padding: '20px',
            textAlign: 'center',
          }}>
            <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Termfi</h1>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>Contract Intelligence for Financial Services</p>
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '450px',
              textAlign: 'left',
            }}>
              <p style={{ color: '#dc2626', marginBottom: '12px', fontWeight: 500, textAlign: 'center' }}>JavaScript Required</p>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
                This website requires JavaScript to run. It appears JavaScript is disabled or blocked in your browser.
              </p>
              <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.5, marginBottom: '12px' }}>
                <strong>If you&apos;re on a corporate network:</strong><br/>
                Your IT department may need to whitelist this site. Please contact them and request JavaScript access for this domain.
              </p>
              <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                <strong>If you&apos;re on a personal device:</strong><br/>
                Check your browser settings to enable JavaScript, or try a different browser.
              </p>
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', textAlign: 'center' }}>
                <a href="mailto:support@gettermfi.com?subject=JavaScript%20Access%20Request" 
                   style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '14px' }}>
                  Contact Support →
                </a>
              </div>
            </div>
          </div>
        </noscript>
        {children}
      </body>
    </html>
  );
}
