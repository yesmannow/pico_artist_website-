/**
 * Waveform component using wavesurfer.js
 * Client-side only component for audio visualization
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformProps {
  url: string;
  currentTime?: number;
  onSeek?: (time: number) => void;
  height?: number;
  className?: string;
  isPlaying?: boolean;
}

export default function Waveform({
  url,
  currentTime = 0,
  onSeek,
  height = 80,
  className = '',
  isPlaying = false,
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isSeekingRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const playheadGlow = '0 0 20px rgba(0,245,212,0.35)'; // aligns with piko-teal brand

  // Initialize wavesurfer
  useEffect(() => {
    if (!containerRef.current) return;

    // Try WebAudio first, fallback to MediaElement if needed
    let backend: 'WebAudio' | 'MediaElement' = 'WebAudio';
    
    try {
      // Create wavesurfer instance
      const wavesurfer = WaveSurfer.create({
        container: containerRef.current,
        waveColor: 'rgb(0, 245, 212)', // piko-teal
        progressColor: 'rgb(255, 0, 110)', // piko-pink
        cursorColor: 'rgb(255, 158, 0)', // piko-orange
        barWidth: 2,
        barRadius: 3,
        barGap: 1,
        height,
        normalize: true,
        backend,
        interact: true,
      });

      wavesurferRef.current = wavesurfer;

      // Load audio
      wavesurfer.load(url);

       // Handle seeking
       wavesurfer.on('seeking', (progress) => {
         if (!isSeekingRef.current) {
           isSeekingRef.current = true;
           const duration = wavesurfer.getDuration();
           const time = progress * duration;
          onSeek?.(time);
          setTimeout(() => {
            isSeekingRef.current = false;
          }, 100);
        }
      });

       // Cleanup
       return () => {
         wavesurfer.destroy();
       };
     } catch (error) {
       console.error('WaveSurfer initialization failed:', error);
      // Fallback already attempted through backend setting
    }
  }, [url, height, onSeek]);

  // Update current time from external source
   useEffect(() => {
     if (wavesurferRef.current && !isSeekingRef.current) {
       const waveDuration = wavesurferRef.current.getDuration();
       if (waveDuration > 0) {
         const computedProgress = currentTime / waveDuration;
         setProgress(computedProgress);
         wavesurferRef.current.seekTo(computedProgress);
       }
     }
   }, [currentTime]);

  return (
    <div
      ref={containerRef}
      className={`relative rounded-lg overflow-hidden bg-zinc-950/50 ${className}`}
      style={{
        cursor: 'pointer',
      }}
    >
      {/* Playhead glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: isPlaying ? 1 : 0.4,
          transition: 'opacity 150ms ease',
        }}
      >
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-piko-teal via-piko-pink to-piko-orange shadow-[0_0_20px_rgba(0,245,212,0.35)]"
          style={{
            left: `${Math.min(100, Math.max(0, progress * 100))}%`,
            transform: 'translateX(-50%)',
            boxShadow: playheadGlow,
          }}
        />
        <div
          className="absolute bottom-1 h-1 rounded-full bg-gradient-to-r from-piko-teal/30 via-piko-pink/25 to-piko-orange/20 blur-md"
          style={{
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
          }}
        />
      </div>
    </div>
  );
}
