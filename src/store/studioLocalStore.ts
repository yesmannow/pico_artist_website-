import { create } from 'zustand';

export interface Clip {
  id: string;
  startTime: number; // in seconds
  duration: number; // length in seconds
  gain: number; // per-clip gain adjustment
  isMuted: boolean; // mute per clip
}

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
  clips: Clip[];
}

export interface Project {
  id: string;
  name: string;
  tempo: number;
  current_time: number;
  master_volume: number;
  tracks: Track[];
  created_at: string;
  updated_at: string;
}

interface StudioLocalState {
  tracks: Track[];
  currentTime: number;
  isPlaying: boolean;
  isRecording: boolean;
  isLooping: boolean;
  selectedTrackId: string | null;
  masterVolume: number;
  tempo: number;
  projects: Project[];
  currentProjectId: string | null;
  addTrack: (track: Omit<Track, 'id'>) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsRecording: (recording: boolean) => void;
  setIsLooping: (looping: boolean) => void;
  setSelectedTrack: (id: string | null) => void;
  toggleMute: (id: string) => void;
  toggleSolo: (id: string) => void;
  setMasterVolume: (volume: number) => void;
  setTempo: (tempo: number) => void;
  addClip: (trackId: string, clip: Omit<Clip, 'id'>) => void;
  updateClip: (trackId: string, clipId: string, updates: Partial<Clip>) => void;
  removeClip: (trackId: string, clipId: string) => void;
  saveProject: (name?: string) => void;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  getProjects: () => Project[];
  exportData: () => string;
  importData: (data: string) => void;
}

// Helper functions for localStorage
const STORAGE_KEY = 'studio-local-storage';

const loadFromStorage = (): Partial<StudioLocalState> => {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};
    
    const data = JSON.parse(stored);
    
    // Ensure all tracks have a clips array for backward compatibility
    if (data.tracks) {
      data.tracks = data.tracks.map((track: Track) => ({
        ...track,
        clips: track.clips || [],
      }));
    }
    
    // Ensure all projects have tracks with clips arrays
    if (data.projects) {
      data.projects = data.projects.map((project: Project) => ({
        ...project,
        tracks: project.tracks.map((track: Track) => ({
          ...track,
          clips: track.clips || [],
        })),
      }));
    }
    
    return data;
  } catch {
    return {};
  }
};

