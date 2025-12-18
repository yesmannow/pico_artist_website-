import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  filename: string;
  url: string;
  title: string;
}

/**
 * Parse filename to extract title
 */
function parseTitle(filename: string): string {
  const nameWithoutExt = filename.replace(/\.(webp|mp4)$/i, '');
  return nameWithoutExt
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * API Route: GET /api/gallery
 * Returns all media files from the gallery content directory
 */
export async function GET() {
  try {
    const media: MediaItem[] = [];
    
    const imagesDir = path.join(process.cwd(), 'public/assets/content/images');
    const videosDir = path.join(process.cwd(), 'public/assets/content/videos');

    // Read images
    try {
      const imageFiles = await fs.readdir(imagesDir);
      for (const file of imageFiles) {
        if (file.endsWith('.webp')) {
          media.push({
            id: `img-${file}`,
            type: 'image',
            filename: file,
            url: `/assets/content/images/${file}`,
            title: parseTitle(file),
          });
        }
      }
    } catch (error) {
      // Directory might not exist or be empty
      console.error('Error reading images directory:', error);
    }

    // Read videos
    try {
      const videoFiles = await fs.readdir(videosDir);
      for (const file of videoFiles) {
        if (file.endsWith('.mp4')) {
          media.push({
            id: `vid-${file}`,
            type: 'video',
            filename: file,
            url: `/assets/content/videos/${file}`,
            title: parseTitle(file),
          });
        }
      }
    } catch (error) {
      // Directory might not exist or be empty
      console.error('Error reading videos directory:', error);
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error reading gallery media:', error);
    return NextResponse.json({ error: 'Failed to load gallery media' }, { status: 500 });
  }
}
