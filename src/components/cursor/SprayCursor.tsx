/**
 * SprayCursor - Digital Graffiti Paint Mist Trail
 * Lightweight HTML5 Canvas overlay that emits vanishing paint particles
 * Optimized for 60fps using requestAnimationFrame outside React state
 */

'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
}

export default function SprayCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const lastEmitTimeRef = useRef(0);
  const isHoverDeviceRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Detect hover-capable device (disable on touch devices)
    const checkHoverDevice = () => {
      isHoverDeviceRef.current = window.matchMedia('(hover: hover)').matches;
    };
    checkHoverDevice();
    window.addEventListener('resize', checkHoverDevice);

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHoverDeviceRef.current) return;

      mousePosRef.current = { x: e.clientX, y: e.clientY };

      // Emit particles at regular intervals (every ~16ms for ~60fps)
      const now = performance.now();
      if (now - lastEmitTimeRef.current > 16) {
        emitParticle(e.clientX, e.clientY);
        lastEmitTimeRef.current = now;
      }
    };

    // Emit a single particle
    const emitParticle = (x: number, y: number) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed + 0.3; // Slight downward drift

      particlesRef.current.push({
        x,
        y,
        vx,
        vy,
        size: 2 + Math.random() * 4,
        opacity: 0.4 + Math.random() * 0.6,
        life: 0,
        maxLife: 30 + Math.random() * 40, // 30-70 frames
      });

      // Limit particle count for performance
      if (particlesRef.current.length > 50) {
        particlesRef.current.shift();
      }
    };

    // Animation loop (runs outside React state)
    const animate = () => {
      if (!isHoverDeviceRef.current) {
        // Clear particles on touch devices
        particlesRef.current = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear with slight fade for trail effect
      ctx.fillStyle = 'rgba(9, 9, 11, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // Gravity
        p.life++;

        // Calculate fade
        const lifeRatio = p.life / p.maxLife;
        const currentOpacity = p.opacity * (1 - lifeRatio);

        // Draw particle (neon green #00f5d4)
        ctx.save();
        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = '#00f5d4';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f5d4';
        ctx.fill();
        ctx.restore();

        // Remove dead particles
        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', checkHoverDevice);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Don't render on touch devices
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        cursor: 'none',
        // Disable on touch devices via CSS
        display: typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches ? 'none' : 'block'
      }}
      aria-hidden="true"
    />
  );
}

