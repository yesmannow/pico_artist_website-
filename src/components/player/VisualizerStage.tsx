'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface VisualizerStageProps {
  active: boolean;
  isPlaying: boolean;
  currentTime: number;
  className?: string;
  intensity?: number;
}

// Slightly faster-than-1Hz beat to keep the blob motion feeling musical without being distracting
const BEAT_FREQUENCY = 2.6;
const SPLASH_ALPHA = {
  pink: { base: 0.08, pulse: 0.05 },
  teal: { base: 0.07, pulse: 0.05 },
  orange: { base: 0.05, pulse: 0.04 },
};

export default function VisualizerStage({
  active,
  isPlaying,
  currentTime,
  className = '',
  intensity = 1,
}: VisualizerStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(currentTime);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    timeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    if (!active || prefersReducedMotion) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!ctx || !canvas) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const beat = Math.sin(timeRef.current * BEAT_FREQUENCY) * 0.5 + 0.5;
      const pulse = (isPlaying ? 0.6 : 0.2) * intensity + beat * 0.25;

      ctx.fillStyle = `rgba(255, 0, 110, ${
        SPLASH_ALPHA.pink.base + pulse * SPLASH_ALPHA.pink.pulse
      })`;
      ctx.beginPath();
      ctx.ellipse(width * 0.35, height * 0.55, width * 0.45, height * (0.3 + pulse * 0.25), 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(0, 245, 212, ${
        SPLASH_ALPHA.teal.base + pulse * SPLASH_ALPHA.teal.pulse
      })`;
      ctx.beginPath();
      ctx.ellipse(width * 0.65, height * 0.45, width * 0.38, height * (0.28 + pulse * 0.2), 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 158, 0, ${
        SPLASH_ALPHA.orange.base + pulse * SPLASH_ALPHA.orange.pulse
      })`;
      ctx.beginPath();
      ctx.ellipse(width * 0.5, height * 0.65, width * 0.5, height * (0.18 + pulse * 0.15), 0, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [active, prefersReducedMotion, isPlaying, intensity]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="h-full w-full" />
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"
        initial={false}
        animate={
          active && !prefersReducedMotion
            ? { opacity: [0.7, 0.9, 0.7] }
            : { opacity: 0.55 }
        }
        transition={{ repeat: active && !prefersReducedMotion ? Infinity : 0, duration: 3 }}
      />
    </div>
  );
}