const saveToStorage = (state: Partial<StudioLocalState>) => {
  if (typeof window === 'undefined') return;
  try {
    const toSave = {
      tracks: state.tracks,
      projects: state.projects,
      tempo: state.tempo,
      masterVolume: state.masterVolume,
      currentProjectId: state.currentProjectId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const initialState = loadFromStorage();

export const useStudioLocalStore = create<StudioLocalState>()((set, get) => ({
      tracks: initialState.tracks || [],
      currentTime: 0,
      isPlaying: false,
      isRecording: false,
      isLooping: false,
      selectedTrackId: null,
      masterVolume: initialState.masterVolume ?? 1.0,
      tempo: initialState.tempo ?? 120,
      projects: initialState.projects || [],
      currentProjectId: initialState.currentProjectId || null,

      addTrack: (track) =>
        set((state) => {
          const newState = {
            tracks: [
              ...state.tracks,
              {
                ...track,
                id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                clips: track.clips || [],
              },
            ],
          };
          saveToStorage(newState);
          return newState;
        }),

      removeTrack: (id) =>
        set((state) => {
          const newState = {
            tracks: state.tracks.filter((t) => t.id !== id),
          };
          saveToStorage(newState);
          return newState;
        }),

      updateTrack: (id, updates) =>
        set((state) => {
          const newState = {
            tracks: state.tracks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          };
          saveToStorage(newState);
          return newState;
        }),

      setCurrentTime: (time) => set({ currentTime: time }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setIsRecording: (recording) => set({ isRecording: recording }),
      setIsLooping: (looping) => set({ isLooping: looping }),
      setSelectedTrack: (id) => set({ selectedTrackId: id }),

      toggleMute: (id) =>
        set((state) => ({
          tracks: state.tracks.map((t) => (t.id === id ? { ...t, muted: !t.muted } : t)),
        })),

      toggleSolo: (id) =>
        set((state) => ({
          tracks: state.tracks.map((t) => (t.id === id ? { ...t, solo: !t.solo } : t)),
        })),

      setMasterVolume: (volume) => {
        set({ masterVolume: volume });
        saveToStorage({ masterVolume: volume });
      },
      setTempo: (tempo) => {
        set({ tempo });
        saveToStorage({ tempo });
      },

      addClip: (trackId, clip) =>
        set((state) => {
          const newState = {
            tracks: state.tracks.map((t) =>
              t.id === trackId
                ? {
                    ...t,
                    clips: [
                      ...t.clips,
                      {
                        ...clip,
                        id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                      },
                    ],
                  }
                : t
            ),
          };
          saveToStorage(newState);
          return newState;
        }),

      updateClip: (trackId, clipId, updates) =>
        set((state) => {
          const newState = {
            tracks: state.tracks.map((t) =>
              t.id === trackId
                ? {
                    ...t,
                    clips: t.clips.map((c) =>
                      c.id === clipId ? { ...c, ...updates } : c
                    ),
                  }
                : t
            ),
          };
          saveToStorage(newState);
          return newState;
        }),

      removeClip: (trackId, clipId) =>
        set((state) => {
          const newState = {
            tracks: state.tracks.map((t) =>
              t.id === trackId
                ? { ...t, clips: t.clips.filter((c) => c.id !== clipId) }
                : t
            ),
          };
          saveToStorage(newState);
          return newState;
        }),

      saveProject: (name) => {
        const state = get();
        const project: Project = {
          id: state.currentProjectId || `project-${Date.now()}`,
          name: name || 'Untitled Project',
          tempo: state.tempo,
          current_time: state.currentTime,
          master_volume: state.masterVolume,
          tracks: state.tracks,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        set((prev) => {
          const existingIndex = prev.projects.findIndex((p) => p.id === project.id);
          const updatedProjects = existingIndex >= 0
            ? prev.projects.map((p, i) => (i === existingIndex ? { ...project, created_at: p.created_at } : p))
            : [...prev.projects, project];

          const newState = {
            projects: updatedProjects,
            currentProjectId: project.id,
          };
          saveToStorage(newState);
          return newState;
        });
      },

      loadProject: (projectId) => {
        const state = get();
        const project = state.projects.find((p) => p.id === projectId);
        if (project) {
          set({
            tracks: project.tracks,
            currentTime: project.current_time,
            masterVolume: project.master_volume,
            tempo: project.tempo,
            currentProjectId: project.id,
            isPlaying: false,
            isRecording: false,
            selectedTrackId: null,
          });
        }
      },

      deleteProject: (projectId) =>
        set((state) => {
          const newState = {
            projects: state.projects.filter((p) => p.id !== projectId),
            currentProjectId: state.currentProjectId === projectId ? null : state.currentProjectId,
          };
          saveToStorage(newState);
          return newState;
        }),

      getProjects: () => {
        return get().projects.sort((a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      },

      exportData: () => {
        const state = get();
        return JSON.stringify({
          tracks: state.tracks,
          projects: state.projects,
          tempo: state.tempo,
          masterVolume: state.masterVolume,
          exportedAt: new Date().toISOString(),
        }, null, 2);
      },

      importData: (data) => {
        try {
          const imported = JSON.parse(data);
          const newState = {
            tracks: imported.tracks || [],
            projects: imported.projects || [],
            tempo: imported.tempo || 120,
            masterVolume: imported.masterVolume || 1.0,
            currentProjectId: null,
          };
          set(newState);
          saveToStorage(newState);
        } catch (error) {
          console.error('Failed to import data:', error);
          throw new Error('Invalid import data format');
        }
      },
    }));

