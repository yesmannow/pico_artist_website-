/**
 * Share Buttons Component
 * Social sharing for tracks and content
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Share2 from 'lucide-react/dist/esm/icons/share-2';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Link2 from 'lucide-react/dist/esm/icons/link-2';
import Check from 'lucide-react/dist/esm/icons/check';

interface ShareButtonsProps {
  title: string;
  url?: string;
  description?: string;
  variant?: 'default' | 'minimal';
}

export default function ShareButtons({ 
  title, 
  url, 
  description,
  variant = 'default'
}: ShareButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = description || title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 transition-all ${
          variant === 'minimal'
            ? 'text-zinc-400 hover:text-piko-teal'
            : 'px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/60 hover:border-piko-teal/50 hover:bg-zinc-800 text-zinc-300'
        }`}
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" />
        {variant === 'default' && <span className="text-sm font-medium">Share</span>}
      </button>

      {/* Share Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[200px] rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-xl shadow-lg overflow-hidden"
            >
              <div className="p-2 space-y-1">
                {/* Twitter */}
                <button
                  onClick={handleTwitterShare}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1DA1F2]/10 flex items-center justify-center">
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                  </div>
                  <span className="text-sm text-zinc-300">Twitter</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleFacebookShare}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-[#1877F2]/10 flex items-center justify-center">
                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                  </div>
                  <span className="text-sm text-zinc-300">Facebook</span>
                </button>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 transition text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-piko-teal/10 flex items-center justify-center">
                    {copied ? (
                      <Check className="w-4 h-4 text-piko-teal" />
                    ) : (
                      <Link2 className="w-4 h-4 text-piko-teal" />
                    )}
                  </div>
                  <span className="text-sm text-zinc-300">
                    {copied ? 'Copied!' : 'Copy Link'}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
