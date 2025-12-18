'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Music2, Play, ExternalLink } from 'lucide-react';

// Sample discography data - replace with actual YouTube Music channel data
const albums = [
  {
    id: '1',
    title: 'Digital Graffiti',
    year: '2024',
    tracks: 12,
    cover: '/piko-logo.jpg',
    youtubeUrl: 'https://music.youtube.com/playlist?list=PL...',
  },
  {
    id: '2',
    title: 'Midnight Sessions',
    year: '2023',
    tracks: 8,
    cover: '/piko-logo.jpg',
    youtubeUrl: 'https://music.youtube.com/playlist?list=PL...',
  },
  {
    id: '3',
    title: 'Street Art Anthems',
    year: '2023',
    tracks: 15,
    cover: '/piko-logo.jpg',
    youtubeUrl: 'https://music.youtube.com/playlist?list=PL...',
  },
];

export default function DiscographyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Visualizer bars that react to scroll
  const bar1 = useTransform(scrollYProgress, [0, 1], [20, 100]);
  const bar2 = useTransform(scrollYProgress, [0, 1], [40, 80]);
  const bar3 = useTransform(scrollYProgress, [0, 1], [60, 120]);
  const bar4 = useTransform(scrollYProgress, [0, 1], [30, 90]);
  const bar5 = useTransform(scrollYProgress, [0, 1], [50, 110]);

  return (
    <div ref={containerRef} className="min-h-screen px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-piko-pink/10 via-transparent to-piko-teal/10 blur-3xl" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">Discography</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">Music Collection</h1>
          <p className="text-zinc-400 max-w-3xl mx-auto">
            Explore the complete catalog of Piko FG's digital graffiti soundscapes.
          </p>
        </motion.div>

        {/* Scroll Visualizer */}
        <motion.div
          className="flex items-end justify-center gap-2 h-32 mb-8"
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]) }}
        >
          <motion.div
            className="w-3 rounded-t-full bg-gradient-to-t from-piko-teal to-piko-pink"
            style={{ height: bar1 }}
          />
          <motion.div
            className="w-3 rounded-t-full bg-gradient-to-t from-piko-pink to-piko-orange"
            style={{ height: bar2 }}
          />
          <motion.div
            className="w-3 rounded-t-full bg-gradient-to-t from-piko-orange to-piko-teal"
            style={{ height: bar3 }}
          />
          <motion.div
            className="w-3 rounded-t-full bg-gradient-to-t from-piko-teal to-piko-pink"
            style={{ height: bar4 }}
          />
          <motion.div
            className="w-3 rounded-t-full bg-gradient-to-t from-piko-pink to-piko-orange"
            style={{ height: bar5 }}
          />
        </motion.div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, idx) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group relative rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl overflow-hidden hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10 transition"
            >
              {/* Album Cover */}
              <div className="relative aspect-square overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/20 via-piko-pink/20 to-piko-orange/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-piko-teal/90 flex items-center justify-center shadow-lg shadow-piko-teal/50"
                  >
                    <Play className="h-8 w-8 text-white ml-1" fill="white" />
                  </motion.div>
                </div>
              </div>

              {/* Album Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-piko-teal transition">
                      {album.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">{album.year}</p>
                  </div>
                  <Music2 className="h-6 w-6 text-piko-pink opacity-50" />
                </div>

                <p className="text-sm text-zinc-400 mb-4">{album.tracks} tracks</p>

                <a
                  href={album.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-full border border-piko-teal/50 bg-piko-teal/10 text-piko-teal hover:bg-piko-teal/20 transition"
                >
                  <span className="text-sm font-semibold">Listen on YouTube Music</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

