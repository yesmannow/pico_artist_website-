'use client';

import { motion } from "framer-motion";
import Image from "next/image";

export default function BioPage() {
  return (
    <div className="min-h-screen px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-piko-teal/5 via-transparent to-piko-pink/5 blur-3xl" />

      <div className="max-w-5xl mx-auto space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">Bio</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">
            Piko FG — Digital Graffiti in Motion
          </h1>
          <p className="text-zinc-400 max-w-3xl mx-auto">
            Raised on late-night subway static and club strobes, Piko FG blends neon melodies with
            smoky verses. The Private SoundCloud vibe you're hearing here is the lab where new
            stories are forged.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid gap-8 md:grid-cols-2 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-8"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800">
            <Image
              src="/piko-logo.jpg"
              alt="Piko FG"
              fill
              className="object-cover scale-110 blur-[1px] opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-piko-pink/40 via-transparent to-piko-teal/30 mix-blend-screen" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-50">The pulse</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Piko's cinematic dark palette was born from street murals that glowed under
              sodium lights. Every hook is layered like a paint drip—rounded, bright, and ready to
              cut through the night. Expect glitch transitions, wavesurfer renderings, and live
              overdubs captured straight from the /studio workspace.
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              This bio stays lean so the site stays fast. Scroll down, hit tracks, grab merch, or
              walk into the Member Studio when you&apos;re signed in.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
