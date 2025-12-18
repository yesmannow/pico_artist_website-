/**
 * Community Placeholder Component
 * Future fan engagement section for events page
 */

'use client';

import { motion } from 'framer-motion';
import Users from 'lucide-react/dist/esm/icons/users';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import Heart from 'lucide-react/dist/esm/icons/heart';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';

export default function CommunityPlaceholder() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-zinc-800/70 bg-zinc-900/40 backdrop-blur-xl overflow-hidden p-12"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/5 via-transparent to-piko-pink/5" />
          
          {/* Content */}
          <div className="relative text-center space-y-6">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-piko-teal/20 to-piko-pink/20 border border-piko-teal/30 mb-4">
              <Users className="w-10 h-10 text-piko-teal" />
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-100">
              Join the <span className="bg-gradient-to-r from-piko-teal to-piko-pink bg-clip-text text-transparent">Community</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Connect with other fans, share your favorite tracks, discuss upcoming events, and be part of the Digital Graffiti Collective.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm"
              >
                <MessageCircle className="w-8 h-8 text-piko-teal mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Fan Discussions</h3>
                <p className="text-sm text-zinc-400">
                  Chat with other fans about tracks, lyrics, and upcoming releases
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm"
              >
                <Heart className="w-8 h-8 text-piko-pink mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Exclusive Content</h3>
                <p className="text-sm text-zinc-400">
                  Get early access to tracks, behind-the-scenes footage, and more
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-xl border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm"
              >
                <Sparkles className="w-8 h-8 text-piko-orange mb-3 mx-auto" />
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Fan Events</h3>
                <p className="text-sm text-zinc-400">
                  Join virtual meetups, Q&A sessions, and exclusive performances
                </p>
              </motion.div>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 bg-zinc-800/60 text-zinc-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
