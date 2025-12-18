'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Heart, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  coverArt?: string;
}

interface TrackCardProps {
  track: Track;
  isPlaying: boolean;
  onPlay: () => void;
}

function TrackCard({ track, isPlaying, onPlay }: TrackCardProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState(false);
  const [showSplatter, setShowSplatter] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Initialize wavesurfer.js
    if (waveformRef.current) {
      // Placeholder for actual wavesurfer initialization
      // In a real implementation, this would use WaveSurfer.create()
      const ctx = document.createElement('canvas').getContext('2d');
      if (ctx) {
        const canvas = waveformRef.current.querySelector('canvas') || document.createElement('canvas');
        canvas.width = waveformRef.current.clientWidth;
        canvas.height = 60;
        if (!waveformRef.current.querySelector('canvas')) {
          waveformRef.current.appendChild(canvas);
        }
        
        const canvasCtx = canvas.getContext('2d');
        if (canvasCtx) {
          // Draw gradient waveform
          const gradient = canvasCtx.createLinearGradient(0, 0, canvas.width, 0);
          gradient.addColorStop(0, '#00f5d4');
          gradient.addColorStop(1, '#ff006e');
          
          canvasCtx.fillStyle = gradient;
          
          // Draw waveform bars
          const bars = 100;
          const barWidth = canvas.width / bars;
          for (let i = 0; i < bars; i++) {
            const height = Math.random() * 40 + 10;
            const x = i * barWidth;
            const y = (canvas.height - height) / 2;
            canvasCtx.fillRect(x, y, barWidth * 0.8, height);
          }
        }
      }
    }
  }, []);

  const handleActionClick = (e: React.MouseEvent, action: 'like' | 'share') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setShowSplatter({ x, y });
    setTimeout(() => setShowSplatter(null), 600);
    
    if (action === 'like') {
      setLiked(!liked);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-4 transition-all hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10"
    >
      {/* Track Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-14 w-14 rounded-md bg-gradient-to-br from-piko-teal to-piko-pink flex-shrink-0 flex items-center justify-center">
          <button
            onClick={onPlay}
            className="transition-transform hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-white" fill="currentColor" />
            ) : (
              <Play className="h-6 w-6 text-white" fill="currentColor" />
            )}
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-zinc-100 truncate">
            {track.title}
          </h3>
          <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
          <p className="text-xs text-zinc-500">{track.duration}</p>
        </div>
      </div>

      {/* Waveform */}
      <div ref={waveformRef} className="h-15 rounded bg-zinc-950/50 mb-3 overflow-hidden" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => handleActionClick(e, 'like')}
          className="relative flex items-center gap-1 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 text-xs text-zinc-300 transition-all hover:border-piko-pink hover:text-piko-pink overflow-hidden"
        >
          <Heart className={`h-4 w-4 ${liked ? 'fill-piko-pink text-piko-pink' : ''}`} />
          <span>Like</span>
          
          {/* Paint Splatter Animation */}
          <AnimatePresence>
            {showSplatter && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute pointer-events-none"
                style={{
                  left: showSplatter.x,
                  top: showSplatter.y,
                  width: '40px',
                  height: '40px',
                  marginLeft: '-20px',
                  marginTop: '-20px',
                }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-piko-pink to-piko-orange" 
                  style={{
                    filter: 'blur(4px)',
                    clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
        
        <button
          onClick={(e) => handleActionClick(e, 'share')}
          className="relative flex items-center gap-1 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800/50 text-xs text-zinc-300 transition-all hover:border-piko-teal hover:text-piko-teal overflow-hidden"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function TrackList() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'Digital Dreams',
      artist: 'Piko FG',
      duration: '3:42',
    },
    {
      id: '2',
      title: 'Neon Nights',
      artist: 'Piko FG',
      duration: '4:15',
    },
    {
      id: '3',
      title: 'Cyber Soul',
      artist: 'Piko FG',
      duration: '3:28',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-zinc-100 mb-6">Featured Tracks</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            isPlaying={playingId === track.id}
            onPlay={() => setPlayingId(playingId === track.id ? null : track.id)}
          />
        ))}
      </div>
    </div>
  );
}
