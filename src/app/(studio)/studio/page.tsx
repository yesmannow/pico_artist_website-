'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import StudioHeaderLocal from '@/components/studio/StudioHeaderLocal';
import SharedActivityLogLocal from '@/components/studio/SharedActivityLogLocal';
import StudioHelpPanel from '@/components/studio/StudioHelpPanel';
import { useStudioLocalStore } from '@/store/studioLocalStore';
import type { Track } from '@/lib/supabase';
import FolderOpen from 'lucide-react/dist/esm/icons/folder-open';
import Download from 'lucide-react/dist/esm/icons/download';
import Upload from 'lucide-react/dist/esm/icons/upload';
import Home from 'lucide-react/dist/esm/icons/home';

const StudioRecorder = dynamic(() => import('@/components/studio/StudioRecorder'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-piko-teal"></div>
    </div>
  ),
});

const MultitrackTimeline = dynamic(
  () => import('@/components/studio/MultitrackTimeline'),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-piko-teal"></div>
      </div>
    ),
  }
);

const Transport = dynamic(() => import('@/components/studio/Transport'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-piko-teal"></div>
    </div>
  ),
});

const ProjectManagerLocal = dynamic(() => import('@/components/studio/ProjectManagerLocal'), {
  ssr: false,
});

// Mock backing tracks for now
const mockBackingTracks: Track[] = [
  {
    id: '1',
    title: 'Ambient Beat',
    artist: 'Piko FG',
    duration: '3:20',
    audio_url: '/lofi-teaser.wav',
    likes: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Jazz Loop',
    artist: 'Piko FG',
    duration: '2:45',
    audio_url: '/lofi-teaser.wav',
    likes: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Hip Hop Instrumental',
    artist: 'Piko FG',
    duration: '4:10',
    audio_url: '/lofi-teaser.wav',
    likes: 0,
    created_at: new Date().toISOString(),
  },
];

export default function StudioPage() {
  const [projectManagerOpen, setProjectManagerOpen] = useState(false);
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);
  const { exportData, importData } = useStudioLocalStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update CSS variables for dynamic gradient
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `studio-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      importData(text);
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Failed to import:', error);
      alert('Failed to import data. Please check the file format.');
    } finally {
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-40 md:pt-44 pb-12 relative overflow-hidden">
        <StudioHeaderLocal onHelpClick={() => setHelpPanelOpen(true)} />
        <SharedActivityLogLocal />

        {/* Interactive Mouse Spotlight - Dynamic style based on mouse position */}
        <div className="fixed inset-0 pointer-events-none transition-opacity duration-300 mouse-spotlight" />

        <main className="flex flex-col items-center gap-8 w-full relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl"
          >
            <h1 className="text-5xl font-bold text-zinc-100 mb-4">
              Piko <span className="bg-gradient-to-r from-piko-teal to-piko-pink bg-clip-text text-transparent">Studio</span>
            </h1>
            <p className="text-lg text-zinc-400 mb-4">
              Professional recording tools with real-time visualization and overdub capabilities
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-piko-teal transition"
            >
              <Home className="h-4 w-4" />
              <span>Return to Site</span>
            </Link>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-4 flex-wrap justify-center"
          >
            <button
              onClick={() => setProjectManagerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-zinc-100 hover:border-piko-teal hover:bg-zinc-800/50 transition"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Project Manager</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-zinc-100 hover:border-piko-teal hover:bg-zinc-800/50 transition"
            >
              <Download className="h-4 w-4" />
              <span>Export JSON</span>
            </button>

            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-zinc-100 hover:border-piko-teal hover:bg-zinc-800/50 transition cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Import JSON</span>
              <input
                type="file"
                accept="application/json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </motion.div>

          {/* Studio Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full space-y-6"
          >
            <ErrorBoundary>
              <StudioRecorder backingTracks={mockBackingTracks} />
            </ErrorBoundary>
            <ErrorBoundary>
              <Transport />
            </ErrorBoundary>
            <ErrorBoundary>
              <MultitrackTimeline className="mt-8" />
            </ErrorBoundary>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 max-w-2xl"
          >
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 backdrop-blur-md p-6">
              <h3 className="text-sm font-semibold text-piko-teal mb-3">Studio Tips</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-piko-pink">•</span>
                  <span>Select a backing track to enable overdub mode and record vocals over existing music</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-piko-orange">•</span>
                  <span>Use the Vibe toggle to apply real-time audio effects to your recording</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-piko-teal">•</span>
                  <span>All data is saved to localStorage. Use Export/Import to backup your projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-piko-pink">•</span>
                  <span>Future: Projects will sync to Supabase for cloud storage and collaboration</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </main>

        {/* Project Manager Modal */}
        <ProjectManagerLocal
          isOpen={projectManagerOpen}
          onClose={() => setProjectManagerOpen(false)}
        />

        {/* Help Panel */}
        <StudioHelpPanel
          isOpen={helpPanelOpen}
          onClose={() => setHelpPanelOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}
