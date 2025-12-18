import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
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

// Helper functions for database operations
export async function getTracks() {
  const { data, error } = await supabase
    .from('tracks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }

  return data as Track[];
}

export async function likeTrack(trackId: string) {
  const { data, error } = await supabase.rpc('increment_likes', {
    track_id: trackId
  });

  if (error) {
    console.error('Error liking track:', error);
    return null;
  }

  return data;
}

export async function uploadTrack(file: File, metadata: Partial<Track>) {
  try {
    // Upload audio file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `tracks/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // Insert track metadata into database
    const { data, error: insertError } = await supabase
      .from('tracks')
      .insert([
        {
          ...metadata,
          audio_url: publicUrl,
        },
      ])
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return data as Track;
  } catch (error) {
    console.error('Error uploading track:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

// Project JSON Schema Types
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

// Project Management Functions
export async function saveProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        ...project,
        user_id: user.id,
        project_data: JSON.stringify(project),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error saving project:', error);
    throw error;
  }

  return data;
}

export async function updateProject(projectId: string, project: Partial<Project>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .update({
      ...project,
      project_data: JSON.stringify(project),
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    throw error;
  }

  return data;
}

export async function getProjects() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  // Parse JSON data
  return data.map((item: any) => ({
    ...item,
    ...(typeof item.project_data === 'string' ? JSON.parse(item.project_data) : item.project_data),
  })) as (Project & { id: string; created_at: string; updated_at: string })[];
}

export async function loadProject(projectId: string): Promise<Project | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error loading project:', error);
    return null;
  }

  // Parse JSON data
  const projectData = typeof data.project_data === 'string'
    ? JSON.parse(data.project_data)
    : data.project_data;

  return {
    ...projectData,
    id: data.id,
    created_at: data.created_at,
    updated_at: data.updated_at,
  } as Project;
}

export async function deleteProject(projectId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}