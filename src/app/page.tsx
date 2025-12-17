import { Music, Mic, Radio } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <main className="flex flex-col items-center gap-8 text-center">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 p-4 shadow-lg shadow-cyan-500/20">
            <Music className="h-12 w-12 text-white" />
          </div>
          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-zinc-100 md:text-6xl">
            Pico Artist Studio
          </h1>
          <p className="max-w-md text-lg text-zinc-400">
            Your private SoundCloud experience with a built-in mobile-friendly recording studio
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          <div className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
            <div className="mb-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-600/10 p-3 w-fit">
              <Radio className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-100">
              Stream Your Music
            </h3>
            <p className="text-sm text-zinc-400">
              Share your tracks with beautiful waveform visualizations and a persistent player
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="mb-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-cyan-600/10 p-3 w-fit">
              <Mic className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-100">
              Record Studio
            </h3>
            <p className="text-sm text-zinc-400">
              Professional recording tools with real-time frequency visualizers right in your browser
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 rounded-lg bg-gradient-to-br from-cyan-500/10 to-purple-600/10 p-3 w-fit">
              <Music className="h-6 w-6 text-cyan-500" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-100">
              Cinematic Experience
            </h3>
            <p className="text-sm text-zinc-400">
              Dark, glassmorphic design with neon accents and smooth animations
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-cyan-500/40">
            Get Started
          </button>
          <button className="rounded-full border border-zinc-700 px-8 py-3 font-semibold text-zinc-100 transition-all hover:border-zinc-600 hover:bg-zinc-800/50">
            Learn More
          </button>
        </div>
      </main>
    </div>
  );
}
