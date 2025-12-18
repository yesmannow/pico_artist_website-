/**
 * Premium Track Card Component
 * Displays track with cover art, gradient overlay, and animations
 * Used across home, music, and media pages
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { Track } from '@/data/tracks';
import { usePlayerStore } from '@/store/playerStore';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import Music from 'lucide-react/dist/esm/icons/music';

interface TrackCardProps {
  track: Track;
  index?: number;
  onPlay?: () => void;
  variant?: 'default' | 'compact' | 'featured';
  showNowPlaying?: boolean;
}

export default function TrackCard({
  track,
  index = 0,
  onPlay,
  variant = 'default',
  showNowPlaying = true,
}: TrackCardProps) {
  const { current, isPlaying } = usePlayerStore();
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const isCurrentTrack = current?.id === track.id;
  const isCurrentPlaying = isCurrentTrack && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onPlay) {
      onPlay();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onPlay) {
        onPlay();
      }
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/music/${track.slug}`} className="block">
        <div
          className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
            isCurrentTrack
              ? 'border-piko-teal/60 shadow-[0_0_0_1px_rgba(0,245,212,0.28),0_0_40px_rgba(255,0,110,0.14)]'
              : 'border-zinc-800/80 hover:border-piko-teal/50 hover:-translate-y-1 hover:shadow-[0_22px_46px_-28px_rgba(0,245,212,0.35)]'
          }`}
        >
          {/* Cover Art Background */}
          <div className="relative h-48 sm:h-56 overflow-hidden bg-zinc-900">
            <Image
              src={track.coverArt || '/piko-logo.jpg'}
              alt={track.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              unoptimized
            />
            
            {/* Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />
            
            {/* Animated glow on hover */}
            {isHovered && !prefersReducedMotion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-piko-teal/20 via-piko-pink/20 to-piko-orange/20"
              />
            )}
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayClick}
                onKeyDown={handleKeyDown}
                aria-label={isCurrentPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-piko-teal focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                  isCurrentTrack
                    ? 'bg-gradient-to-br from-piko-teal to-piko-pink shadow-lg shadow-piko-pink/50'
                    : 'bg-zinc-900/80 backdrop-blur-md group-hover:bg-gradient-to-br group-hover:from-piko-teal group-hover:to-piko-pink group-hover:shadow-lg group-hover:shadow-piko-pink/50 opacity-80 group-hover:opacity-100'
                }`}
              >
                {isCurrentPlaying ? (
                  <Pause className="w-7 h-7 text-white" fill="currentColor" />
                ) : (
                  <Play className="w-7 h-7 text-white ml-0.5" fill="currentColor" />
                )}
              </button>
            </div>
          </div>

          {/* Track Info */}
          <div className="relative bg-zinc-900/80 backdrop-blur-xl p-4 border-t border-zinc-800/50">
            {/* Now Playing Indicator */}
            {showNowPlaying && isCurrentTrack && (
              <div className="absolute -top-3 right-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-piko-teal/90 border border-piko-teal shadow-lg shadow-piko-teal/30">
                  <Music className="w-3 h-3 text-white" />
                  <span className="text-xs text-white font-semibold">Now Playing</span>
                </div>
              </div>
            )}

            <h3 className="text-base font-semibold text-zinc-100 truncate mb-1 group-hover:text-piko-teal transition">
              {track.title}
            </h3>
            <p className="text-sm text-zinc-400 truncate mb-2">{track.artist}</p>

            {/* Tags */}
            {track.tags && track.tags.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {track.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pulse animation for currently playing track */}
          {isCurrentTrack && isPlaying && !prefersReducedMotion && (
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(0,245,212,0.2)',
                  '0 0 0 14px rgba(255,0,110,0)',
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.9,
                ease: 'easeOut',
              }}
            />
          )}

          {/* Subtle glow effect for active track */}
          {isCurrentTrack && (
            <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(0,245,212,0.12),transparent_55%)] opacity-50 blur-3xl pointer-events-none" />
          )}
        </div>
      </Link>
    </motion.div>
  );
}
