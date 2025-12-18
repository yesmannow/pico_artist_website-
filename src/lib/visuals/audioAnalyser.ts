/**
 * Audio Analyser Integration
 * Attempts to connect to Howler audio stream for frequency analysis
 * Supports both Howler's Web Audio API and MediaElement sources
 * Falls back to null if unavailable
 */

import { Howl } from 'howler';

interface AudioData {
  level: number; // 0..1 - overall volume
  bass: number; // 0..1 - low frequencies
  mid: number; // 0..1 - mid frequencies
  treble: number; // 0..1 - high frequencies
}

// Singleton AudioContext for the entire app
let sharedAudioContext: AudioContext | null = null;

/**
 * Get or create the shared AudioContext
 */
function getSharedAudioContext(): AudioContext | null {
  if (sharedAudioContext && sharedAudioContext.state !== 'closed') {
    return sharedAudioContext;
  }
  
  try {
    // Try to get Howler's context first for consistency
    const howlerCtx = (Howl as unknown as { _audioContext?: AudioContext })._audioContext;
    if (howlerCtx && howlerCtx instanceof AudioContext && howlerCtx.state !== 'closed') {
      sharedAudioContext = howlerCtx;
      return sharedAudioContext;
    }
    
    // Create a new AudioContext if Howler's isn't available
    sharedAudioContext = new AudioContext();
    return sharedAudioContext;
  } catch {
    return null;
  }
}

/**
 * Audio analyser that connects to Howler's audio context
 * Supports both standard Web Audio and MediaElement sources (html5 mode)
 */
export class AudioAnalyser {
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private audioContext: AudioContext | null = null;
  private mediaElementSource: MediaElementAudioSourceNode | null = null;
  private connectedMediaElement: HTMLMediaElement | null = null;
  private smoothedLevel = 0;
  private smoothedBass = 0;
  private smoothedMid = 0;
  private smoothedTreble = 0;
  private smoothing = 0.7;

  /**
   * Try to initialize analyser from Howler's audio context
   * NOTE: This accesses Howler's private API (_audioContext, _masterGain)
   * which may change in future versions. The implementation includes
   * fallback handling if these internals are unavailable.
   */
  init(): boolean {
    try {
      // Get or create AudioContext
      const ctx = getSharedAudioContext();
      
      if (!ctx) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AudioAnalyser] No AudioContext available');
        }
        return false;
      }

      this.audioContext = ctx;

      // Create analyser
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      // Try to connect to Howler's master gain node
      const masterGain = (Howl as unknown as { _masterGain?: GainNode })._masterGain;
      
      if (masterGain) {
        // Standard Web Audio path - connect master gain to analyser
        masterGain.connect(this.analyser);
        if (process.env.NODE_ENV === 'development') {
          console.log('[AudioAnalyser] Connected via Howler master gain');
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AudioAnalyser] No master gain - will try MediaElement bridge on demand');
        }
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[AudioAnalyser] Successfully initialized');
      }

      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AudioAnalyser] Failed to initialize:', error);
      }
      return false;
    }
  }

  /**
   * Connect a media element to the analyser (for MediaElement backend)
   * This creates a bridge between HTML5 audio and Web Audio API
   */
  connectMediaElement(mediaElement: HTMLMediaElement): boolean {
    if (!this.audioContext || !this.analyser) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AudioAnalyser] Cannot connect media element - analyser not initialized');
      }
      return false;
    }

    try {
      // Resume audio context if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      // Check if this is the same element already connected
      if (this.connectedMediaElement === mediaElement && this.mediaElementSource) {
        return true;
      }

      // Set crossOrigin for CORS compliance (only if not already set)
      // This is required for Web Audio API to access the audio data
      if (!mediaElement.crossOrigin) {
        mediaElement.crossOrigin = 'anonymous';
      }

      // A media element can only be connected to one MediaElementAudioSourceNode
      // If we already have a source connected to a different element, we cannot disconnect
      // and reconnect (Web Audio limitation). Return false to indicate connection failure.
      if (this.mediaElementSource && this.connectedMediaElement !== mediaElement) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AudioAnalyser] Cannot reconnect - previous element still connected');
        }
        return false;
      }

      // Create MediaElementAudioSourceNode
      this.mediaElementSource = this.audioContext.createMediaElementSource(mediaElement);
      this.connectedMediaElement = mediaElement;
      
      // Connect to analyser
      this.mediaElementSource.connect(this.analyser);
      
      // Connect to destination so audio still plays
      this.mediaElementSource.connect(this.audioContext.destination);

      if (process.env.NODE_ENV === 'development') {
        console.log('[AudioAnalyser] MediaElement bridge connected');
      }

      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AudioAnalyser] Failed to connect media element:', error);
      }
      return false;
    }
  }

  /**
   * Get the AudioContext for external use
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Get the AnalyserNode for external use
   */
  getAnalyserNode(): AnalyserNode | null {
    return this.analyser;
  }

  /**
   * Get current audio data
   * Returns null if analyser not available
   */
  getAudioFrame(): AudioData | null {
    if (!this.analyser || !this.dataArray) {
      return null;
    }

    try {
      // Get frequency data
      this.analyser.getByteFrequencyData(this.dataArray);

      const length = this.dataArray.length;
      
      // Calculate average level
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += this.dataArray[i];
      }
      const avgLevel = sum / length / 255;

      // Split into frequency bands (bass, mid, treble)
      const bassEnd = Math.floor(length * 0.15); // ~0-300Hz
      const midEnd = Math.floor(length * 0.5); // ~300-2000Hz
      
      let bassSum = 0;
      for (let i = 0; i < bassEnd; i++) {
        bassSum += this.dataArray[i];
      }
      const bass = bassSum / bassEnd / 255;

      let midSum = 0;
      for (let i = bassEnd; i < midEnd; i++) {
        midSum += this.dataArray[i];
      }
      const mid = midSum / (midEnd - bassEnd) / 255;

      let trebleSum = 0;
      for (let i = midEnd; i < length; i++) {
        trebleSum += this.dataArray[i];
      }
      const treble = trebleSum / (length - midEnd) / 255;

      // Apply smoothing
      this.smoothedLevel = this.smoothedLevel * this.smoothing + avgLevel * (1 - this.smoothing);
      this.smoothedBass = this.smoothedBass * this.smoothing + bass * (1 - this.smoothing);
      this.smoothedMid = this.smoothedMid * this.smoothing + mid * (1 - this.smoothing);
      this.smoothedTreble = this.smoothedTreble * this.smoothing + treble * (1 - this.smoothing);

      return {
        level: this.smoothedLevel,
        bass: this.smoothedBass,
        mid: this.smoothedMid,
        treble: this.smoothedTreble,
      };
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AudioAnalyser] Error getting audio frame:', error);
      }
      return null;
    }
  }

  /**
   * Clean up analyser
   */
  destroy() {
    if (this.mediaElementSource) {
      try {
        this.mediaElementSource.disconnect();
      } catch {
        // Ignore errors on disconnect
      }
      this.mediaElementSource = null;
    }
    this.connectedMediaElement = null;
    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch {
        // Ignore errors on disconnect
      }
      this.analyser = null;
    }
    this.dataArray = null;
    this.audioContext = null;
  }
}

/**
 * Create a new audio analyser instance
 */
export function createAudioAnalyser(): AudioAnalyser | null {
  const analyser = new AudioAnalyser();
  const success = analyser.init();
  
  if (!success) {
    analyser.destroy();
    return null;
  }
  
  return analyser;
}
