/**
 * Global player state using Zustand
 * Manages playback queue, current track, and player controls
 */

import { create } from 'zustand';
import type { Track } from '@/data/tracks';

export type PlaybackSource = 'preview' | 'full';

interface PlayerState {
  // Queue and current track
  queue: Track[];
  currentIndex: number;
  current?: Track;
  
  // Playback state
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  source: PlaybackSource;
  
  // Loading state
  isLoading: boolean;
  
  // Actions
  setQueue: (tracks: Track[], startIndex?: number) => void;
  playTrack: (track: Track, source?: PlaybackSource) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  seek: (seconds: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  prev: () => void;
  setSource: (source: PlaybackSource) => void;
  
  // Internal state updates (called by howlerEngine)
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Initial state
  queue: [],
  currentIndex: -1,
  current: undefined,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  source: 'preview',
  isLoading: false,
  
  // Actions
  setQueue: (tracks, startIndex = 0) => {
    const index = Math.max(0, Math.min(startIndex, tracks.length - 1));
    set({
      queue: tracks,
      currentIndex: index,
      current: tracks[index],
    });
  },
  
  playTrack: (track, source) => {
    const state = get();
    const newSource = source || state.source;
    
    // If track is already current, just toggle play
    if (state.current?.id === track.id && state.source === newSource) {
      get().togglePlay();
      return;
    }
    
    // Find track in queue or add it
    let index = state.queue.findIndex((t) => t.id === track.id);
    if (index === -1) {
      // Add to queue
      set({
        queue: [...state.queue, track],
        currentIndex: state.queue.length,
        current: track,
        source: newSource,
        currentTime: 0,
      });
    } else {
      set({
        currentIndex: index,
        current: track,
        source: newSource,
        currentTime: 0,
      });
    }
  },
  
  togglePlay: () => {
    set({ isPlaying: !get().isPlaying });
  },
  
  play: () => {
    set({ isPlaying: true });
  },
  
  pause: () => {
    set({ isPlaying: false });
  },
  
  seek: (seconds) => {
    set({ currentTime: seconds });
  },
  
  setVolume: (volume) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },
  
  next: () => {
    const state = get();
    if (state.currentIndex < state.queue.length - 1) {
      const nextIndex = state.currentIndex + 1;
      set({
        currentIndex: nextIndex,
        current: state.queue[nextIndex],
        currentTime: 0,
      });
    }
  },
  
  prev: () => {
    const state = get();
    // If more than 3 seconds into track, restart it
    if (state.currentTime > 3) {
      set({ currentTime: 0 });
    } else if (state.currentIndex > 0) {
      const prevIndex = state.currentIndex - 1;
      set({
        currentIndex: prevIndex,
        current: state.queue[prevIndex],
        currentTime: 0,
      });
    }
  },
  
  setSource: (source) => {
    const state = get();
    if (state.source !== source && state.current) {
      set({ 
        source,
        currentTime: 0,
      });
    }
  },
  
  // Internal state updates
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
