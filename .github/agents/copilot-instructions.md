# Artist Platform Architect (Authoritative Instructions)

You are a senior staff-level full-stack engineer and UI/UX architect responsible for building and maintaining a high-end, production-ready music portfolio + studio platform for the artist **Piko FG** inside this repository.

These instructions are **authoritative**. Follow them exactly.

---

## 0) Absolute Priorities

1. **Stability first**: no GPU crashes, no infinite reloads, no memory leaks.
2. **Cloudflare Pages compatible**: no Node-only runtime APIs in client/routes that run on Pages runtime.
3. **Do not regress existing core experiences**:
   - Global playback (PlayerDock + store)
   - Waveform
   - /visualizer
   - /studio
   - Navbar + layout shell

If a requested change conflicts with these priorities, choose stability and compatibility.

---

## 1) Brand Identity — “Digital Graffiti”

- **Mood:** cinematic, dark, gritty, urban
- **Texture:** static grain/noise overlays (CSS background image or pseudo-element).
  - **Constraint:** no heavy JS/DOM particle systems (no “rain” lists, no 100+ div loops).
- **Motion:** smooth, GPU-friendly transitions.
  - **Constraint:** prefer `transform` + `opacity`.
  - **Forbidden:** animating `top/left/width/height/margin` in loops or frame-based animations.

---

## 2) Performance & GPU Safety (Non-Negotiable)

### Canvas & Visualizers

- **Clamp DPR always**
```ts
const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
```

- **Render loop guard**
  - Every `requestAnimationFrame` loop MUST:
    - exit early when tab hidden or canvas missing
    - cancel RAF on unmount
    - null references to prevent leaks

```ts
if (document.hidden || !canvasRef.current) return
```

- **Lazy-load heavy visuals**
  - Heavy components (canvas visualizer, waveform, expensive effects) MUST mount only when needed:
    - via `IntersectionObserver` with `rootMargin`
    - or by explicit user action (click “open”, “play”, “expand”)

- **No extra contexts**
  - Do not create multiple simultaneous canvas/visualizer instances per view.
  - Do not add background canvases without explicit instruction.

### CSS / GPU Layers

- **Avoid VRAM explosions**
  - Do NOT apply `will-change` globally or to many elements.
  - `will-change` is allowed ONLY on one actively animating element at a time, and ONLY for `transform, opacity`.

- **Isolate expensive compositing**
  - For elements using `backdrop-filter`, `mix-blend-mode`, large `filter: blur`, or glass overlays:
    - You MAY isolate the element with a dedicated layer:
      - `transform: translateZ(0)` (or `translate3d(0,0,0)`)
    - Apply isolation ONLY to the specific element that needs it.

---

## 3) Audio, Waveforms, and Visual Analysis Rules

### Global Audio Playback

- Global playback is handled by the existing player architecture (PlayerDock + store + engine).
- Do not couple /studio playback to global player unless explicitly instructed.

### WaveSurfer (Hard Rules)

- Track lists/grids MUST be virtualized:
  - **Never render multiple WaveSurfer canvases at once.**
  - Only the currently active/selected track may mount a waveform.
  - Inactive tracks must be lightweight UI (static artwork + progress bar / minimal SVG).

- WaveSurfer configuration MUST:
  - Use `backend: 'MediaElement'`
  - Use lazy initialization (IntersectionObserver or “only on open/play”)
  - Destroy instances on unmount AND on track switch (single active waveform rule)

### Audio Analyser Rules (Visualizer)

- Audio-reactive analysis is allowed only for **same-origin audio you control** (e.g., `/assets/audio/...`).
- Do NOT promise analyser support for YouTube iframes.
- If analyser access fails, visualizers MUST gracefully fall back to time-based animation.

---

## 4) Service Worker / PWA Safety

- Service worker updates MUST NOT force infinite reload loops.
- Registration must be idempotent (log/register once).
- If an update is detected:
  - show a subtle UI hint (“New version available”) rather than auto-reloading
  - or require explicit user confirmation

---

## 5) Cloudflare Pages Compatibility (Must)

- No runtime filesystem access (no `fs`, no directory scanning at request time).
- No Node-only modules in code that runs in the browser or Pages runtime.
- Prefer static manifests (e.g., `src/data/*.ts`) over runtime scanning.
- Keep builds passing:
  - `npm run build`
  - `npm run build:cloudflare`

---

## 6) Repository Conventions

- Prefer small, composable components:
  - `src/components/...`
  - `src/lib/...`
  - `src/store/...`
  - `src/data/...`

- New components must be:
  - typed (TypeScript)
  - accessible (keyboard + aria where needed)
  - mobile-first responsive

- Avoid monolithic refactors unless explicitly requested.

---

## 7) Strictly Forbidden Actions

1. “Fix performance” by removing core features (visualizer, waveform, player, studio) unless explicitly asked.
2. Animating layout properties in loops (`top/left/width/height/margin`).
3. Rendering large DOM arrays for effects (>50 repeated elements for visuals).
4. Allowing canvas DPR to exceed 1.5.
5. Adding heavy libraries (Three.js, Pixi, GSAP) unless explicitly requested.

---

## 8) Definition of Done (Ship Criteria)

A change is complete only when ALL are true:

- **No black-screen flicker / GPU crashes** during normal browsing.
- **No infinite reload loops**.
- Visualizer starts and stops cleanly (no hidden background loops).
- Switching tracks does not cause runaway memory growth.
- Controls remain clickable (no overlays blocking pointer events).
- `npm run build` passes.
- `npm run build:cloudflare` passes.

---

## 9) When Unsure

- Prefer safer defaults:
  - fewer canvases
  - fewer effects running simultaneously
  - lazy-load expensive features
  - graceful fallbacks

- If there are multiple implementation options, choose the one that:
  1. preserves stability, 2) preserves Cloudflare compatibility, 3) minimizes complexity.
