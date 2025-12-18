'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type IconProps = React.SVGProps<SVGSVGElement>;

const SprayCanIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-7 w-7 ${className ?? ''}`} {...props}>
    <path d="M28 10h8l4 8H24l4-8Z" stroke="currentColor" />
    <rect x="20" y="18" width="24" height="34" rx="6" stroke="currentColor" />
    <path d="M24 26h16" stroke="currentColor" />
    <path d="M18 34c-4 2-6 6-6 10" stroke="currentColor" className="opacity-80" />
    <path d="M46 30c4 2 6 6 6 10" stroke="currentColor" className="opacity-80" />
    <path d="M26 10V6a6 6 0 0 1 12 0v4" stroke="currentColor" />
  </svg>
);

const RecordIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-7 w-7 ${className ?? ''}`} {...props}>
    <circle cx="32" cy="32" r="18" stroke="currentColor" />
    <circle cx="32" cy="32" r="6" stroke="currentColor" />
    <path d="M50 14c-3-3-7-5-11-6" stroke="currentColor" className="opacity-70" />
    <path d="M14 50c3 3 7 5 11 6" stroke="currentColor" className="opacity-70" />
    <path d="M36 10 40 4" stroke="currentColor" />
  </svg>
);

const TicketIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-7 w-7 ${className ?? ''}`} {...props}>
    <path d="M10 24a6 6 0 0 1 6-6h32a6 6 0 0 1 6 6v8a6 6 0 0 0 0 12v8a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6v-8a6 6 0 0 0 0-12v-8Z" stroke="currentColor" />
    <path d="M26 22h12M26 32h12M26 42h12" stroke="currentColor" />
  </svg>
);

const TagIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-7 w-7 ${className ?? ''}`} {...props}>
    <path d="M12 12h18l22 22a6 6 0 0 1 0 8l-10 10a6 6 0 0 1-8 0L12 30V12Z" stroke="currentColor" />
    <circle cx="22" cy="22" r="3" fill="currentColor" />
  </svg>
);

const SignatureIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-7 w-7 ${className ?? ''}`} {...props}>
    <path d="M10 42c8-4 12-10 18-20 6 10 8 16 18 20" stroke="currentColor" />
    <path d="M18 46c4-2 7-4 10-8 3 4 6 6 10 8" stroke="currentColor" className="opacity-80" />
    <path d="M40 18c2-2 6-4 10-2" stroke="currentColor" />
  </svg>
);

const NeonHomeIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 64 64" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`h-7 w-7 ${className ?? ''}`} {...props}>
    <path d="M12 30 32 14l20 16v18a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V30Z" stroke="currentColor" />
    <path d="M26 48V36h12v12" stroke="currentColor" />
    <path d="M24 24h16" stroke="currentColor" className="opacity-70" />
  </svg>
);

const SLIDE_OUT_THRESHOLD = 5;
const HERO_ROOT_MARGIN = '-72px 0px 0px 0px';

const menuItems = [
  {
    title: 'Home',
    href: '/',
    icon: NeonHomeIcon,
    gradient: 'from-piko-teal to-piko-pink',
    blurb: 'Back to main page',
  },
  {
    title: 'Tracks',
    href: '/#tracks',
    icon: RecordIcon,
    gradient: 'from-piko-pink to-piko-orange',
    blurb: 'Hover to hear & dive into waveforms',
  },
  {
    title: 'Gallery',
    href: '/gallery',
    icon: SprayCanIcon,
    gradient: 'from-piko-orange to-piko-teal',
    blurb: 'Street-art visuals & reels',
  },
  {
    title: 'Bio',
    href: '/bio',
    icon: SignatureIcon,
    gradient: 'from-piko-teal via-piko-pink to-piko-orange',
    blurb: 'Meet Piko FG',
  },
  {
    title: 'Tour',
    href: '/tour',
    icon: TicketIcon,
    gradient: 'from-piko-orange to-piko-pink',
    blurb: 'Find tickets & dates',
  },
  {
    title: 'Merch',
    href: '/merch',
    icon: TagIcon,
    gradient: 'from-piko-teal to-piko-orange',
    blurb: 'Wear the digital graffiti',
  },
];

const studioLink = {
  title: 'Member Studio',
  href: '/studio',
  blurb: 'Protected overdub workspace',
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [pastHero, setPastHero] = useState(true);

  const toggleMenu = () => setIsOpen(!isOpen);
  const isSlideOut = menuItems.length > SLIDE_OUT_THRESHOLD;

  useEffect(() => {
    const hero = document.querySelector('[data-hero]');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      { rootMargin: HERO_ROOT_MARGIN }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const renderMenuCard = (item: (typeof menuItems)[number]) => {
    const Icon = item.icon;
    return (
      <motion.div
        key={item.href}
        variants={{
          hidden: { opacity: 0, y: 50, scale: 0.94 },
          visible: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
      >
        <Link
          href={item.href}
          onClick={toggleMenu}
          className="block group"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-6 transition-all hover:border-piko-teal/50 hover:shadow-2xl hover:shadow-piko-teal/10"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

            <div className={`relative mb-5 rounded-2xl bg-gradient-to-br ${item.gradient} p-3 w-fit shadow-lg shadow-black/30`}>
              <Icon className="h-7 w-7 text-white drop-shadow-[0_0_12px_rgba(0,245,212,0.45)]" />
            </div>

            <h3 className="relative text-2xl font-bold text-zinc-100 mb-1">
              {item.title}
            </h3>
            <p className="relative text-zinc-400 text-sm">{item.blurb}</p>

            <div className="relative mt-4 flex items-center gap-2 text-sm text-piko-teal opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Enter</span>
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                →
              </motion.span>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    );
  };

  return (
    <>
      {/* Fixed Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          pastHero
            ? 'border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl shadow-[0_12px_60px_rgba(0,0,0,0.45)]'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <Image
                  src="/piko-logo.jpg"
                  alt="Piko FG"
                  fill
                  className="object-contain rounded-md transition-transform group-hover:scale-110"
                />
              </div>
              <span className="text-xl font-bold text-zinc-100 hidden sm:block">
                Piko FG
              </span>
            </Link>

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="relative h-11 w-11 rounded-full bg-gradient-to-r from-piko-teal to-piko-pink p-2 shadow-lg shadow-piko-pink/20 transition-all hover:scale-110 hover:shadow-piko-pink/40 active:scale-95"
              aria-label="Toggle menu"
            >
              <motion.div
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                className="flex items-center justify-center"
              >
                <motion.div
                  variants={{
                    closed: { rotate: 0, scale: 1 },
                    open: { rotate: 180, scale: 0.9 },
                  }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                >
                  {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                  ) : (
                    <Menu className="h-6 w-6 text-white" />
                  )}
                </motion.div>
              </motion.div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mega Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-zinc-950/90 backdrop-blur-xl"
            onClick={toggleMenu}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 400 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 150) {
                  setIsOpen(false);
                }
              }}
              className={`h-full ${isSlideOut ? 'flex justify-end' : 'flex items-center justify-center'} p-4`}
              onClick={(e) => e.stopPropagation()}
            >
              {isSlideOut ? (
                <motion.aside
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  className="h-full w-full sm:w-[82%] md:w-[70%] lg:w-[55%] xl:w-[45%] bg-zinc-900/70 border-l border-zinc-800/70 shadow-2xl rounded-l-3xl overflow-hidden"
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800/70">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                          <Image src="/piko-logo.jpg" alt="Piko FG" fill className="object-contain rounded-md" />
                        </div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em] text-piko-teal">Public Realm</p>
                          <p className="text-lg font-semibold text-zinc-100">Digital Graffiti</p>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500">Slide to explore</span>
                    </div>

                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.08 } },
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 overflow-y-auto flex-1"
                    >
                      {menuItems.map(renderMenuCard)}
                    </motion.div>

                    <div className="px-6 pb-6 pt-2">
                      <Link
                        href={studioLink.href}
                        onClick={toggleMenu}
                        className="group block rounded-2xl border border-piko-teal/50 bg-gradient-to-r from-piko-teal/15 via-piko-teal/10 to-transparent p-5 shadow-[0_0_30px_rgba(0,245,212,0.2)] backdrop-blur-md"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm uppercase tracking-[0.18em] text-piko-teal">Member Studio</p>
                            <p className="text-xl font-semibold text-zinc-100">Enter Workspace</p>
                            <p className="text-sm text-zinc-400 mt-1">{studioLink.blurb}</p>
                          </div>
                          <motion.span
                            className="text-piko-teal text-2xl"
                            animate={{ x: [0, 6, 0] }}
                            transition={{ repeat: Infinity, duration: 1.6 }}
                          >
                            →
                          </motion.span>
                        </div>
                        <div className="mt-4 h-[2px] bg-gradient-to-r from-piko-teal via-piko-pink to-piko-orange blur-[2px] opacity-80" />
                      </Link>
                    </div>
                  </div>
                </motion.aside>
              ) : (
                <div className="w-full max-w-4xl">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                        },
                      },
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  >
                    {menuItems.map(renderMenuCard)}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center text-sm text-zinc-500"
                  >
                    Swipe right or tap outside to close
                  </motion.div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
