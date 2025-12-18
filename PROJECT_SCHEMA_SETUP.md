# Project JSON Schema Setup for Supabase

This document describes the database schema required for the Studio Project Manager feature.

## Database Table: `projects`

Create the following table in your Supabase database:

```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own projects
CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own projects
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own projects
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_updated_at ON projects(updated_at DESC);
```

## Project JSON Schema

The `project_data` JSONB column stores the following structure:

```typescript
{
  name: string;
  tempo: number;
  current_time: number;
  master_volume: number;
  tracks: Array<{
    id: string;
    name: string;
    volume: number;
    pan: number;
    isMuted: boolean;
    isSolo: boolean;
    clips: Array<{
      id: string;
      startTime: number;
      duration: number;
      blobUrl: string;
      offset: number;
    }>;
  }>;
}
```

## Usage

The Project Manager component (`src/components/studio/ProjectManager.tsx`) uses the following functions from `src/lib/supabase.ts`:

- `saveProject()` - Save a new project
- `getProjects()` - List all user's projects
- `loadProject()` - Load a specific project
- `updateProject()` - Update an existing project
- `deleteProject()` - Delete a project

All functions automatically filter by the authenticated user's ID for security.

