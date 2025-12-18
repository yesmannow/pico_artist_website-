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
 * Get all media files from the gallery content directory
 * This function is meant to be called server-side or in an API route
 */
export async function getGalleryMedia(): Promise<MediaItem[]> {
  // In a real implementation, this would read from the file system
  // For now, we'll return mock data that can be replaced when files are added
  const media: MediaItem[] = [];

  // This is a placeholder - in production, you would use fs to read the directories
  // Example implementation would look like:
  // const fs = require('fs').promises;
  // const path = require('path');
  // const imagesDir = path.join(process.cwd(), 'public/assets/content/images');
  // const videosDir = path.join(process.cwd(), 'public/assets/content/videos');
  
  return media;
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
