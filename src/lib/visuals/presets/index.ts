/**
 * Preset Registry
 * Central export for all visualizer presets
 */

import splatterNeon from './splatterNeon';
import neonField from './neonField';
import inkDripPulse from './inkDripPulse';
import type { EngineState } from '../engine';

export interface Preset {
  id: string;
  name: string;
  render: (ctx: CanvasRenderingContext2D, state: EngineState, dt: number) => void;
  reset: () => void;
}

export const presets: Preset[] = [splatterNeon, neonField, inkDripPulse];

export function getPresetById(id: string): Preset | undefined {
  return presets.find((p) => p.id === id);
}

export function getDefaultPreset(): Preset {
  return presets[0];
}
