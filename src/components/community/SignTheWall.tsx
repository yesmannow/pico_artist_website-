/**
 * SignTheWall - Digital Graffiti Wall Component
 * Interactive email capture with spray paint aesthetics
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';

export default function SignTheWall() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const spraySound = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize spray sound effect
    // Using a short burst of white noise as spray can hiss
    spraySound.current = new Howl({
      src: ['/lofi-teaser.wav'], // Fallback - ideally would be a spray can sound
      volume: 0.3,
      rate: 3, // Speed up for quick hiss effect
      sprite: {
        spray: [0, 200], // 200ms spray sound
      },
    });

    return () => {
      spraySound.current?.unload();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    setIsSubmitting(true);

    // Play spray sound
    if (spraySound.current) {
      spraySound.current.play('spray');
    }

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Show success animation
    setShowSuccess(true);
    setEmail('');
    setIsSubmitting(false);

    // Reset after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);

    // TODO: Implement actual email capture logic (Supabase, etc.)
    // Example: await supabase.from('subscribers').insert({ email });
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Graffiti wall background */}
      <div className="absolute inset-0 bg-[url('/assets/images/bg/wall_2602116_1280.jpg')] opacity-5 bg-cover bg-center" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-6xl font-black text-zinc-100 mb-4">
            SIGN THE <span className="bg-gradient-to-r from-piko-pink to-piko-teal bg-clip-text text-transparent">WALL</span>
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Join the Digital Graffiti Collective. Get exclusive updates, drops, and behind-the-scenes access.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative"
        >
          {/* Main form container with spray paint aesthetic */}
          <div className="relative rounded-3xl border-2 border-zinc-800 bg-zinc-900/60 backdrop-blur-xl p-8 md:p-12 overflow-hidden">
            {/* Spray paint drips effect */}
            <div className="absolute top-0 left-1/4 w-1 h-12 bg-gradient-to-b from-piko-pink to-transparent opacity-60" />
            <div className="absolute top-0 left-1/2 w-1 h-16 bg-gradient-to-b from-piko-teal to-transparent opacity-60" />
            <div className="absolute top-0 right-1/3 w-1 h-10 bg-gradient-to-b from-piko-orange to-transparent opacity-60" />

            <AnimatePresence mode="wait">
              {!showSuccess ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Email Input - Spray Paint Stencil Style */}
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-4 bg-zinc-950/80 border-2 border-zinc-700 rounded-full text-zinc-100 placeholder-zinc-500 focus:border-piko-teal focus:outline-none focus:ring-2 focus:ring-piko-teal/50 transition disabled:opacity-50 font-mono text-lg"
                      style={{
                        textShadow: '0 0 10px rgba(0, 245, 212, 0.3)',
                      }}
                    />

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !email}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-gradient-to-r from-piko-pink to-piko-teal rounded-full text-white font-bold text-lg shadow-lg shadow-piko-pink/30 hover:shadow-piko-pink/50 transition disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            ⚡
                          </motion.span>
                          TAGGING...
                        </span>
                      ) : (
                        'ADD TAG'
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-8"
                >
                  {/* Success Animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-piko-teal to-piko-pink flex items-center justify-center shadow-2xl shadow-piko-teal/50">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl"
                      >
                        ✓
                      </motion.span>
                    </div>
                  </motion.div>

                  <h3 className="text-2xl md:text-3xl font-bold text-piko-teal mb-2">
                    TAG ADDED!
                  </h3>
                  <p className="text-zinc-400">
                    Welcome to the collective. Check your email for exclusive content.
                  </p>

                  {/* Spray paint splatter effect */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-br from-piko-teal to-piko-pink blur-3xl -z-10"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Additional decorative elements */}
          <motion.div
            className="absolute -bottom-2 -right-2 w-32 h-32 bg-gradient-to-br from-piko-pink/20 to-piko-orange/20 rounded-full blur-2xl -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -top-2 -left-2 w-32 h-32 bg-gradient-to-br from-piko-teal/20 to-piko-pink/20 rounded-full blur-2xl -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
