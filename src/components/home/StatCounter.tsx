/**
 * Animated Stats Counter
 * Displays key metrics with smooth count-up animation
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

interface StatCounterProps {
  end: number;
  duration?: number;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
  decimals?: number;
}

export default function StatCounter({
  end,
  label,
  icon,
  suffix = '',
  decimals = 0,
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (isInView) {
      motionValue.set(end);
    }
  }, [isInView, motionValue, end]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(latest.toFixed(decimals));
    });
    return () => unsubscribe();
  }, [springValue, decimals]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 hover:border-piko-teal/50 transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/10 to-piko-pink/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-piko-teal to-piko-pink flex items-center justify-center">
              {icon}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-zinc-100 mb-2 font-mono">
              {displayValue}
              {suffix}
            </div>
            <p className="text-sm text-zinc-400 uppercase tracking-wider">{label}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
