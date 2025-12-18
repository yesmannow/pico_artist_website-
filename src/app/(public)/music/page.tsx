'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { getTracks } from '@/data/tracks';
import TrackList from '@/components/player/TrackList';

export default function MusicPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const tracks = getTracks();

  // Visualizer bars that react to scroll
  const bar1 = useTransform(scrollYProgress, [0, 1], [20, 100]);
  const bar2 = useTransform(scrollYProgress, [0, 1], [40, 80]);
  const bar3 = useTransform(scrollYProgress, [0, 1], [60, 120]);
  const bar4 = useTransform(scrollYProgress, [0, 1], [30, 90]);
  const bar5 = useTransform(scrollYProgress, [0, 1], [50, 110]);

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden">
      {/* Hero Section with Artist Image Background */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images design assets/white hero.jpg"
            alt="Piko FG"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950" />
          {/* Brand glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/10 via-transparent to-piko-pink/10" />
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">Music</p>
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-100">
              Digital Graffiti Soundscapes
            </h1>
            <p className="text-zinc-300 max-w-2xl mx-auto">
              Stream the full collection of Piko FG&apos;s tracks
            </p>
          </motion.div>

          {/* Scroll Visualizer */}
          <motion.div
            className="flex items-end justify-center gap-2 h-20 mt-8"
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]) }}
          >
            <motion.div
              className="w-2 rounded-t-full bg-gradient-to-t from-piko-teal to-piko-pink"
              style={{ height: bar1 }}
            />
            <motion.div
              className="w-2 rounded-t-full bg-gradient-to-t from-piko-pink to-piko-orange"
              style={{ height: bar2 }}
            />
            <motion.div
              className="w-2 rounded-t-full bg-gradient-to-t from-piko-orange to-piko-teal"
              style={{ height: bar3 }}
            />
            <motion.div
              className="w-2 rounded-t-full bg-gradient-to-t from-piko-teal to-piko-pink"
              style={{ height: bar4 }}
            />
            <motion.div
              className="w-2 rounded-t-full bg-gradient-to-t from-piko-pink to-piko-orange"
              style={{ height: bar5 }}
            />
          </motion.div>
        </div>
      </div>

      {/* Track List Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <TrackList tracks={tracks} showFilter />
      </div>

      {/* Add bottom padding to account for PlayerDock */}
      <div className="h-32" />
    </div>
  );
}
