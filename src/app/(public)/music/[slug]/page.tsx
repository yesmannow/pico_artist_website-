/**
 * Track Detail Page
 * Shows individual track with waveform, full playback option, and links
 */

'use client';

import { use, useMemo, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getTrackBySlug, getTracks } from '@/data/tracks';
import { usePlayerStore } from '@/store/playerStore';
import Waveform from '@/components/player/Waveform';
import CinematicHero from '@/components/media/CinematicHero';
import VisualizerStage from '@/components/player/VisualizerStage';
import ShareButtons from '@/components/ui/ShareButtons';
import { useIdle } from '@/hooks/useIdle';
import Play from 'lucide-react/dist/esm/icons/play';
import Pause from 'lucide-react/dist/esm/icons/pause';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';

interface TrackDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function TrackDetailPage({ params }: TrackDetailPageProps) {
  const { slug } = use(params);
  const track = getTrackBySlug(slug);

  if (!track) {
    notFound();
  }

  const {
    current,
    isPlaying,
    currentTime,
    source,
    playTrack,
    togglePlay,
    seek,
  } = usePlayerStore();
  const [stageMode, setStageMode] = useState(false);
  const isIdle = useIdle();

  const isCurrentTrack = current?.id === track.id;
  const isCurrentPlaying = isCurrentTrack && isPlaying;

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track, 'preview');
    }
  };

  const handlePlayFull = () => {
    if (!track.fullUrl) return;

    if (isCurrentTrack && source === 'full') {
      togglePlay();
    } else {
      playTrack(track, 'full');
    }
  };

  const handleWaveformSeek = (time: number) => {
    seek(time);
  };

  const currentUrl = isCurrentTrack
    ? source === 'full' && track.fullUrl
      ? track.fullUrl
      : track.previewUrl
    : track.previewUrl;

  const heroImage = useMemo(
    () => track.coverArt || '/piko-logo.jpg',
    [track.coverArt]
  );

  // Get related tracks (other tracks excluding current one, limited to 5)
  const relatedTracks = useMemo(() => {
    try {
      const tracks = getTracks();
      if (!tracks || !Array.isArray(tracks)) {
        return [];
      }
      return tracks
        .filter((t) => t && t.id !== track.id)
        .slice(0, 5);
    } catch (error) {
      console.error('Error loading related tracks:', error);
      return [];
    }
  }, [track.id]);

  const dimUI = isIdle && isCurrentPlaying;

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <Link
          href="/music"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-piko-teal transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Music
        </Link>
      </div>

      <CinematicHero
        title={track.title}
        subtitle={track.artist}
        backgroundImageUrl={heroImage}
        align="left"
        variant="music"
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 transition-opacity duration-300" style={{ opacity: dimUI ? 0.65 : 1 }}>
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={handlePlay}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-piko-teal text-white font-semibold hover:bg-piko-teal/80 transition shadow-lg shadow-piko-teal/15"
          >
            {isCurrentPlaying && source === 'preview' ? (
              <>
                <Pause className="w-4 h-4" fill="currentColor" />
                Pause Preview
              </>
            ) : (
              <>
                <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                Play Preview
              </>
            )}
          </button>

          {track.fullUrl && (
            <button
              onClick={handlePlayFull}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-piko-pink bg-piko-pink/10 text-piko-pink font-semibold hover:bg-piko-pink/20 transition shadow-lg shadow-piko-pink/10"
            >
              {isCurrentPlaying && source === 'full' ? (
                <>
                  <Pause className="w-4 h-4" fill="currentColor" />
                  Pause Full Track
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
                  Play Full Track
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setStageMode((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition ${
              stageMode
                ? 'border-piko-teal bg-piko-teal/15 text-piko-teal shadow-[0_0_24px_rgba(0,245,212,0.25)]'
                : 'border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-piko-teal/60 hover:text-piko-teal'
            }`}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-piko-teal animate-pulse" />
            Stage Mode
          </button>

          <ShareButtons
            title={`${track.title} by ${track.artist}`}
            description={`Listen to ${track.title} by ${track.artist} on Piko FG Studio`}
          />

          <Link
            href="/visualizer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/70 text-zinc-300 hover:border-piko-teal hover:text-piko-teal transition text-sm"
          >
            <Sparkles className="w-4 h-4" />
            Visualizer Mode
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Waveform */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`relative rounded-xl border bg-zinc-900/60 backdrop-blur-xl p-6 overflow-hidden transition-all ${stageMode ? 'border-piko-teal/50 ring-1 ring-piko-teal/30 shadow-[0_0_45px_rgba(0,245,212,0.12)]' : 'border-zinc-800'}`}>
              {stageMode && (
                <VisualizerStage
                  active={stageMode}
                  isPlaying={isCurrentPlaying}
                  currentTime={currentTime}
                  className="opacity-90"
                  intensity={1.1}
                />
              )}
              <div className="relative">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-3">
                  <span>
                    {isCurrentTrack && source === 'full' && track.fullUrl
                      ? 'Full Track'
                      : 'Preview'}
                  </span>
                  {stageMode && <span className="text-xs uppercase tracking-[0.2em] text-piko-teal/80">Stage</span>}
                </h2>
                {isCurrentTrack ? (
                  <Waveform
                    url={currentUrl}
                    currentTime={currentTime}
                    onSeek={handleWaveformSeek}
                    height={stageMode ? 160 : 120}
                    className="mb-4"
                    isPlaying={isCurrentPlaying}
                  />
                ) : (
                  <div className="h-[120px] rounded-lg bg-zinc-950/50 flex items-center justify-center text-zinc-500">
                    Click play to load waveform
                  </div>
                )}
              </div>
            </div>

            {/* External Links */}
            {track.links && Object.values(track.links).some((link) => link) && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Listen Elsewhere
                </h2>
                <div className="flex flex-wrap gap-3">
                  {track.links.spotify && (
                    <a
                      href={track.links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-green-500 hover:text-green-500 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Spotify
                    </a>
                  )}
                  {track.links.youtubeMusic && (
                    <a
                      href={track.links.youtubeMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-red-500 hover:text-red-500 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      YouTube Music
                    </a>
                  )}
                  {track.links.youtube && (
                    <a
                      href={track.links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-red-500 hover:text-red-500 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Related Tracks */}
          <div className="space-y-4 transition-opacity duration-300" style={{ opacity: stageMode ? 0.9 : 1 }}>
            {relatedTracks.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Related Tracks</h2>
                <div className="space-y-3">
                  {relatedTracks.map((relatedTrack) => (
                    <Link
                      key={relatedTrack.id}
                      href={`/music/${relatedTrack.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/60 transition group"
                    >
                      <div className="w-10 h-10 rounded bg-zinc-800 flex-shrink-0 relative overflow-hidden">
                        <Image
                          src={relatedTrack.coverArt || '/piko-logo.jpg'}
                          alt={relatedTrack.title}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/40 to-piko-pink/40 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-piko-teal transition">
                          {relatedTrack.title}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {relatedTrack.artist}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {track.tags && track.tags.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-6">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {track.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm rounded-full bg-zinc-800/80 text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add bottom padding to account for PlayerDock */}
      <div className="h-32" />
    </div>
  );
}
