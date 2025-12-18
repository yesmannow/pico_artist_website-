/**
 * Waveform component using wavesurfer.js
 * Client-side only component for audio visualization
 */

'use client';

import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformProps {
  url: string;
  currentTime?: number;
  onSeek?: (time: number) => void;
  height?: number;
  className?: string;
}

export default function Waveform({
  url,
  currentTime = 0,
  onSeek,
  height = 80,
  className = '',
}: WaveformProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const isSeekingRef = useRef(false);

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
      const duration = wavesurferRef.current.getDuration();
      if (duration > 0) {
        const progress = currentTime / duration;
        wavesurferRef.current.seekTo(progress);
      }
    }
  }, [currentTime]);

  return (
    <div 
      ref={containerRef} 
      className={`rounded-lg overflow-hidden bg-zinc-950/50 ${className}`}
      style={{ 
        cursor: 'pointer',
      }}
    />
  );
}
