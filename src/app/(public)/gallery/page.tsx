'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Gallery from '@/components/Gallery';
import VideoGrid from '@/components/gallery/VideoGrid';
import manifest from '@/data/media-manifest.json';

export default function GalleryPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen px-4 py-12 relative overflow-hidden">
      {/* Interactive Mouse Spotlight */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 0, 110, 0.15), transparent 80%)`,
        }}
      />

      <main className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-zinc-100 mb-4">
            <span className="bg-gradient-to-r from-piko-orange via-piko-pink to-piko-teal bg-clip-text text-transparent">
              Piko FG Gallery
            </span>
          </h1>
          <p className="text-lg text-zinc-400">
            Visual moments from the streets to the studio
          </p>
        </motion.div>

        {/* Video Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <VideoGrid videos={manifest.videos} />
        </motion.div>

        {/* Image Gallery */}
        <Gallery />
      </main>
    </div>
  );
}
