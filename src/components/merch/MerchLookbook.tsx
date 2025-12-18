/**
 * MerchLookbook - "The Stash" Component
 * Horizontal scroll merch preview with grayscale hover effects
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Lock from 'lucide-react/dist/esm/icons/lock';

interface MerchItem {
  id: string;
  name: string;
  category: string;
  price: string;
  image?: string;
}

const merchItems: MerchItem[] = [
  {
    id: 'merch-1',
    name: 'Digital Graffiti Hoodie',
    category: 'Apparel',
    price: '$65',
    image: '/assets/images/bg/graffiti_1874452_1280.jpg',
  },
  {
    id: 'merch-2',
    name: 'Piko FG Cap',
    category: 'Headwear',
    price: '$35',
    image: '/assets/images/bg/wall_2602116_1280.jpg',
  },
  {
    id: 'merch-3',
    name: 'Limited Edition Vinyl',
    category: 'Music',
    price: '$45',
    image: '/assets/images/bg/window_999882_1280.jpg',
  },
];

export default function MerchLookbook() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black text-zinc-100 mb-4">
            THE <span className="bg-gradient-to-r from-piko-orange to-piko-pink bg-clip-text text-transparent">STASH</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Exclusive merchandise — Limited drops for the Digital Graffiti Collective
          </p>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          {/* Scroll wrapper */}
          <div className="overflow-x-auto pb-6 scrollbar-hide">
            <div className="flex gap-6 min-w-max px-4">
              {merchItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onHoverStart={() => setHoveredItem(item.id)}
                  onHoverEnd={() => setHoveredItem(null)}
                  className="group relative w-80 flex-shrink-0"
                >
                  {/* Card */}
                  <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md overflow-hidden hover:border-piko-orange/50 transition-all hover:shadow-xl hover:shadow-piko-orange/20">
                    {/* Image with grayscale filter */}
                    <div className="relative aspect-square overflow-hidden">
                      {/* Background gradient as placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
                      
                      {/* Noise texture overlay */}
                      {item.image && (
                        <div
                          className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500"
                          style={{
                            backgroundImage: `url(${item.image})`,
                            filter: hoveredItem === item.id 
                              ? 'grayscale(0) brightness(1.1)' 
                              : 'grayscale(1) brightness(0.6)',
                          }}
                        >
                          {/* Heavy noise filter */}
                          <div 
                            className="absolute inset-0 opacity-40 group-hover:opacity-10 transition-opacity duration-500"
                            style={{
                              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                            }}
                          />
                        </div>
                      )}

                      {/* Locked overlay */}
                      <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center group-hover:bg-zinc-950/60 transition">
                        <motion.div
                          className="text-center"
                          animate={{
                            scale: hoveredItem === item.id ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-piko-orange to-piko-pink flex items-center justify-center mb-3 mx-auto">
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-sm font-bold text-zinc-400 group-hover:text-piko-orange transition">
                            LOCKED
                          </p>
                        </motion.div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-piko-orange font-semibold mb-1">
                            {item.category}
                          </p>
                          <h3 className="text-xl font-bold text-zinc-100 group-hover:text-piko-orange transition">
                            {item.name}
                          </h3>
                        </div>
                        <span className="text-lg font-bold text-zinc-400">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll indicators */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <button
            disabled
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-piko-orange/50 bg-piko-orange/10 text-piko-orange font-bold cursor-not-allowed"
          >
            <Lock className="w-5 h-5" />
            LOCKED // JOIN WAITLIST
            <span className="absolute -top-2 -right-2 px-3 py-1 bg-piko-pink text-white text-xs font-bold rounded-full">
              SOON
            </span>
          </button>
          <p className="text-sm text-zinc-500 mt-4">
            Merch drops coming soon. Sign the wall to get notified.
          </p>
        </motion.div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
