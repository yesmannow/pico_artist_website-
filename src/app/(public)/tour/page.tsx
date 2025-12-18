'use client';

import TourSection from "@/components/home/TourSection";
import { motion } from "framer-motion";

export default function TourPage() {
  return (
    <div className="min-h-screen px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-piko-orange/10 via-transparent to-piko-teal/10 blur-3xl" />

      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">Tour</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">Digital Graffiti Tour</h1>
          <p className="text-zinc-400 max-w-3xl mx-auto">
            Ultra-fast, SEO-friendly tour listing with ticket CTAs and the same paint-drip neon you
            see on stage.
          </p>
        </motion.div>

        <TourSection />
      </div>
    </div>
  );
}
