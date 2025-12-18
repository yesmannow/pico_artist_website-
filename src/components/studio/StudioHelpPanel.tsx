'use client';

import { motion, AnimatePresence } from 'framer-motion';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';
import X from 'lucide-react/dist/esm/icons/x';

interface StudioHelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudioHelpPanel({ isOpen, onClose }: StudioHelpPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-800 shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-piko-teal" />
                  <h2 className="text-2xl font-bold text-zinc-100">Studio Help</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6 text-sm text-zinc-300">
                <section>
                  <h3 className="text-lg font-semibold text-piko-teal mb-2">Current Features</h3>
                  <ul className="space-y-2 text-zinc-400">
                    <li>• Multi-track recording with local storage</li>
                    <li>• Project management (save/load/delete)</li>
                    <li>• Activity log tracking</li>
                    <li>• Export/Import JSON bundles</li>
                    <li>• No authentication required</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-piko-teal mb-2">Future Integration</h3>
                  <div className="space-y-3 text-zinc-400">
                    <p>
                      This Studio is currently using <strong className="text-zinc-300">localStorage</strong> for
                      persistence. Future integration points with Supabase:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li>
                        <strong className="text-piko-pink">Projects Table:</strong> Store projects in Supabase
                        database with user association
                      </li>
                      <li>
                        <strong className="text-piko-pink">Tracks Table:</strong> Upload audio files to Supabase
                        Storage and track metadata
                      </li>
                      <li>
                        <strong className="text-piko-pink">Real-time Sync:</strong> Use Supabase Realtime for
                        collaborative editing
                      </li>
                      <li>
                        <strong className="text-piko-pink">User Authentication:</strong> Protect Studio access
                        with Supabase Auth
                      </li>
                      <li>
                        <strong className="text-piko-pink">Activity Feed:</strong> Shared activity log across
                        all users
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-piko-teal mb-2">Data Persistence</h3>
                  <div className="space-y-2 text-zinc-400">
                    <p>
                      All data is currently stored in your browser&apos;s <code className="text-piko-orange">localStorage</code>.
                      Use the Export/Import feature to backup your projects.
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">
                      Note: Data will be lost if you clear your browser cache.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-piko-teal mb-2">Keyboard Shortcuts</h3>
                  <ul className="space-y-1 text-zinc-400">
                    <li>
                      <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">Shift + S</kbd> - Navigate to Studio
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-piko-teal mb-2">Access</h3>
                  <p className="text-zinc-400">
                    Studio is accessible via a subtle footer link or the{' '}
                    <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">Shift + S</kbd> keyboard shortcut.
                    No login required for now.
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

