import type { Metadata } from "next";
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
  title: "Piko Artist Studio",
  description: "Music, videos, and tour dates",
  manifest: "/manifest.json",
  appleWebApp: {
    title: "Piko Studio",
  },
};

export const viewport = {
  themeColor: "#ff006e",
  appleMobileWebAppCapable: "yes",
  appleMobileWebAppStatusBarStyle: "black-translucent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
