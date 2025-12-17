import type { Metadata } from "next";
import "./globals.css";
import GlobalMusicPlayer from "@/components/audio/GlobalMusicPlayer";

export const metadata: Metadata = {
  title: "Pico Artist Studio - Private SoundCloud Experience",
  description: "A cinematic music platform with built-in recording studio for artists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100">
        <div className="min-h-screen pb-24">
          {children}
        </div>
        <GlobalMusicPlayer />
      </body>
    </html>
  );
}
