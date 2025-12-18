# Phase 3: Visualizer System Documentation

## Overview

The Phase 3 visualizer system provides a production-ready, audio-reactive visual experience for the Piko FG artist website. It combines paint-splatter/ink aesthetics with neon/cyber glow effects to create an immersive full-screen visualizer that reacts to music playback.

## Architecture

### Core Components

1. **Visual Engine** (`src/lib/visuals/engine.ts`)
   - Manages canvas rendering lifecycle
   - Handles device pixel ratio (DPR) for sharp rendering
   - Implements performance optimizations (quality scaling, visibility detection)
   - Provides requestAnimationFrame-based render loop
   - Supports prefers-reduced-motion

2. **Audio Analyser** (`src/lib/visuals/audioAnalyser.ts`)
   - Attempts to connect to Howler's Web Audio API context
   - Provides frequency analysis (bass, mid, treble)
   - **Graceful fallback**: Returns null if analyser unavailable
   - Smooths audio data to prevent jittery visuals

3. **Visualizer Canvas** (`src/components/visuals/VisualizerCanvas.tsx`)
   - React component wrapping the engine
   - Integrates with playerStore for playback state
   - Handles SSR safety
   - Manages engine lifecycle (init/destroy)

4. **Presets** (`src/lib/visuals/presets/`)
   - Modular visual effects that can be switched
   - Each preset is self-contained with its own state
   - Three included presets: Splatter Neon, Neon Field, Ink Drip Pulse

### Routes

- **`/visualizer`** - Full-screen visualizer experience with overlay controls

### Entry Points

- **PlayerDock** - Sparkles icon button in bottom player
- **Music Detail Page** - "Visualizer Mode" button near track controls

## How Audio-Reactive Fallback Works

The visualizer has two modes:

### Enhanced Mode (Audio-Reactive)
When the audio analyser successfully connects to Howler's AudioContext:
- Reads real-time frequency data (bass, mid, treble)
- Visuals respond directly to music frequencies
- Bass drives large movements (splashes, pulses)
- Treble drives sparkles and highlights
- Mid frequencies drive secondary animations

### Fallback Mode (Time-Based)
When audio analyser is unavailable (most common scenarios):
- Uses time-based sine/cosine waves for animation
- Reacts to player state (isPlaying, trackProgress)
- Still provides smooth, aesthetically pleasing visuals
- No degradation in visual quality, just different behavior
- **Never crashes** - visuals always work

The fallback is automatic and transparent to the user.

## Presets

### 1. Splatter Neon
**File**: `src/lib/visuals/presets/splatterNeon.ts`

**Aesthetic**: Explosive ink splashes with neon glow

**Features**:
- Paint splashes spawn based on bass energy
- Neon drip lines based on treble
- Radial gradients for glow effects
- Splatter dots around main splashes
- Progress bar with gradient at bottom

**Best for**: High-energy tracks, hip-hop, trap

### 2. Neon Field
**File**: `src/lib/visuals/presets/neonField.ts`

**Aesthetic**: Soft cyber grid with waveform ribbon

**Features**:
- Animated grid that pulses with audio
- Central waveform ribbon using sine waves
- Floating particles
- Corner progress dots
- Smooth, flowing motion

**Best for**: Electronic, ambient, chill tracks

### 3. Ink Drip Pulse
**File**: `src/lib/visuals/presets/inkDripPulse.ts`

**Aesthetic**: Slow ink diffusion with drip lines

