/**
 * Audio Analyser Integration
 * Attempts to connect to Howler audio stream for frequency analysis
 * Falls back to null if unavailable
 */

import { Howl } from 'howler';

interface AudioData {
  level: number; // 0..1 - overall volume
  bass: number; // 0..1 - low frequencies
  mid: number; // 0..1 - mid frequencies
  treble: number; // 0..1 - high frequencies
}

/**
 * Audio analyser that connects to Howler's audio context
 */
export class AudioAnalyser {
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private smoothedLevel = 0;
  private smoothedBass = 0;
  private smoothedMid = 0;
  private smoothedTreble = 0;
  private smoothing = 0.7;

  /**
   * Try to initialize analyser from Howler's audio context
   */
  init(): boolean {
    try {
      // Howler uses a global audio context
      const ctx = (Howl as any)._audioContext;
      
      if (!ctx || !(ctx instanceof AudioContext)) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AudioAnalyser] No AudioContext available from Howler');
        }
        return false;
      }

      // Try to get master gain node from Howler
      const masterGain = (Howl as any)._masterGain;
      
      if (!masterGain) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AudioAnalyser] No master gain node available');
        }
        return false;
      }

      // Create analyser
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);

      // Connect master gain to analyser (and keep it connected to destination)
      masterGain.connect(this.analyser);

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
    if (this.analyser) {
      try {
        this.analyser.disconnect();
      } catch (e) {
        // Ignore errors on disconnect
      }
      this.analyser = null;
    }
    this.dataArray = null;
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
