'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSocialLink } from '@/data/socials';

const placeholderVideos = [
  { id: 'placeholder-1', title: 'Latest Visualizer Drop', duration: '3:42' },
  { id: 'placeholder-2', title: 'Behind The Scenes', duration: '2:18' },
  { id: 'placeholder-3', title: 'Live Session Snippet', duration: '1:59' },
];

export default function YouTubeFeed() {
  const youtube = getSocialLink('youtube');
  const youtubeMusic = getSocialLink('youtube-music');

  return (
    <section className="px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-piko-pink">Channel Feed</p>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">YouTube & YouTube Music</h2>
            <p className="text-zinc-400 mt-2">
              Direct links to the official channels. Replace these cards with live data when APIs are wired.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {youtube && (
              <Link
                href={youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-100 hover:border-piko-pink hover:text-piko-pink transition"
              >
                Open YouTube
              </Link>
            )}
            {youtubeMusic && (
              <Link
                href={youtubeMusic.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-100 hover:border-piko-teal hover:text-piko-teal transition"
              >
                Open YouTube Music
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {placeholderVideos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-md p-4"
            >
              <div className="aspect-video rounded-xl bg-gradient-to-br from-piko-teal/20 via-zinc-900 to-piko-pink/15 border border-zinc-800 mb-3 flex items-center justify-center text-zinc-200 font-semibold">
                {video.title}
              </div>
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>{video.duration}</span>
                <span>Queued for API</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

