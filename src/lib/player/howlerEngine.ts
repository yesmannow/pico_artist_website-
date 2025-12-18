/**
 * Howler.js audio engine
 * Handles actual audio playback and syncs with playerStore
 */

import { Howl } from 'howler';
import type { Track } from '@/data/tracks';
import type { PlaybackSource } from '@/store/playerStore';

interface HowlerEngineCallbacks {
  onLoad?: (duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
  onSeek?: () => void;
  onError?: (error: Error) => void;
}

class HowlerEngine {
  private howl: Howl | null = null;
  private animationFrame: number | null = null;
  private callbacks: HowlerEngineCallbacks = {};
  private currentTrack: Track | null = null;
  private currentSource: PlaybackSource = 'preview';

  /**
   * Initialize a new Howl instance for a track
   */
  init(track: Track, source: PlaybackSource, callbacks: HowlerEngineCallbacks): void {
    // Clean up previous instance
    this.cleanup();

    this.currentTrack = track;
    this.currentSource = source;
    this.callbacks = callbacks;

    const url = source === 'full' && track.fullUrl ? track.fullUrl : track.previewUrl;

    this.howl = new Howl({
      src: [url],
      html5: true,
      preload: true,
      onload: () => {
        if (this.howl) {
          const duration = this.howl.duration();
          this.callbacks.onLoad?.(duration);
        }
      },
      onplay: () => {
        this.callbacks.onPlay?.();
        this.startTimeUpdates();
      },
      onpause: () => {
        this.callbacks.onPause?.();
        this.stopTimeUpdates();
      },
      onend: () => {
        this.callbacks.onEnd?.();
        this.stopTimeUpdates();
      },
      onseek: () => {
        this.callbacks.onSeek?.();
      },
      onloaderror: (_id, error) => {
        this.callbacks.onError?.(new Error(`Failed to load audio: ${error}`));
      },
      onplayerror: (_id, error) => {
        this.callbacks.onError?.(new Error(`Failed to play audio: ${error}`));
      },
    });
  }

  /**
   * Play the current track
   */
  play(): void {
    if (this.howl && !this.howl.playing()) {
      this.howl.play();
    }
  }

  /**
   * Pause the current track
   */
  pause(): void {
    if (this.howl && this.howl.playing()) {
      this.howl.pause();
    }
  }

  /**
   * Stop the current track
   */
  stop(): void {
    if (this.howl) {
      this.howl.stop();
      this.stopTimeUpdates();
    }
  }

  /**
   * Seek to a specific time in seconds
   */
  seek(seconds: number): void {
    if (this.howl) {
      this.howl.seek(seconds);
    }
  }

  /**
   * Set volume (0 to 1)
   */
  setVolume(volume: number): void {
    if (this.howl) {
      this.howl.volume(volume);
    }
  }

  /**
   * Get current playback time
   */
  getCurrentTime(): number {
    if (this.howl) {
      return this.howl.seek() as number;
    }
    return 0;
  }

  /**
   * Get duration
   */
  getDuration(): number {
    if (this.howl) {
      return this.howl.duration();
    }
    return 0;
  }

  /**
   * Check if currently playing
   */
  isPlaying(): boolean {
    return this.howl?.playing() ?? false;
  }

  /**
   * Start updating current time via requestAnimationFrame
   */
  private startTimeUpdates(): void {
    this.stopTimeUpdates();
    
    const update = () => {
      if (this.howl && this.howl.playing()) {
        const time = this.howl.seek() as number;
        // Call onSeek to notify about time update
        this.callbacks.onSeek?.();
        this.animationFrame = requestAnimationFrame(update);
      }
    };
    
    this.animationFrame = requestAnimationFrame(update);
  }

  /**
   * Stop time updates
   */
  private stopTimeUpdates(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Clean up and unload current Howl instance
   */
  cleanup(): void {
    this.stopTimeUpdates();
    if (this.howl) {
      this.howl.unload();
      this.howl = null;
    }
    this.currentTrack = null;
    this.callbacks = {};
  }

  /**
   * Get current track info
   */
  getCurrentTrack(): { track: Track | null; source: PlaybackSource } {
    return {
      track: this.currentTrack,
      source: this.currentSource,
    };
  }

  /**
   * Get the internal audio element when using html5 mode
   * Returns null if not using html5 or if Howl is not initialized
   */
  getMediaElement(): HTMLMediaElement | null {
    if (!this.howl) return null;
    
    try {
      // Howler stores sounds internally - when using html5 mode, each sound has an audio element
      // WARNING: Accessing private API - may break in future Howler versions
      const sounds = (this.howl as unknown as { _sounds?: Array<{ _node?: HTMLMediaElement }> })._sounds;
      if (sounds && sounds.length > 0 && sounds[0]._node) {
        return sounds[0]._node;
      }
    } catch {
      // Ignore errors when accessing private API
    }
    
    return null;
  }
}

// Export singleton instance
export const howlerEngine = new HowlerEngine();
