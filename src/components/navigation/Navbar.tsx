'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Music, Image as ImageIcon, Mic } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const menuItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
    gradient: 'from-piko-teal to-piko-pink',
  },
  {
    title: 'Tracks',
    href: '/#tracks',
    icon: Music,
    gradient: 'from-piko-pink to-piko-orange',
  },
  {
    title: 'Gallery',
    href: '/gallery',
    icon: ImageIcon,
    gradient: 'from-piko-orange to-piko-teal',
  },
  {
    title: 'Studio',
    href: '/studio',
    icon: Mic,
    gradient: 'from-piko-teal via-piko-pink to-piko-orange',
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
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
              className="relative h-10 w-10 rounded-full bg-gradient-to-r from-piko-teal to-piko-pink p-2 shadow-lg shadow-piko-pink/20 transition-all hover:scale-110 hover:shadow-piko-pink/40"
              aria-label="Toggle menu"
            >
              <motion.div
                initial={false}
                animate={isOpen ? 'open' : 'closed'}
                className="flex items-center justify-center"
              >
                <motion.div
                  variants={{
                    closed: { rotate: 0 },
                    open: { rotate: 180 },
                  }}
                  transition={{ duration: 0.3 }}
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
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-zinc-950/95 backdrop-blur-xl"
            onClick={toggleMenu}
          >
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 400 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                // Close menu if dragged right more than 150px
                if (info.offset.x > 150) {
                  setIsOpen(false);
                }
              }}
              className="h-full flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-4xl">
                {/* 2x2 Mega Menu Grid */}
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
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.href}
                        variants={{
                          hidden: { opacity: 0, y: 50, scale: 0.9 },
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
                            whileTap={{ scale: 0.95 }}
                            className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md p-8 transition-all hover:border-piko-teal/50 hover:shadow-2xl hover:shadow-piko-teal/10"
                          >
                            {/* Background Gradient on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                            
                            {/* Icon */}
                            <div className={`relative mb-6 rounded-2xl bg-gradient-to-br ${item.gradient} p-4 w-fit`}>
                              <Icon className="h-8 w-8 text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="relative text-3xl font-bold text-zinc-100 mb-2">
                              {item.title}
                            </h3>

                            {/* Description */}
                            <p className="relative text-zinc-400 text-sm">
                              {item.title === 'Home' && 'Back to main page'}
                              {item.title === 'Tracks' && 'Browse all tracks'}
                              {item.title === 'Gallery' && 'View media gallery'}
                              {item.title === 'Studio' && 'Record & create'}
                            </p>

                            {/* Arrow indicator */}
                            <div className="relative mt-4 flex items-center gap-2 text-sm text-piko-teal opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>Enter</span>
                              <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                              >
                                →
                              </motion.span>
                            </div>
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Swipe Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 text-center text-sm text-zinc-500"
                >
                  Swipe right or tap outside to close
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
