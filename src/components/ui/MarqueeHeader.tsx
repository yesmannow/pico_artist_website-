/**
 * MarqueeHeader - Kinetic Typography Component
 * Scrolling header text that increases speed on scroll
 */

'use client';

import { useEffect, useRef, useState } from 'react';

interface MarqueeHeaderProps {
  text: string;
  className?: string;
}

export default function MarqueeHeader({ text, className = '' }: MarqueeHeaderProps) {
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);
      
      // Increase speed when scrolling down, with max limit to prevent motion sickness
      if (scrollDelta > 0) {
        const calculatedSpeed = 1 + Math.min(scrollDelta / 100, 2);
        // Cap max speed at 2x to prevent excessively fast animations
        setScrollSpeed(Math.min(calculatedSpeed, 2));
      } else {
        setScrollSpeed(1);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ensure minimum duration to prevent excessively fast animations
  const animationDuration = Math.max(20 / scrollSpeed, 10); // Minimum 10s duration

  return (
    <div className={`relative overflow-hidden py-4 ${className}`}>
      <div
        className="marquee-container"
        style={{
          animationDuration: `${animationDuration}s`,
        }}
      >
        <div className="marquee-content">
          <span className="text-3xl md:text-4xl font-bold text-zinc-100 mx-8 whitespace-nowrap">
            {text}
          </span>
          <span className="text-3xl md:text-4xl font-bold text-zinc-100 mx-8 whitespace-nowrap">
            {text}
          </span>
          <span className="text-3xl md:text-4xl font-bold text-zinc-100 mx-8 whitespace-nowrap">
            {text}
          </span>
          <span className="text-3xl md:text-4xl font-bold text-zinc-100 mx-8 whitespace-nowrap">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
