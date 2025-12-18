import { create } from 'zustand';

export interface Track {
  id: string;
  name: string;
  audioUrl?: string;
  waveform?: number[];
  startTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  solo: boolean;
}

interface StudioState {
  tracks: Track[];
  currentTime: number;
  isPlaying: boolean;
  isRecording: boolean;
  selectedTrackId: string | null;
  masterVolume: number;
  addTrack: (track: Omit<Track, 'id'>) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsRecording: (recording: boolean) => void;
  setSelectedTrack: (id: string | null) => void;
  toggleMute: (id: string) => void;
  toggleSolo: (id: string) => void;
  setMasterVolume: (volume: number) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  tracks: [],
  currentTime: 0,
  isPlaying: false,
  isRecording: false,
  selectedTrackId: null,
  masterVolume: 1.0,

  addTrack: (track) =>
    set((state) => ({
      tracks: [
        ...state.tracks,
        {
          ...track,
          id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      ],
    })),

  removeTrack: (id) =>
    set((state) => ({
      tracks: state.tracks.filter((t) => t.id !== id),
    })),

  updateTrack: (id, updates) =>
    set((state) => ({
      tracks: state.tracks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  setCurrentTime: (time) => set({ currentTime: time }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsRecording: (recording) => set({ isRecording: recording }),
  setSelectedTrack: (id) => set({ selectedTrackId: id }),

  toggleMute: (id) =>
    set((state) => ({
      tracks: state.tracks.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t)),
    })),

  toggleSolo: (id) =>
    set((state) => ({
      tracks: state.tracks.map((t) => (t.id === id ? { ...t, solo: !t.solo } : t)),
    })),

  setMasterVolume: (volume) => set({ masterVolume: volume }),
}));

