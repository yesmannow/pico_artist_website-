"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import Visualizer from "./Visualizer";

export type Track = {
  id: string;
  title: string;
  src: string;
  artist?: string;
};

type AudioPlayerProps = {
  tracks: Track[];
  initialIndex?: number;
  className?: string;
};

const VISIBLE_WINDOW = 6;

export default function AudioPlayer({
  tracks,
  initialIndex = 0,
  className = "",
}: AudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>();

  // Initialize audio graph once
  useEffect(() => {
    if (!tracks.length || typeof window === "undefined") return;

    const audio = new Audio(tracks[initialIndex]?.src ?? tracks[0].src);
    audio.crossOrigin = "anonymous";
    audio.preload = "metadata";
    audioRef.current = audio;

    const AudioContextCtor = (window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);

    if (AudioContextCtor) {
      const ctx = new AudioContextCtor();
      contextRef.current = ctx;
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      setAnalyserNode(analyser);
    }

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audio.src = "";
      cancelAnimationFrame(rafRef.current ?? 0);
      analyserRef.current?.disconnect();
      analyserRef.current = null;
      contextRef.current?.close();
    };
  }, [initialIndex, tracks]);

  // Update track source when the active track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !tracks[currentIndex]) return;

    audio.pause();
    audio.currentTime = 0;
    audio.src = tracks[currentIndex].src;
    audio.load();
    setProgress(0);

    if (isPlaying) {
      contextRef.current?.resume().catch(() => undefined);
      audio
        .play()
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [currentIndex, isPlaying, tracks]);

  // Sync progress with raf to avoid layout thrashing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const step = () => {
      const duration = audio.duration || 1;
      setProgress(duration ? audio.currentTime / duration : 0);
      rafRef.current = requestAnimationFrame(step);
    };

    if (isPlaying) {
      contextRef.current?.resume().catch(() => undefined);
      audio
        .play()
        .then(() => {
          rafRef.current = requestAnimationFrame(step);
        })
        .catch(() => setIsPlaying(false));
    } else {
      cancelAnimationFrame(rafRef.current ?? 0);
      audio.pause();
    }

    return () => cancelAnimationFrame(rafRef.current ?? 0);
  }, [isPlaying]);

  const handleToggle = () => {
    if (!tracks.length) return;
    setIsPlaying((prev) => !prev);
  };

  const handleSkip = (direction: 1 | -1) => {
    if (!tracks.length) return;
    setCurrentIndex((prev) => {
      const nextIndex = (prev + direction + tracks.length) % tracks.length;
      return nextIndex;
    });
    setIsPlaying(false);
  };

  const handleScrub = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const duration = audio.duration || 0;
    audio.currentTime = duration * value;
    setProgress(value);
  };

  const virtualTracks = useMemo(() => {
    if (!tracks.length) return [];
    const start = Math.max(0, currentIndex - 2);
    const end = Math.min(tracks.length, start + VISIBLE_WINDOW);
    return tracks.slice(start, end).map((track, sliceIndex) => ({
      track,
      absoluteIndex: start + sliceIndex,
    }));
  }, [currentIndex, tracks]);

  const hiddenCount = Math.max(tracks.length - virtualTracks.length, 0);
  const activeTrack = tracks[currentIndex];

  return (
    <div
      className={`relative flex flex-col gap-4 rounded-xl border border-zinc-800/60 bg-zinc-950/60 p-4 shadow-lg ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
            Now Playing
          </p>
          <p className="truncate text-lg font-semibold text-zinc-50">
            {activeTrack?.title ?? "Select a track"}
          </p>
          {activeTrack?.artist && (
            <p className="text-sm text-zinc-400">{activeTrack.artist}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSkip(-1)}
            className="rounded-full border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-200 transition hover:border-piko-teal hover:text-piko-teal"
            aria-label="Previous track"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleToggle}
            className="rounded-full border border-piko-pink/60 bg-piko-pink/20 px-4 py-2 text-sm font-semibold text-zinc-50 transition hover:border-piko-teal hover:bg-piko-teal/20"
            aria-label={isPlaying ? "Pause audio" : "Play audio"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => handleSkip(1)}
            className="rounded-full border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-200 transition hover:border-piko-teal hover:text-piko-teal"
            aria-label="Next track"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative h-2 overflow-hidden rounded-full bg-zinc-800/80">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-piko-teal to-piko-pink"
            style={{ width: `${Math.min(progress, 1) * 100}%` }}
            transition={{ duration: 0.15 }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={Number.isFinite(progress) ? progress : 0}
          onChange={(event) => handleScrub(Number(event.target.value))}
          className="w-full accent-piko-teal"
          aria-label="Scrub playback position"
        />
      </div>

      <Visualizer analyser={analyserNode} className="mt-1" />

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          <span>Virtualized Tracklist</span>
          <span>
            Showing {virtualTracks.length} / {tracks.length}
            {hiddenCount > 0 ? ` • ${hiddenCount} buffered` : ""}
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {virtualTracks.map(({ track, absoluteIndex }) => {
            const isActive = absoluteIndex === currentIndex;
            return (
              <button
                key={track.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(absoluteIndex);
                  setIsPlaying(false);
                }}
                className={`flex items-center justify-between rounded-lg border p-3 text-left transition ${
                  isActive
                    ? "border-piko-teal bg-piko-teal/10 text-zinc-50"
                    : "border-zinc-800/70 bg-zinc-900/50 text-zinc-200 hover:border-piko-teal/50"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{track.title}</p>
                  {track.artist && (
                    <p className="text-xs text-zinc-400">{track.artist}</p>
                  )}
                </div>
                <span className="text-xs text-zinc-400">
                  {isActive ? "Live" : "Static"}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
