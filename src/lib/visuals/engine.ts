/**
 * Visual Engine Core
 * Manages canvas rendering lifecycle with performance optimizations
 */

export interface EngineState {
  time: number;
  dt: number;
  width: number;
  height: number;
  dpr: number;
  colors: {
    inkBlack: string;
    inkWhite: string;
    neonTeal: string;
    neonPink: string;
    neonOrange: string;
  };
  intensity: number; // 0..1
  trackProgress: number; // 0..1
  isPlaying: boolean;
  audio?: {
    level: number; // 0..1
    bass: number; // 0..1
    mid: number; // 0..1
    treble: number; // 0..1
  };
}

export type RenderFunction = (
  ctx: CanvasRenderingContext2D,
  state: EngineState,
  dt: number
) => void;

interface EngineOptions {
  canvas: HTMLCanvasElement;
  render: RenderFunction;
  targetFPS?: number;
}

interface QualitySettings {
  scale: number; // 0.5 to 1
  particleLimit: number;
  motionScale: number; // 0.5 to 1
}

/**
 * Calculate quality settings based on device capabilities
 */
function calculateQualitySettings(): QualitySettings {
  // Default to high quality
  let scale = 1;
  let particleLimit = 500;
  let motionScale = 1;

  if (typeof window === 'undefined') {
    return { scale, particleLimit, motionScale };
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    particleLimit = 100;
    motionScale = 0.5;
  }

  // Check device memory if available (Chrome feature)
  const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
  if (deviceMemory && deviceMemory < 4) {
    scale = 0.75;
    particleLimit = 200;
  }

  // Check screen size
  const screenArea = window.innerWidth * window.innerHeight;
  if (screenArea > 2073600) {
    // > 1920x1080
    if (deviceMemory && deviceMemory < 8) {
      scale = 0.85;
    }
  }

  return { scale, particleLimit, motionScale };
}

/**
 * Create and manage a visual engine
 */
export function createEngine(options: EngineOptions) {
  const { canvas, render } = options;
  const ctx = canvas.getContext('2d', { alpha: false });

  if (!ctx) {
    throw new Error('Failed to get 2D rendering context');
  }

  let rafId: number | null = null;
  let lastTime = 0;
  const startTime = performance.now();
  let isPaused = false;
  let isVisible = true;

  const quality = calculateQualitySettings();
  // MANDATORY: Clamp DPR to max 1.5 to prevent VRAM exhaustion
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality.scale;

  // State that will be passed to render function
  const state: EngineState = {
    time: 0,
    dt: 0,
    width: 0,
    height: 0,
    dpr,
    colors: {
      inkBlack: '#09090b', // zinc-950
      inkWhite: '#fafafa', // zinc-50
      neonTeal: '#00f5d4',
      neonPink: '#ff006e',
      neonOrange: '#ff9e00',
    },
    intensity: 1,
    trackProgress: 0,
    isPlaying: false,
  };

  /**
   * Resize canvas to match display size
   */
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Update canvas size with DPR
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Update state
    state.width = width;
    state.height = height;

    // Scale context for DPR
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  /**
   * Main render loop
   */
  function loop(currentTime: number) {
    // MANDATORY: Visibility kill-switch at the TOP of render loop
    if (document.hidden || isPaused || !isVisible) {
      rafId = null;
      return;
    }

    const elapsed = currentTime - startTime;
    const dt = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap at 100ms

    state.time = elapsed / 1000;
    state.dt = dt;

    // Call render function
    render(ctx, state, dt);

    lastTime = currentTime;
    rafId = requestAnimationFrame(loop);
  }

  /**
   * Start the engine
   */
  function start() {
    if (rafId !== null) return;

    isPaused = false;
    resize();
    lastTime = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  /**
   * Pause the engine
   */
  function pause() {
    isPaused = true;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  /**
   * Resume the engine
   */
  function resume() {
    if (!isPaused) return;
    isPaused = false;
    lastTime = performance.now();
    start();
  }

  /**
   * Update state properties
   */
  function updateState(updates: Partial<EngineState>) {
    Object.assign(state, updates);
  }

  /**
   * Clean up
   */
  function destroy() {
    pause();
    visibilityCleanup();
    resizeCleanup();
  }

  // Handle visibility changes
  function handleVisibilityChange() {
    if (document.hidden) {
      isVisible = false;
      pause();
    } else {
      isVisible = true;
      if (!isPaused) {
        resume();
      }
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange);

  const visibilityCleanup = () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  // Handle window resize
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  function handleResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resize, 100);
  }

  window.addEventListener('resize', handleResize);

  const resizeCleanup = () => {
    window.removeEventListener('resize', handleResize);
    if (resizeTimeout) clearTimeout(resizeTimeout);
  };

  return {
    start,
    pause,
    resume,
    updateState,
    destroy,
    getState: () => state,
    getQuality: () => quality,
  };
}
