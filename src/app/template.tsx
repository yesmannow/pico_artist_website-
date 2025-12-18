'use client';

import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'saturate(120%)' }}
      animate={{
        opacity: 1,
        x: [0, -2, 2, 0],
        clipPath: [
          'inset(0% 0% 0% 0%)',
          'inset(2% 0% 0% 0%)',
          'inset(0% 0% 2% 0%)',
          'inset(0% 0% 0% 0%)',
        ],
      }}
      exit={{ opacity: 0, x: -8, scale: 0.99 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="relative"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,0,110,0.14),transparent,rgba(0,245,212,0.12))]"
        animate={{ opacity: [0, 0.35, 0], x: [0, -8, 0] }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      {children}
    </motion.div>
  );
}
