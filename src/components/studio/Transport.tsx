'use client';

import { motion } from 'framer-motion';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import Square from 'lucide-react/dist/esm/icons/square';
import Repeat from 'lucide-react/dist/esm/icons/repeat';
import { useStudioLocalStore } from '@/store/studioLocalStore';

export default function Transport() {
  const {
    isPlaying,
    isLooping,
    currentTime,
    setIsPlaying,
    setIsLooping,
    setCurrentTime,
  } = useStudioLocalStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleLoopToggle = () => {
    setIsLooping(!isLooping);
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-4">
        {/* Transport Controls */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className={`p-3 rounded-full transition-all ${
              isPlaying
                ? 'bg-piko-pink/20 border border-piko-pink/50 text-piko-pink shadow-lg shadow-piko-pink/20'
                : 'bg-piko-teal/20 border border-piko-teal/50 text-piko-teal shadow-lg shadow-piko-teal/20'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" fill="currentColor" />
            ) : (
              <Play className="h-6 w-6" fill="currentColor" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStop}
            className="p-3 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600 transition-all"
            aria-label="Stop"
          >
            <Square className="h-6 w-6" fill="currentColor" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoopToggle}
            className={`p-3 rounded-full transition-all ${
              isLooping
                ? 'bg-piko-orange/20 border border-piko-orange/50 text-piko-orange'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-100 hover:border-zinc-600'
            }`}
            aria-label="Toggle Loop"
          >
            <Repeat className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Timecode Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50 border border-zinc-700">
            <span className="text-xs text-zinc-400 font-semibold">TIME</span>
            <span className="text-2xl font-mono font-bold text-zinc-100 tabular-nums">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
