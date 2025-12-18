'use client';

import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import { useStudioStore } from '@/store/studioStore';
import { motion } from 'framer-motion';

export default function StudioHeader() {
  const isSaving = useStudioStore((state) => state.isSaving);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-zinc-100">
            Piko <span className="bg-gradient-to-r from-piko-teal to-piko-pink bg-clip-text text-transparent">Studio</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Sync Icon */}
          <motion.div
            animate={{
              scale: isSaving ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: isSaving ? Infinity : 0,
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-5 w-5 transition-colors ${
                isSaving
                  ? 'text-piko-teal animate-spin'
                  : 'text-zinc-400'
              }`}
              style={{
                filter: isSaving ? 'drop-shadow(0 0 8px rgba(0, 245, 212, 0.8))' : 'none',
              }}
            />
            <span
              className={`text-xs font-medium transition-colors ${
                isSaving ? 'text-piko-teal' : 'text-zinc-400'
              }`}
            >
              {isSaving ? 'Saving...' : 'Synced'}
            </span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
