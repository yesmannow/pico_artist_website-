'use client';

import { useEffect, useState } from 'react';

const DEFAULT_TIMEOUT = 2500;

export function useIdle(timeout = DEFAULT_TIMEOUT) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      setIsIdle(false);
      timer = setTimeout(() => setIsIdle(true), timeout);
    };

    const events: Array<keyof DocumentEventMap> = ['mousemove', 'mousedown', 'touchstart', 'scroll', 'keydown'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout]);

  return isIdle;
}
