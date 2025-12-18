/**
 * Gallery Media Utilities
 * Helpers for reading and managing gallery media files
 */

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  filename: string;
  url: string;
  title: string;
  aspectRatio?: 'vertical' | 'horizontal' | 'square';
}

/**
 * Client-side function to fetch gallery media from API
 */
export async function fetchGalleryMedia(): Promise<MediaItem[]> {
  try {
    const response = await fetch('/api/gallery');
    if (!response.ok) {
      throw new Error('Failed to fetch gallery media');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching gallery media:', error);
    return [];
  }
}

/**
 * Determine aspect ratio from dimensions
 */
export function getAspectRatio(width: number, height: number): 'vertical' | 'horizontal' | 'square' {
  const ratio = width / height;
  if (ratio > 1.1) return 'horizontal';
  if (ratio < 0.9) return 'vertical';
  return 'square';
}
