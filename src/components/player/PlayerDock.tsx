/**
 * PlayerDock - Fixed bottom player UI
 * Always visible global music player
 */

'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePlayerStore } from '@/store/playerStore';
import { howlerEngine } from '@/lib/player/howlerEngine';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import SkipBack from 'lucide-react/dist/esm/icons/skip-back';
import SkipForward from 'lucide-react/dist/esm/icons/skip-forward';
import Volume2 from 'lucide-react/dist/esm/icons/volume-2';
import VolumeX from 'lucide-react/dist/esm/icons/volume-x';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Music from 'lucide-react/dist/esm/icons/music';
import { usePathname, useRouter } from 'next/navigation';
import { getSocialLink } from '@/data/socials';

/**
 * Format seconds to mm:ss
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlayerDock() {
  const pathname = usePathname();
  const router = useRouter();
  const youtubeMusicLink = getSocialLink('youtube-music');
  const {
    current,
    isPlaying,
    volume,
    currentTime,
    duration,
    source,
    togglePlay,
    prev,
    next,
    seek,
    setVolume,
    setSource,
    setCurrentTime,
    setDuration,
    setIsPlaying,
  } = usePlayerStore();

  const timeUpdateRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const safeProgress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Initialize and sync with howler engine
  useEffect(() => {
    if (!current) return;

    // Initialize howler with current track
    howlerEngine.init(current, source, {
      onLoad: (dur) => {
        setDuration(dur);
      },
      onPlay: () => {
        setIsPlaying(true);
      },
      onPause: () => {
        setIsPlaying(false);
      },
      onEnd: () => {
        next();
      },
    });

    return () => {
      howlerEngine.cleanup();
    };
  }, [current, source, setDuration, setIsPlaying, next]);

  // Set volume separately to avoid re-initialization
  useEffect(() => {
    howlerEngine.setVolume(volume);
  }, [volume]);

  // Handle play/pause state changes
  useEffect(() => {
    if (isPlaying) {
      howlerEngine.play();
    } else {
      howlerEngine.pause();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    howlerEngine.setVolume(volume);
  }, [volume]);

  // Update current time continuously while playing
  useEffect(() => {
    if (isPlaying) {
      const updateTime = () => {
        const time = howlerEngine.getCurrentTime();
        setCurrentTime(time);
        timeUpdateRef.current = requestAnimationFrame(updateTime);
      };
      timeUpdateRef.current = requestAnimationFrame(updateTime);
    } else {
      if (timeUpdateRef.current) {
        cancelAnimationFrame(timeUpdateRef.current);
        timeUpdateRef.current = null;
      }
    }

    return () => {
      if (timeUpdateRef.current) {
        cancelAnimationFrame(timeUpdateRef.current);
      }
    };
  }, [isPlaying, setCurrentTime]);

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
    howlerEngine.seek(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Toggle source (only on track detail page and if full version exists)
  const canToggleSource = pathname?.includes('/music/') && current?.fullUrl;
  
  const handleSourceToggle = () => {
    if (canToggleSource) {
      setSource(source === 'preview' ? 'full' : 'preview');
    }
  };

  if (!current) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Progress bar */}
          <div className="mb-2">
            <motion.div
              className="relative"
              animate={
                isPlaying && !prefersReducedMotion
                  ? { scaleY: [1, 1.02, 1], opacity: [0.95, 1, 0.95] }
                  : { scaleY: 1, opacity: 1 }
              }
              transition={{ repeat: isPlaying && !prefersReducedMotion ? Infinity : 0, duration: 2.4 }}
            >
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-piko-teal [&::-webkit-slider-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgb(255, 0, 110) 0%, rgb(255, 0, 110) ${safeProgress}%, rgb(39, 39, 42) ${safeProgress}%, rgb(39, 39, 42) 100%)`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-full blur-md"
                style={{
                  background: `linear-gradient(to right, rgba(0,245,212,0.2) 0%, rgba(255,0,110,0.3) ${safeProgress}%, rgba(39,39,42,0) ${safeProgress}%, rgba(39,39,42,0) 100%)`,
                  opacity: isPlaying ? 0.6 : 0.3,
                  transition: 'opacity 200ms ease',
                }}
              />
            </motion.div>
            <div className="flex justify-between text-xs text-zinc-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls and info */}
          <div className="flex items-center justify-between gap-4">
            {/* Track info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-piko-teal to-piko-pink flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-zinc-100 truncate">
                  {current.title}
                </p>
                <p className="text-xs text-zinc-400 truncate">{current.artist}</p>
              </div>
              <motion.div
                aria-hidden
                className="hidden sm:flex items-end gap-1"
                animate={
                  isPlaying && !prefersReducedMotion
                    ? { scaleY: [0.6, 1, 0.6] }
                    : { scaleY: 0.4 }
                }
                transition={{ repeat: isPlaying && !prefersReducedMotion ? Infinity : 0, duration: 1.2, ease: 'easeInOut' }}
              >
                {[1, 2, 3, 4].map((bar) => (
                  <div
                    key={bar}
                    className="w-[3px] rounded-full bg-gradient-to-b from-piko-teal via-piko-pink to-piko-orange"
                    style={{
                      height: `${10 + bar * 4}px`,
                      opacity: 0.8,
                    }}
                  />
                ))}
              </motion.div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="p-2 text-zinc-400 hover:text-piko-teal transition"
                aria-label="Previous track"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-piko-teal text-white hover:bg-piko-teal/80 transition"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                )}
              </button>
              <button
                onClick={next}
                className="p-2 text-zinc-400 hover:text-piko-teal transition"
                aria-label="Next track"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume and source toggle */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              {/* YouTube Music Link */}
              {youtubeMusicLink && (
                <a
                  href={youtubeMusicLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-zinc-400 hover:text-piko-pink transition"
                  aria-label="Listen on YouTube Music"
                  title="Listen on YouTube Music"
                >
                  <Music className="w-5 h-5" />
                </a>
              )}

              {/* Visualizer button */}
              <button
                onClick={() => router.push('/visualizer')}
                className="p-2 text-zinc-400 hover:text-piko-teal transition"
                aria-label="Open visualizer"
                title="Visualizer Mode"
              >
                <Sparkles className="w-5 h-5" />
              </button>

              {/* Source toggle (only on detail page with full version) */}
              {canToggleSource && (
                <button
                  onClick={handleSourceToggle}
                  className="px-3 py-1 text-xs rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-piko-pink hover:text-piko-pink transition"
                >
                  {source === 'preview' ? 'Preview' : 'Full'}
                </button>
              )}

              {/* Volume control */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                  className="text-zinc-400 hover:text-piko-teal transition"
                  aria-label={volume > 0 ? 'Mute' : 'Unmute'}
                >
                  {volume > 0 ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-piko-teal [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
