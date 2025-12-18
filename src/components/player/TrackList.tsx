/**
 * TrackList component
 * Displays a grid of tracks with play controls
 * Integrates with global player store
 */

'use client';

import { useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import type { Track } from '@/data/tracks';
import TrackCard from './TrackCard';
import Music from 'lucide-react/dist/esm/icons/music';

interface TrackListProps {
  tracks: Track[];
  showFilter?: boolean;
}

export default function TrackList({ tracks, showFilter = false }: TrackListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { current, playTrack, setQueue, togglePlay } = usePlayerStore();

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
        {filteredTracks.map((track, index) => (
          <TrackCard
            key={track.id}
            track={track}
            index={index}
            onPlay={() => handlePlay(track, index)}
          />
        ))}
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
