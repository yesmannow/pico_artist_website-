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
- **No-Login Mode** - Studio currently runs without authentication using localStorage
- **Hidden Access** - Studio accessible via subtle footer link or `Shift+S` keyboard shortcut
- **Future Auth** - Supabase integration deferred until magic link authentication is enabled

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

# Build for production (Cloudflare Pages)
npm run build:cloudflare

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## ⚙️ Build & Deployment

### Cloudflare Pages Build

This project uses **OpenNext** to deploy Next.js to Cloudflare Pages with full support for dynamic routes and server-side rendering.

**Build Command:**
```bash
npm run build:cloudflare
```

This command:
1. Cleans previous builds (`.next`, `.open-next`, `.vercel`)
2. Runs OpenNext to generate Cloudflare-compatible output
3. Prepares the deployment structure with `_worker.js` and `_routes.json`
4. Verifies all critical files are present

**Verify Build:**
```bash
npm run verify:cf
```

This verification script checks that:
- `_worker.js` exists (Cloudflare Worker for SSR)
- `_routes.json` exists (routes static assets correctly)
- `_next/static/` has content (JS/CSS bundles)
- All public assets are present

### Cloudflare Pages Settings

Configure your Cloudflare Pages project with these **exact settings**:

| Setting | Value |
|---------|-------|
| **Build command** | `npm run build:cloudflare` |
| **Build output directory** | `.open-next/output` |
| **Node version** | `22` |

**Important:** Set `NODE_VERSION=22` in your Cloudflare Pages environment variables.

### Deployment

**Option 1: Automatic (Recommended)**
- Push to GitHub
- Cloudflare Pages will automatically build and deploy

**Option 2: Manual via Wrangler**
```bash
# Build locally (run in WSL/Linux/macOS for production parity)
npm run build:cloudflare

# Verify build output
npm run verify:cf

# Deploy to Cloudflare Pages
npx wrangler pages deploy .open-next/output
```

### Environment Parity

⚠️ **Important:** Production builds should be run in **Linux/macOS or WSL** to match the Cloudflare Pages environment. Windows builds may succeed but can cause runtime issues.

### Troubleshooting

For detailed deployment troubleshooting, static asset routing, and verification steps, see [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md).

Common issues:
- **Unstyled site / CSS 404s**: Missing or incorrect `_routes.json` (fixed by new build process)
- **JavaScript 404s**: Static assets not excluded from Worker routing (fixed by new build process)
- **Dynamic routes fail**: Worker not executing properly - check Cloudflare build logs

### Build Output Structure

After a successful build, `.open-next/output/` contains:

```
.open-next/output/
├── _worker.js          # Cloudflare Worker (handles SSR and API routes)
├── _routes.json        # Routes config (excludes static assets from Worker)
├── _next/static/       # Next.js static assets (JS, CSS, fonts, images)
├── manifest.json       # PWA manifest
├── piko-logo.jpg       # Public assets
└── ...                 # Other runtime files
```

The `_routes.json` file ensures static assets (`/_next/static/*`, images, fonts, etc.) are served directly from Cloudflare's CDN, not through the Worker, preventing 404s and improving performance.

## 🎛️ Studio Access (Hidden Pattern)

The Studio feature includes a hidden, no-login access pattern for development:

### Access Methods

1. **Footer Link**: A subtle link in the footer (low opacity, visually discreet)
2. **Keyboard Shortcut**: Press `Shift + S` from anywhere on the site to navigate to Studio
3. **Direct URL**: Navigate to `/studio` directly

### Configuration

Studio visibility can be controlled via environment variable:
```bash
NEXT_PUBLIC_STUDIO_VISIBLE=false  # Hide Studio link (default: true)
```

### Current Implementation

- **No Authentication**: Studio is accessible without login (for now)
- **Local Storage**: All projects and tracks are saved to browser localStorage
- **Mock Data**: Uses mock backing tracks and local state management
- **Export/Import**: JSON bundle export/import for data portability

### Future Integration

The Studio is designed for future Supabase integration:
- **Projects Table**: Store projects in Supabase database with user association
- **Tracks Table**: Upload audio files to Supabase Storage
- **Real-time Sync**: Collaborative editing via Supabase Realtime
- **User Authentication**: Protect Studio access with Supabase Auth (magic link)
- **Activity Feed**: Shared activity log across all users

See the in-app Help panel (click the help icon in Studio header) for detailed integration points.

## 🛡️ Supabase Migrations

**Note:** Studio currently runs in no-login mode. Supabase integration is deferred until magic link authentication is enabled.

When you provision or refresh the Supabase database, execute the SQL scripts under `migrations/sql/` to keep RLS, indexes, and backups aligned with the frontend expectations:

- `migrations/sql/001_secure_policies.sql` enables row-level security and applies least-privilege policies for `tracks`, `projects`, `likes`, `auth_user_meta`, and their backup tables (validation queries such as `SELECT 1 FROM tracks LIMIT 1;` confirm visibility).
- `migrations/sql/002_perf_indexes.sql` adds the missing primary keys to every `*_backup` table, drops unused indexes (`idx_likes_user_id`, `idx_projects_user_id`), and keeps only the indexes the app actually queries (e.g., `tracks(created_at DESC)` and `projects(updated_at DESC)`).

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

## 🎛️ Studio Access (Hidden Pattern)

The Studio feature includes a hidden, no-login access pattern for development and preview:

### Access Methods

1. **Footer Link**: A subtle link in the footer (low opacity, visually discreet)
2. **Keyboard Shortcut**: Press `Shift + S` from anywhere on the site to navigate to Studio
3. **Direct URL**: Navigate to `/studio` directly

### Configuration

Studio visibility can be controlled via environment variable:
```bash
NEXT_PUBLIC_STUDIO_VISIBLE=false  # Hide Studio link (default: true)
```

### Current Implementation

- **No Authentication**: Studio is accessible without login (for now)
- **Local Storage**: All projects and tracks are saved to browser localStorage
- **Mock Data**: Uses mock backing tracks and local state management
- **Export/Import**: JSON bundle export/import for data portability

### Future Integration

The Studio is designed for future Supabase integration:
- **Projects Table**: Store projects in Supabase database with user association
- **Tracks Table**: Upload audio files to Supabase Storage
- **Real-time Sync**: Collaborative editing via Supabase Realtime
- **User Authentication**: Protect Studio access with Supabase Auth
- **Activity Feed**: Shared activity log across all users

See the in-app Help panel (click the help icon in Studio header) for detailed integration points.

## 🤝 Contributing

This is a personal artist platform for Piko FG. For bugs or suggestions, please open an issue.

## 📄 License

MIT
