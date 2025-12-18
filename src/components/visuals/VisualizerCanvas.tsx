/**
 * Visualizer Canvas Component
 * Full-screen canvas with audio-reactive visuals
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { createEngine } from '@/lib/visuals/engine';
import { createAudioAnalyser, AudioAnalyser } from '@/lib/visuals/audioAnalyser';
import { getPresetById, getDefaultPreset, type Preset } from '@/lib/visuals/presets';
import { getRandomBg } from '@/data/images';

interface VisualizerCanvasProps {
  presetId?: string;
  intensity?: number;
  audioReactive?: boolean;
  backgroundMode?: 'hero' | 'bg' | 'none';
  className?: string;
}

export default function VisualizerCanvas({
  presetId,
  intensity = 1,
  audioReactive = true,
  backgroundMode = 'bg',
  className = '',
}: VisualizerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ReturnType<typeof createEngine> | null>(null);
  const analyserRef = useRef<AudioAnalyser | null>(null);
  const currentPresetRef = useRef<Preset | null>(null);
  
  const [bgImage] = useState(() => backgroundMode !== 'none' ? getRandomBg() : null);
  
  const { isPlaying, currentTime, duration, current } = usePlayerStore();

  // Initialize engine and preset
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get preset
    const preset = presetId ? getPresetById(presetId) : getDefaultPreset();
    if (!preset) {
      console.error('Invalid preset ID:', presetId);
      return;
    }

    currentPresetRef.current = preset;
    preset.reset();

    // Create engine
    const engine = createEngine({
      canvas,
      render: (ctx, state, dt) => {
        if (currentPresetRef.current) {
          currentPresetRef.current.render(ctx, state, dt);
        }
      },
    });

    engineRef.current = engine;

    // Try to initialize audio analyser if requested
    if (audioReactive) {
      const analyser = createAudioAnalyser();
      if (analyser) {
        analyserRef.current = analyser;
        console.log('[VisualizerCanvas] Audio analyser initialized');
      } else {
        console.log('[VisualizerCanvas] Audio analyser not available, using fallback');
      }
    }

    engine.start();

    return () => {
      engine.destroy();
      if (analyserRef.current) {
        analyserRef.current.destroy();
        analyserRef.current = null;
      }
    };
  }, [presetId, audioReactive]);

  // Update engine state based on player and audio
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    // Calculate safe track progress
    const trackProgress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;

    // Get audio data if available
    const audioData = analyserRef.current?.getAudioFrame();

    // Update engine state
    engine.updateState({
      intensity,
      trackProgress,
      isPlaying,
      audio: audioData || undefined,
    });
  }, [intensity, isPlaying, currentTime, duration]);

  // Handle preset changes
  useEffect(() => {
    if (!currentPresetRef.current) return;
    
    const newPreset = presetId ? getPresetById(presetId) : getDefaultPreset();
    if (newPreset && newPreset.id !== currentPresetRef.current.id) {
      currentPresetRef.current.reset();
      currentPresetRef.current = newPreset;
      newPreset.reset();
    }
  }, [presetId]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      {/* Background image layer */}
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 blur-sm"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      
      {/* Canvas layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}
