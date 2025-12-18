'use client';

import Link from "next/link";
import { motion } from "framer-motion";

type TourStop = {
  date: string;
  city: string;
  venue: string;
  status?: string;
};

const tourStops: TourStop[] = [
  { date: "JAN 24", city: "Brooklyn, NY", venue: "Elsewhere Hall", status: "Low tickets" },
  { date: "FEB 02", city: "Los Angeles, CA", venue: "The Echo", status: "On sale" },
  { date: "FEB 15", city: "Austin, TX", venue: "Empire Control", status: "New" },
  { date: "MAR 01", city: "Toronto, ON", venue: "Velvet Underground" },
  { date: "MAR 14", city: "Chicago, IL", venue: "Sleeping Village", status: "Low tickets" },
];

export default function TourSection({ compact = false }: { compact?: boolean }) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-10 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl border border-zinc-800/70 bg-zinc-900/40 backdrop-blur-xl px-6 sm:px-8 py-8 shadow-[0_20px_120px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-x-10 -top-6 h-16 bg-gradient-to-r from-piko-teal/20 via-piko-pink/15 to-piko-orange/20 blur-3xl opacity-70" />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between relative">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">Tour</p>
            <h2 className="text-3xl font-bold text-zinc-100">Catch the live glitch set</h2>
            <p className="text-zinc-400 text-sm mt-1">
              Cinematic nights with paint-drip visuals and midnight bass.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full border border-piko-pink/50 bg-piko-pink/10 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_30px_rgba(255,0,110,0.25)] transition hover:scale-[1.02] hover:border-piko-teal hover:text-piko-teal"
          >
            Tickets
            <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
              →
            </motion.span>
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto pb-2">
          <div className={`flex gap-4 min-w-full ${compact ? "sm:grid sm:grid-cols-2" : ""}`}>
            {tourStops.map((stop, idx) => (
              <motion.div
                key={stop.date + stop.city}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                className="relative flex-1 min-w-[240px] rounded-2xl border border-zinc-800 bg-zinc-950/60 px-5 py-4 backdrop-blur-md hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10 transition group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                  <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-gradient-to-br from-piko-teal/40 to-transparent blur-3xl" />
                </div>

                <p className="text-xs uppercase tracking-[0.24em] text-piko-orange">
                  {stop.date}
                </p>
                <p className="text-lg font-semibold text-zinc-50">{stop.city}</p>
                <p className="text-sm text-zinc-400">{stop.venue}</p>
                {stop.status && (
                  <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-piko-pink/10 px-3 py-1 text-[11px] font-semibold text-piko-pink border border-piko-pink/40">
                    {stop.status}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
