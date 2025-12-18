/**
 * Ink Drip Pulse Preset
 * Slow ink diffusion with drip lines and neon highlights on peaks
 */

import type { EngineState } from '../engine';

interface InkBlob {
  x: number;
  y: number;
  size: number;
  opacity: number;
  age: number;
  maxAge: number;
  pulsePhase: number;
}

interface DripLine {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  thickness: number;
  opacity: number;
  isNeon: boolean;
}

let inkBlobs: InkBlob[] = [];
let dripLines: DripLine[] = [];
let pulsePhase = 0;

/**
 * Reset state when preset changes
 */
export function reset() {
  inkBlobs = [];
  dripLines = [];
  pulsePhase = 0;
}

/**
 * Render ink drip pulse preset
 */
export function render(
  ctx: CanvasRenderingContext2D,
  state: EngineState,
  dt: number
) {
  const { width, height, colors, intensity, trackProgress, isPlaying, audio } = state;

  // Fade existing content instead of clearing (creates trailing effect)
  ctx.fillStyle = 'rgba(9, 9, 11, 0.05)'; // Very subtle fade
  ctx.fillRect(0, 0, width, height);

  pulsePhase += dt * 1.5;

  // Spawn ink blobs based on bass
  const bassEnergy = audio?.bass || Math.sin(state.time) * 0.5 + 0.5;
  if (Math.random() < bassEnergy * intensity * 0.15) {
    inkBlobs.push({
      x: width / 2 + (Math.random() - 0.5) * width * 0.6,
      y: height / 3 + (Math.random() - 0.5) * height * 0.3,
      size: 40 + Math.random() * 80 * intensity,
      opacity: 0.6,
      age: 0,
      maxAge: 4 + Math.random() * 3,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  }

  // Spawn drip lines
  const midEnergy = audio?.mid || Math.sin(state.time * 1.5) * 0.5 + 0.5;
  if (Math.random() < midEnergy * intensity * 0.2) {
    const isNeon = Math.random() > 0.6;
    dripLines.push({
      x: Math.random() * width,
      y: 0,
      targetY: height * (0.3 + Math.random() * 0.7),
      speed: 30 + Math.random() * 80,
      thickness: isNeon ? 1 : 2,
      opacity: isNeon ? 0.8 : 0.5,
      isNeon,
    });
  }

  // Update and draw drip lines
  for (let i = dripLines.length - 1; i >= 0; i--) {
    const drip = dripLines[i];
    drip.y += drip.speed * dt;

    if (drip.y > drip.targetY) {
      drip.opacity -= dt * 0.5;
    }

    if (drip.opacity <= 0) {
      dripLines.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = drip.opacity;
    ctx.strokeStyle = drip.isNeon ? colors.neonTeal : colors.inkWhite;
    ctx.lineWidth = drip.thickness;
    
    ctx.beginPath();
    ctx.moveTo(drip.x, 0);
    ctx.lineTo(drip.x, Math.min(drip.y, drip.targetY));
    ctx.stroke();

    if (drip.isNeon) {
      // Glow effect
      ctx.globalAlpha = drip.opacity * 0.4;
      ctx.shadowBlur = 10;
      ctx.shadowColor = colors.neonTeal;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  // Update and draw ink blobs
  for (let i = inkBlobs.length - 1; i >= 0; i--) {
    const blob = inkBlobs[i];
    blob.age += dt;
    
    // Grow and fade
    const growthFactor = 1 + (blob.age / blob.maxAge) * 0.5;
    const currentSize = blob.size * growthFactor;
    blob.opacity = Math.max(0, 1 - blob.age / blob.maxAge);

    if (blob.opacity <= 0) {
      inkBlobs.splice(i, 1);
      continue;
    }

    // Pulsing size based on audio
    const pulse = Math.sin(pulsePhase + blob.pulsePhase) * 0.15 + 1;
    const renderSize = currentSize * pulse;

    // Draw ink blob with diffusion
    const gradient = ctx.createRadialGradient(
      blob.x,
      blob.y,
      0,
      blob.x,
      blob.y,
      renderSize
    );
    
    gradient.addColorStop(0, `rgba(250, 250, 250, ${blob.opacity * 0.4})`);
    gradient.addColorStop(0.5, `rgba(250, 250, 250, ${blob.opacity * 0.15})`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(blob.x, blob.y, renderSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // Neon highlights on peaks
  const trebleEnergy = audio?.treble || 0;
  if (trebleEnergy > 0.5) {
    const highlightCount = Math.floor(trebleEnergy * 5);
    for (let i = 0; i < highlightCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 10 + Math.random() * 20;
      const color = [colors.neonPink, colors.neonTeal, colors.neonOrange][i % 3];

      ctx.globalAlpha = (trebleEnergy - 0.5) * 0.6;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      ctx.globalAlpha = (trebleEnergy - 0.5) * 0.2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Progress indicator - vertical bar on left
  if (trackProgress > 0) {
    const barHeight = height * trackProgress;
    const barX = 15;

    ctx.globalAlpha = 0.5;
    const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
    gradient.addColorStop(0, colors.neonPink);
    gradient.addColorStop(0.5, colors.neonTeal);
    gradient.addColorStop(1, colors.neonOrange);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(barX, height - barHeight, 3, barHeight);

    // Glow
    ctx.globalAlpha = 0.3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = colors.neonPink;
    ctx.fillRect(barX, height - barHeight, 3, barHeight);
    ctx.shadowBlur = 0;
  }

  ctx.globalAlpha = 1;
}

export default {
  id: 'inkDripPulse',
  name: 'Ink Drip Pulse',
  render,
  reset,
};
