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
  title: "SafePass Pro - Advanced Password Generator | W Software Solutions",
  description: "Professional password generator by W Software Solutions. Generate cryptographically secure passwords with advanced customization options, real-time strength analysis, and enterprise-grade security.",
  keywords: "password generator, secure passwords, cybersecurity, random password, strong password, enterprise security, W Software Solutions",
  authors: [{ name: "W Software Solutions" }],
  robots: "index, follow",
  icons: {
    icon: "https://i.postimg.cc/25GmZgtN/W-logo.jpg",
    shortcut: "https://i.postimg.cc/25GmZgtN/W-logo.jpg",
    apple: "https://i.postimg.cc/25GmZgtN/W-logo.jpg",
  },
  openGraph: {
    title: "SafePass Pro - Advanced Password Generator | W Software Solutions",
    description: "Professional password generator by W Software Solutions. Generate cryptographically secure passwords with enterprise-grade security.",
    type: "website",
    locale: "en_US",
    images: "https://i.postimg.cc/25GmZgtN/W-logo.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafePass Pro - Advanced Password Generator | W Software Solutions",
    description: "Professional password generator by W Software Solutions. Generate cryptographically secure passwords with enterprise-grade security.",
    images: "https://i.postimg.cc/25GmZgtN/W-logo.jpg",
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
    <html lang="en">
      <head>
        {/* Force browser to use our custom favicon */}
        <link rel="icon" type="image/jpeg" sizes="32x32" href="https://i.postimg.cc/25GmZgtN/W-logo.jpg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="https://i.postimg.cc/25GmZgtN/W-logo.jpg" />
        <link rel="shortcut icon" type="image/jpeg" href="https://i.postimg.cc/25GmZgtN/W-logo.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://i.postimg.cc/25GmZgtN/W-logo.jpg" />
        <meta name="msapplication-TileImage" content="https://i.postimg.cc/25GmZgtN/W-logo.jpg" />
        {/* Cache busting to force favicon reload */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${orbitron.variable} ${exo2.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
