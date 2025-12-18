/**
 * Supabase Client and Helpers
 *
 * NOTE: Currently running in no-login mode with localStorage mocks.
 * To re-enable Supabase:
 * 1. Uncomment the import: import { createClient } from '@supabase/supabase-js';
 * 2. Uncomment the supabase client initialization below
 * 3. Replace localStorage mocks with actual Supabase calls
 * 4. Enable magic link auth in Supabase dashboard
 * 5. Update RLS policies to match migrations/sql/001_secure_policies.sql
 */

// ============================================================================
// SUPABASE CLIENT (Currently disabled - uncomment when ready)
// ============================================================================
// import { createClient } from '@supabase/supabase-js';
//
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
//
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Stub client for type compatibility (remove when Supabase is enabled)
// Minimal stub to avoid 'any' - provides no-op methods for components that reference supabase
export const supabase = {
  from: () => {
    throw new Error('Supabase is disabled. Enable in src/lib/supabase.ts');
  },
  auth: {
    getUser: async () => ({ data: { user: null } }),
    signInWithPassword: () => {
      throw new Error('Supabase is disabled. Enable in src/lib/supabase.ts');
    },
    signOut: async () => ({ error: null }),
  },
  storage: {
    from: () => {
      throw new Error('Supabase is disabled. Enable in src/lib/supabase.ts');
    },
  },
  rpc: () => {
    throw new Error('Supabase is disabled. Enable in src/lib/supabase.ts');
  },
  removeChannel: () => {
    // No-op for SharedActivityLog compatibility
  },
  channel: () => ({
    on: () => ({
      subscribe: () => {
        // No-op subscription stub
      },
    }),
  }),
};

// ============================================================================
// TYPE DEFINITIONS (Keep for future Supabase integration)
// ============================================================================

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audio_url?: string;
  cover_art?: string;
  likes: number;
  created_at: string;
  user_id?: string;
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Clip {
  id: string;
  startTime: number;
  duration: number;
  blobUrl: string;
  offset: number;
}

export interface ProjectTrack {
  id: string;
  name: string;
  volume: number;
  pan: number;
  isMuted: boolean;
  isSolo: boolean;
  clips: Clip[];
}

