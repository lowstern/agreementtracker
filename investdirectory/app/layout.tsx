import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GetTermfi - Contract Intelligence for Asset Managers",
  description: "Transform contract chaos into strategic clarity with GetTermfi's agreement intelligence platform built for asset managers.",
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
