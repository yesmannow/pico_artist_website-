# Gallery Media Optimization Guide

This directory is where you add raw media files before optimization.

## Quick Start

1. **Add your media files here:**
   ```
   downloads/
   ├── my_photo.jpg
   ├── concert_vid.mov
   └── artwork.png
   ```

2. **Run the optimizer:**
   ```bash
   npm run optimize-media
   ```

3. **Files are automatically optimized and moved:**
   ```
   public/assets/content/
   ├── images/
   │   ├── my_photo.webp
   │   └── artwork.webp
   └── videos/
       └── concert_vid.mp4
   ```

4. **Gallery updates automatically!** 🎉

## What the Optimizer Does

### Images
- Converts to **WebP** format (90% quality)
- Reduces file size while maintaining quality
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff`

### Videos
- Converts to **MP4** with H.264 codec
- Optimized for web streaming (faststart flag)
- Audio: AAC 128kbps
- Supported formats: `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`, `.m4v`

### Filename Normalization
- Converts to **lowercase**
- Replaces **spaces with underscores**
- Example: `My Cool Photo.PNG` → `my_cool_photo.webp`

## Supported File Types

| Type | Extensions |
|------|-----------|
| Images | `.jpg`, `.jpeg`, `.png`, `.gif`, `.bmp`, `.tiff` |
| Videos | `.mp4`, `.mov`, `.avi`, `.mkv`, `.webm`, `.m4v` |

## Tips

- **Large files?** The optimizer handles them automatically
- **Keep originals?** Yes! They stay in `downloads/` (gitignored)
- **Batch processing?** Just add multiple files and run once
- **Title extraction:** Filenames become titles in the gallery
  - `my_awesome_photo.webp` → "My Awesome Photo"

## Directory Structure

```
pico_artist_website/
├── downloads/              # ← Add raw files here (gitignored)
├── public/
│   └── assets/
│       └── content/
│           ├── images/     # ← Optimized images appear here
│           └── videos/     # ← Optimized videos appear here
└── scripts/
    └── optimize-media.js   # ← The optimizer script
```

## Troubleshooting

**Optimizer not working?**
```bash
# Check if dependencies are installed
npm install

# Run with verbose output
node scripts/optimize-media.js
```

**Gallery not showing files?**
- Refresh the page (Cmd/Ctrl + R)
- Check the API: http://localhost:3000/api/gallery
- Ensure files are in `public/assets/content/`

## Security Note

The `downloads/` directory is **gitignored** to prevent committing large raw files to the repository. Only optimized files in `public/assets/content/` are tracked.
