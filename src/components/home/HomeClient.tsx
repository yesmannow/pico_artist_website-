'use client';

import { motion, useScroll, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Play from "lucide-react/dist/esm/icons/play";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Calendar from "lucide-react/dist/esm/icons/calendar";
import { getTracks, type Track } from "@/data/tracks";
import { getVideos, type Video } from "@/data/videos";
import { usePlayerStore } from "@/store/playerStore";
import BackgroundTexture from "@/components/ui/BackgroundTexture";
import TrackCard from "@/components/player/TrackCard";

const ParticlesBackground = dynamic(
  () => import("@/components/background/ParticlesBackground"),
  { ssr: false }
);

// Simple event preview data (import from events page if needed)
const upcomingEvents = [
  {
    id: 'event-1',
    name: 'Mexico City',
    venue: 'Palacio de los Deportes',
    date: 'Jan 15, 2026',
  },
  {
    id: 'event-2',
    name: 'Los Angeles',
    venue: 'The Wiltern',
    date: 'Feb 02, 2026',
  },
];

export default function HomeClient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const vinylRotation = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const { playTrack, setQueue } = usePlayerStore();

  const tracks = getTracks().slice(0, 6); // Featured tracks
  const videos = getVideos().slice(0, 6); // Featured videos

  // Scroll-based vinyl rotation
  useEffect(() => {
    if (prefersReducedMotion) return;
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      vinylRotation.set(latest * 360);
    });
    return () => unsubscribe();
  }, [scrollYProgress, vinylRotation, prefersReducedMotion]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const backgroundParallax = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroImageParallax = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const handleTrackPlay = (track: Track, index: number) => {
    setQueue(tracks, index);
    playTrack(track, 'preview');
  };

  return (
    <>
      <ParticlesBackground />
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
        <section data-hero className="min-h-screen flex items-center px-4 relative z-10">
          <motion.div
            className="absolute inset-0"
            style={{ y: prefersReducedMotion ? 0 : backgroundParallax }}
          >
            <BackgroundTexture
              src="/assets/images/bg/graffiti_1874452_1280.jpg"
              opacity={0.16}
              blend="soft-light"
            />
          </motion.div>
          <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 text-center lg:text-left"
            >
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.8
                }}
                className="relative mx-auto lg:mx-0 w-52 h-52 md:w-64 md:h-64"
                onMouseEnter={() => setIsHoveringLogo(true)}
                onMouseLeave={() => setIsHoveringLogo(false)}
              >
                {/* Floating 3D Vinyl Record */}
                <motion.div
                  style={{ rotate: vinylRotation }}
                  className="relative w-full h-full"
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
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-zinc-100"
              >
                Piko FG Studio
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="text-lg text-zinc-300 max-w-xl mx-auto lg:mx-0"
              >
                Digital Graffiti Collective — Cinematic Soundscapes
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
              >
                <Link
                  href="/media?tab=tracks"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-piko-teal px-6 py-3 font-semibold text-zinc-950 shadow-lg shadow-piko-teal/30 transition hover:scale-[1.02]"
                >
                  Listen
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/media?tab=videos"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-piko-pink/60 bg-piko-pink/10 px-6 py-3 font-semibold text-piko-pink shadow-lg shadow-piko-pink/20 transition hover:scale-[1.02]"
                >
                  Watch
                  <Play className="h-4 w-4" fill="currentColor" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative w-full h-[420px] md:h-[480px]"
              style={{ y: prefersReducedMotion ? 0 : heroImageParallax }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute -inset-6 bg-gradient-to-br from-piko-teal/10 via-piko-pink/10 to-piko-orange/10 blur-3xl" />
              <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-zinc-800/70 bg-zinc-900/60 backdrop-blur-xl shadow-2xl shadow-piko-pink/10">
                <Image
                  src="/assets/images/hero/white_hero.jpg"
                  alt="Piko FG Hero"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 90vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                <BackgroundTexture
                  src="/assets/images/bg/wall_2602116_1280.jpg"
                  opacity={0.14}
                  blend="soft-light"
                  grain={false}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bio / Identity Section */}
        <section id="bio" className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <div className="max-w-5xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-piko-teal mb-4">Artist Identity</p>
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-6">
                Piko FG — <span className="bg-gradient-to-r from-piko-teal to-piko-pink bg-clip-text text-transparent">Digital Graffiti in Motion</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-3xl mx-auto mb-8">
                Raised on late-night subway static and club strobes, Piko FG blends neon melodies with
                smoky verses. The cinematic dark palette was born from street murals that glowed under
                sodium lights.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="grid gap-8 md:grid-cols-2 rounded-3xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-8"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800">
                <Image
                  src="/assets/images/artist/close_up_face.jpg"
                  alt="Piko FG"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-piko-pink/40 via-transparent to-piko-teal/30 mix-blend-screen" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-zinc-50">The Pulse</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Every hook is layered like a paint drip—rounded, bright, and ready to
                  cut through the night. Expect glitch transitions, wavesurfer renderings, and live
                  overdubs captured straight from the studio workspace.
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  This is the lab where new stories are forged. Scroll down to explore tracks, videos,
                  and upcoming events.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Tracks Section */}
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
                Featured <span className="bg-gradient-to-r from-piko-teal to-piko-pink bg-clip-text text-transparent">Tracks</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Explore curated tracks from the Digital Graffiti Collective
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track, idx) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  index={idx}
                  onPlay={() => handleTrackPlay(track, idx)}
                />
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center mt-8"
            >
              <Link href="/media?tab=tracks">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full border border-piko-teal/50 bg-piko-teal/10 text-piko-teal font-semibold hover:bg-piko-teal/20 transition"
                >
                  View All Tracks
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Featured Videos Section */}
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
                Featured <span className="bg-gradient-to-r from-piko-pink to-piko-orange bg-clip-text text-transparent">Videos</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Cinematic visuals and music videos
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, idx) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx, duration: 0.6 }}
                  className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md overflow-hidden hover:border-piko-pink/50 transition-all cursor-pointer"
                >
                  <Link href={`/media?tab=videos`}>
                    <div className="relative aspect-video overflow-hidden bg-zinc-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-zinc-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-piko-pink/90 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-zinc-900/80 backdrop-blur-sm relative">
                      <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-piko-pink transition">
                        {video.title}
                      </h3>
                      {video.releaseYear && (
                        <p className="text-xs text-zinc-500 mt-1">{video.releaseYear}</p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center mt-8"
            >
              <Link href="/media?tab=videos">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full border border-piko-pink/50 bg-piko-pink/10 text-piko-pink font-semibold hover:bg-piko-pink/20 transition"
                >
                  View All Videos
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Visualizer Tease Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <BackgroundTexture
            src="/assets/images/bg/window_999882_1280.jpg"
            opacity={0.12}
            blend="overlay"
            className="absolute inset-0"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto w-full relative z-10"
          >
            <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl p-12 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-piko-orange/10 via-piko-teal/10 to-piko-pink/10 opacity-50" />
              <div className="relative z-10 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                  Interactive <span className="bg-gradient-to-r from-piko-orange to-piko-teal bg-clip-text text-transparent">Visualizer</span>
                </h2>
                <p className="text-lg text-zinc-400 mb-8">
                  Experience your music with real-time audio-reactive visuals
                </p>
                <Link href="/visualizer">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-piko-orange to-piko-teal font-semibold text-white shadow-lg shadow-piko-teal/30 transition-all hover:shadow-piko-teal/50"
                  >
                    <span className="text-lg">Launch Visualizer</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 rounded-full bg-piko-teal blur-xl opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Events Preview Section */}
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
                Upcoming <span className="bg-gradient-to-r from-piko-pink to-piko-orange bg-clip-text text-transparent">Events</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Catch us live at these upcoming shows and performances
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {upcomingEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * idx, duration: 0.6 }}
                  className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 hover:border-piko-orange/50 transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-piko-orange/10 to-piko-pink/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-piko-orange to-piko-pink flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.24em] text-piko-orange">{event.date}</p>
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-100 mb-1">{event.name}</h3>
                    <p className="text-sm text-zinc-400">{event.venue}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center mt-8"
            >
              <Link href="/events">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full border border-piko-orange/50 bg-piko-orange/10 text-piko-orange font-semibold hover:bg-piko-orange/20 transition"
                >
                  View All Events
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
