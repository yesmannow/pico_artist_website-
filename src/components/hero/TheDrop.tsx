/**
 * TheDrop - Hero Replacement Component
 * Showcase for latest single with glitch effect and neon glow
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { getSocialLink } from '@/data/socials';

interface TheDropProps {
  trackTitle?: string;
}

export default function TheDrop({ 
  trackTitle = 'Te Prometo',
}: TheDropProps) {
  const youtubeMusicLink = getSocialLink('youtube-music');

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Video Effect - Using static gradient for now */}
      <div className="absolute inset-0 bg-gradient-to-br from-piko-pink/20 via-zinc-950 to-piko-teal/20">
        {/* Animated gradient overlay for "glitch" effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-piko-orange/10 via-transparent to-piko-pink/10"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-[url('/assets/images/bg/graffiti_1874452_1280.jpg')] opacity-10 mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* "OUT NOW" Badge */}
          <motion.div
            className="inline-block mb-6"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="px-6 py-2 text-sm font-bold tracking-[0.3em] text-piko-teal border-2 border-piko-teal rounded-full bg-piko-teal/10 shadow-lg shadow-piko-teal/30">
              OUT NOW
            </span>
          </motion.div>

          {/* Track Title with Glitch Effect */}
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* Main title */}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-piko-pink via-piko-teal to-piko-orange bg-clip-text text-transparent">
                {trackTitle}
              </span>
              {/* Glitch layers */}
              <span 
                className="absolute inset-0 bg-gradient-to-r from-piko-pink to-piko-teal bg-clip-text text-transparent opacity-70"
                style={{ transform: 'translate(-2px, 2px)' }}
                aria-hidden="true"
              >
                {trackTitle}
              </span>
              <span 
                className="absolute inset-0 bg-gradient-to-r from-piko-teal to-piko-orange bg-clip-text text-transparent opacity-70"
                style={{ transform: 'translate(2px, -2px)' }}
                aria-hidden="true"
              >
                {trackTitle}
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-zinc-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            The latest single from Piko FG — Available on all platforms
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {/* Stream Now Button */}
            <motion.a
              href={youtubeMusicLink?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-10 py-5 text-lg font-bold rounded-full bg-gradient-to-r from-piko-pink to-piko-teal text-white shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-piko-pink to-piko-teal blur-xl opacity-0 group-hover:opacity-75 transition-opacity -z-10" />
              
              STREAM NOW
              <ExternalLink className="w-5 h-5" />
              
              {/* Animated border */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/50"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.a>

            {/* Listen on Site */}
            <Link
              href={`/media?tab=tracks`}
              className="group inline-flex items-center gap-3 px-10 py-5 text-lg font-bold rounded-full border-2 border-piko-orange bg-piko-orange/10 text-piko-orange hover:bg-piko-orange/20 transition shadow-lg shadow-piko-orange/20"
            >
              LISTEN HERE
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
