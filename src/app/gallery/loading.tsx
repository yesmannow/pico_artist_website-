'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function GalleryLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="relative">
        {/* Pulsing Piko Logo */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative w-32 h-32 rounded-full overflow-hidden"
        >
          <Image
            src="/piko-logo.jpg"
            alt="Piko FG"
            width={128}
            height={128}
            className="rounded-full"
          />
        </motion.div>

        {/* Digital Graffiti Splatter Animation */}
        <svg
          className="absolute -inset-8 pointer-events-none"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Animated paint drips around logo */}
          <motion.circle
            cx="100"
            cy="100"
            r="70"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="10 5"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: 360 }}
            transition={{
              pathLength: { duration: 2, repeat: Infinity },
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            }}
          />
          <motion.circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#gradient2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="8 12"
            initial={{ pathLength: 0, rotate: 180 }}
            animate={{ pathLength: 1, rotate: -180 }}
            transition={{
              pathLength: { duration: 2.5, repeat: Infinity, delay: 0.3 },
              rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
            }}
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff006e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#00f5d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff9e00" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff9e00" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ff006e" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center"
      >
        <h2 className="text-xl font-semibold bg-gradient-to-r from-piko-orange via-piko-pink to-piko-teal bg-clip-text text-transparent mb-2">
          Loading Gallery
        </h2>
        <p className="text-zinc-500 text-sm">Digital Graffiti Loading...</p>
      </motion.div>

      {/* Animated dots */}
      <div className="flex gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-piko-teal"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
