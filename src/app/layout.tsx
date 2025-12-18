import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import PlayerDock from "@/components/player/PlayerDock";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import PWARegister from "@/components/PWARegister";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import SprayCursor from "@/components/cursor/SprayCursor";

// CLOUDFLARE FIX: Edge runtime removed entirely to keep the worker lean
// No runtime export needed - defaults to nodejs

export const metadata: Metadata = {
  title: {
    default: "Piko FG - Digital Graffiti Artist",
    template: "%s | Piko FG",
  },
  description: "Music, videos, and tour dates from Piko FG. Urban beats, digital graffiti aesthetic, and immersive audio experiences.",
  appleWebApp: {
    title: "Piko Studio",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pikofg.com",
    siteName: "Piko FG",
    title: "Piko FG - Digital Graffiti Artist",
    description: "Music, videos, and tour dates from Piko FG. Urban beats, digital graffiti aesthetic, and immersive audio experiences.",
    images: [
      {
        url: "/piko-logo.jpg",
        width: 1200,
        height: 630,
        alt: "Piko FG",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Piko FG - Digital Graffiti Artist",
    description: "Music, videos, and tour dates from Piko FG.",
    images: ["/piko-logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#ff006e",
  appleMobileWebAppCapable: "yes",
  appleMobileWebAppStatusBarStyle: "black-translucent",
};

type RootLayoutProps = Readonly<{ children: ReactNode }>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100">
        <ErrorBoundary>
          <SprayCursor />
          <PWARegister />
          <Navbar />
          <div className="min-h-screen pb-24 pt-16">
            {children}
          </div>
          <Footer />
          <PlayerDock />
        </ErrorBoundary>
      </body>
    </html>
  );
}