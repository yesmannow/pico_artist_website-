# Pico Artist Studio 🎵

A cinematic music platform with a built-in mobile-friendly recording studio - your private SoundCloud experience featuring the artist **Piko FG**.

![Pico Artist Studio](https://github.com/user-attachments/assets/4bf878bd-63c0-4aee-b355-ec7573b1b265)

## ✨ Features -

### 🎧 Music Streaming
- **Stream Your Music** - Browse and play tracks with beautiful waveform visualizations
- **Persistent Player** - Global music player with paint-drip visualizer
- **Real-time Likes** - Optimistic UI updates with Supabase backend

### 🎤 Professional Studio
- **Multi-Track Recording** - Record high-quality audio directly in your browser
- **Overdub Mode** - Record vocals while playing a backing track for layered productions
- **Live Visualizer** - Real-time "paint drip" frequency visualization during recording
- **Voice FX** - Apply audio effects with the "Vibe" toggle
- **Cloud Storage** - Upload recordings directly to Supabase

### 🎨 Cinematic Design
- **Digital Graffiti Theme** - Dark glassmorphic design with neon accents inspired by Piko FG's brand
- **Brand Palette**: 
  - Splatter Magenta (`#ff006e`)
  - Drip Cyan (`#00f5d4`)
  - Splash Orange (`#ff9e00`)
- **Interactive Effects** - Mouse-following spotlight and paint splatter animations
- **Mobile-First** - Responsive design with native app feel

### 🔒 Security & Auth
- **Protected Routes** - Studio access requires authentication via Supabase middleware
- **User Management** - Sign in/out functionality with branded login page

### 📱 Progressive Web App
- **Installable** - Add to home screen on mobile devices
- **Offline Support** - Service worker caching for offline access
- **Native Feel** - Swipe gestures and touch interactions

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router) with TypeScript
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Styling:** Tailwind CSS 4 (Dark Mode, Glassmorphism)
- **Audio:** Web Audio API, wavesurfer.js, howler.js, MediaRecorder API
- **Recording:** react-media-recorder with custom hooks
- **Animations:** Framer Motion (staggered entries, spring physics)
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (see [DATABASE_SETUP.md](./DATABASE_SETUP.md))

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Database Setup

See [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed Supabase configuration instructions.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page with track feed
│   ├── login/             # Authentication page
│   ├── studio/            # Protected recording studio
│   └── gallery/           # Media gallery (placeholder)
├── components/
│   ├── audio/             # Audio components (Player, TrackList)
│   ├── studio/            # Recording components (Recorder, Visualizer)
│   ├── navigation/        # Navbar with Mega Menu
│   └── PWARegister.tsx    # Service worker registration
├── hooks/                 # Custom React hooks
│   └── useAudioRecorder.ts # Recording logic
├── lib/                   # Utility functions
│   └── supabase.ts        # Supabase client & helpers
└── middleware.ts          # Route protection
```

## 🎨 Design System

### Color Palette
- **Base:** `bg-zinc-950` (dark background), `text-zinc-100` (light text)
- **Piko Brand Colors:**
  - `piko-pink`: #ff006e (Splatter Magenta)
  - `piko-teal`: #00f5d4 (Drip Cyan)
  - `piko-orange`: #ff9e00 (Splash Orange)

### Visual Effects
- **Glassmorphism:** `backdrop-blur-xl` with semi-transparent backgrounds
- **Neon Glow:** Box shadows on interactive elements
- **Paint Drips:** Rounded line caps and gradients on visualizers
- **SVG Noise:** 0.03 opacity grain texture overlay

### Mobile-First Approach
- Touch-friendly targets (44px minimum)
- Swipe gestures for navigation
- Haptic feedback (scale effects on tap)
- Full-screen mega menu

## 🎵 Key Features Explained

### Overdub Recording
The studio allows you to select a backing track and record vocals simultaneously:
1. Select a backing track from the dropdown
2. Click the record button
3. The backing track plays while recording your microphone
4. Both streams are synchronized for perfect timing

### Paint Splatter Effects
Every primary action (Like, Upload, Record) triggers animated particle effects that simulate paint splatters, matching the digital graffiti aesthetic.

### Swipe Gestures
The mega menu can be closed by:
- Swiping right on the menu overlay
- Tapping outside the menu
- Pressing the close button

## 📱 PWA Features

The app can be installed as a Progressive Web App:
- Manifest file for app metadata
- Service worker for offline caching
- Installable on iOS and Android
- Custom shortcuts to Studio and Tracks

## 🔐 Authentication

Protected routes require authentication:
- `/studio` - Recording studio (requires login)
- All other routes are public

## 🤝 Contributing

This is a personal artist platform for Piko FG. For bugs or suggestions, please open an issue.

## 📄 License

MIT
