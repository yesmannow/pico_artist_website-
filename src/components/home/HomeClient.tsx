'use client';

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import TrackList from "@/components/audio/TrackList";
import TourSection from "@/components/home/TourSection";
import MerchGrid from "@/components/home/MerchGrid";
import ParticlesBackground from "@/components/background/ParticlesBackground";
import CustomCursor from "@/components/cursor/CustomCursor";
import { Music, Mic, Radio } from "lucide-react";

export default function HomeClient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <ParticlesBackground />
      <CustomCursor />
      <div className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <motion.div
          className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-piko-teal/10 blur-3xl"
          animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-160px] top-32 h-[540px] w-[540px] rounded-full bg-[url('/piko-logo.jpg')] bg-cover bg-center opacity-[0.08] blur-[90px]"
          animate={{ x: [0, -20, 0], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-10 bottom-[-120px] h-[360px] w-[360px] rounded-full bg-gradient-to-br from-piko-pink/15 via-transparent to-piko-orange/20 blur-3xl"
          animate={{ x: [0, 12, 0], y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
        />
      </motion.div>
      {/* Interactive Mouse Spotlight */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 0, 110, 0.15), transparent 80%)`,
        }}
      />

      <main className="flex flex-col items-center gap-8 text-center relative z-10">
        {/* Hero Section with Logo */}
        <div className="flex flex-col items-center gap-4" data-hero>
          {/* Stamped Logo with RGB Glitch Effect */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.8
            }}
            className="relative"
            onMouseEnter={() => setIsHoveringLogo(true)}
            onMouseLeave={() => setIsHoveringLogo(false)}
          >
            {/* RGB Glitch Layers */}
            <div className="relative w-48 h-48 md:w-64 md:h-64">
              {isHoveringLogo && (
                <>
                  <div className="absolute inset-0 opacity-70 mix-blend-screen">
                    <Image
                      src="/piko-logo.jpg"
                      alt="Piko FG Logo - Red Channel"
                      fill
                      className="object-contain"
                      style={{ filter: "grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(600%)", transform: "translate(-2px, 0)" }}
                    />
                  </div>
                  <div className="absolute inset-0 opacity-70 mix-blend-screen">
                    <Image
                      src="/piko-logo.jpg"
                      alt="Piko FG Logo - Blue Channel"
                      fill
                      className="object-contain"
                      style={{ filter: "grayscale(100%) sepia(100%) hue-rotate(180deg) saturate(600%)", transform: "translate(2px, 0)" }}
                    />
                  </div>
                </>
              )}
              <Image
                src="/piko-logo.jpg"
                alt="Piko FG Logo"
                fill
                className="object-contain relative z-10"
                priority
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-zinc-100 md:text-6xl"
          >
            Piko FG Studio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-md text-lg text-zinc-400"
          >
            Your private SoundCloud experience with a built-in mobile-friendly recording studio
          </motion.p>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl"
        >
          <div className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10">
            <div className="mb-4 rounded-lg bg-gradient-to-br from-piko-teal/10 to-piko-pink/10 p-3 w-fit">
              <Radio className="h-6 w-6 text-piko-teal" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-100">
              Stream Your Music
            </h3>
            <p className="text-sm text-zinc-400">
              Share your tracks with beautiful waveform visualizations and a persistent player
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-piko-pink/50 hover:shadow-lg hover:shadow-piko-pink/10">
            <div className="mb-4 rounded-lg bg-gradient-to-br from-piko-pink/10 to-piko-orange/10 p-3 w-fit">
              <Mic className="h-6 w-6 text-piko-pink" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-100">
              Record Studio
            </h3>
            <p className="text-sm text-zinc-400">
              Professional recording tools with real-time frequency visualizers right in your browser
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-piko-orange/50 hover:shadow-lg hover:shadow-piko-orange/10 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 rounded-lg bg-gradient-to-br from-piko-orange/10 to-piko-teal/10 p-3 w-fit">
              <Music className="h-6 w-6 text-piko-orange" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-100">
              Cinematic Experience
            </h3>
            <p className="text-sm text-zinc-400">
              Dark, glassmorphic design with neon accents and smooth animations
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          <button className="rounded-full bg-gradient-to-r from-piko-teal to-piko-pink px-8 py-3 font-semibold text-white shadow-lg shadow-piko-pink/20 transition-all hover:scale-105 hover:shadow-piko-pink/40">
            Get Started
          </button>
          <button className="rounded-full border border-zinc-700 px-8 py-3 font-semibold text-zinc-100 transition-all hover:border-piko-teal hover:bg-zinc-800/50 hover:text-piko-teal">
            Learn More
          </button>
        </motion.div>

        {/* Public hooks */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="w-full mt-14 space-y-10"
        >
          <TourSection />
          <MerchGrid condensed />
        </motion.div>

        {/* Track List Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="w-full mt-16"
        >
          <TrackList />
        </motion.div>
      </main>
    </div>
    </>
  );
}