export interface Project {
  id?: string;
  name: string;
  tempo: number;
  current_time: number;
  master_volume: number;
  tracks: ProjectTrack[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface for Supabase project rows (commented out until Supabase is re-enabled)
// interface SupabaseProjectRow extends Project {
//   id: string;
//   project_data?: string | Partial<Project>;
//   created_at: string;
//   updated_at: string;
// }

// ============================================================================
// LOCALSTORAGE UTILITIES (Replace with Supabase calls when ready)
// ============================================================================

// Utility: safely parse JSON from localStorage
function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// ============================================================================
// TRACK FUNCTIONS (Stubbed with localStorage)
// ============================================================================

/**
 * Get all tracks (mock implementation)
 * TODO: Replace with: await supabase.from('tracks').select('*').order('created_at', { ascending: false })
 */
export async function getTracks(): Promise<Track[]> {
  if (typeof window === 'undefined') {
    return [
      {
        id: '1',
        title: 'Ambient Beat',
        artist: 'Piko FG',
        duration: '3:20',
        audio_url: '/lofi-teaser.wav',
        likes: 0,
        created_at: new Date().toISOString(),
      },
    ];
  }

  const raw = localStorage.getItem('studio_tracks');
  const parsed = safeParse<Track[]>(raw);
  return parsed ?? [
    {
      id: '1',
      title: 'Ambient Beat',
      artist: 'Piko FG',
      duration: '3:20',
      audio_url: '/lofi-teaser.wav',
      likes: 0,
      created_at: new Date().toISOString(),
    },
  ];
}

/**
 * Like a track (mock implementation)
 * TODO: Replace with: await supabase.rpc('increment_likes', { track_id: trackId })
 */
export async function likeTrack(trackId: string): Promise<Track | null> {
  if (typeof window === 'undefined') return null;

  const tracks = await getTracks();
  const updated = tracks.map((t) =>
    t.id === trackId ? { ...t, likes: (t.likes || 0) + 1 } : t
  );
  localStorage.setItem('studio_tracks', JSON.stringify(updated));
  return updated.find((t) => t.id === trackId) ?? null;
}

/**
 * Upload a track (mock implementation - creates object URL)
 * TODO: Replace with Supabase Storage upload + database insert
 */
export async function uploadTrack(file: File, metadata: Partial<Track>): Promise<Track> {
  if (typeof window === 'undefined') {
    throw new Error('uploadTrack requires browser environment');
  }

  const objectUrl = URL.createObjectURL(file);
  const newTrack: Track = {
    id: crypto.randomUUID(),
    title: metadata.title ?? file.name,
    artist: metadata.artist ?? 'Piko FG',
    duration: metadata.duration ?? '0:00',
    audio_url: objectUrl,
    cover_art: metadata.cover_art,
    likes: 0,
    created_at: new Date().toISOString(),
  };

  const tracks = await getTracks();
  tracks.push(newTrack);
  localStorage.setItem('studio_tracks', JSON.stringify(tracks));

  return newTrack;
}

// ============================================================================
// AUTH FUNCTIONS (Stubbed - return null/throw for now)
// ============================================================================

/**
 * Get current user (stubbed - returns null)
 * TODO: Replace with: await supabase.auth.getUser()
 */
export async function getCurrentUser() {
  // In no-login mode, always return null
  return null;
}

/**
 * Sign in (stubbed - throws error)
 * TODO: Replace with magic link auth:
 *   await supabase.auth.signInWithOtp({ email })
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function signIn(_email: string, _password: string) {
  throw new Error('Authentication is disabled. Studio runs in no-login mode with localStorage.');
}

/**
 * Sign out (stubbed - no-op)
 * TODO: Replace with: await supabase.auth.signOut()
 */
export async function signOut() {
  // No-op in no-login mode
  console.log('Sign out called (no-op in no-login mode)');
}

// ============================================================================
// PROJECT FUNCTIONS (Stubbed with localStorage)
// ============================================================================

/**
 * Save a project (mock implementation)
 * TODO: Replace with Supabase insert + RLS policy check
 */
export async function saveProject(
  project: Project | Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project & { id: string; created_at: string; updated_at: string }> {
  if (typeof window === 'undefined') {
    throw new Error('saveProject requires browser environment');
  }

  const projects = await getProjects();
  const projectWithId = project as Project;
  const newProject: Project & { id: string; created_at: string; updated_at: string } = {
    ...project,
    id: projectWithId.id ?? crypto.randomUUID(),
    created_at: projectWithId.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  projects.push(newProject);
  localStorage.setItem('studio_projects', JSON.stringify(projects));

  return newProject;
}

/**
 * Update a project (mock implementation)
 * TODO: Replace with Supabase update + RLS policy check
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Project>
): Promise<Project & { id: string; created_at: string; updated_at: string } | null> {
  if (typeof window === 'undefined') {
    throw new Error('updateProject requires browser environment');
  }

  const projects = await getProjects();
  const updatedProjects = projects.map((p) =>
    p.id === projectId
      ? { ...p, ...updates, updated_at: new Date().toISOString() }
      : p
  );
  localStorage.setItem('studio_projects', JSON.stringify(updatedProjects));
  return updatedProjects.find((p) => p.id === projectId) ?? null;
}

/**
 * Get all projects (mock implementation)
 * TODO: Replace with: await supabase.from('projects').select('*').order('updated_at', { ascending: false })
 */
export async function getProjects(): Promise<(Project & { id: string; created_at: string; updated_at: string })[]> {
  if (typeof window === 'undefined') return [];

  const raw = localStorage.getItem('studio_projects');
  const parsed = safeParse<(Project & { id: string; created_at: string; updated_at: string })[]>(raw);
  return parsed ?? [];
}

/**
 * Load a specific project (mock implementation)
 * TODO: Replace with: await supabase.from('projects').select('*').eq('id', projectId).single()
 */
export async function loadProject(projectId: string): Promise<Project | null> {
  if (typeof window === 'undefined') return null;

  const projects = await getProjects();
  return projects.find((p) => p.id === projectId) ?? null;
}

/**
 * Delete a project (mock implementation)
 * TODO: Replace with: await supabase.from('projects').delete().eq('id', projectId)
 */
export async function deleteProject(projectId: string): Promise<void> {
  if (typeof window === 'undefined') return;

  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== projectId);
  localStorage.setItem('studio_projects', JSON.stringify(filtered));
}

// ============================================================================
// REALTIME STUB (For SharedActivityLog compatibility)
// ============================================================================

/**
 * Stubbed realtime handler (no-op)
 * TODO: Replace with actual Supabase realtime when enabled
 */
export const realtime = {
  on: () => ({
    subscribe: () => {
      // no-op stub
    },
  }),
};
