'use client';

import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function GlobalMusicPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(75);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Canvas visualizer animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bars = 32;
    const barWidth = canvas.width / bars;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < bars; i++) {
        // Simulate frequency data (would be replaced with real audio data)
        const height = isPlaying 
          ? Math.random() * canvas.height * 0.8 + canvas.height * 0.1
          : canvas.height * 0.1;
        
        // Create gradient for drip effect
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#00f5d4');
        gradient.addColorStop(1, '#ff006e');
        
        ctx.fillStyle = gradient;
        
        // Draw drip-style bars
        const x = i * barWidth;
        ctx.beginPath();
        ctx.roundRect(x + barWidth * 0.2, canvas.height - height, barWidth * 0.6, height, [2, 2, 0, 0]);
        ctx.fill();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      {/* Paint Drip SVG Overlay */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full">
        <svg 
          viewBox="0 0 1200 40" 
          preserveAspectRatio="none" 
          className="w-full h-10"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }}
        >
          <defs>
            <linearGradient id="dripGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#00f5d4', stopOpacity: 0.6 }} />
              <stop offset="50%" style={{ stopColor: '#ff006e', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: '#ff9e00', stopOpacity: 0.6 }} />
            </linearGradient>
          </defs>
          <path 
            d="M0,0 L0,20 Q50,35 100,20 T200,20 T300,20 Q350,30 400,20 T500,20 T600,20 Q650,35 700,20 T800,20 T900,20 Q950,30 1000,20 T1100,20 L1200,20 L1200,0 Z" 
            fill="url(#dripGradient)"
          />
        </svg>
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Track Info with Visualizer */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-12 w-12 rounded-md bg-gradient-to-br from-piko-teal to-piko-pink flex-shrink-0 relative overflow-hidden">
              <canvas 
                ref={canvasRef} 
                width="48" 
                height="48" 
                className="absolute inset-0"
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-zinc-100 truncate">
                No track loaded
              </div>
              <div className="text-xs text-zinc-400 truncate">
                Select a track to play
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-piko-teal"
              aria-label="Previous track"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full bg-gradient-to-r from-piko-teal to-piko-pink p-3 text-white shadow-lg shadow-piko-pink/20 transition-all hover:shadow-piko-pink/40 hover:scale-105"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
              )}
            </button>
            <button
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-piko-teal"
              aria-label="Next track"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-end">
            <Volume2 className="h-4 w-4 text-zinc-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-piko-teal [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-piko-teal [&::-moz-range-thumb]:border-0"
              aria-label="Volume"
              style={{
                background: `linear-gradient(to right, #00f5d4 0%, #00f5d4 ${volume}%, #3f3f46 ${volume}%, #3f3f46 100%)`
              }}
            />
            <span className="text-xs text-zinc-400 w-8 text-right">
              {volume}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-1 rounded-full bg-gradient-to-r from-piko-pink to-piko-orange transition-all duration-300"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
