'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Interactive Mouse Spotlight */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 0, 110, 0.15), transparent 80%)`,
        }}
      />

      <main className="flex flex-col items-center gap-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl font-bold text-zinc-100 mb-4">
            <span className="bg-gradient-to-r from-piko-orange to-piko-teal bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="text-lg text-zinc-400">
            Media gallery coming soon. This will showcase photos, artwork, and visual content from Piko FG.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-12"
        >
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-zinc-500">Under construction</p>
        </motion.div>
      </main>
    </div>
  );
}
