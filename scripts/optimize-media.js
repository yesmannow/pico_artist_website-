#!/usr/bin/env node

/**
 * Media Optimization Pipeline for Piko FG Gallery
 * Converts images to WebP and videos to MP4 with optimized settings
 * Normalizes filenames to lowercase with underscores
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const { execSync } = require('child_process');

// Paths
const DOWNLOADS_DIR = path.join(__dirname, '../downloads');
const OUTPUT_IMAGES_DIR = path.join(__dirname, '../public/assets/content/images');
const OUTPUT_VIDEOS_DIR = path.join(__dirname, '../public/assets/content/videos');

// Supported formats
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];

/**
 * Normalize filename: lowercase and replace spaces with underscores
 */
function normalizeFilename(filename) {
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  return base.toLowerCase().replace(/\s+/g, '_') + ext.toLowerCase();
}

/**
 * Process an image file to WebP format
 */
async function processImage(inputPath, outputDir) {
  try {
    const filename = path.basename(inputPath);
    const normalizedName = normalizeFilename(filename);
    const outputName = normalizedName.replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '.webp');
    const outputPath = path.join(outputDir, outputName);

    console.log(`📸 Processing image: ${filename} -> ${outputName}`);

    await sharp(inputPath)
      .webp({ quality: 90, effort: 6 })
      .toFile(outputPath);

    const stats = await fs.stat(outputPath);
    console.log(`✅ Image optimized: ${outputName} (${(stats.size / 1024).toFixed(2)} KB)`);
    
    return outputPath;
  } catch (error) {
    console.error(`❌ Error processing image ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Process a video file to MP4 format using ffmpeg
 */
async function processVideo(inputPath, outputDir) {
  try {
    const filename = path.basename(inputPath);
    const normalizedName = normalizeFilename(filename);
    const outputName = normalizedName.replace(/\.(mov|avi|mkv|webm|m4v|mp4)$/i, '.mp4');
    const outputPath = path.join(outputDir, outputName);

    console.log(`🎬 Processing video: ${filename} -> ${outputName}`);

    // Get ffmpeg-static path
    const ffmpegPath = require('ffmpeg-static');

    // Use ffmpeg to convert video with optimized settings
    const command = `"${ffmpegPath}" -i "${inputPath}" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart -y "${outputPath}"`;
    
    execSync(command, { stdio: 'inherit' });

    const stats = await fs.stat(outputPath);
    console.log(`✅ Video optimized: ${outputName} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
    
    return outputPath;
  } catch (error) {
    console.error(`❌ Error processing video ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Scan directory and process all media files
 */
async function optimizeMedia() {
  console.log('🚀 Starting Media Optimization Pipeline...\n');

  try {
    // Ensure output directories exist
    await fs.mkdir(OUTPUT_IMAGES_DIR, { recursive: true });
    await fs.mkdir(OUTPUT_VIDEOS_DIR, { recursive: true });

    // Check if downloads directory exists
    try {
      await fs.access(DOWNLOADS_DIR);
    } catch {
      console.log(`📁 Downloads directory not found. Creating ${DOWNLOADS_DIR}`);
      await fs.mkdir(DOWNLOADS_DIR, { recursive: true });
      console.log('ℹ️  No files to process. Add media files to the downloads/ directory.');
      return;
    }

    // Read all files from downloads directory
    const files = await fs.readdir(DOWNLOADS_DIR);
    
    if (files.length === 0) {
      console.log('ℹ️  No files found in downloads/ directory.');
      return;
    }

    const images = [];
    const videos = [];

    // Categorize files
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const fullPath = path.join(DOWNLOADS_DIR, file);
      
      // Check if it's a file (not a directory)
      const stats = await fs.stat(fullPath);
      if (!stats.isFile()) continue;

      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(fullPath);
      } else if (VIDEO_EXTENSIONS.includes(ext)) {
        videos.push(fullPath);
      }
    }

    console.log(`Found ${images.length} image(s) and ${videos.length} video(s)\n`);

    // Process images
    if (images.length > 0) {
      console.log('--- Processing Images ---');
      for (const imagePath of images) {
        await processImage(imagePath, OUTPUT_IMAGES_DIR);
      }
      console.log('');
    }

    // Process videos
    if (videos.length > 0) {
      console.log('--- Processing Videos ---');
      for (const videoPath of videos) {
        await processVideo(videoPath, OUTPUT_VIDEOS_DIR);
      }
      console.log('');
    }

    console.log('✨ Media optimization complete!');
    console.log(`📂 Images saved to: ${OUTPUT_IMAGES_DIR}`);
    console.log(`📂 Videos saved to: ${OUTPUT_VIDEOS_DIR}`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the optimizer
optimizeMedia();
