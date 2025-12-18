'use client';

import MerchGrid from "@/components/home/MerchGrid";
import { motion } from "framer-motion";

export default function MerchPage() {
  return (
    <div className="min-h-screen px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-piko-pink/10 via-transparent to-piko-orange/10 blur-3xl" />

      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">Merch</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">Piko Splash Capsule</h1>
          <p className="text-zinc-400 max-w-3xl mx-auto">
            Optimized visuals for hoodies, snapbacks, and vinyl—ready for quick installs and PWA
            save-to-home-screen.
          </p>
        </motion.div>

        <MerchGrid />
      </div>
    </div>
  );
}
