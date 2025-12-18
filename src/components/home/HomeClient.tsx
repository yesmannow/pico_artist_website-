'use client';

import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/background/ParticlesBackground";
import CustomCursor from "@/components/cursor/CustomCursor";
import { Play, ArrowRight } from "lucide-react";
import { Howl } from "howler";

export default function HomeClient() {
  const router = useRouter();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const vinylRotation = useMotionValue(0);
  const [teaserPlaying, setTeaserPlaying] = useState(false);
  const teaserSoundRef = useRef<Howl | null>(null);

  // Scroll-based vinyl rotation
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      vinylRotation.set(latest * 360);
    });
    return () => unsubscribe();
  }, [scrollYProgress, vinylRotation]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handlePlayTeaser = () => {
    if (teaserPlaying) {
      teaserSoundRef.current?.stop();
      setTeaserPlaying(false);
      return;
    }

    // Load and play 5s teaser
    const sound = new Howl({
      src: ['/lofi-teaser.wav'],
      volume: 0.7,
      onend: () => {
        setTeaserPlaying(false);
        router.push('/music');
      },
    });

    // Stop after 5 seconds
    sound.play();
    setTimeout(() => {
      sound.stop();
      setTeaserPlaying(false);
      router.push('/music');
    }, 5000);

    teaserSoundRef.current = sound;
    setTeaserPlaying(true);
  };

  return (
    <>
      <ParticlesBackground />
      <CustomCursor />
      <div
        ref={containerRef}
        className="flex min-h-screen flex-col relative overflow-hidden"
      >
        {/* Interactive Mouse Spotlight */}
        <div
          className="fixed inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 0, 110, 0.15), transparent 80%)`,
          }}
        />

        {/* Hero Section - Full Height */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 0.8
            }}
            className="relative mb-8"
            onMouseEnter={() => setIsHoveringLogo(true)}
            onMouseLeave={() => setIsHoveringLogo(false)}
          >
            {/* Floating 3D Vinyl Record */}
            <motion.div
              style={{ rotate: vinylRotation }}
              className="relative w-64 h-64 md:w-80 md:h-80"
            >
              {/* RGB Glitch Layers */}
              {isHoveringLogo && (
                <>
                  <div className="absolute inset-0 opacity-70 mix-blend-screen">
                    <Image
                      src="/piko-logo.jpg"
                      alt="Piko FG Logo - Red Channel"
                      fill
                      className="object-contain rounded-full"
                      style={{ filter: "grayscale(100%) sepia(100%) hue-rotate(-50deg) saturate(600%)", transform: "translate(-2px, 0)" }}
                    />
                  </div>
                  <div className="absolute inset-0 opacity-70 mix-blend-screen">
                    <Image
                      src="/piko-logo.jpg"
                      alt="Piko FG Logo - Blue Channel"
                      fill
                      className="object-contain rounded-full"
                      style={{ filter: "grayscale(100%) sepia(100%) hue-rotate(180deg) saturate(600%)", transform: "translate(2px, 0)" }}
                    />
                  </div>
                </>
              )}
              <Image
                src="/piko-logo.jpg"
                alt="Piko FG Logo"
                fill
                className="object-contain relative z-10 rounded-full"
                priority
              />
              {/* Vinyl Grooves */}
              <div className="absolute inset-0 rounded-full border-8 border-zinc-800/50" />
              <div className="absolute inset-4 rounded-full border-2 border-zinc-700/30" />
              <div className="absolute inset-8 rounded-full border border-zinc-700/20" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-zinc-100 md:text-6xl text-center mb-4"
          >
            Piko FG Studio
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="max-w-md text-lg text-zinc-400 text-center"
          >
            Digital Graffiti Collective — Cinematic Soundscapes
          </motion.p>
        </section>

        {/* The Lab - Bio Section - Full Height */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <div className="max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                The <span className="bg-gradient-to-r from-piko-teal to-piko-pink bg-clip-text text-transparent">Lab</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Where sound meets street art. Piko FG fuses cinematic production with digital graffiti aesthetics,
                creating immersive audio-visual experiences that blur the line between music and art.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {[
                { title: "Production", desc: "Cinematic sound design" },
                { title: "Visuals", desc: "Digital graffiti aesthetics" },
                { title: "Live", desc: "Immersive performances" },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx, duration: 0.6 }}
                  className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md hover:border-piko-teal/50 transition"
                >
                  <h3 className="text-xl font-semibold text-zinc-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-400">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Latest Release - CTA Card */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto w-full"
          >
            <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl p-12 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/10 via-piko-pink/10 to-piko-orange/10 opacity-50" />
              <div className="relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                  Latest Release
                </h2>
                <p className="text-lg text-zinc-400 mb-8">
                  Experience the new album with immersive audio-visual storytelling
                </p>
                <button
                  onClick={handlePlayTeaser}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-piko-teal to-piko-pink font-semibold text-white shadow-lg shadow-piko-pink/30 transition-all hover:scale-105 hover:shadow-piko-pink/50"
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                  <span className="text-lg">Play Now</span>
                  <div className="absolute inset-0 rounded-full bg-piko-pink blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
                </button>
                {teaserPlaying && (
                  <p className="mt-4 text-sm text-piko-teal animate-pulse">
                    Playing teaser... Redirecting to Music
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* The Supply - Merch Section - Full Height */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                The <span className="bg-gradient-to-r from-piko-pink to-piko-orange bg-clip-text text-transparent">Supply</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Limited edition gear from the Digital Graffiti Collective
              </p>
            </motion.div>
            <Link href="/merch">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex items-center justify-center gap-2 text-piko-teal hover:text-piko-pink transition"
              >
                <span className="text-sm font-semibold">View Full Collection</span>
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Link>
          </div>
        </section>

        {/* Visual Reel Section - Full Height */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                Visual <span className="bg-gradient-to-r from-piko-orange to-piko-teal bg-clip-text text-transparent">Reel</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
                Cinematic music videos and digital art installations
              </p>
              <Link href="/gallery">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full border border-piko-teal/50 bg-piko-teal/10 text-piko-teal font-semibold hover:bg-piko-teal/20 transition"
                >
                  Explore Gallery
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
