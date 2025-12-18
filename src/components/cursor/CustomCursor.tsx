'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      // Add a trail point when clicking
      setTrails((prev) => [
        ...prev.slice(-4), // Keep only last 5 trails
        { x: mousePosition.x, y: mousePosition.y, id: Date.now() },
      ]);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [mousePosition]);

  // Remove old trails
  useEffect(() => {
    const interval = setInterval(() => {
      setTrails((prev) => prev.filter((trail) => Date.now() - trail.id < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Custom Cursor Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        animate={{
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <div className="w-6 h-6 rounded-full border-2 border-piko-teal shadow-[0_0_20px_rgba(0,245,212,0.8)]" />
      </motion.div>

      {/* Paint Trail Glows */}
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            x: trail.x - 20,
            y: trail.y - 20,
          }}
          initial={{ opacity: 0.8, scale: 0 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-piko-teal/40 via-piko-pink/40 to-piko-orange/40 blur-xl" />
        </motion.div>
      ))}
    </>
  );
}

