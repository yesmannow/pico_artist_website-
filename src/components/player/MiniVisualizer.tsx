/**
 * Mini Visualizer Overlay
 * Lightweight audio-reactive animation for track cards
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';

interface MiniVisualizerProps {
  trackId: string;
  className?: string;
}

export default function MiniVisualizer({ trackId, className = '' }: MiniVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const barsRef = useRef<number[]>([]);
  
  const { current, isPlaying } = usePlayerStore();
  const isCurrentTrack = current?.id === trackId;
  const shouldAnimate = isCurrentTrack && isPlaying;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize bars with random heights
    if (barsRef.current.length === 0) {
      barsRef.current = Array.from({ length: 5 }, () => Math.random() * 0.5 + 0.5);
    }

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!shouldAnimate) {
        // Draw static bars when not playing
        const barCount = 5;
        const barWidth = canvas.width / barCount;
        const minHeight = 0.2;

        for (let i = 0; i < barCount; i++) {
          const height = canvas.height * minHeight;
          ctx.fillStyle = 'rgba(0, 245, 212, 0.3)';
          ctx.fillRect(
            i * barWidth + barWidth * 0.2,
            (canvas.height - height) / 2,
            barWidth * 0.6,
            height
          );
        }
        return;
      }

      // Animate bars when playing
      const barCount = 5;
      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        // Update bar height with smooth animation
        const targetHeight = Math.random() * 0.6 + 0.4;
        barsRef.current[i] += (targetHeight - barsRef.current[i]) * 0.2;

        const height = canvas.height * barsRef.current[i];
        
        // Create gradient for bars
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 245, 212, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 0, 110, 0.8)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          i * barWidth + barWidth * 0.2,
          (canvas.height - height) / 2,
          barWidth * 0.6,
          height
        );
      }

      if (shouldAnimate) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    // Start animation loop
    draw();
    if (shouldAnimate) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [shouldAnimate]);

  // Set canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
