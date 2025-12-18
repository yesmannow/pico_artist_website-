/**
 * Splatter Neon Preset
 * Ink splashes with neon glow pulses and occasional drip streaks
 */

import type { EngineState } from '../engine';

interface Splash {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  age: number;
  maxAge: number;
  vx: number;
  vy: number;
}

interface Drip {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  color: string;
}

let splashes: Splash[] = [];
let drips: Drip[] = [];
let glowPhase = 0;

/**
 * Reset state when preset changes
 */
export function reset() {
  splashes = [];
  drips = [];
  glowPhase = 0;
}

/**
 * Render splatter neon preset
 */
export function render(
  ctx: CanvasRenderingContext2D,
  state: EngineState,
  dt: number
) {
  const { width, height, colors, intensity, trackProgress, isPlaying, audio } = state;

  // Clear with ink black
  ctx.fillStyle = colors.inkBlack;
  ctx.fillRect(0, 0, width, height);

  // Update glow phase
  glowPhase += dt * 2;

  // Spawn new splashes based on audio or time
  const bassEnergy = audio?.bass || Math.sin(state.time * 2) * 0.5 + 0.5;
  const spawnChance = isPlaying ? bassEnergy * intensity * 0.3 : 0.05;
  
  if (Math.random() < spawnChance) {
    splashes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 20 + Math.random() * 60 * intensity,
      opacity: 0.8,
      color: [colors.neonPink, colors.neonTeal, colors.neonOrange][
        Math.floor(Math.random() * 3)
      ],
      age: 0,
      maxAge: 2 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 30,
      vy: (Math.random() - 0.5) * 30,
    });
  }

  // Spawn drips
  const trebleEnergy = audio?.treble || Math.sin(state.time * 3) * 0.5 + 0.5;
  if (Math.random() < trebleEnergy * intensity * 0.1) {
    drips.push({
      x: Math.random() * width,
      y: 0,
      length: 30 + Math.random() * 100,
      speed: 50 + Math.random() * 150,
      opacity: 0.6,
      color: Math.random() > 0.5 ? colors.neonTeal : colors.inkWhite,
    });
  }

  // Update and draw drips
  ctx.lineWidth = 2;
  for (let i = drips.length - 1; i >= 0; i--) {
    const drip = drips[i];
    drip.y += drip.speed * dt;
    drip.opacity -= dt * 0.5;

    if (drip.opacity <= 0 || drip.y > height + drip.length) {
      drips.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = drip.opacity;
    ctx.strokeStyle = drip.color;
    ctx.beginPath();
    ctx.moveTo(drip.x, drip.y);
    ctx.lineTo(drip.x, drip.y - drip.length);
    ctx.stroke();
  }

  // Update and draw splashes
  for (let i = splashes.length - 1; i >= 0; i--) {
    const splash = splashes[i];
    splash.age += dt;
    splash.x += splash.vx * dt;
    splash.y += splash.vy * dt;
    splash.opacity = 1 - splash.age / splash.maxAge;

    if (splash.opacity <= 0) {
      splashes.splice(i, 1);
      continue;
    }

    // Draw splash with glow
    const glowIntensity = Math.sin(glowPhase + i) * 0.3 + 0.7;
    
    // Outer glow
    ctx.globalAlpha = splash.opacity * 0.3 * glowIntensity;
    const gradient = ctx.createRadialGradient(
      splash.x,
      splash.y,
      0,
      splash.x,
      splash.y,
      splash.size * 1.5
    );
    gradient.addColorStop(0, splash.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(splash.x, splash.y, splash.size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Inner splash
    ctx.globalAlpha = splash.opacity * 0.8;
    ctx.fillStyle = splash.color;
    ctx.beginPath();
    ctx.arc(splash.x, splash.y, splash.size, 0, Math.PI * 2);
    ctx.fill();

    // Add some splatter dots
    ctx.globalAlpha = splash.opacity * 0.6;
    for (let j = 0; j < 3; j++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = splash.size * (0.8 + Math.random() * 0.4);
      const dotSize = splash.size * (0.1 + Math.random() * 0.15);
      const dotX = splash.x + Math.cos(angle) * dist;
      const dotY = splash.y + Math.sin(angle) * dist;
      
      ctx.fillStyle = splash.color;
      ctx.beginPath();
      ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw progress bar glow at bottom
  if (trackProgress > 0) {
    const barY = height - 30;
    const barWidth = width * trackProgress;

    ctx.globalAlpha = 0.4;
    const barGradient = ctx.createLinearGradient(0, barY, barWidth, barY);
    barGradient.addColorStop(0, colors.neonTeal);
    barGradient.addColorStop(0.5, colors.neonPink);
    barGradient.addColorStop(1, colors.neonOrange);
    ctx.fillStyle = barGradient;
    ctx.fillRect(0, barY, barWidth, 4);

    // Glow
    ctx.globalAlpha = 0.2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = colors.neonPink;
    ctx.fillRect(0, barY, barWidth, 4);
    ctx.shadowBlur = 0;
  }

  // Reset alpha
  ctx.globalAlpha = 1;
}

export default {
  id: 'splatterNeon',
  name: 'Splatter Neon',
  render,
  reset,
};
