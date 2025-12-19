"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type VisualizerProps = {
  analyser?: AnalyserNode | null;
  bars?: number;
  className?: string;
};

const MAX_DEVICE_PIXEL_RATIO = 1.5;

export default function Visualizer({
  analyser,
  bars = 32,
  className = "",
}: VisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let resizeFrame: number | undefined;

    const applyResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleResize = () => {
      if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
      }
      resizeFrame = requestAnimationFrame(applyResize);
    };

    applyResize();
    window.addEventListener("resize", handleResize);

    const bufferLength = Math.min(analyser.frequencyBinCount, bars * 2);
    const dataArray = new Uint8Array(bufferLength);
    let rafId: number;

    const renderFrame = () => {
      analyser.getByteFrequencyData(dataArray);
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / bars;
      for (let i = 0; i < bars; i += 1) {
        const value = dataArray[i] / 255;
        const barHeight = Math.max(value * height, 2);
        ctx.fillStyle = `rgba(0, 245, 212, ${0.25 + value * 0.6})`;
        ctx.shadowColor = "rgba(255, 0, 110, 0.25)";
        ctx.shadowBlur = 12;
        ctx.fillRect(i * barWidth + 2, height - barHeight, barWidth - 4, barHeight);
      }

      rafId = requestAnimationFrame(renderFrame);
    };

    renderFrame();

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeFrame) {
        cancelAnimationFrame(resizeFrame);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [analyser, bars]);

  return (
    <motion.div
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-xl border border-zinc-800/70 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-800 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="visualizer-canvas h-32 w-full"
        aria-label="Waveform visualizer"
      />
      {!analyser && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.25em] text-zinc-500/80">
          Idle Visualizer
        </div>
      )}
    </motion.div>
  );
}
