/**
 * Unified Media Page
 * Single source of truth for Tracks and Videos
 * Tabs: Tracks | Videos
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { getTracks } from '@/data/tracks';
import { getVideos, type Video } from '@/data/videos';
import TrackList from '@/components/player/TrackList';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import Play from 'lucide-react/dist/esm/icons/play';
import Music from 'lucide-react/dist/esm/icons/music';
import Video from 'lucide-react/dist/esm/icons/video';
import BackgroundTexture from '@/components/ui/BackgroundTexture';
import CinematicHero from '@/components/media/CinematicHero';

type TabType = 'tracks' | 'videos';

function MediaContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('tracks');
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tracks = getTracks();
  const videos = getVideos();

  // Initialize featured video
  useEffect(() => {
    if (videos.length > 0 && !featuredVideo) {
      setFeaturedVideo(videos[0]);
    }
  }, [videos, featuredVideo]);

  // Handle URL params for tab
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab === 'videos') {
      setActiveTab('videos');
    } else if (tab === 'tracks') {
      setActiveTab('tracks');
    }
  }, [searchParams]);

  // Filter videos by tag
  const filteredVideos = selectedTag
    ? videos.filter((video) => video.tags?.includes(selectedTag))
    : videos;

  // Get unique tags from videos
  const allTags = Array.from(
    new Set(videos.flatMap((video) => video.tags || []))
  ).sort();

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950">
      <BackgroundTexture
        src="/assets/images/bg/street_art_2254155_1280.jpg"
        opacity={0.15}
        blend="soft-light"
        className="absolute inset-0"
      />

      <CinematicHero
        title="Media Hub"
        subtitle="Explore tracks and videos from Piko FG"
        backgroundImageUrl="/assets/images/hero/black_and_white_standing_low_shot.jpg"
        align="center"
        variant="music"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-1">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition ${
                activeTab === 'tracks'
                  ? 'bg-gradient-to-r from-piko-teal to-piko-pink text-white shadow-lg shadow-piko-pink/20'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Music className="h-4 w-4" />
              Tracks
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition ${
                activeTab === 'videos'
                  ? 'bg-gradient-to-r from-piko-teal to-piko-pink text-white shadow-lg shadow-piko-pink/20'
                  : 'text-zinc-400 hover:text-zinc-100'
              }`}
            >
              <Video className="h-4 w-4" />
              Videos
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'tracks' ? (
            <motion.div
              key="tracks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Featured Shots */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-zinc-100">Featured Shots</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-piko-teal">Cinematic Frames</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { src: '/assets/images/artist/on_the_mic.jpg', caption: 'On the Mic' },
                    { src: '/assets/images/hero/black_and_white_standing_low_shot.jpg', caption: 'Low Light Stage' },
                    { src: '/assets/images/artist/close_up_face.jpg', caption: 'Close Up' },
                  ].map((shot, idx) => (
                    <motion.div
                      key={shot.src}
                      className="group relative overflow-hidden rounded-2xl border border-zinc-800/70 bg-zinc-900/60"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={shot.src}
                          alt={shot.caption}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          priority={idx < 2}
                          unoptimized
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-80" />
                      <div className="absolute inset-0 flex items-end p-4">
                        <div className="w-full rounded-lg bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 backdrop-blur-md border border-zinc-800/60 group-hover:border-piko-teal/60 transition">
                          {shot.caption}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Track List */}
              <TrackList tracks={tracks} showFilter />
            </motion.div>
          ) : (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Filter */}
              {allTags.length > 0 && (
                <div className="flex justify-center gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition ${
                      selectedTag === null
                        ? 'border-piko-teal bg-piko-teal/10 text-piko-teal'
                        : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-piko-teal/50'
                    }`}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition ${
                        selectedTag === tag
                          ? 'border-piko-teal bg-piko-teal/10 text-piko-teal'
                          : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-piko-teal/50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Featured Video Player */}
              {featuredVideo && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featuredVideo.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-2xl border border-piko-teal/20 bg-zinc-900/60 backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                  >
                    <BackgroundTexture
                      src="/assets/images/bg/graffiti_1874452_1280.jpg"
                      opacity={0.1}
                      blend="soft-light"
                      className="z-0"
                    />
                    <div className="aspect-video">
                      <LiteYouTubeEmbed
                        id={featuredVideo.youtubeVideoId}
                        title={featuredVideo.title}
                        poster="hqdefault"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-zinc-100 mb-2">
                        {featuredVideo.title}
                      </h2>
                      {featuredVideo.releaseYear && (
                        <p className="text-sm text-zinc-400">{featuredVideo.releaseYear}</p>
                      )}
                      {featuredVideo.tags && featuredVideo.tags.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {featuredVideo.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full bg-zinc-800/80 text-zinc-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}

              {/* Video Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredVideos.map((video, index) => {
                  const isFeatured = video.id === featuredVideo?.id;

                  return (
                    <motion.button
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFeaturedVideo(video)}
                      className={`group relative overflow-hidden rounded-xl border bg-zinc-900/60 backdrop-blur-sm transition-all ${
                        isFeatured
                          ? 'border-piko-teal shadow-lg shadow-piko-teal/20'
                          : 'border-zinc-800 hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-zinc-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-piko-teal/90 flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                          </div>
                        </div>

                        {/* Paint splatter glow on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/20 via-piko-pink/20 to-piko-orange/20 blur-sm" />
                        </div>
                      </div>

                      {/* Video info */}
                      <div className="p-3 bg-zinc-900/80 backdrop-blur-sm relative">
                        <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-piko-teal transition">
                          {video.title}
                        </h3>
                        {video.releaseYear && (
                          <p className="text-xs text-zinc-500 mt-1">{video.releaseYear}</p>
                        )}
                      </div>

                      {/* Featured indicator */}
                      {isFeatured && (
                        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-piko-teal/90 backdrop-blur-sm">
                          <span className="text-xs font-semibold text-white">Now Playing</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Empty state */}
              {filteredVideos.length === 0 && (
                <div className="text-center py-12">
                  <Play className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400">No videos found</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom padding for PlayerDock */}
        <div className="h-32" />
      </div>
    </div>
  );
}

export default function MediaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-zinc-400">Loading...</div>
      </div>
    }>
      <MediaContent />
    </Suspense>
  );
}
