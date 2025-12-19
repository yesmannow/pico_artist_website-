'use client';

import { motion, useScroll, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Play from "lucide-react/dist/esm/icons/play";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right";
import Youtube from "lucide-react/dist/esm/icons/youtube";
import Facebook from "lucide-react/dist/esm/icons/facebook";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import { getTracks, type Track } from "@/data/tracks";
import { getVideos } from "@/data/videos";
import { usePlayerStore } from "@/store/playerStore";
import BackgroundTexture from "@/components/ui/BackgroundTexture";
import TrackCard from "@/components/player/TrackCard";
import MarqueeHeader from "@/components/ui/MarqueeHeader";
import HyperText from "@/components/ui/HyperText";
import { getSocialLinks } from "@/data/socials";

const FilmGrain = dynamic(
  () => import("@/components/visuals/FilmGrain"),
  { ssr: false }
);

const GraffitiPreloader = dynamic(
  () => import("@/components/ui/GraffitiPreloader"),
  { ssr: false }
);

const TheDrop = dynamic(
  () => import("@/components/hero/TheDrop"),
  { ssr: false }
);

const SignTheWall = dynamic(
  () => import("@/components/community/SignTheWall"),
  { ssr: false }
);

const MerchLookbook = dynamic(
  () => import("@/components/merch/MerchLookbook"),
  { ssr: false }
);

const InstagramFeed = dynamic(
  () => import("@/components/social/InstagramFeed"),
  { ssr: false }
);

const YouTubeFeed = dynamic(
  () => import("@/components/social/YouTubeFeed"),
  { ssr: false }
);

const InstagramGrid = dynamic(
  () => import("@/components/social/InstagramGrid"),
  { ssr: false }
);

export default function HomeClient() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const vinylRotation = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const { playTrack, setQueue } = usePlayerStore();
  const socialLinks = getSocialLinks();

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

  const heroImageParallax = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Keep vinylRotation for potential future use
  void vinylRotation;
  void heroImageParallax;

  const handleTrackPlay = (track: Track, index: number) => {
    setQueue(tracks, index);
    playTrack(track, 'preview');
  };

  return (
    <>
      {isLoading && (
        <GraffitiPreloader
          minDuration={1200}
          onComplete={() => setIsLoading(false)}
        />
      )}
      <FilmGrain />
      <div
        ref={containerRef}
        className="flex min-h-screen flex-col relative overflow-hidden"
      >
        {/* Interactive Mouse Spotlight */}
        <div
          className="fixed inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 0, 110, 0.20), transparent 80%)`,
          }}
        />

        {/* "The Drop" - Hero Replacement */}
        <TheDrop trackTitle="Te Prometo" />

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

              {/* Social Pill Row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center justify-center gap-3 flex-wrap"
              >
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900/50 hover:border-piko-teal hover:bg-piko-teal/10 transition text-sm font-medium text-zinc-300 hover:text-piko-teal"
                  >
                    {social.platform === 'youtube' && <Youtube className="w-4 h-4" />}
                    {social.platform === 'facebook' && <Facebook className="w-4 h-4" />}
                    {social.platform === 'instagram' && <Instagram className="w-4 h-4" />}
                    <span>{social.name}</span>
                  </a>
                ))}
              </motion.div>
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

        {/* Featured Music Video Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <div className="max-w-6xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <HyperText
                text="Latest Release"
                as="p"
                className="text-xs uppercase tracking-[0.3em] text-piko-pink mb-4"
              />
              <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
                Featured <span className="bg-gradient-to-r from-piko-pink to-piko-orange bg-clip-text text-transparent">Music Video</span>
              </h2>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Experience the latest visual masterpiece
              </p>
            </motion.div>

            {/* Large Video Player */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-3xl border border-piko-pink/30 bg-zinc-900/80 backdrop-blur-xl overflow-hidden shadow-[0_25px_70px_rgba(255,0,110,0.2)]"
            >
              <BackgroundTexture
                src="/assets/images/bg/graffiti_1874452_1280.jpg"
                opacity={0.08}
                blend="soft-light"
                className="z-0"
              />
              <div className="relative aspect-video">
                {/* Placeholder for video - will be replaced with actual embed */}
                <div className="absolute inset-0 bg-gradient-to-br from-piko-pink/20 via-zinc-900/80 to-piko-teal/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-piko-pink to-piko-orange flex items-center justify-center mb-4 mx-auto">
                      <Play className="w-12 h-12 text-white ml-1" fill="currentColor" />
                    </div>
                    <p className="text-zinc-100 text-lg font-semibold">{videos[0]?.title || 'Latest Music Video'}</p>
                    <p className="text-zinc-400 text-sm">{videos[0]?.releaseYear || '2024'}</p>
                  </div>
                </div>
              </div>
              <div className="relative p-6 bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-zinc-100 mb-1">
                      {videos[0]?.title || 'Latest Track'}
                    </h3>
                    <p className="text-zinc-400 text-sm">Directed by Piko FG • {videos[0]?.releaseYear || '2024'}</p>
                  </div>
                  <Link
                    href="/media?tab=videos"
                    className="px-6 py-3 rounded-full border border-piko-pink/50 bg-piko-pink/10 text-piko-pink font-semibold hover:bg-piko-pink/20 transition"
                  >
                    Watch More
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Tracks Section */}
        <section className="min-h-screen flex items-center justify-center px-4 py-20 relative">
          <div className="max-w-6xl mx-auto w-full">
            <MarqueeHeader text="FEATURED TRACKS" />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
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
            <MarqueeHeader text="FEATURED VIDEOS" />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
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

        {/* Social Automation */}
        <YouTubeFeed />
        <InstagramGrid />

        {/* Sign The Wall - Community Feature */}
        <SignTheWall />

        {/* Merch Lookbook */}
        <MerchLookbook />

        {/* Instagram Feed (legacy embed) */}
        <InstagramFeed />
      </div>
    </>
  );
}
