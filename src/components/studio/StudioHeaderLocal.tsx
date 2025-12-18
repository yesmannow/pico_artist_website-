'use client';

import Link from 'next/link';
import Home from 'lucide-react/dist/esm/icons/home';
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle';

interface StudioHeaderLocalProps {
  onHelpClick: () => void;
}

export default function StudioHeaderLocal({ onHelpClick }: StudioHeaderLocalProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-zinc-400">
            <Link
              href="/"
              className="hover:text-piko-teal transition flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-zinc-100">Studio</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-zinc-100 hidden md:block">
            Piko <span className="bg-gradient-to-r from-piko-teal to-piko-pink bg-clip-text text-transparent">Studio</span>
          </h1>
          <button
            onClick={onHelpClick}
            className="p-2 rounded-lg text-zinc-400 hover:text-piko-teal hover:bg-zinc-800 transition"
            title="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

