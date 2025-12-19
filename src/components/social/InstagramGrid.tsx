'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { getSocialLink } from '@/data/socials';

const placeholderPosts = Array.from({ length: 6 }).map((_, idx) => ({
  id: `insta-${idx}`,
  title: `Graffiti Drop ${idx + 1}`,
}));

export default function InstagramGrid() {
  const instagram = getSocialLink('instagram');

  return (
    <section className="px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">Digital Graffiti Wall</p>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">Instagram Grid</h2>
            <p className="text-zinc-400 mt-2">
              Placeholder grid wired to the official handle. Replace with live embeds when API access is available.
            </p>
          </div>
          {instagram && (
            <Link
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-zinc-700 text-sm text-zinc-100 hover:border-piko-teal hover:text-piko-teal transition"
            >
              View Instagram
            </Link>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {placeholderPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.35 }}
              className="relative aspect-square rounded-2xl border border-zinc-800 bg-gradient-to-br from-piko-teal/15 via-zinc-900/60 to-piko-pink/15 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,245,212,0.2),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(255,0,110,0.2),transparent_45%)]" />
              <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                <p className="text-lg font-semibold text-zinc-50 drop-shadow-[0_0_12px_rgba(0,0,0,0.4)]">
                  {post.title}
                </p>
              </div>
              <div className="absolute bottom-3 right-3 text-xs uppercase tracking-[0.2em] text-zinc-200 bg-black/40 px-3 py-1 rounded-full border border-white/10">
                Incoming
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

