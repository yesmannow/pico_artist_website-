'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Square,
  Play,
  Pause,
  Download,
  Upload,
  Trash2,
  Music,
  Settings,
} from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import CanvasVisualizer from './CanvasVisualizer';
import { uploadTrack, type Track } from '@/lib/supabase';

interface StudioRecorderProps {
  backingTracks?: Track[];
}

export default function StudioRecorder({ backingTracks = [] }: StudioRecorderProps) {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioURL,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
    analyser,
  } = useAudioRecorder();

  const [selectedTrackUrl, setSelectedTrackUrl] = useState<string | null>(null);
  const [isPlayingBacking, setIsPlayingBacking] = useState(false);
  const [vibeEnabled, setVibeEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [trackTitle, setTrackTitle] = useState('');
  const [showSplatter, setShowSplatter] = useState<{ x: number; y: number } | null>(null);

  const backingAudioRef = useRef<HTMLAudioElement | null>(null);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (selectedTrackUrl && backingAudioRef.current) {
      backingAudioRef.current.src = selectedTrackUrl;
    }
  }, [selectedTrackUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRecord = async () => {
    if (isRecording) {
      stopRecording();
      if (isPlayingBacking && backingAudioRef.current) {
        backingAudioRef.current.pause();
        backingAudioRef.current.currentTime = 0;
        setIsPlayingBacking(false);
      }
    } else {
      await startRecording();
      // Start backing track if selected (overdub mode)
      if (selectedTrackUrl && backingAudioRef.current) {
        backingAudioRef.current.currentTime = 0;
        backingAudioRef.current.play();
        setIsPlayingBacking(true);
      }
    }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeRecording();
      if (backingAudioRef.current) {
        backingAudioRef.current.play();
      }
    } else {
      pauseRecording();
      if (backingAudioRef.current) {
        backingAudioRef.current.pause();
      }
    }
  };

  const handleDownload = () => {
    if (audioURL) {
      const a = document.createElement('a');
      a.href = audioURL;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    }
  };

  const handleUpload = async (e: React.MouseEvent) => {
    if (!audioBlob || !trackTitle) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setShowSplatter({ x, y });
    setTimeout(() => setShowSplatter(null), 600);

    setUploading(true);
    try {
      const file = new File([audioBlob], `${trackTitle}.webm`, { type: 'audio/webm' });
      await uploadTrack(file, {
        title: trackTitle,
        artist: 'Piko FG',
        duration: formatTime(recordingTime),
        likes: 0,
      });
      alert('Track uploaded successfully!');
      clearRecording();
      setTrackTitle('');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload track');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Backing Track Selector */}
      {backingTracks.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Music className="h-5 w-5 text-piko-orange" />
            <h3 className="text-lg font-semibold text-zinc-100">Overdub Mode</h3>
          </div>
          <select
            value={selectedTrackUrl || ''}
            onChange={(e) => setSelectedTrackUrl(e.target.value || null)}
            disabled={isRecording}
            className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 focus:border-piko-teal focus:outline-none disabled:opacity-50"
          >
            <option value="">No backing track</option>
            {backingTracks.map((track) => (
              <option key={track.id} value={track.audio_url || ''}>
                {track.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Recording Interface */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6">
        {/* Visualizer */}
        <div className="mb-6 rounded-lg overflow-hidden border border-zinc-800 h-48">
          <CanvasVisualizer analyser={analyser} isActive={isRecording && !isPaused} />
        </div>

        {/* Recording Timer */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800/50 border border-zinc-700">
            {isRecording && !isPaused && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-3 h-3 rounded-full bg-red-500"
              />
            )}
            <span className="text-3xl font-mono font-bold text-zinc-100">
              {formatTime(recordingTime)}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRecord}
            className={`rounded-full p-6 shadow-lg transition-all ${
              isRecording
                ? 'bg-red-500 shadow-red-500/30 hover:shadow-red-500/50'
                : 'bg-gradient-to-r from-piko-teal to-piko-pink shadow-piko-pink/30 hover:shadow-piko-pink/50'
            }`}
          >
            {isRecording ? (
              <Square className="h-8 w-8 text-white" fill="currentColor" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </motion.button>

          {isRecording && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePauseResume}
              className="rounded-full p-6 bg-zinc-800 shadow-lg transition-all hover:bg-zinc-700"
            >
              {isPaused ? (
                <Play className="h-8 w-8 text-piko-teal" fill="currentColor" />
              ) : (
                <Pause className="h-8 w-8 text-piko-teal" fill="currentColor" />
              )}
            </motion.button>
          )}

          {/* Vibe Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setVibeEnabled(!vibeEnabled)}
            className={`rounded-full p-4 border-2 transition-all ${
              vibeEnabled
                ? 'border-piko-pink bg-piko-pink/20 shadow-lg shadow-piko-pink/30'
                : 'border-zinc-700 bg-zinc-800/50'
            }`}
          >
            <Settings className="h-6 w-6 text-zinc-100" />
          </motion.button>
        </div>

        {/* Recorded Audio Controls */}
        <AnimatePresence>
          {audioURL && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4"
            >
              <audio ref={recordedAudioRef} src={audioURL} controls className="w-full" />

              <div className="space-y-3">
                <input
                  type="text"
                  value={trackTitle}
                  onChange={(e) => setTrackTitle(e.target.value)}
                  placeholder="Track title..."
                  className="w-full px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder-zinc-500 focus:border-piko-pink focus:outline-none"
                />

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 transition-all hover:border-piko-teal hover:text-piko-teal"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpload}
                    disabled={uploading || !trackTitle}
                    className="relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-piko-teal to-piko-pink text-white shadow-lg shadow-piko-pink/20 transition-all hover:shadow-piko-pink/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <Upload className="h-5 w-5" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>

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
                            width: '60px',
                            height: '60px',
                            marginLeft: '-30px',
                            marginTop: '-30px',
                          }}
                        >
                          <div
                            className="w-full h-full rounded-full bg-gradient-to-br from-piko-orange to-white"
                            style={{
                              filter: 'blur(6px)',
                              clipPath:
                                'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearRecording}
                    className="px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800/50 text-red-400 transition-all hover:border-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hidden audio element for backing track */}
      <audio ref={backingAudioRef} className="hidden" />
    </div>
  );
}
