-- 001_secure_policies.sql
-- Enables row-level security and enforces least-privilege policies for all public tables

-- Tracks table: public SELECT, authenticated INSERT, owner-only UPDATE/DELETE
ALTER TABLE IF EXISTS tracks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tracks - public select" ON tracks;
CREATE POLICY "Tracks - public select" ON tracks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Tracks - authenticated insert" ON tracks;
CREATE POLICY "Tracks - authenticated insert" ON tracks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

DROP POLICY IF EXISTS "Tracks - owner update" ON tracks;
CREATE POLICY "Tracks - owner update" ON tracks
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Tracks - owner delete" ON tracks;
CREATE POLICY "Tracks - owner delete" ON tracks
  FOR DELETE USING (auth.uid() = user_id);

-- Projects table: owner-only access for CRUD
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Likes table: only the owner can select/insert/modify their likes
ALTER TABLE IF EXISTS likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Likes - owner select" ON likes;
CREATE POLICY "Likes - owner select" ON likes
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Likes - owner insert" ON likes;
CREATE POLICY "Likes - owner insert" ON likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Likes - owner update" ON likes;
CREATE POLICY "Likes - owner update" ON likes
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Likes - owner delete" ON likes;
CREATE POLICY "Likes - owner delete" ON likes
  FOR DELETE USING (auth.uid() = user_id);

-- auth_user_meta: restrict access to the owning user
ALTER TABLE IF EXISTS auth_user_meta ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth meta - owner select" ON auth_user_meta;
CREATE POLICY "Auth meta - owner select" ON auth_user_meta
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth meta - owner insert" ON auth_user_meta;
CREATE POLICY "Auth meta - owner insert" ON auth_user_meta
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth meta - owner update" ON auth_user_meta;
CREATE POLICY "Auth meta - owner update" ON auth_user_meta
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Auth meta - owner delete" ON auth_user_meta;
CREATE POLICY "Auth meta - owner delete" ON auth_user_meta
  FOR DELETE USING (auth.uid() = user_id);

-- Backup tables should be limited to the service role (no public access)
ALTER TABLE IF EXISTS tracks_backup ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tracks backup - service" ON tracks_backup;
CREATE POLICY "Tracks backup - service" ON tracks_backup
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE IF EXISTS projects_backup ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects backup - service" ON projects_backup;
CREATE POLICY "Projects backup - service" ON projects_backup
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE IF EXISTS likes_backup ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Likes backup - service" ON likes_backup;
CREATE POLICY "Likes backup - service" ON likes_backup
  FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE IF EXISTS auth_user_meta_backup ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Auth meta backup - service" ON auth_user_meta_backup;
CREATE POLICY "Auth meta backup - service" ON auth_user_meta_backup
  FOR ALL USING (auth.role() = 'service_role');

-- Validation hints (run manually under the service role to confirm connectivity):
--   SELECT 1 FROM tracks LIMIT 1;
--   SELECT 1 FROM projects LIMIT 1;
--   SELECT 1 FROM likes LIMIT 1;
--   SELECT 1 FROM auth_user_meta LIMIT 1;
