'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function GlobalMusicPlayer() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(75);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-12 w-12 rounded-md bg-gradient-to-br from-cyan-500 to-purple-600 flex-shrink-0" />
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
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
              aria-label="Previous track"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-3 text-white shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-500/40 hover:scale-105"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" fill="currentColor" />
              ) : (
                <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
              )}
            </button>
            <button
              className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
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
              className="w-24 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              aria-label="Volume"
            />
            <span className="text-xs text-zinc-400 w-8 text-right">
              {volume}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="h-1 w-full rounded-full bg-zinc-800">
            <div
              className="h-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
