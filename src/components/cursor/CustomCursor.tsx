'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return hasFinePointer && supportsHover && !prefersReducedMotion;
  });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only add event listeners if cursor is enabled
    if (!isEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
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

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mousePosition, isEnabled]);

  // Remove old trails
  useEffect(() => {
    if (!isEnabled) return;
    
    const interval = setInterval(() => {
      setTrails((prev) => prev.filter((trail) => Date.now() - trail.id < 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [isEnabled]);

  useEffect(() => {
    // Only hide default cursor if custom cursor is enabled
    if (!isEnabled) {
      document.body.style.cursor = 'auto';
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
      return;
    }
    
    // Check if style already exists to prevent duplicates
    let style = document.getElementById('custom-cursor-style');
    
    if (!style) {
      // Add CSS rule to hide cursor globally, but allow normal cursor on interactive elements
      style = document.createElement('style');
      style.id = 'custom-cursor-style';
      style.textContent = `
        body { cursor: none !important; }
        input, textarea, select, button, a, [role="button"], [contenteditable="true"] {
          cursor: auto !important;
        }
        button, a, [role="button"] { cursor: pointer !important; }
        /* Ensure studio elements are interactive */
        [data-studio-interactive], [data-studio-interactive] * {
          cursor: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      // Clean up on unmount or when disabled
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
      document.body.style.cursor = 'auto';
    };
  }, [isEnabled]);

  // Don't render custom cursor if device doesn't support it
  if (!isEnabled) {
    return null;
  }

  return (
    <>
      {/* Custom Cursor Ring */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          pointerEvents: 'none',
        }}
        animate={{
          scale: isClicking ? 0.8 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      >
        <div className="w-6 h-6 rounded-full border-2 border-piko-teal shadow-[0_0_20px_rgba(0,245,212,0.8)]" />
      </motion.div>

      {/* Paint Trail Glows */}
      {trails.map((trail) => (
        <motion.div
          key={trail.id}
          aria-hidden
          className="fixed top-0 left-0 pointer-events-none z-[9998]"
          style={{
            x: trail.x - 20,
            y: trail.y - 20,
            pointerEvents: 'none',
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
