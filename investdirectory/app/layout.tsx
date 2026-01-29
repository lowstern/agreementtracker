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
      <body>{children}</body>
    </html>
  );
}
