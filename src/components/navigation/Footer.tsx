'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CloudRain from 'lucide-react/dist/esm/icons/cloud-rain';
import { Howl } from 'howler';
import { STUDIO_CONFIG } from '@/lib/studioConfig';

export default function Footer() {
  const [streetRainEnabled, setStreetRainEnabled] = useState(false);
  const rainSoundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize street rain sound
    rainSoundRef.current = new Howl({
      src: ['/lofi-teaser.wav'], // Fallback - would ideally be a rain soundscape
      volume: 0.1,
      loop: true,
      rate: 0.3, // Slow down for ambient effect
    });

    return () => {
      rainSoundRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    if (streetRainEnabled && rainSoundRef.current && !rainSoundRef.current.playing()) {
      rainSoundRef.current.play();
    } else if (!streetRainEnabled && rainSoundRef.current && rainSoundRef.current.playing()) {
      rainSoundRef.current.pause();
    }
  }, [streetRainEnabled]);

  // Keyboard shortcut for Studio access (Shift+S)
  useEffect(() => {
    if (!STUDIO_CONFIG.visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Shift+S (case-insensitive)
      if (e.shiftKey && e.key.toLowerCase() === 's') {
        // Prevent default browser behavior if needed
        e.preventDefault();
        window.location.href = '/studio';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <footer className="relative border-t border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      {/* Glassmorphic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-zinc-950/60 to-zinc-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,212,0.05),transparent_70%)]" />

      {/* Infinite CSS Marquee */}
      <div className="relative z-10 py-4 border-b border-zinc-800/50 overflow-hidden" aria-hidden="true">
        <div className="marquee-container">
          <div className="marquee-content">
            <span className="text-piko-teal mx-8 text-sm font-semibold" aria-hidden="true">PIKO FG</span>
            <span className="text-zinc-400 mx-8 text-sm font-semibold" aria-hidden="true">—</span>
            <span className="text-piko-pink mx-8 text-sm font-semibold" aria-hidden="true">NEW ALBUM 2026</span>
            <span className="text-zinc-400 mx-8 text-sm font-semibold" aria-hidden="true">—</span>
            <span className="text-piko-orange mx-8 text-sm font-semibold" aria-hidden="true">STAY TUNED</span>
            <span className="text-zinc-400 mx-8 text-sm font-semibold" aria-hidden="true">—</span>
            <span className="text-piko-teal mx-8 text-sm font-semibold" aria-hidden="true">DIGITAL GRAFFITI COLLECTIVE</span>
            <span className="text-zinc-400 mx-8 text-sm font-semibold" aria-hidden="true">—</span>
            {/* Duplicate for seamless loop */}
            <span className="text-piko-teal mx-8 text-sm font-semibold" aria-hidden="true">PIKO FG</span>
            <span className="text-zinc-400 mx-8 text-sm font-semibold" aria-hidden="true">—</span>
            <span className="text-piko-pink mx-8 text-sm font-semibold" aria-hidden="true">NEW ALBUM 2026</span>
            <span className="text-zinc-400 mx-8 text-sm font-semibold" aria-hidden="true">—</span>
            <span className="text-piko-orange mx-8 text-sm font-semibold" aria-hidden="true">STAY TUNED</span>
            <span className="text-zinc-400 mx-8 text-sm font-semibold" aria-hidden="true">—</span>
            <span className="text-piko-teal mx-8 text-sm font-semibold" aria-hidden="true">DIGITAL GRAFFITI COLLECTIVE</span>
            <span className="text-zinc-400 mx-8 text-sm font-semibold" aria-hidden="true">—</span>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Copyright */}
          <div className="text-sm text-zinc-400">
            <p>&copy; {new Date().getFullYear()} Piko FG. All rights reserved.</p>
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex items-center gap-6 flex-wrap justify-center">
            <Link href="/music" className="text-sm text-zinc-400 hover:text-piko-teal transition">
              Music
            </Link>
            <Link href="/gallery" className="text-sm text-zinc-400 hover:text-piko-pink transition">
              Gallery
            </Link>
            <Link href="/merch" className="text-sm text-zinc-400 hover:text-piko-orange transition">
              Merch
            </Link>
            <Link href="/tour" className="text-sm text-zinc-400 hover:text-piko-teal transition">
              Tour
            </Link>
            {STUDIO_CONFIG.visible && (
              <Link
                href="/studio"
                aria-label="Studio (hidden access)"
                className="text-sm text-zinc-400 hover:text-piko-teal transition"
                style={{ opacity: STUDIO_CONFIG.footerLinkOpacity }}
              >
                Studio
              </Link>
            )}
          </nav>

          {/* Right: Street Rain Toggle */}
          <div className="flex items-center gap-4">
            {/* Street Rain Toggle */}
            <button
              onClick={() => setStreetRainEnabled(!streetRainEnabled)}
              aria-pressed={streetRainEnabled}
              aria-label="Toggle street rain ambiance"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition ${
                streetRainEnabled
                  ? 'border-piko-teal/50 bg-piko-teal/10 text-piko-teal'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
              }`}
              title="Street Rain Ambiance"
            >
              <CloudRain className="h-4 w-4" />
              <span className="text-xs font-medium">Rain</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
