'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signIn } from '@/lib/supabase';

function LoginForm() {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder-zinc-500 focus:border-piko-pink focus:ring-2 focus:ring-piko-pink/20 focus:outline-none transition-all"
          placeholder="you@example.com"
          style={{
            boxShadow: '0 0 20px rgba(255, 0, 110, 0)',
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(255, 0, 110, 0.3)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(255, 0, 110, 0)';
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-100 placeholder-zinc-500 focus:border-piko-pink focus:ring-2 focus:ring-piko-pink/20 focus:outline-none transition-all"
          placeholder="••••••••"
          style={{
            boxShadow: '0 0 20px rgba(255, 0, 110, 0)',
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(255, 0, 110, 0.3)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(255, 0, 110, 0)';
          }}
        />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-piko-teal to-piko-pink font-semibold text-white shadow-lg shadow-piko-pink/20 transition-all hover:scale-105 hover:shadow-piko-pink/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </motion.button>
    </form>
  );
}

export default function LoginPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Interactive Mouse Spotlight */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 0, 110, 0.15), transparent 80%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl p-8 shadow-2xl">
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
            className="flex justify-center mb-8"
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
            className="text-3xl font-bold text-center text-zinc-100 mb-2"
          >
            Welcome to the Studio
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center text-zinc-400 mb-8"
          >
            Sign in to access your private recording studio
          </motion.p>

          <Suspense fallback={<div className="text-center text-zinc-400">Loading...</div>}>
            <LoginForm />
          </Suspense>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-sm text-zinc-400"
          >
            Demo credentials for testing purposes only
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