**Features**:
- Ink blobs that grow and fade
- Vertical drip lines (some neon, some white)
- Pulsing based on audio
- Trail effect (doesn't fully clear canvas)
- Vertical progress bar on left

**Best for**: Moody tracks, slow jams, atmospheric music

## How to Add a New Preset

### Step 1: Create Preset File

Create a new file in `src/lib/visuals/presets/yourPresetName.ts`:

```typescript
import type { EngineState } from '../engine';

// State variables (persistent across frames)
let myState: any = {};

/**
 * Reset state when preset changes
 */
export function reset() {
  myState = {};
}

/**
 * Render function called every frame
 */
export function render(
  ctx: CanvasRenderingContext2D,
  state: EngineState,
  dt: number
) {
  const { width, height, colors, intensity, trackProgress, isPlaying, audio } = state;
  
  // Clear canvas
  ctx.fillStyle = colors.inkBlack;
  ctx.fillRect(0, 0, width, height);
  
  // Your visual logic here
  // Use audio?.bass, audio?.mid, audio?.treble if available
  // Fall back to state.time for time-based animations
  
  // Example: Draw a pulsing circle
  const pulse = audio?.level || Math.sin(state.time * 2) * 0.5 + 0.5;
  const radius = 50 + pulse * 100 * intensity;
  
  ctx.fillStyle = colors.neonTeal;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Reset alpha
  ctx.globalAlpha = 1;
}

export default {
  id: 'yourPresetName',
  name: 'Your Preset Name',
  render,
  reset,
};
```

### Step 2: Register Preset

Add your preset to `src/lib/visuals/presets/index.ts`:

```typescript
import yourPresetName from './yourPresetName';

export const presets: Preset[] = [
  splatterNeon,
  neonField,
  inkDripPulse,
  yourPresetName, // Add here
];
```

### Step 3: Test

1. Start dev server: `npm run dev`
2. Navigate to `/visualizer`
3. Use preset switcher to cycle through presets
4. Verify your preset appears and renders correctly

## Performance Considerations

### Quality Scaling
The engine automatically scales rendering quality based on:
- Device memory (if available via Navigator API)
- Screen size
- User's `prefers-reduced-motion` setting

### Optimizations
- Canvas pauses when tab is hidden (visibility API)
- Render loop uses requestAnimationFrame
- DPR capped at 2x to prevent excessive resolution
- Particle limits enforced based on device capabilities

### Reduced Motion
When user has `prefers-reduced-motion: reduce`:
- Particle count reduced to 100 (from 500)
- Motion scale reduced to 50%
- All animations still work but are gentler

## Keyboard Shortcuts

When on `/visualizer`:
- **ESC** - Exit visualizer and return to last page
- **SPACE** - Toggle play/pause
- **← / →** - Seek backward/forward by 5 seconds

## Integration with Player

The visualizer integrates seamlessly with the existing player system:

### State Sync
- Reads from `playerStore` (isPlaying, currentTime, duration, current track)
- Updates in real-time as playback state changes
- No duplicate player controls - shares global state

### Audio Engine
- Attempts to tap into Howler's AudioContext
- Does not interfere with playback
- Falls back gracefully if connection fails

## Cloudflare Compatibility

The visualizer is **fully compatible** with Cloudflare Pages deployment:

- ✅ No Node.js-only APIs
- ✅ Pure client-side rendering
- ✅ Uses Web Audio API (browser standard)
- ✅ Canvas 2D API (browser standard)
- ✅ No server-side requirements
- ✅ Builds successfully with OpenNext

Verified with both:
- `npm run build`
- `npm run build:cloudflare`

## Troubleshooting

### Visualizer shows no audio reactivity
**Cause**: Audio analyser failed to connect to Howler's AudioContext

**Solution**: This is expected behavior. The visualizer automatically falls back to time-based animation. Visuals will still look great, just won't respond to specific frequencies.

### Canvas appears blurry
**Cause**: Device has high pixel ratio but quality scaling reduced it

**Solution**: This is intentional for performance. Quality scaling can be adjusted in `engine.ts` if needed.

### Performance issues on mobile
**Cause**: High particle counts or screen resolution

**Solution**: The engine already scales quality down on low-memory devices. Check `calculateQualitySettings()` in `engine.ts` to adjust thresholds.

### Visualizer route returns 404
**Cause**: Build didn't include the route

**Solution**: 
1. Check `src/app/(public)/visualizer/page.tsx` exists
2. Rebuild: `npm run build`
3. Verify route appears in build output

## Future Enhancements

Potential improvements for future phases:

1. **More Presets** - Add community-submitted presets
2. **Preset Parameters** - Allow users to customize presets
3. **Recording** - Capture visualizer as video
4. **Shader Support** - Add WebGL for more complex effects
5. **MIDI Support** - React to MIDI controller inputs
6. **Beat Detection** - Smarter bass/beat detection algorithms
7. **Custom Colors** - Let users choose color schemes
8. **Mobile Optimization** - Touch controls, better mobile layouts

## Credits

- **Visual Engine**: Custom-built for Piko FG
- **Audio Analysis**: Web Audio API
- **Color Scheme**: Piko FG brand palette (teal, pink, orange)
- **Aesthetic**: Digital graffiti / urban cyber fusion
