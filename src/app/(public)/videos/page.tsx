/**
 * Videos Page
 * Displays YouTube videos with embedded player
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVideos } from '@/data/videos';
import type { Video } from '@/data/videos';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import Play from 'lucide-react/dist/esm/icons/play';
import CinematicHero from '@/components/media/CinematicHero';

export default function VideosPage() {
  const videos = getVideos();
  const [featuredVideo, setFeaturedVideo] = useState<Video>(videos[0]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter videos by tag
  const filteredVideos = selectedTag
    ? videos.filter((video) => video.tags?.includes(selectedTag))
    : videos;

  // Get unique tags
  const allTags = Array.from(
    new Set(videos.flatMap((video) => video.tags || []))
  ).sort();

  return (
    <div className="min-h-screen px-4 pb-16">
      <div className="max-w-7xl mx-auto space-y-12">
        <CinematicHero
          title="Visual Gallery"
          subtitle="Watch the latest music videos, behind-the-scenes, and more from Piko FG"
          backgroundImageUrl="/images%20design%20assets/header%20with%20logo.jpg"
          align="center"
          variant="videos"
        />
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
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredVideo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
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

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredVideos.map((video, index) => {
            const isFeatured = video.id === featuredVideo.id;

            return (
              <motion.button
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setFeaturedVideo(video)}
                className={`group relative overflow-hidden rounded-lg border transition-all ${
                  isFeatured
                    ? 'border-piko-teal shadow-lg shadow-piko-teal/20'
                    : 'border-zinc-800 hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-zinc-900">
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
                    <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/20 via-piko-pink/20 to-piko-orange/20" />
                  </div>
                </div>

                {/* Video info */}
                <div className="p-3 bg-zinc-900/80 backdrop-blur-sm">
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
      </div>

      {/* Add bottom padding to account for PlayerDock if present */}
      <div className="h-32" />
    </div>
  );
}
