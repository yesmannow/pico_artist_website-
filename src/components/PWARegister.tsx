'use client';

import { useEffect, useRef } from 'react';

export default function PWARegister() {
  const registrationAttempted = useRef(false);

  useEffect(() => {
    // MANDATORY: Only register once to prevent reload loops
    if (registrationAttempted.current) return;
    registrationAttempted.current = true;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Log only once - no auto-reload on update
          if (process.env.NODE_ENV === 'development') {
            console.log('[PWA] Service Worker registered:', registration);
          }
          
          // Prevent auto-reload on service worker update
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available but don't auto-reload
                  if (process.env.NODE_ENV === 'development') {
                    console.log('[PWA] New service worker available. Refresh to update.');
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    }
  }, []);

  return null;
}
