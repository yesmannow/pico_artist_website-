'use client';

import { useState, useMemo } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import { motion } from 'framer-motion';
import Music from 'lucide-react/dist/esm/icons/music';
import Video from 'lucide-react/dist/esm/icons/video';
import Radio from 'lucide-react/dist/esm/icons/radio';

type VideoItem = {
  id: string;
  title: string;
  category?: 'music-video' | 'live-session' | 'vlog' | string;
};

type VideoGridProps = {
  videos: VideoItem[];
};

const categories = [
  { id: 'all', label: 'All', icon: Radio },
  { id: 'music-video', label: 'Music Videos', icon: Music },
  { id: 'live-session', label: 'Live Sessions', icon: Video },
  { id: 'vlog', label: 'Vlogs', icon: Radio },
] as const;

export default function VideoGrid({ videos }: VideoGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'all') return videos;
    return videos.filter((video) => video.category === selectedCategory);
  }, [videos, selectedCategory]);

  return (
    <div className="w-full space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = selectedCategory === category.id;
          return (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isActive
                  ? 'border-piko-teal bg-piko-teal/10 text-piko-teal shadow-lg shadow-piko-teal/20'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-semibold">{category.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Video Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredVideos.map((video, idx) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10 transition"
          >
            <div className="relative aspect-video">
              <LiteYouTubeEmbed
                id={video.id}
                title={video.title}
                wrapperClass="yt-lite"
                playerClass="lty-playbtn"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-piko-teal transition">
                {video.title}
              </h3>
              {video.category && (
                <span className="mt-2 inline-block text-xs uppercase tracking-wider text-zinc-400">
                  {video.category.replace('-', ' ')}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400">No videos found in this category.</p>
        </div>
      )}
    </div>
  );
}
