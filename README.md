# Pico Artist Studio 🎵

A cinematic music platform with a built-in mobile-friendly recording studio - your private SoundCloud experience.

![Pico Artist Studio](https://github.com/user-attachments/assets/4bf878bd-63c0-4aee-b355-ec7573b1b265)

## Features

- **Stream Your Music** - Share tracks with beautiful waveform visualizations and a persistent player
- **Record Studio** - Professional recording tools with real-time frequency visualizers in your browser
- **Cinematic Experience** - Dark, glassmorphic design with neon accents and smooth animations

## Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Styling:** Tailwind CSS (Dark Mode, Glassmorphism, Neon Accents)
- **Audio:** Web Audio API, wavesurfer.js, howler.js
- **Recording:** MediaRecorder API, react-media-recorder
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/
│   ├── audio/       # Audio-specific components (Player, Waveform, Visualizer)
│   ├── studio/      # Recording and editing logic
│   └── ui/          # Atomic components (buttons, inputs)
├── hooks/           # Custom React hooks
└── lib/             # Utility functions and configs
```

## Design System

- **Base Palette:** `bg-zinc-950`, `text-zinc-100`
- **Accents:** Cyan (`#06b6d4`) to Purple (`#a855f7`) gradients
- **Effects:** Glassmorphism with `backdrop-blur-md`, neon shadows
- **Mobile-First:** Responsive, touch-friendly controls

## License

MIT