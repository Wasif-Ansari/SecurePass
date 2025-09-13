import type { Metadata, Viewport } from "next";
import { Orbitron, Exo_2 } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SecurePass Pro - Advanced Password Generator | W Software Solutions",
  description: "Professional password generator by W Software Solutions. Generate cryptographically secure passwords with advanced customization options, real-time strength analysis, and enterprise-grade security.",
  keywords: "password generator, secure passwords, cybersecurity, random password, strong password, enterprise security, W Software Solutions",
  authors: [{ name: "W Software Solutions" }],
  robots: "index, follow",
  openGraph: {
    title: "SecurePass Pro - Advanced Password Generator | W Software Solutions",
    description: "Professional password generator by W Software Solutions. Generate cryptographically secure passwords with enterprise-grade security.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SecurePass Pro - Advanced Password Generator | W Software Solutions",
    description: "Professional password generator by W Software Solutions. Generate cryptographically secure passwords with enterprise-grade security.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00f0ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="hydrated">
      <head>
        <link rel="icon" href="https://i.postimg.cc/25GmZgtN/W-logo.jpg" />
        <link rel="apple-touch-icon" href="https://i.postimg.cc/25GmZgtN/W-logo.jpg" />
      </head>
      <body
        className={`${orbitron.variable} ${exo2.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
