/**
 * InstagramFeed - 3x2 Masonry Grid Component
 * Placeholder component ready for Instagram Graph API integration
 * 
 * Setup Instructions:
 * 1. Create Facebook App at https://developers.facebook.com/
 * 2. Add Instagram Basic Display API
 * 3. Get Access Token and User ID
 * 4. Add INSTAGRAM_ACCESS_TOKEN to environment variables
 */

'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import { getSocialLink } from '@/data/socials';

interface InstagramPost {
  id: string;
  caption?: string;
  mediaUrl: string;
  permalink: string;
  timestamp: string;
}

// Placeholder data - replace with actual API call
const placeholderPosts: InstagramPost[] = [
  {
    id: '1',
    caption: 'New track out now 🔥',
    mediaUrl: '/assets/images/bg/graffiti_1874452_1280.jpg',
    permalink: 'https://www.instagram.com/piko289/',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    caption: 'Studio vibes ✨',
    mediaUrl: '/assets/images/bg/wall_2602116_1280.jpg',
    permalink: 'https://www.instagram.com/piko289/',
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    caption: 'Behind the scenes 📸',
    mediaUrl: '/assets/images/bg/window_999882_1280.jpg',
    permalink: 'https://www.instagram.com/piko289/',
    timestamp: new Date().toISOString(),
  },
  {
    id: '4',
    caption: 'Live performance energy 🎤',
    mediaUrl: '/assets/images/artist/on_the_mic.jpg',
    permalink: 'https://www.instagram.com/piko289/',
    timestamp: new Date().toISOString(),
  },
  {
    id: '5',
    caption: 'Digital graffiti aesthetic 🎨',
    mediaUrl: '/assets/images/artist/close_up_face.jpg',
    permalink: 'https://www.instagram.com/piko289/',
    timestamp: new Date().toISOString(),
  },
  {
    id: '6',
    caption: 'New visuals coming soon 👀',
    mediaUrl: '/assets/images/hero/black_and_white_standing_low_shot.jpg',
    permalink: 'https://www.instagram.com/piko289/',
    timestamp: new Date().toISOString(),
  },
];

export default function InstagramFeed() {
  const instagramLink = getSocialLink('instagram');

  // TODO: Implement actual Instagram API call
  // const [posts, setPosts] = useState<InstagramPost[]>([]);
  // const [loading, setLoading] = useState(true);
  
  const posts = placeholderPosts;

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Instagram className="w-8 h-8 text-piko-pink" />
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-100">
              <span className="bg-gradient-to-r from-piko-pink to-piko-orange bg-clip-text text-transparent">
                @piko289
              </span>
            </h2>
          </div>
          <p className="text-lg text-zinc-400">
            Follow for behind-the-scenes content and exclusive updates
          </p>
        </motion.div>

        {/* Masonry Grid - 3x2 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <motion.a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-piko-pink/50 transition-all"
            >
              {/* Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${post.mediaUrl})` }}
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                <div className="text-center">
                  {post.caption && (
                    <p className="text-sm text-zinc-200 mb-2 line-clamp-2">
                      {post.caption}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-2 text-piko-pink text-xs font-semibold">
                    <Instagram className="w-4 h-4" />
                    View on Instagram
                  </div>
                </div>
              </div>

              {/* Instagram icon badge */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <ExternalLink className="w-4 h-4 text-piko-pink" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-8"
        >
          <a
            href={instagramLink?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-piko-pink/50 bg-piko-pink/10 text-piko-pink hover:bg-piko-pink/20 transition font-semibold"
          >
            <Instagram className="w-5 h-5" />
            Follow @piko289
          </a>
        </motion.div>
      </div>
    </section>
  );
}
