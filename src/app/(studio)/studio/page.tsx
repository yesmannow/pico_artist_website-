'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StudioRecorder from '@/components/studio/StudioRecorder';
import { getTracks, type Track } from '@/lib/supabase';

export default function StudioPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [backingTracks, setBackingTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    async function loadTracks() {
      try {
        const tracks = await getTracks();
        setBackingTracks(tracks.filter(t => t.audio_url)); // Only tracks with audio
      } catch (error) {
        console.error('Failed to load tracks:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTracks();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Interactive Mouse Spotlight */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 0, 110, 0.15), transparent 80%)`,
        }}
      />

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
          <p className="text-lg text-zinc-400">
            Professional recording tools with real-time visualization and overdub capabilities
          </p>
        </motion.div>

        {/* Studio Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full"
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-piko-teal"></div>
            </div>
          ) : (
            <StudioRecorder backingTracks={backingTracks} />
          )}
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
                <span>Download your recordings locally or upload them to share with the world</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
