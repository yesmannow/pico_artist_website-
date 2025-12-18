'use client';

import React, { useRef, useEffect, useState } from 'react';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import SkipBack from 'lucide-react/dist/esm/icons/skip-back';
import SkipForward from 'lucide-react/dist/esm/icons/skip-forward';
import Volume2 from 'lucide-react/dist/esm/icons/volume-2';
import { Howl } from 'howler';

interface GlobalMusicPlayerState {
  currentTrack: {
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
  } | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
}

export default function GlobalMusicPlayer() {
  const [state, setState] = useState<GlobalMusicPlayerState>({
    currentTrack: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
    volume: 75,
  });

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [crackleVolume, setCrackleVolume] = useState(0.02);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const soundRef = useRef<Howl | null>(null);
  const crackleRef = useRef<Howl | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrubRef = useRef<HTMLDivElement>(null);

  // Initialize crackle sound with Web Audio API for proper lowpass filter
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Generate crackle noise buffer
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      // Create crackle pattern with occasional spikes
      const spike = Math.random() < 0.01 ? Math.random() * 0.3 : 0;
      data[i] = (Math.random() * 2 - 1) * 0.05 + spike;
    }

    // Create Howl instance for crackle
    crackleRef.current = new Howl({
      src: ['/lofi-teaser.wav'], // Fallback - would ideally be a crackle sound file
      volume: crackleVolume,
      loop: true,
      rate: 0.3, // Slow down for crackle effect
    });

    // Apply Web Audio API processing for lowpass filter
    if (crackleRef.current && audioContext) {
      const rawNode = (crackleRef.current as any)._sounds?.[0]?._node;
      const mediaElement = rawNode instanceof HTMLMediaElement ? rawNode : new Audio();
      const source = audioContext.createMediaElementSource(mediaElement);
      const filter = audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      filter.Q.value = 1;
      source.connect(filter);
      filter.connect(audioContext.destination);
    }

    return () => {
      crackleRef.current?.unload();
    };
  }, []);

  // Update crackle volume and apply lowpass filter when scrubbing
  useEffect(() => {
    if (crackleRef.current) {
      if (isScrubbing) {
        crackleRef.current.volume(0.15);
        // Apply resonant lowpass effect by adjusting rate and using Web Audio API
        crackleRef.current.rate(0.25); // Slower for more resonant effect
      } else {
        crackleRef.current.volume(crackleVolume);
        crackleRef.current.rate(0.3);
      }
    }
  }, [isScrubbing, crackleVolume]);

  // Play crackle when playing
  useEffect(() => {
    if (state.isPlaying && crackleRef.current && !crackleRef.current.playing()) {
      crackleRef.current.play();
    } else if (!state.isPlaying && crackleRef.current && crackleRef.current.playing()) {
      crackleRef.current.pause();
    }
  }, [state.isPlaying]);

  // Canvas visualizer animation - only animate when playing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Don't animate if not playing
    if (!state.isPlaying) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const bars = 32;
    const barWidth = canvas.width / bars;

    const animate = () => {
      // Check if still playing before animating
      if (!state.isPlaying) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#00f5d4');
        gradient.addColorStop(1, '#ff006e');

        ctx.fillStyle = gradient;

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
  }, [state.isPlaying]);

  // Update progress
  useEffect(() => {
    if (state.isPlaying && soundRef.current) {
      progressIntervalRef.current = setInterval(() => {
        if (soundRef.current && !isScrubbing) {
          const seek = soundRef.current.seek() as number;
          const duration = soundRef.current.duration() || 0;
          setState(prev => ({
            ...prev,
            progress: seek,
            duration: duration,
          }));
        }
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [state.isPlaying, isScrubbing]);

  const handlePlayPause = () => {
    if (!state.currentTrack) return;

    if (state.isPlaying) {
      soundRef.current?.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
    } else {
      if (!soundRef.current) {
        soundRef.current = new Howl({
          src: [state.currentTrack.audioUrl],
          volume: state.volume / 100,
          onend: () => {
            setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
          },
        });
      }
      soundRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrubRef.current || !soundRef.current || !state.duration) return;

    const rect = scrubRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newTime = percentage * state.duration;

    soundRef.current.seek(newTime);
    setState(prev => ({ ...prev, progress: newTime }));
  };

  const handleScrubStart = () => {
    setIsScrubbing(true);
  };

  const handleScrubEnd = () => {
    setIsScrubbing(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    if (soundRef.current) {
      soundRef.current.volume(newVolume / 100);
    }
    setState(prev => ({ ...prev, volume: newVolume }));
  };

  return (
    <div className="fixed bottom-0 right-0 w-96 z-50 border-t border-l border-zinc-800 bg-zinc-950/95 backdrop-blur-md rounded-tl-2xl">
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

      <div className="px-4 py-3">
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
                {state.currentTrack?.title || 'No track loaded'}
              </div>
              <div className="text-xs text-zinc-400 truncate">
                {state.currentTrack?.artist || 'Select a track to play'}
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
              onClick={handlePlayPause}
              className="rounded-full bg-gradient-to-r from-piko-teal to-piko-pink p-3 text-white shadow-lg shadow-piko-pink/20 transition-all hover:shadow-piko-pink/40 hover:scale-105"
              aria-label={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isPlaying ? (
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
              value={state.volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-piko-teal [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-piko-teal [&::-moz-range-thumb]:border-0"
              aria-label="Volume"
              style={{
                background: `linear-gradient(to right, #00f5d4 0%, #00f5d4 ${state.volume}%, #3f3f46 ${state.volume}%, #3f3f46 100%)`
              }}
            />
            <span className="text-xs text-zinc-400 w-8 text-right">
              {state.volume}%
            </span>
          </div>
        </div>

        {/* Vinyl Scrub Progress Bar */}
        <div className="mt-2">
          <div
            ref={scrubRef}
            onMouseDown={handleScrubStart}
            onMouseUp={handleScrubEnd}
            onMouseMove={(e) => {
              if (isScrubbing) handleScrub(e);
            }}
            onMouseLeave={handleScrubEnd}
            className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden cursor-pointer relative group"
          >
            <div
              className="h-2 rounded-full bg-gradient-to-r from-piko-pink to-piko-orange transition-all duration-300 relative"
              style={{ width: `${state.duration ? (state.progress / state.duration) * 100 : 0}%` }}
            >
              {/* Vinyl groove effect */}
              {isScrubbing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              )}
            </div>
            {/* Scrub handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-piko-teal border-2 border-zinc-950 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${state.duration ? (state.progress / state.duration) * 100 : 0}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-500 mt-1">
            <span>{formatTime(state.progress)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
