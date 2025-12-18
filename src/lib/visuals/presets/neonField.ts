/**
 * Neon Field Preset
 * Soft neon grid/field with waveform-like ribbon and subtle particles
 */

import type { EngineState } from '../engine';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

let particles: Particle[] = [];
let waveOffsets: number[] = [];
let gridPhase = 0;

/**
 * Reset state when preset changes
 */
export function reset() {
  particles = [];
  waveOffsets = [];
  gridPhase = 0;
}

/**
 * Render neon field preset
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

  gridPhase += dt * 0.5;

  // Draw subtle grid
  const gridSize = 40;
  const gridOpacity = 0.1 + (audio?.level || 0) * 0.1;
  
  ctx.strokeStyle = colors.neonTeal;
  ctx.lineWidth = 1;
  ctx.globalAlpha = gridOpacity;

  // Vertical lines
  for (let x = 0; x < width; x += gridSize) {
    const offset = Math.sin(gridPhase + x * 0.01) * 5;
    ctx.beginPath();
    ctx.moveTo(x + offset, 0);
    ctx.lineTo(x + offset, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    const offset = Math.cos(gridPhase + y * 0.01) * 5;
    ctx.beginPath();
    ctx.moveTo(0, y + offset);
    ctx.lineTo(width, y + offset);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;

  // Draw waveform ribbon
  if (waveOffsets.length === 0) {
    for (let i = 0; i < 100; i++) {
      waveOffsets.push(Math.random() * Math.PI * 2);
    }
  }

  const centerY = height / 2;
  const bassAmp = (audio?.bass || 0.3) * 60 * intensity;
  const midAmp = (audio?.mid || 0.2) * 40 * intensity;

  ctx.beginPath();
  ctx.moveTo(0, centerY);

  for (let i = 0; i <= 100; i++) {
    const x = (i / 100) * width;
    const progress = i / 100;
    const offset = waveOffsets[i] || 0;
    
    const wave1 = Math.sin(state.time * 2 + progress * Math.PI * 4 + offset) * bassAmp;
    const wave2 = Math.sin(state.time * 3 + progress * Math.PI * 8 + offset) * midAmp;
    const y = centerY + wave1 + wave2;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  // Gradient stroke
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, colors.neonTeal);
  gradient.addColorStop(0.5, colors.neonPink);
  gradient.addColorStop(1, colors.neonOrange);
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.8;
  ctx.stroke();

  // Glow
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 6;
  ctx.globalAlpha = 0.3;
  ctx.shadowBlur = 15;
  ctx.shadowColor = colors.neonPink;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Spawn particles
  const levelEnergy = audio?.level || 0.2;
  if (isPlaying && Math.random() < levelEnergy * intensity * 0.5) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20,
      size: 2 + Math.random() * 3,
      opacity: 0.8,
      color: [colors.neonTeal, colors.neonPink, colors.neonOrange][
        Math.floor(Math.random() * 3)
      ],
    });
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.opacity -= dt * 0.3;

    if (p.opacity <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      particles.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // Small glow
    ctx.globalAlpha = p.opacity * 0.3;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Track progress indicator - corner dots
  if (trackProgress > 0) {
    const dotCount = 20;
    const activeDots = Math.floor(dotCount * trackProgress);

    for (let i = 0; i < dotCount; i++) {
      const x = 20 + i * 15;
      const y = height - 20;
      const isActive = i < activeDots;

      ctx.globalAlpha = isActive ? 0.8 : 0.2;
      ctx.fillStyle = isActive ? colors.neonTeal : colors.inkWhite;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1;
}

const neonFieldPreset = {
  id: 'neonField',
  name: 'Neon Field',
  render,
  reset,
};

export default neonFieldPreset;
