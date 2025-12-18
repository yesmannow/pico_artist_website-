import type { Metadata } from "next";
import "./globals.css";
import GlobalMusicPlayer from "@/components/audio/GlobalMusicPlayer";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import PWARegister from "@/components/PWARegister";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Pico Artist Studio - Private SoundCloud Experience",
  description: "A cinematic music platform with built-in recording studio for artists",
  manifest: "/manifest.json",
  themeColor: "#ff006e",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Piko Studio",
  },
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
          <PWARegister />
          <Navbar />
          <div className="min-h-screen pb-24 pt-16">
            {children}
          </div>
          <Footer />
          <GlobalMusicPlayer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
