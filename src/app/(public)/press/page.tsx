/**
 * Press / EPK (Electronic Press Kit) Page
 * "The Underground" - Classified File Aesthetic
 */

'use client';

import { motion } from 'framer-motion';
import Download from 'lucide-react/dist/esm/icons/download';
import FileText from 'lucide-react/dist/esm/icons/file-text';
import Image from 'lucide-react/dist/esm/icons/image';
import Music from 'lucide-react/dist/esm/icons/music';
import Link from 'next/link';

interface PressAsset {
  id: string;
  title: string;
  description: string;
  type: 'logo' | 'photo' | 'bio' | 'tech-rider' | 'music';
  downloadUrl?: string;
  icon: React.ReactNode;
}

const pressAssets: PressAsset[] = [
  {
    id: 'bio',
    title: 'Artist Biography',
    description: '150-word professional bio for press releases and features',
    type: 'bio',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 'logo-high-res',
    title: 'High-Resolution Logo',
    description: 'PNG format, transparent background, 4000x4000px',
    type: 'logo',
    downloadUrl: '/piko-logo.jpg',
    icon: <Image className="w-6 h-6" alt="" aria-hidden="true" />,
  },
  {
    id: 'press-photos',
    title: 'Press Photos Pack',
    description: 'Collection of high-resolution promotional photos',
    type: 'photo',
    icon: <Image className="w-6 h-6" alt="" aria-hidden="true" />,
  },
  {
    id: 'tech-rider',
    title: 'Technical Rider',
    description: 'Stage setup, sound requirements, and hospitality details',
    type: 'tech-rider',
    icon: <Music className="w-6 h-6" />,
  },
];

const artistBio = `Piko FG is a visionary artist blending urban soundscapes with cinematic production. Emerging from the underground hip-hop scene, Piko FG's work is characterized by neon-lit aesthetics and digital graffiti artistry. With releases like "Te Prometo" and "El Don," Piko FG has carved a unique space in contemporary music, combining raw street authenticity with polished studio craftsmanship. The "Digital Graffiti Collective" movement represents a new wave of artists merging visual art, music, and technology into immersive experiences. Based between creative hubs, Piko FG continues to push boundaries while staying rooted in authentic storytelling and sonic innovation.`;

export default function PressPage() {
  const handleDownload = (asset: PressAsset) => {
    if (asset.downloadUrl) {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = asset.downloadUrl;
      link.download = asset.downloadUrl.split('/').pop() || asset.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For assets without downloadUrl, show a message or handle differently
      alert(`${asset.title} download will be available soon. Please contact us for immediate access.`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header - Classified File Aesthetic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          {/* "CLASSIFIED" stamp effect */}
          <div className="relative inline-block mb-8">
            <motion.div
              initial={{ rotate: -5, scale: 0 }}
              animate={{ rotate: -5, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-8 py-3 border-4 border-piko-pink rounded-lg transform -rotate-3"
            >
              <span className="text-3xl font-black text-piko-pink tracking-[0.3em]">
                PRESS ACCESS
              </span>
            </motion.div>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-zinc-100 mb-4">
            THE <span className="bg-gradient-to-r from-piko-teal to-piko-pink bg-clip-text text-transparent">UNDERGROUND</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Electronic Press Kit — Media Assets, Bio, and Technical Information
          </p>
        </motion.div>

        {/* Artist Bio Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-piko-teal" />
              <h2 className="text-2xl font-bold text-zinc-100">Artist Biography</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-6">
              {artistBio}
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(artistBio)}
              className="px-6 py-2 rounded-full border border-piko-teal/50 bg-piko-teal/10 text-piko-teal hover:bg-piko-teal/20 transition text-sm font-semibold"
            >
              Copy to Clipboard
            </button>
          </div>
        </motion.section>

        {/* Press Assets Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-zinc-100 mb-6">Media Assets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {pressAssets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-6 hover:border-piko-pink/50 transition-all hover:shadow-lg hover:shadow-piko-pink/10"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-piko-pink/20 to-piko-teal/20 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <div className="text-piko-teal">{asset.icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-piko-pink transition">
                  {asset.title}
                </h3>
                <p className="text-sm text-zinc-400 mb-4">{asset.description}</p>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(asset)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700 text-zinc-300 hover:border-piko-teal hover:text-piko-teal transition text-sm font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>

                {/* Decorative corner element */}
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-piko-pink/30 opacity-0 group-hover:opacity-100 transition" />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Press Inquiries</h2>
            <p className="text-zinc-400 mb-6">
              For booking, interviews, or additional materials, reach out through our social channels
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-piko-pink to-piko-teal text-white font-semibold hover:shadow-lg hover:shadow-piko-pink/30 transition"
            >
              Back to Main Site
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
