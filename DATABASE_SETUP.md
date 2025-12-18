# Supabase Database Setup

This project requires a Supabase database with the following configuration.

## ⚠️ Current Status: No-Login Mode

**Studio currently runs in no-login mode. Supabase integration deferred until magic link auth is enabled.**

The Studio feature uses localStorage for persistence. All database setup below is for future integration when Supabase is re-enabled.

## Tables

### 1. `tracks` Table

```sql
CREATE TABLE tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  duration TEXT NOT NULL,
  audio_url TEXT,
  cover_art TEXT,
  likes INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read tracks
CREATE POLICY "Anyone can view tracks" ON tracks
  FOR SELECT USING (true);

-- Policy to allow authenticated users to insert their own tracks
CREATE POLICY "Users can insert own tracks" ON tracks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own tracks
CREATE POLICY "Users can update own tracks" ON tracks
  FOR UPDATE USING (auth.uid() = user_id);
```

### 2. Like Increment Function

```sql
-- Function to increment likes
CREATE OR REPLACE FUNCTION increment_likes(track_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE tracks
  SET likes = likes + 1
  WHERE id = track_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Storage

### `media` Bucket

1. Create a storage bucket named `media`
2. Set it to **Public** (or configure appropriate policies)
3. Configure policies:

```sql
-- Policy to allow anyone to read files
CREATE POLICY "Anyone can view media files" ON storage.objects
  FOR SELECT USING (bucket_id = 'media');

-- Policy to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload media" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND
    auth.role() = 'authenticated'
  );
```

## Environment Variables

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Authentication

The app uses Supabase Auth. You can:

1. Enable Email/Password authentication in your Supabase project
2. Create test users via the Supabase dashboard
3. Users can sign in via `/login` page

## Testing Without Database

If you don't have a Supabase database set up yet, the app will:
- Show mock tracks on the home page
- Allow recording in the studio (but uploads will fail)
- Display placeholder content

To fully test all features, set up the database as described above.

## 🧱 Supabase migrations

Run the SQL scripts inside `migrations/sql/` whenever you provision or refresh the Supabase database:

1. `migrations/sql/001_secure_policies.sql` enables RLS and gates public tables (`tracks`, `projects`, `likes`, `auth_user_meta`) so the anon role can only use the documented policies (public `SELECT` where appropriate, authenticated `INSERT`, and owner-only `UPDATE/DELETE`). The same script locks down every `*_backup` table with service-role-only access and adds validation comments such as `SELECT 1 FROM tracks LIMIT 1;`.

2. `migrations/sql/002_perf_indexes.sql` adds missing primary keys to `tracks_backup`, `projects_backup`, `likes_backup`, and `auth_user_meta_backup`, drops unused indexes `idx_likes_user_id`/`idx_projects_user_id`, and re-creates the indexes the tracker code actually relies on (for example, `tracks(created_at DESC)` and `projects(updated_at DESC)`).

Execute both scripts with `psql` or `supabase db query` before you deploy so the schema, policies, and indexes match the expectations described elsewhere in this repo.
