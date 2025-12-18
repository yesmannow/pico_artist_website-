'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signIn } from '@/lib/supabase';

function LoginForm({ onSystemOverride }: { onSystemOverride: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      const redirectTo = searchParams.get('redirectTo') || '/studio';
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemOverride = () => {
    onSystemOverride();
    // Could add special access logic here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2 font-mono">
          [EMAIL]
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900/80 text-zinc-100 placeholder-zinc-500 focus:border-piko-teal focus:ring-2 focus:ring-piko-teal/20 focus:outline-none transition-all font-mono text-sm"
          placeholder="user@domain.com"
          style={{
            boxShadow: '0 0 20px rgba(0, 245, 212, 0)',
            textShadow: '0 0 10px rgba(0, 245, 212, 0.3)',
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(0, 245, 212, 0.3)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(0, 245, 212, 0)';
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2 font-mono">
          [PASSWORD]
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-900/80 text-zinc-100 placeholder-zinc-500 focus:border-piko-teal focus:ring-2 focus:ring-piko-teal/20 focus:outline-none transition-all font-mono text-sm"
          placeholder="••••••••"
          style={{
            boxShadow: '0 0 20px rgba(0, 245, 212, 0)',
            textShadow: '0 0 10px rgba(0, 245, 212, 0.3)',
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(0, 245, 212, 0.3)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(0, 245, 212, 0)';
          }}
        />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm font-mono"
        >
          [ERROR] {error}
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-piko-teal to-piko-pink font-semibold text-white shadow-lg shadow-piko-pink/20 transition-all hover:scale-105 hover:shadow-piko-pink/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-mono"
      >
        {loading ? '[AUTHENTICATING...]' : '[SIGN IN]'}
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        type="button"
        onClick={handleSystemOverride}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2 px-4 rounded-lg border border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-red-500/50 hover:text-red-400 transition-all font-mono text-xs"
      >
        [SYSTEM OVERRIDE]
      </motion.button>
    </form>
  );
}

export default function LoginPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [flicker, setFlicker] = useState(0);
  const [screenShake, setScreenShake] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // CRT Flicker Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFlicker(Math.random() * 0.02);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden"
      animate={{
        x: screenShake ? [0, -10, 10, -10, 10, 0] : 0,
        y: screenShake ? [0, 10, -10, 10, -10, 0] : 0,
      }}
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
      }}
    >
      {/* CRT Scanlines Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15) 0px,
              rgba(0, 0, 0, 0.15) 2px,
              transparent 2px,
              transparent 4px
            )
          `,
          opacity: 0.3,
        }}
      />

      {/* CRT Flicker */}
      <div
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${flicker})`,
        }}
      />

      {/* Interactive Mouse Spotlight */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 245, 212, 0.1), transparent 80%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          {/* CRT Terminal Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-piko-teal/5 via-transparent to-piko-pink/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,212,0.1),transparent_70%)]" />

          {/* Terminal Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 mb-6 pb-4 border-b border-zinc-800"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-zinc-500 font-mono ml-2">terminal.exe</span>
            </div>
            <div className="text-xs text-piko-teal font-mono">
              {'>'} SYSTEM ACCESS REQUIRED
            </div>
          </motion.div>

          {/* Stamped Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="flex justify-center mb-8 relative z-10"
          >
            <div className="relative w-32 h-32">
              <Image
                src="/piko-logo.jpg"
                alt="Piko FG Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-center text-zinc-100 mb-2 font-mono relative z-10"
            style={{ textShadow: '0 0 20px rgba(0, 245, 212, 0.5)' }}
          >
            {'>'} WELCOME TO THE STUDIO
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-zinc-400 mb-8 font-mono text-sm relative z-10"
          >
            {'>'} Sign in to access your private recording studio
          </motion.p>

          <Suspense fallback={<div className="text-center text-zinc-400 font-mono">[LOADING...]</div>}>
            <LoginForm onSystemOverride={() => setScreenShake(true)} />
          </Suspense>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-xs text-zinc-500 font-mono relative z-10"
          >
            {'>'} Demo credentials for testing purposes only
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
