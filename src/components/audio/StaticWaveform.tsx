/**
 * StaticWaveform - Lightweight SVG waveform placeholder
 * 
 * A CSS-only, zero-JS waveform visualization that uses static SVG paths
 * instead of heavy wavesurfer.js canvas rendering.
 * 
 * Use this for non-playing tracks to save memory and GPU resources.
 */

'use client';

import { useMemo } from 'react';

interface StaticWaveformProps {
  className?: string;
  height?: number;
  barCount?: number;
  seed?: string; // For consistent random patterns per track
}

// Simple seeded random for consistent waveform generation
function seededRandom(seed: string): () => number {
  let value = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export default function StaticWaveform({
  className = '',
  height = 48,
  barCount = 50,
  seed = 'default',
}: StaticWaveformProps) {
  // Generate waveform bars with consistent pattern based on seed
  const bars = useMemo(() => {
    const random = seededRandom(seed);
    return Array.from({ length: barCount }, () => {
      // Generate height between 20% and 100% of container height
      const barHeight = 0.2 + random() * 0.8;
      return barHeight;
    });
  }, [barCount, seed]);

  return (
    <svg
      viewBox={`0 0 ${barCount * 4} ${height}`}
      className={`w-full ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`waveGradient-${seed}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f5d4" />
          <stop offset="100%" stopColor="#ff006e" />
        </linearGradient>
      </defs>
      {bars.map((barHeight, i) => {
        const barH = barHeight * height;
        const y = (height - barH) / 2;
        return (
          <rect
            key={i}
            x={i * 4}
            y={y}
            width={3}
            height={barH}
            rx={1.5}
            fill={`url(#waveGradient-${seed})`}
            opacity={0.9}
          />
        );
      })}
    </svg>
  );
}
