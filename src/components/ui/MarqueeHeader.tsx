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
      
      // Increase speed when scrolling down
      if (scrollDelta > 0) {
        setScrollSpeed(1 + Math.min(scrollDelta / 100, 2));
      } else {
        setScrollSpeed(1);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative overflow-hidden py-4 ${className}`}>
      <div
        className="marquee-container"
        style={{
          animationDuration: `${20 / scrollSpeed}s`,
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
