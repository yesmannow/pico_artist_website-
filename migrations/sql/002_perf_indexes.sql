-- 002_perf_indexes.sql
-- Adds the missing primary keys on backup tables and tunes indexes for observed query patterns.

-- Ensure backup tables have explicit primary keys for faster lookups.
ALTER TABLE IF EXISTS tracks_backup
  DROP CONSTRAINT IF EXISTS tracks_backup_pkey,
  ADD CONSTRAINT tracks_backup_pkey PRIMARY KEY (id);
ALTER TABLE IF EXISTS projects_backup
  DROP CONSTRAINT IF EXISTS projects_backup_pkey,
  ADD CONSTRAINT projects_backup_pkey PRIMARY KEY (id);
ALTER TABLE IF EXISTS likes_backup
  DROP CONSTRAINT IF EXISTS likes_backup_pkey,
  ADD CONSTRAINT likes_backup_pkey PRIMARY KEY (id);
ALTER TABLE IF EXISTS auth_user_meta_backup
  DROP CONSTRAINT IF EXISTS auth_user_meta_backup_pkey,
  ADD CONSTRAINT auth_user_meta_backup_pkey PRIMARY KEY (id);

-- Drop unused indexes that are not visited by the app.
DROP INDEX IF EXISTS idx_likes_user_id;
DROP INDEX IF EXISTS idx_projects_user_id;

-- Retain indexes that support the queries in src/lib/supabase.ts.
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON tracks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_user_updated ON projects(user_id, updated_at DESC);

-- Validation: inspect pg_indexes to confirm the expected indexes exist.
--   SELECT indexname FROM pg_indexes WHERE tablename = 'tracks';
--   SELECT indexname FROM pg_indexes WHERE tablename = 'projects';
