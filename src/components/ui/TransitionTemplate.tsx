/**
 * TransitionTemplate - Cinematic Page Transitions
 * Glitch effect for desktop, simple fade/slide for mobile
 * Mobile-first: Disables heavy effects on touch devices
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface TransitionTemplateProps {
  children: React.ReactNode;
}

export default function TransitionTemplate({ children }: TransitionTemplateProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [isLowBattery, setIsLowBattery] = useState(false);

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check battery level (where supported)
  useEffect(() => {
    let batteryManager: any = null;

    const checkBattery = () => {
      if (batteryManager) {
        // Disable effects if battery is low (< 20%) or charging is false
        setIsLowBattery(batteryManager.level < 0.2 && !batteryManager.charging);
      }
    };

    const setupBattery = async () => {
      if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
        try {
          batteryManager = await (navigator as any).getBattery();
          checkBattery(); // Initial check
          batteryManager.addEventListener('levelchange', checkBattery);
          batteryManager.addEventListener('chargingchange', checkBattery);
        } catch {
          // Battery API not supported or failed, ignore
        }
      }
    };

    setupBattery();

    // ✅ Cleanup runs correctly when component unmounts
    return () => {
      if (batteryManager) {
        batteryManager.removeEventListener('levelchange', checkBattery);
        batteryManager.removeEventListener('chargingchange', checkBattery);
      }
    };
  }, []);

  // Use simple transitions on mobile, low battery, or reduced motion
  const useSimpleTransition = isMobile || isLowBattery || prefersReducedMotion;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={useSimpleTransition ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
        animate={useSimpleTransition ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
        exit={useSimpleTransition ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' }}
        transition={
          useSimpleTransition
            ? { duration: 0.3, ease: 'easeInOut' }
            : { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
        }
        className="relative"
      >
        {/* Digital Noise Glitch Effect (Desktop Only) */}
        {!useSimpleTransition && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-50 opacity-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.15, 0, 0.1, 0],
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.2, 0.4, 0.6, 1],
            }}
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  0deg,
                  rgba(0, 245, 212, 0.03) 0px,
                  transparent 1px,
                  transparent 2px,
                  rgba(255, 0, 110, 0.03) 3px
                ),
                repeating-linear-gradient(
                  90deg,
                  rgba(0, 245, 212, 0.03) 0px,
                  transparent 1px,
                  transparent 2px,
                  rgba(255, 0, 110, 0.03) 3px
                )
              `,
              backgroundSize: '4px 4px',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Simple fade overlay for mobile */}
        {useSimpleTransition && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-50 bg-zinc-950"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        )}

        {children}
      </motion.div>
    </AnimatePresence>
  );
}

