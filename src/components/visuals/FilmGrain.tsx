/**
 * FilmGrain - Lightweight CSS-only Film Grain Overlay
 * 
 * Zero CPU usage, GPU-compositor-only effect that adds a subtle
 * "TV static" film grain texture to enhance the Digital Graffiti aesthetic.
 * 
 * Replaces heavy DOM-based particle/rain animations with a CSS animation
 * that runs entirely on the compositor thread.
 */

'use client';

export default function FilmGrain() {
  return (
    <div
      className="film-grain"
      aria-hidden="true"
    />
  );
}
