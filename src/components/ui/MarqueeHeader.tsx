/**
 * MarqueeHeader - Kinetic Typography Component
 * Framer Motion marquee that scrolls section titles infinitely
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface MarqueeHeaderProps {
  text: string;
  className?: string;
}

const marqueeCopies = Array.from({ length: 6 });

export default function MarqueeHeader({ text, className = '' }: MarqueeHeaderProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={`relative overflow-hidden py-4 ${className}`}>
      <div className="pointer-events-none">
        <motion.div
          className="flex"
          aria-hidden
          initial={false}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: ['0%', '-50%'],
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 16,
                  ease: 'linear',
                  repeat: Infinity,
                }
          }
        >
          {[0, 1].map((index) => (
            <div key={index} className="flex min-w-full shrink-0">
              {marqueeCopies.map((_, idx) => (
                <span
                  key={`${index}-${idx}`}
                  className="text-3xl md:text-4xl font-bold text-zinc-100 mx-8 whitespace-nowrap tracking-[0.08em]"
                >
                  {text || 'PIKO FG'}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
