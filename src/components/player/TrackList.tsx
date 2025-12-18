/**
 * TrackList component
 * Displays a grid of tracks with play controls
 * Integrates with global player store
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '@/store/playerStore';
import type { Track } from '@/data/tracks';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import Music from 'lucide-react/dist/esm/icons/music';

interface TrackListProps {
  tracks: Track[];
  showFilter?: boolean;
}

export default function TrackList({ tracks, showFilter = false }: TrackListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { current, isPlaying, playTrack, setQueue, togglePlay } = usePlayerStore();

  // Filter tracks by tag
  const filteredTracks = selectedTag
    ? tracks.filter((track) => track.tags?.includes(selectedTag))
    : tracks;

  // Get unique tags
  const allTags = Array.from(
    new Set(tracks.flatMap((track) => track.tags || []))
  ).sort();

  const handlePlay = (track: Track, index: number) => {
    // Set entire filtered list as queue
    setQueue(filteredTracks, index);
    
    // If clicking the same track, toggle play
    if (current?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, 'preview');
    }
  };

  return (
    <div className="w-full">
      {/* Filter */}
      {showFilter && allTags.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 text-xs rounded-full border transition ${
              selectedTag === null
                ? 'border-piko-teal bg-piko-teal/10 text-piko-teal'
                : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-piko-teal/50'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 text-xs rounded-full border transition ${
                selectedTag === tag
                  ? 'border-piko-teal bg-piko-teal/10 text-piko-teal'
                  : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-piko-teal/50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Track grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTracks.map((track, index) => {
          const isCurrentTrack = current?.id === track.id;
          const isCurrentPlaying = isCurrentTrack && isPlaying;

          return (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group relative overflow-hidden rounded-lg border bg-zinc-900/50 backdrop-blur-md p-4 transition-all hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10 ${
                isCurrentTrack ? 'border-piko-teal/50' : 'border-zinc-800'
              }`}
            >
              {/* Now Playing indicator */}
              {isCurrentTrack && (
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-piko-teal/10 border border-piko-teal/50">
                    <Music className="w-3 h-3 text-piko-teal" />
                    <span className="text-xs text-piko-teal font-semibold">
                      Now Playing
                    </span>
                  </div>
                </div>
              )}

              {/* Track content */}
              <div className="flex items-center gap-3 mb-3">
                {/* Play button */}
                <button
                  onClick={() => handlePlay(track, index)}
                  className={`w-14 h-14 rounded-md flex-shrink-0 flex items-center justify-center transition-all ${
                    isCurrentTrack
                      ? 'bg-gradient-to-br from-piko-teal to-piko-pink'
                      : 'bg-zinc-800 group-hover:bg-gradient-to-br group-hover:from-piko-teal group-hover:to-piko-pink'
                  }`}
                >
                  {isCurrentPlaying ? (
                    <Pause className="w-6 h-6 text-white" fill="currentColor" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                  )}
                </button>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-100 truncate">
                    {track.title}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                  {track.releaseYear && (
                    <p className="text-xs text-zinc-500">{track.releaseYear}</p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {track.tags && track.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {track.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs rounded-full bg-zinc-800/80 text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Animated border glow on hover */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-piko-teal/20 via-piko-pink/20 to-piko-orange/20" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredTracks.length === 0 && (
        <div className="text-center py-12">
          <Music className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400">No tracks found</p>
        </div>
      )}
    </div>
  );
}
