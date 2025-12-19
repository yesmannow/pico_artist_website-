import { NextResponse } from 'next/server';
// Use relative import instead of TS path alias for Worker/Edge runtime compatibility
import manifest from '../../../data/media-manifest.json';

// Use the Node.js runtime for OpenNext Cloudflare Worker compatibility
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Transform manifest data to match Gallery.tsx expected format
    const mediaItems = [
      // Map videos from manifest
      ...manifest.videos.map((video) => ({
        id: video.id,
        type: 'video' as const,
        filename: video.id,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        title: video.title,
      })),
      // Map images from manifest
      ...manifest.images.map((image, index) => ({
        id: `img-${index}`,
        type: 'image' as const,
        filename: image,
        url: `/gallery/${image}`,
        title: image.replace(/\.(webp|jpg|png)$/, '').replace(/_/g, ' '),
      })),
    ];

    return NextResponse.json(mediaItems);
  } catch (error) {
    // Log sanitized error for debugging without exposing sensitive details
    // Use specific prefix for easier log filtering and monitoring in production
    console.error('API_GALLERY_ERROR:', error instanceof Error ? error.message : 'Unknown error');
    
    // Return empty array as fallback - matches MediaItem[] type expected by Gallery.tsx
    return NextResponse.json([]);
  }
}
