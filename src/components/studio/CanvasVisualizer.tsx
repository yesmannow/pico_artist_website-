'use client';

import { useEffect, useRef } from 'react';

interface CanvasVisualizerProps {
  analyser: AnalyserNode | null;
  isActive: boolean;
}

export default function CanvasVisualizer({ analyser, isActive }: CanvasVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!analyser || !canvasRef.current || !isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isActive) return;

      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 64;
      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const value = dataArray[dataIndex];
        const height = (value / 255) * canvas.height;

        // Create gradient for "paint drip" effect
        const gradient = ctx.createLinearGradient(0, canvas.height - height, 0, canvas.height);
        gradient.addColorStop(0, '#00f5d4'); // piko-teal
        gradient.addColorStop(1, '#ff006e'); // piko-pink

        ctx.fillStyle = gradient;

        // Draw drip-style bars with rounded caps
        const x = i * barWidth;
        const y = canvas.height - height;

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw rounded rectangle for drip effect
        ctx.beginPath();
        ctx.roundRect(
          x + barWidth * 0.2,
          y,
          barWidth * 0.6,
          height,
          [4, 4, 0, 0] // Rounded top corners
        );
        ctx.fill();

        // Add glow effect for active bars
        if (height > canvas.height * 0.3) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = i % 2 === 0 ? '#00f5d4' : '#ff006e';
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={200}
      className="w-full h-full rounded-lg bg-zinc-950/50"
    />
  );
}
