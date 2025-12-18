'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  filename: string;
  url: string;
  title: string;
}

export default function Gallery() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setMedia(data);
        }
      } catch (error) {
        console.error('Failed to fetch gallery media:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMedia();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-zinc-400">Loading gallery...</div>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-4">
        <div className="text-6xl mb-4">🎨</div>
        <p className="text-zinc-400 mb-2">No media files yet</p>
        <p className="text-sm text-zinc-500">
          Add images or videos to <code className="text-piko-teal">downloads/</code> and run{' '}
          <code className="text-piko-orange">npm run optimize-media</code>
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {media.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="break-inside-avoid"
          >
            <div
              className="relative overflow-hidden rounded-lg cursor-pointer group"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedItem(item)}
            >
              {/* Media Content */}
              {item.type === 'image' ? (
                <div className="relative w-full">
                  <Image
                    src={item.url}
                    alt={item.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="relative">
                  <video
                    src={item.url}
                    className="w-full h-auto object-cover"
                    preload="metadata"
                  />
                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/30 group-hover:bg-zinc-950/50 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-piko-pink/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-zinc-100 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              )}

              {/* Piko Splash Hover Effect */}
              <AnimatePresence>
                {hoveredId === item.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent flex items-end p-4"
                  >
                    <div className="relative z-10">
                      <h3 className="text-zinc-100 font-semibold text-lg">
                        {item.title}
                      </h3>
                      <div className="text-piko-teal text-sm uppercase tracking-wider">
                        {item.type}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Piko Teal Glow Border on Hover */}
              <div
                className={`absolute inset-0 rounded-lg pointer-events-none transition-all duration-300 ${
                  hoveredId === item.id
                    ? 'ring-2 ring-piko-teal shadow-[0_0_20px_rgba(0,245,212,0.5)]'
                    : ''
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-zinc-900/80 hover:bg-zinc-800 flex items-center justify-center transition-colors z-10"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-6 h-6 text-zinc-100" />
            </button>

            {/* Media Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-7xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'image' ? (
                <div className="relative">
                  <Image
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-[90vh] object-contain rounded-lg"
                  />
                </div>
              ) : (
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              )}

              {/* Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950 to-transparent p-6 rounded-b-lg">
                <h2 className="text-2xl font-bold text-zinc-100 mb-1">
                  {selectedItem.title}
                </h2>
                <p className="text-piko-teal text-sm uppercase tracking-wider">
                  {selectedItem.type}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
