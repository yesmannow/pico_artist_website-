'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type HeroVariant = 'music' | 'videos' | 'default';
type Align = 'left' | 'center';

interface CinematicHeroProps {
  title: string;
  subtitle?: string;
  backgroundImageUrl: string;
  align?: Align;
  variant?: HeroVariant;
}

const NOISE_SVG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")";

function variantGradients(variant: HeroVariant) {
  switch (variant) {
    case 'music':
      return 'from-piko-teal/30 via-piko-pink/20 to-transparent';
    case 'videos':
      return 'from-piko-orange/30 via-piko-pink/25 to-transparent';
    default:
      return 'from-piko-teal/25 via-piko-orange/20 to-transparent';
  }
}

export default function CinematicHero({
  title,
  subtitle,
  backgroundImageUrl,
  align = 'center',
  variant = 'default',
}: CinematicHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      data-hero
      className="relative overflow-hidden rounded-b-[32px] border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur-xl"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImageUrl}
          alt={title}
          fill
          priority
          className="object-cover opacity-90"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/75 to-zinc-950" />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${variantGradients(variant)} opacity-80`}
        />
      </div>

      {/* Grain overlay */}
      <div
      className="absolute inset-0 pointer-events-none opacity-30"
      aria-hidden
      style={{
          backgroundImage: NOISE_SVG,
        }}
      />

      {/* Paint splatter glow accent */}
      <div className="absolute -left-20 top-10 h-60 w-60 rounded-full bg-piko-teal/20 blur-[80px]" />
      <div className="absolute right-0 bottom-10 h-52 w-52 rounded-full bg-piko-pink/25 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 py-20">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`max-w-3xl space-y-4 ${align === 'center' ? 'text-center mx-auto' : 'text-left'}`}
        >
          <p className="text-xs uppercase tracking-[0.32em] text-piko-teal drop-shadow-[0_0_12px_rgba(0,245,212,0.35)]">
            Digital Graffiti
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-50 leading-tight drop-shadow-[0_6px_28px_rgba(0,0,0,0.55)]">
            {title}
          </h1>
          {subtitle && <p className="text-lg md:text-xl text-zinc-300 max-w-2xl">{subtitle}</p>}
        </motion.div>

        {/* Floating chips */}
        <div className={`mt-10 flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
          {['Splatter Magenta', 'Drip Cyan', 'Splash Orange'].map((chip, index) => (
            <motion.span
              key={chip}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="rounded-full border border-zinc-800/70 bg-zinc-900/70 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-sm"
            >
              {chip}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
