import { create } from 'zustand';
import { saveProject, updateProject, type Project } from '@/lib/supabase';

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
  tempo: number;
  isSaving: boolean;
  currentProjectId: string | null;
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
  setTempo: (tempo: number) => void;
  loadProject: (projectData: Project) => void;
  saveProject: () => Promise<void>;
}

// Debounce timer for saveProject
let saveTimer: NodeJS.Timeout | null = null;

export const useStudioStore = create<StudioState>((set, get) => ({
  tracks: [],
  currentTime: 0,
  isPlaying: false,
  isRecording: false,
  selectedTrackId: null,
  masterVolume: 1.0,
  tempo: 120,
  isSaving: false,
  currentProjectId: null,

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

  setTempo: (tempo) => set({ tempo }),

  loadProject: (projectData) => {
    // Clear existing session data and hydrate with project data
    set({
      tracks: projectData.tracks.map((pt) => ({
        id: pt.id,
        name: pt.name,
        audioUrl: undefined, // Will need to be loaded separately if needed
        waveform: undefined,
        startTime: 0,
        duration: 0,
        volume: pt.volume,
        muted: pt.isMuted,
        solo: pt.isSolo,
      })),
      currentTime: projectData.current_time,
      masterVolume: projectData.master_volume,
      tempo: projectData.tempo,
      currentProjectId: projectData.id || null,
      isPlaying: false,
      isRecording: false,
      selectedTrackId: null,
    });
  },

  saveProject: async () => {
    const state = get();

    // Clear existing timer
    if (saveTimer) {
      clearTimeout(saveTimer);
    }

    // Set saving state immediately
    set({ isSaving: true });

    // Debounce the actual save by 5 seconds
    saveTimer = setTimeout(async () => {
      try {
        const projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
          name: state.currentProjectId ? 'Auto-saved Project' : 'Untitled Project',
          tempo: state.tempo,
          current_time: state.currentTime,
          master_volume: state.masterVolume,
          tracks: state.tracks.map((track) => ({
            id: track.id,
            name: track.name,
            volume: track.volume,
            pan: 0,
            isMuted: track.muted,
            isSolo: track.solo,
            clips: [], // Convert track audio to clips if needed
          })),
        };

        if (state.currentProjectId) {
          await updateProject(state.currentProjectId, projectData);
        } else {
          const saved = await saveProject(projectData);
          if (saved?.id) {
            set({ currentProjectId: saved.id });
          }
        }
      } catch (error) {
        console.error('Failed to save project:', error);
      } finally {
        set({ isSaving: false });
      }
    }, 5000);
  },
}));

// Auto-save subscription will be handled in components that use the store

