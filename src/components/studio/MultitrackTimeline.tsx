'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Volume2 from 'lucide-react/dist/esm/icons/volume-2';
import VolumeX from 'lucide-react/dist/esm/icons/volume-x';
import Headphones from 'lucide-react/dist/esm/icons/headphones';
import Trash2 from 'lucide-react/dist/esm/icons/trash-2';
import { useStudioLocalStore } from '@/store/studioLocalStore';
import WaveSurfer from 'wavesurfer.js';

interface MultitrackTimelineProps {
  className?: string;
}

export default function MultitrackTimeline({ className }: MultitrackTimelineProps) {
  const {
    tracks,
    isPlaying,
    isRecording,
    selectedTrackId,
    currentTime,
    setCurrentTime,
    removeTrack,
    toggleMute,
    toggleSolo,
    setSelectedTrack,
  } = useStudioLocalStore();

  const waveformRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const wavesurfers = useRef<Map<string, WaveSurfer>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize WaveSurfer instances
  useEffect(() => {
    const waveSurferMap = wavesurfers.current;
    tracks.forEach((track) => {
      const container = waveformRefs.current.get(track.id);
      if (!container || waveSurferMap.has(track.id)) return;

      const wavesurfer = WaveSurfer.create({
        container,
        waveColor: '#00f5d4',
        progressColor: '#ff006e',
        cursorColor: '#ff9e00',
        barWidth: 2,
        barRadius: 1,
        height: 60,
        normalize: true,
        // Force MediaElement backend to avoid excessive decode/CPU spikes
        backend: 'MediaElement',
      });

      if (track.audioUrl) {
        wavesurfer.load(track.audioUrl);
      }

      wavesurfer.on('timeupdate', (time) => {
        setCurrentTime(time);
      });

      waveSurferMap.set(track.id, wavesurfer);
    });

    return () => {
      waveSurferMap.forEach((ws) => ws.destroy());
      waveSurferMap.clear();
    };
  }, [tracks, setCurrentTime]);

  // Sync playback
  useEffect(() => {
    if (isPlaying) {
      wavesurfers.current.forEach((ws) => ws.play());
    } else {
      wavesurfers.current.forEach((ws) => ws.pause());
    }
  }, [isPlaying]);

  // Sync current time to all wavesurfers when changed externally (e.g., stop button)
  useEffect(() => {
    if (currentTime === 0) {
      wavesurfers.current.forEach((ws) => {
        ws.stop();
        ws.seekTo(0);
      });
    }
  }, [currentTime]);

  if (tracks.length === 0) {
    return (
      <div className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-8 text-center ${className}`}>
        <p className="text-zinc-400">No tracks loaded. Add a track to start mixing.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl overflow-hidden ${className}`}>
      {/* Recording Indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border-b border-red-500/50">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-semibold text-red-400">Recording</span>
        </div>
      )}

      {/* Track List */}
      <div className="divide-y divide-zinc-800" ref={containerRef}>
        {tracks.map((track, idx) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`group relative flex items-center gap-4 p-4 hover:bg-zinc-800/30 transition ${
              selectedTrackId === track.id ? 'bg-piko-teal/10 border-l-4 border-piko-teal' : ''
            }`}
            onClick={() => setSelectedTrack(track.id)}
          >
            {/* Track Controls */}
            <div className="flex flex-col items-center gap-2 min-w-[120px]">
              <p className="text-xs text-zinc-400 font-mono">Track {idx + 1}</p>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute(track.id);
                  }}
                  className={`p-2 rounded ${
                    track.muted ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {track.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSolo(track.id);
                  }}
                  className={`p-2 rounded ${
                    track.solo ? 'bg-piko-orange/20 text-piko-orange' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  <Headphones className="h-4 w-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTrack(track.id);
                  }}
                  className="p-2 rounded bg-zinc-800 text-zinc-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Waveform */}
            <div className="flex-1 min-h-[60px]">
              <div
                ref={(el) => {
                  if (el) waveformRefs.current.set(track.id, el);
                }}
                className="w-full h-full"
              />
            </div>

            {/* Track Info */}
            <div className="min-w-[150px] text-right">
              <p className="text-sm font-semibold text-zinc-100">{track.name}</p>
              <p className="text-xs text-zinc-400">{track.duration.toFixed(2)}s</p>
              {track.clips.length > 0 && (
                <p className="text-xs text-piko-teal mt-1">{track.clips.length} clip{track.clips.length > 1 ? 's' : ''}</p>
              )}
              <div className="mt-2 flex items-center justify-end gap-2">
                <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-piko-teal to-piko-pink"
                    style={{ width: `${track.volume * 100}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 w-8">{Math.round(track.volume * 100)}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
