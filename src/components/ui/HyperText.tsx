/**
 * HyperText - Hacker-style Text Decoding Effect
 * Scrambles characters on hover before settling on correct text
 * Uses framer-motion for smooth animations
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface HyperTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
  duration?: number;
  scrambleChars?: string;
}

const DEFAULT_SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';

export default function HyperText({
  text,
  className = '',
  as: Component = 'span',
  duration = 0.6,
  scrambleChars = DEFAULT_SCRAMBLE_CHARS,
}: HyperTextProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [displayText, setDisplayText] = useState(text);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scramble animation
  useEffect(() => {
    if (!isHovering || isMobile || shouldReduceMotion) {
      setDisplayText(text);
      return;
    }

    let frame = 0;
    const maxFrames = Math.ceil(duration * 60); // 60fps
    const chars = text.split('');
    const scrambleIndices = chars
      .map((_, i) => i)
      .filter((i) => chars[i] !== ' '); // Don't scramble spaces

    const interval = setInterval(() => {
      frame++;
      const progress = frame / maxFrames;

      if (progress >= 1) {
        setDisplayText(text);
        clearInterval(interval);
        return;
      }

      // Scramble random characters
      const newChars = [...chars];
      const numToScramble = Math.floor(scrambleIndices.length * (1 - progress));

      for (let i = 0; i < numToScramble; i++) {
        const randomIndex = scrambleIndices[Math.floor(Math.random() * scrambleIndices.length)];
        const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        newChars[randomIndex] = randomChar;
      }

      setDisplayText(newChars.join(''));
    }, 1000 / 60); // ~60fps

    return () => clearInterval(interval);
  }, [isHovering, text, duration, scrambleChars, isMobile, shouldReduceMotion]);

  // On mobile, show text immediately (no hover effect)
  if (isMobile || shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component
      className={className}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ display: 'inline-block' }}
    >
      <motion.span
        key={displayText}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        style={{ display: 'inline-block' }}
      >
        {displayText}
      </motion.span>
    </Component>
  );
}

