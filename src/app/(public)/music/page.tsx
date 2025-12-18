'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { getTracks } from '@/data/tracks';
import TrackList from '@/components/player/TrackList';
import CinematicHero from '@/components/media/CinematicHero';
import { usePlayerStore } from '@/store/playerStore';
import { useIdle } from '@/hooks/useIdle';

const featuredShots = [
  { src: '/images%20design%20assets/on%20the%20mic.jpg', caption: 'On the Mic' },
  { src: '/images%20design%20assets/black%20and%20white%20standing%20low%20shot.jpg', caption: 'Low Light Stage' },
  { src: '/images%20design%20assets/close%20up%20face.jpg', caption: 'Close Up' },
  { src: '/images%20design%20assets/piko%20musician%20bio%20photo.jpg', caption: 'Studio Portrait' },
  { src: '/images%20design%20assets/green%20shillioette.jpg', caption: 'Silhouette Glow' },
];

export default function MusicPage() {
  const tracks = getTracks();
  const { isPlaying } = usePlayerStore();
  const isIdle = useIdle();
  const prefersReducedMotion = useReducedMotion();

  const dimUI = isIdle && isPlaying;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CinematicHero
        title="Digital Graffiti Soundscapes"
        subtitle="Stream the full collection of Piko FG tracks"
        backgroundImageUrl="/images%20design%20assets/white%20hero.jpg"
        variant="music"
      />

      {/* Featured Shots */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-zinc-100">Featured Shots</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-piko-teal">Cinematic Frames</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredShots.slice(0, 6).map((shot, idx) => (
            <motion.div
              key={shot.src}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-900/60"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={shot.src}
                  alt={shot.caption}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  priority={idx < 2}
                  unoptimized
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-80" />
              <div className="absolute inset-0 flex items-end p-4">
                <div className="w-full rounded-lg bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 backdrop-blur-md border border-zinc-800/60 group-hover:border-piko-teal/60 transition">
                  {shot.caption}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Track List Section */}
      <div
        className="max-w-6xl mx-auto px-4 py-16 transition-opacity duration-300"
        style={{ opacity: dimUI ? 0.65 : 1 }}
      >
        <TrackList tracks={tracks} showFilter />
      </div>

      {/* Add bottom padding to account for PlayerDock */}
      <div className="h-32" />
    </div>
  );
}
