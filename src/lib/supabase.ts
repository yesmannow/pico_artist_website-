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
