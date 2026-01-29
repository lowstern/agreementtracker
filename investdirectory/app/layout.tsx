import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InvestDirectory - Contract Intelligence for Asset Managers",
  description: "Transform contract chaos into strategic clarity with InvestDirectory's agreement intelligence platform built for asset managers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
