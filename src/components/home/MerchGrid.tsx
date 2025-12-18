'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

type MerchItem = {
  title: string;
  price: string;
  image: string;
  accent: string;
};

const merch: MerchItem[] = [
  {
    title: "Graffiti Hoodie",
    price: "$65",
    image: "/merch-hoodie.svg",
    accent: "from-piko-pink/50 to-piko-orange/40",
  },
  {
    title: "Neon Snapback",
    price: "$38",
    image: "/merch-hat.svg",
    accent: "from-piko-teal/50 to-piko-pink/40",
  },
  {
    title: "Vinyl: Digital Graffiti",
    price: "$45",
    image: "/merch-vinyl.svg",
    accent: "from-piko-orange/45 to-piko-teal/35",
  },
];

export default function MerchGrid({ condensed = false }: { condensed?: boolean }) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">Merch</p>
          <h2 className="text-3xl font-bold text-zinc-100">Piko Splash Capsule</h2>
          <p className="text-sm text-zinc-400">Gear built for the cinematic dark aesthetic.</p>
        </div>
        <button className="rounded-full border border-piko-teal/50 bg-piko-teal/10 px-4 py-2 text-sm font-semibold text-piko-teal shadow-[0_0_20px_rgba(0,245,212,0.25)] transition hover:scale-[1.02] active:scale-95">
          View drop
        </button>
      </div>

      <div className={`grid gap-5 ${condensed ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {merch.map((item, idx) => (
          <Tilt
            key={item.title}
            className="parallax-effect-glare-scale"
            perspective={1000}
            glareEnable={true}
            glareMaxOpacity={0.3}
            scale={1.02}
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            transitionSpeed={1000}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/60 p-5 backdrop-blur-xl shadow-[0_20px_120px_rgba(0,0,0,0.45)] hover:border-piko-teal/50 transition"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
                <div className={`absolute -inset-8 bg-gradient-to-br ${item.accent} blur-3xl`} />
                <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-piko-pink/30 blur-3xl" />
              </div>

              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-50">{item.title}</p>
                  <p className="text-xs text-zinc-400">{item.price}</p>
                </div>
                <span className="text-xs rounded-full border border-piko-orange/50 bg-piko-orange/10 px-3 py-1 text-piko-orange font-semibold shadow-[0_0_20px_rgba(255,158,0,0.3)]">
                  Piko Splash
                </span>
              </div>

              <div className="relative mt-4">
                <div className="absolute -inset-2 bg-gradient-to-br from-piko-teal/10 via-piko-pink/8 to-transparent blur-2xl" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/60">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    priority={idx === 0}
                  />

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,245,212,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,0,110,0.16),transparent_32%),radial-gradient(circle_at_60%_80%,rgba(255,158,0,0.18),transparent_32%)]" />
                    <div className="absolute inset-x-4 -bottom-10 h-24 rounded-full bg-gradient-to-r from-piko-teal/40 via-piko-pink/30 to-piko-orange/40 blur-3xl" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}
