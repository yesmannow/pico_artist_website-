/**
 * GraffitiPreloader - SVG-based loading animation
 * 
 * A "Graffiti Tag" preloader that shows the Piko FG logo filling up
 * with neon paint using SVG stroke-dashoffset animation.
 * 
 * Lightweight, CSS-only animation that runs on the compositor thread.
 */

'use client';

import { useState, useEffect } from 'react';

interface GraffitiPreloaderProps {
  /** Minimum duration to show the loader (ms) */
  minDuration?: number;
  /** Called when loading is complete */
  onComplete?: () => void;
}

export default function GraffitiPreloader({
  minDuration = 1500,
  onComplete,
}: GraffitiPreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimatingOut(true);
      // Wait for fade out animation before removing
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 400);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 transition-opacity duration-400 ${
        isAnimatingOut ? 'opacity-0' : 'opacity-100'
      }`}
      aria-label="Loading"
      role="progressbar"
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Piko FG Logo with stroke animation */}
        <svg
          viewBox="0 0 120 120"
          className="w-24 h-24 md:w-32 md:h-32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff006e" />
              <stop offset="50%" stopColor="#00f5d4" />
              <stop offset="100%" stopColor="#ff9e00" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
            fill="none"
          />
          
          {/* Animated "P" path (stylized Piko) */}
          <path
            d="M40 90 L40 30 Q40 25 45 25 L65 25 Q85 25 85 45 Q85 65 65 65 L50 65"
            stroke="url(#neonGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            filter="url(#glow)"
            className="preloader-stroke"
          />
          
          {/* Animated progress circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="url(#neonGradient)"
            strokeWidth="3"
            fill="none"
            filter="url(#glow)"
            className="preloader-circle"
          />
        </svg>

        {/* Brand text */}
        <div className="text-center">
          <p className="text-lg md:text-xl font-bold tracking-[0.3em] text-zinc-100">
            PIKO <span className="text-piko-teal">FG</span>
          </p>
          <p className="text-xs text-zinc-500 tracking-widest mt-1">
            DIGITAL GRAFFITI
          </p>
        </div>

        {/* Loading dots - using CSS animation delays via inline style (Tailwind doesn't support arbitrary animation-delay) */}
        <div className="flex gap-1">
          <span className="preloader-dot w-2 h-2 rounded-full bg-piko-pink" style={{ animationDelay: '0ms' }} />
          <span className="preloader-dot w-2 h-2 rounded-full bg-piko-teal" style={{ animationDelay: '150ms' }} />
          <span className="preloader-dot w-2 h-2 rounded-full bg-piko-orange" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
