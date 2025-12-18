/**
 * Story Timeline Component
 * Interactive timeline showing Piko FG's journey
 * with modals for photos/videos
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import X from 'lucide-react/dist/esm/icons/x';
import Calendar from 'lucide-react/dist/esm/icons/calendar';

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  image?: string;
  videoId?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 'event-1',
    year: '2018',
    title: 'The Beginning',
    description: 'Started making beats in a small bedroom studio, inspired by the graffiti-covered streets and underground hip-hop scene.',
    image: '/assets/images/bg/graffiti_1874452_1280.jpg',
  },
  {
    id: 'event-2',
    year: '2020',
    title: 'First Release',
    description: 'Released debut tracks during the global lockdown, connecting with fans through raw emotion and digital soundscapes.',
    image: '/assets/images/artist/on_the_mic.jpg',
  },
  {
    id: 'event-3',
    year: '2022',
    title: 'Live Performances',
    description: 'Took the stage for the first time, bringing the Digital Graffiti sound to live audiences across the city.',
    image: '/assets/images/hero/black_and_white_standing_low_shot.jpg',
  },
  {
    id: 'event-4',
    year: '2024',
    title: 'Studio Evolution',
    description: 'Built a professional studio space, launched this platform, and expanded the creative vision with visuals and video content.',
    image: '/assets/images/artist/close_up_face.jpg',
  },
];

export default function StoryTimeline() {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-piko-orange mb-4">
            The Journey
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
            Story of <span className="bg-gradient-to-r from-piko-teal to-piko-pink bg-clip-text text-transparent">Piko FG</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            From bedroom beats to digital graffiti — the evolution of a sound
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-piko-teal via-piko-pink to-piko-orange opacity-30" />

          {/* Events */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                >
                  {/* Content Card */}
                  <div className="flex-1">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className={`group w-full text-left rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-6 hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10 transition-all ${
                        isLeft ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-piko-orange" />
                        <span className="text-sm font-semibold text-piko-orange">
                          {event.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-piko-teal transition">
                        {event.title}
                      </h3>
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {event.description}
                      </p>
                      <p className="text-xs text-piko-teal mt-3 opacity-0 group-hover:opacity-100 transition">
                        Click to view details →
                      </p>
                    </button>
                  </div>

                  {/* Year Bubble */}
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full border-2 border-piko-teal bg-zinc-950 flex items-center justify-center shadow-lg shadow-piko-teal/20">
                      <span className="text-sm font-bold text-piko-teal">
                        {event.year.slice(2)}
                      </span>
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-xl"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full rounded-3xl border border-piko-teal/50 bg-zinc-900/95 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_rgba(0,245,212,0.3)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 transition"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>

              {/* Image */}
              {selectedEvent.image && (
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="p-8 relative">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-piko-orange" />
                  <span className="text-lg font-semibold text-piko-orange">
                    {selectedEvent.year}
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-zinc-100 mb-4">
                  {selectedEvent.title}
                </h2>
                <p className="text-lg text-zinc-300 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
