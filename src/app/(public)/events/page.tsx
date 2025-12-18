'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import X from 'lucide-react/dist/esm/icons/x';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Download from 'lucide-react/dist/esm/icons/download';
import CommunityPlaceholder from '@/components/events/CommunityPlaceholder';
import { downloadICS, parseEventDate, addHours } from '@/lib/calendar';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

// keep your TourDate type for runtime use
type TourDate = {
  lat: number;
  lng: number;
  name: string;
  date: string;
  status: string;
  venue: string;
  ticketUrl?: string;
};

const tourDates: TourDate[] = [
  {
    lat: 19.4326,
    lng: -99.1332,
    name: 'Mexico City',
    venue: 'Palacio de los Deportes',
    date: 'Jan 15, 2026',
    status: 'Tickets Available',
    ticketUrl: 'https://www.ticketmaster.com',
  },
  {
    lat: 34.0522,
    lng: -118.2437,
    name: 'Los Angeles',
    venue: 'The Wiltern',
    date: 'Feb 02, 2026',
    status: 'Sold Out',
  },
  {
    lat: 35.6762,
    lng: 139.6503,
    name: 'Tokyo',
    venue: 'Liquidroom',
    date: 'Mar 10, 2026',
    status: 'Selling Fast',
    ticketUrl: 'https://www.eventbrite.com',
  },
  {
    lat: 40.7128,
    lng: -74.0060,
    name: 'New York',
    venue: 'Brooklyn Steel',
    date: 'Apr 20, 2026',
    status: 'Coming Soon',
  },
  {
    lat: 52.5200,
    lng: 13.4050,
    name: 'Berlin',
    venue: 'Berghain',
    date: 'May 12, 2026',
    status: 'Member Studio Exclusive',
  },
];

export default function EventsPage() {
  // Use a MutableRefObject matching GlobeMethods signature by using any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<TourDate | null>(null);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, []);

  const handlePointClick = (point: TourDate) => {
    setSelectedEvent(point);
  };

  const handleDownloadCalendar = (event: TourDate) => {
    const startDate = parseEventDate(event.date);
    const endDate = addHours(startDate, 3); // 3 hour event duration

    downloadICS({
      title: `Piko FG - ${event.name}`,
      description: `Piko FG live performance at ${event.venue}`,
      location: `${event.venue}, ${event.name}`,
      startDate,
      endDate,
      url: event.ticketUrl,
    });
  };

  return (
    <div className="min-h-screen px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-piko-orange/10 via-transparent to-piko-teal/10 blur-3xl" />

      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">Events</p>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-100">Digital Graffiti Events</h1>
          <p className="text-zinc-400 max-w-3xl mx-auto">
            Upcoming shows, performances, and experiences — tickets and dates for the Digital Graffiti Collective.
          </p>
        </motion.div>

        {/* Interactive Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative h-[600px] rounded-3xl border border-zinc-800/70 bg-zinc-900/40 backdrop-blur-xl overflow-hidden shadow-[0_20px_120px_rgba(0,0,0,0.5)]"
        >
          <Globe
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            pointsData={tourDates}
            pointColor={() => '#00f5d4'}
            pointAltitude={0.07}
            pointRadius={0.5}
            // cast incoming object to any then to TourDate inside
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pointLat={(obj: any) => (obj as TourDate).lat}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pointLng={(obj: any) => (obj as TourDate).lng}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            pointLabel={(obj: any) => {
              const d = obj as TourDate;
              return `
                <div class="glassmorphism p-4 border-l-4 border-pikoTeal bg-zinc-900/90 backdrop-blur-md rounded-lg">
                  <div class="font-bold">${d.name}</div>
                  <div class="text-sm">${d.date}</div>
                  ${d.venue ? `<div class="text-xs">${d.venue}</div>` : ""}
                  ${d.status ? `<div class="text-xs">${d.status}</div>` : ""}
                </div>
              `;
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onPointClick={(obj: any) => {
              const d = obj as TourDate;
              handlePointClick(d);
            }}
            atmosphereColor="#ff006e"
            atmosphereAltitude={0.15}
            enablePointerInteraction={true}
          />
        </motion.div>

        {/* Event List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {tourDates.map((event, idx) => (
            <motion.div
              key={`${event.lat}-${event.lng}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
              onClick={() => setSelectedEvent(event)}
              className="relative rounded-2xl border border-zinc-800 bg-zinc-950/60 px-5 py-4 backdrop-blur-md hover:border-piko-teal/50 hover:shadow-lg hover:shadow-piko-teal/10 transition cursor-pointer group"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-gradient-to-br from-piko-teal/40 to-transparent blur-3xl" />
              </div>

              <p className="text-xs uppercase tracking-[0.24em] text-piko-orange">{event.date}</p>
              <p className="text-lg font-semibold text-zinc-50">{event.name}</p>
              <p className="text-sm text-zinc-400">{event.venue}</p>
              {event.status && (
                <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-piko-pink/10 px-3 py-1 text-[11px] font-semibold text-piko-pink border border-piko-pink/40">
                  {event.status}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Community Section */}
        <CommunityPlaceholder />
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xl"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full rounded-3xl border border-piko-teal/50 bg-zinc-900/90 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(0,245,212,0.3)]"
            >
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 transition"
                aria-label="Close event details"
                title="Close"
              >
                <X className="h-5 w-5 text-zinc-400" />
              </button>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-piko-teal">{selectedEvent.date}</p>
                  <h2 className="text-3xl font-bold text-zinc-100 mt-2">{selectedEvent.name}</h2>
                  <p className="text-lg text-zinc-400 mt-1">{selectedEvent.venue}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-piko-pink/10 text-piko-pink text-sm font-semibold border border-piko-pink/40">
                    {selectedEvent.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-6">
                  <button
                    onClick={() => handleDownloadCalendar(selectedEvent)}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border border-piko-teal bg-piko-teal/10 text-piko-teal font-semibold hover:bg-piko-teal/20 transition"
                  >
                    <Download className="h-4 w-4" />
                    Add to Calendar
                  </button>

                  {selectedEvent.ticketUrl && (
                    <a
                      href={selectedEvent.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-gradient-to-r from-piko-teal to-piko-pink text-white font-semibold hover:scale-105 transition shadow-lg shadow-piko-pink/20"
                    >
                      Buy Tickets
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
