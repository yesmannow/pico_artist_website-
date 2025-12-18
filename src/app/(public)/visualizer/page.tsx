/**
 * Visualizer Page
 * Full-screen audio-reactive visualizer experience
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/store/playerStore';
import VisualizerCanvas from '@/components/visuals/VisualizerCanvas';
import { presets } from '@/lib/visuals/presets';
import X from 'lucide-react/dist/esm/icons/x';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';

export default function VisualizerPage() {
  const router = useRouter();
  
  // Determine last route from referrer on mount
  const [lastRoute] = useState(() => {
    if (typeof window === 'undefined') return '/music';
    const referrer = document.referrer;
    if (referrer) {
      try {
        const url = new URL(referrer);
        if (url.pathname !== '/visualizer') {
          return url.pathname;
        }
      } catch {
        // Invalid referrer, use default
      }
    }
    return '/music';
  });
  
  const [presetId, setPresetId] = useState(presets[0].id);
  const [intensity, setIntensity] = useState(1);
  const [audioReactive, setAudioReactive] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);

  const { isPlaying, togglePlay, current, seek, currentTime } = usePlayerStore();

  // Auto-hide controls after 3 seconds of no mouse movement
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (hideTimeout) clearTimeout(hideTimeout);
      const timeout = setTimeout(() => setShowControls(false), 3000);
      setHideTimeout(timeout);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [hideTimeout]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          router.push(lastRoute);
          break;
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentTime > 5) {
            seek(currentTime - 5);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(currentTime + 5);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, currentTime, seek, router, lastRoute]);

  const handleExit = () => {
    router.push(lastRoute);
  };

  const currentPresetIndex = presets.findIndex((p) => p.id === presetId);

  const handlePrevPreset = () => {
    const newIndex = (currentPresetIndex - 1 + presets.length) % presets.length;
    setPresetId(presets[newIndex].id);
  };

  const handleNextPreset = () => {
    const newIndex = (currentPresetIndex + 1) % presets.length;
    setPresetId(presets[newIndex].id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950">
      {/* Visualizer Canvas */}
      <VisualizerCanvas
        presetId={presetId}
        intensity={intensity}
        audioReactive={audioReactive}
        backgroundMode="bg"
      />

      {/* Overlay Controls */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar - Exit and Track Info */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-zinc-950/80 to-transparent pointer-events-auto">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={handleExit}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 text-zinc-300 hover:border-piko-teal hover:text-piko-teal transition"
              aria-label="Exit visualizer"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Exit</span>
            </button>

            {current && (
              <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800">
                <Sparkles className="w-4 h-4 text-piko-teal" />
                <div className="text-sm">
                  <p className="font-semibold text-zinc-100">{current.title}</p>
                  <p className="text-xs text-zinc-400">{current.artist}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950/80 to-transparent pointer-events-auto">
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Preset and Intensity Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Preset Selector */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-700">
                <button
                  onClick={handlePrevPreset}
                  className="p-1 text-zinc-400 hover:text-piko-teal transition"
                  aria-label="Previous preset"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-zinc-100 min-w-[120px] text-center">
                  {presets[currentPresetIndex].name}
                </span>
                <button
                  onClick={handleNextPreset}
                  className="p-1 text-zinc-400 hover:text-piko-teal transition"
                  aria-label="Next preset"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Intensity Slider */}
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-700">
                <span className="text-xs text-zinc-400">Intensity</span>
                <input
                  type="range"
                  min="0.3"
                  max="2"
                  step="0.1"
                  value={intensity}
                  onChange={(e) => setIntensity(parseFloat(e.target.value))}
                  className="w-24 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-piko-teal [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <span className="text-xs text-zinc-300 w-8">{intensity.toFixed(1)}</span>
              </div>

              {/* Audio Reactive Toggle */}
              <button
                onClick={() => setAudioReactive(!audioReactive)}
                className={`px-4 py-2 rounded-full border text-sm transition ${
                  audioReactive
                    ? 'border-piko-teal bg-piko-teal/15 text-piko-teal shadow-[0_0_20px_rgba(0,245,212,0.2)]'
                    : 'border-zinc-700 bg-zinc-900/80 text-zinc-400 hover:border-zinc-600'
                } backdrop-blur-xl`}
              >
                Audio Reactive
              </button>

              {/* Play/Pause */}
              {current && (
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-piko-pink text-white hover:bg-piko-pink/80 transition shadow-lg shadow-piko-pink/20"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" fill="currentColor" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  )}
                </button>
              )}
            </div>

            {/* Keyboard Hints */}
            <div className="flex justify-center gap-4 text-xs text-zinc-500">
              <span>ESC to exit</span>
              <span>•</span>
              <span>SPACE to play/pause</span>
              <span>•</span>
              <span>← → to seek</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
