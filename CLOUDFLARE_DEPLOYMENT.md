# Cloudflare Pages Deployment Guide

This document provides the exact configuration needed to deploy this Next.js application to Cloudflare Pages using OpenNext.

## Prerequisites

- Cloudflare account with Pages access
- GitHub repository connected to Cloudflare Pages
- Node.js 22.x (specified in `.nvmrc`)

## Cloudflare Pages Configuration

### Build Settings

Use these **exact settings** in your Cloudflare Pages project:

| Setting | Value |
|---------|-------|
| **Framework preset** | None (or Next.js if available) |
| **Build command** | `npm run build:cloudflare` |
| **Build output directory** | `.open-next/output` |
| **Node version** | `22` |

### Environment Variables

Set these in your Cloudflare Pages project settings:

```bash
NODE_VERSION=22
```

Add any additional environment variables your application needs (e.g., Supabase keys, API endpoints).

## Build Process Explained

The `build:cloudflare` script performs the following steps:

1. **Clean**: Removes previous build artifacts (`.next`, `.open-next`, `.vercel`)
2. **OpenNext Build**: Runs `@opennextjs/cloudflare` to generate the Worker and assets
3. **Post-Build Processing**: Runs `scripts/cf-pages-postbuild.mjs` which:
   - Prepares the output directory structure
   - Moves `worker.js` → `_worker.js`
   - Copies all necessary files (middleware, server-functions, assets)
   - **Generates `_routes.json`** for static asset routing
   - Verifies all critical files are present

## Output Structure

After a successful build, `.open-next/output/` will contain:

```
.open-next/output/
├── _worker.js                    # Cloudflare Worker (advanced mode)
├── _routes.json                  # Routes configuration for static assets
├── _next/
│   └── static/                   # Next.js static assets (JS, CSS, etc.)
│       ├── chunks/
│       └── media/
├── cloudflare/                   # Cloudflare-specific runtime files
├── middleware/                   # Next.js middleware
├── server-functions/             # Server-side functions
├── .build/                       # Build metadata
├── manifest.json                 # PWA manifest
├── piko-logo.jpg                 # Public assets
└── (other public files)
```

## Static Asset Routing

The `_routes.json` file tells Cloudflare Pages which routes should **bypass the Worker** and be served directly from the CDN. This is critical for performance and preventing 404s.

### Excluded Patterns

The following patterns are excluded from Worker routing:

- `/_next/static/*` - Next.js static assets (JS, CSS, fonts, images)
- `/_next/image*` - Next.js image optimization
- Static files: `favicon.ico`, `manifest.json`, `robots.txt`, `sitemap.xml`, `sw.js`
- Image formats: `*.png`, `*.jpg`, `*.jpeg`, `*.webp`, `*.svg`, `*.ico`, `*.avif`
- Audio files: `*.wav`, `*.mp3`
- Font files: `*.woff`, `*.woff2`, `*.ttf`, `*.eot`, `*.otf`

### Included Patterns

All other routes (`/*`) are handled by the Worker, including:
- Dynamic routes (e.g., `/api/gallery`)
- Server-side rendered pages
- Dynamic API routes

## Local Build Verification

Before pushing to GitHub, verify the build locally:

```bash
# Install dependencies
npm ci

# Run Cloudflare build
npm run build:cloudflare

# Verify critical files exist
ls .open-next/output/_worker.js
ls .open-next/output/_routes.json
ls .open-next/output/_next/static
```

Expected output:
```
✓ Created output directory
✓ Moved worker.js → _worker.js
✓ Copied cloudflare/
✓ Copied middleware/
✓ Copied server-functions/
✓ Copied .build/
✓ Copied all assets to output root
✓ Generated _routes.json
✓ Verified _worker.js
✓ Verified _routes.json
✓ Verified _next/static
✓ _next/static contains N items
✓ All critical files verified!
```

## Troubleshooting

### Issue: Unstyled site / CSS 404s

**Symptoms:**
- Site loads but has no styling
- Browser DevTools shows 404s for `/_next/static/*.css`
- Console errors about missing assets

**Cause:** `_routes.json` is missing or incorrect

**Solution:** 
1. Verify `.open-next/output/_routes.json` exists after build
2. Check that `/_next/static/*` is in the `exclude` array
3. Rebuild: `npm run build:cloudflare`

### Issue: JavaScript 404s

**Symptoms:**
- Browser DevTools shows 404s for `/_next/static/*.js`
- Interactive features don't work

**Cause:** Same as CSS 404s - `_routes.json` issue

**Solution:** Same as above

### Issue: Public assets (images, manifest.json) 404

**Symptoms:**
- `/piko-logo.jpg` returns 404
- `/manifest.json` returns 404

**Cause:** Assets not copied to output root, or `_routes.json` not excluding them

**Solution:**
1. Verify files exist in `.open-next/output/` after build
2. Check `_routes.json` excludes the file extensions
3. Rebuild: `npm run build:cloudflare`

### Issue: Dynamic routes don't work

**Symptoms:**
- `/api/gallery` returns 404 or errors
- Server-side rendering fails

**Cause:** Worker not executing properly

**Solution:**
1. Verify `.open-next/output/_worker.js` exists
2. Check Cloudflare Pages build logs for errors
3. Ensure `compatibility_flags: ["nodejs_compat"]` is in `wrangler.jsonc`
4. Verify Node.js version is 22

### Issue: Next.js 16 compatibility warnings

**Symptoms:**
- Build warnings: "Next.js 16 is not fully supported yet!"
- Unexpected behavior after deployment

**Current Status:** 
- Next.js 16.0.10 is being used
- OpenNext warns about incomplete support
- If deployment issues persist after fixing `_routes.json`, consider downgrading

**Potential Solution (if needed):**
```bash
npm install next@15 eslint-config-next@15
npm run build:cloudflare
```

## Deployment Checklist

Before deploying:

- [ ] Local build succeeds: `npm run build:cloudflare`
- [ ] All verification checks pass (see console output)
- [ ] `.open-next/output/_worker.js` exists
- [ ] `.open-next/output/_routes.json` exists
- [ ] `.open-next/output/_next/static/` exists and has content
- [ ] Cloudflare Pages build command is `npm run build:cloudflare`
- [ ] Cloudflare Pages output directory is `.open-next/output`
- [ ] Node version is set to `22` in Cloudflare Pages settings

After deployment:

- [ ] Site loads correctly (not unstyled)
- [ ] Browser DevTools shows no 404s for `/_next/static/*`
- [ ] Images load correctly (`/piko-logo.jpg`, etc.)
- [ ] `/manifest.json` is accessible
- [ ] Dynamic routes work (`/api/gallery`)
- [ ] All pages render correctly

## Advanced: Wrangler Configuration

The `wrangler.jsonc` file configures Cloudflare Pages deployment:

```json
{
  "name": "pico-artist-portfolio-website",
  "pages_build_output_dir": ".open-next/output",
  "compatibility_date": "2025-12-18",
  "compatibility_flags": ["nodejs_compat"]
}
```

**Do not modify** unless you understand Cloudflare Workers compatibility.

## Support

If issues persist after following this guide:

1. Check Cloudflare Pages build logs
2. Verify all settings match this documentation exactly
3. Review browser DevTools Network tab for specific 404s
4. Check that static assets are being served from Cloudflare's CDN, not the Worker

## References

- [OpenNext Cloudflare Documentation](https://github.com/opennextjs/opennextjs-cloudflare)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
