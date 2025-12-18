'use client';

import type { ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

type GalleryLayoutProps = {
  children: ReactNode;
};

export default function GalleryLayout({ children }: GalleryLayoutProps) {
  const { scrollYProgress } = useScroll();
  
  // Smooth spring animation for scroll progress
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      {/* Piko Pink Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-piko-pink origin-left z-50"
        style={{ scaleX }}
      />
      
      {/* Add subtle glow effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-piko-pink/50 blur-sm origin-left z-50"
        style={{ scaleX }}
      />

      {children}
    </>
  );
}
