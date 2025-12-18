'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import X from 'lucide-react/dist/esm/icons/x';
import Save from 'lucide-react/dist/esm/icons/save';
import FolderOpen from 'lucide-react/dist/esm/icons/folder-open';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import Edit2 from 'lucide-react/dist/esm/icons/edit-2';
import Check from 'lucide-react/dist/esm/icons/check';
import { saveProject, getProjects, loadProject, deleteProject, updateProject, type Project } from '@/lib/supabase';
import { useStudioStore } from '@/store/studioStore';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectManager({ isOpen, onClose }: ProjectManagerProps) {
  const [projects, setProjects] = useState<(Project & { id: string; created_at: string; updated_at: string })[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [saveName, setSaveName] = useState('Untitled Project');

  const { tracks, currentTime, masterVolume, tempo, loadProject: loadProjectToStore, setTempo } = useStudioStore();

  useEffect(() => {
    if (isOpen) {
      loadProjects();
    }
  }, [isOpen]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const loadedProjects = await getProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!saveName.trim()) return;

    setLoading(true);
    try {
      const projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'> = {
        name: saveName.trim(),
        tempo: tempo,
        current_time: currentTime,
        master_volume: masterVolume || 1.0,
        tracks: tracks.map(track => ({
          id: track.id,
          name: track.name,
          volume: track.volume,
          pan: 0, // Add pan to store if needed
          isMuted: track.muted,
          isSolo: track.solo,
          clips: [], // Convert track audio to clips if needed
        })),
      };

      const saved = await saveProject(projectData);
      if (saved?.id) {
        useStudioStore.setState({ currentProjectId: saved.id });
      }
      setSaveName('Untitled Project');
      await loadProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (projectId: string) => {
    setLoading(true);
    try {
      const project = await loadProject(projectId);
      if (project) {
        // Use store's loadProject to hydrate the session
        loadProjectToStore(project);
        setTempo(project.tempo);
        onClose();
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      alert('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setLoading(true);
    try {
      await deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (project: Project & { id: string }) => {
    setEditingId(project.id!);
    setEditName(project.name);
  };

  const handleSaveEdit = async (projectId: string) => {
    if (!editName.trim()) return;

    setLoading(true);
    try {
      await updateProject(projectId, { name: editName.trim() });
      setEditingId(null);
      await loadProjects();
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-bold text-zinc-100">Project Manager</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Save New Project */}
              <div className="p-6 border-b border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">Save Current Session</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    placeholder="Project name"
                    className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder-zinc-500 focus:border-piko-teal focus:ring-2 focus:ring-piko-teal/20 focus:outline-none"
                  />
                  <button
                    onClick={handleSave}
                    disabled={loading || !saveName.trim()}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-piko-teal to-piko-pink text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    Save
                  </button>
                </div>
              </div>

              {/* Projects List */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">Saved Projects</h3>
                {loading && projects.length === 0 ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piko-teal"></div>
                  </div>
                ) : projects.length === 0 ? (
                  <p className="text-center text-zinc-400 py-8">No saved projects yet</p>
                ) : (
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-800/30 hover:bg-zinc-800/50 transition"
                      >
                        {editingId === project.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 px-3 py-1 rounded border border-zinc-700 bg-zinc-900 text-zinc-100 focus:border-piko-teal focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(project.id)}
                              className="p-1.5 rounded text-piko-teal hover:bg-zinc-700"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 rounded text-zinc-400 hover:bg-zinc-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <p className="font-medium text-zinc-100">{project.name}</p>
                              <p className="text-xs text-zinc-400">
                                {new Date(project.updated_at).toLocaleDateString()} • {project.tracks.length} tracks
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleLoad(project.id)}
                                className="p-2 rounded-lg text-piko-teal hover:bg-zinc-700 transition"
                                title="Load project"
                              >
                                <FolderOpen className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStartEdit(project)}
                                className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-700 transition"
                                title="Rename project"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="p-2 rounded-lg text-red-400 hover:bg-zinc-700 transition"
                                title="Delete project"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
