/**
 * Video data layer
 * Provides YouTube video metadata for the videos page
 * 
 * HOW TO GET YOUTUBE VIDEO ID:
 * From a YouTube URL like: https://www.youtube.com/watch?v=1sH88Y0DgWo
 * The video ID is the part after "v=": 1sH88Y0DgWo
 * 
 * For YouTube Music links like: https://music.youtube.com/watch?v=CdcXTfvAjns
 * The video ID is also after "v=": CdcXTfvAjns
 * 
 * IMPORTANT: Only use the video ID, never the full URL
 */

import { slugify } from '@/lib/media/slugify';

export interface Video {
  id: string;
  slug: string;
  title: string;
  youtubeVideoId: string;
  releaseYear?: string;
  tags?: string[];
}

/**
 * All available videos
 * TODO: Replace placeholder IDs with actual Piko FG video IDs from:
 * https://www.youtube.com/@pikofg-unamasmusic-1203
 */
export const VIDEOS: Video[] = [
  {
    id: 'video-1',
    slug: 'te-prometo',
    title: 'Te Prometo',
    youtubeVideoId: '1sH88Y0DgWo',
    releaseYear: '2024',
    tags: ['music-video', 'official'],
  },
  {
    id: 'video-2',
    slug: 'el-don',
    title: 'El Don',
    youtubeVideoId: 'CdcXTfvAjns',
    releaseYear: '2024',
    tags: ['music-video', 'official'],
  },
  {
    id: 'video-3',
    slug: 'placeholder-3',
    title: 'Behind The Scenes',
    youtubeVideoId: 'jNQXAC9IVRw', // Placeholder - replace with actual video ID
    releaseYear: '2024',
    tags: ['bts'],
  },
  {
    id: 'video-4',
    slug: 'placeholder-4',
    title: 'Studio Session',
    youtubeVideoId: 'kJQP7kiw5Fk', // Placeholder - replace with actual video ID
    releaseYear: '2024',
    tags: ['studio'],
  },
  {
    id: 'video-5',
    slug: 'placeholder-5',
    title: 'Live Performance',
    youtubeVideoId: 'L_jWHffIx5E', // Placeholder - replace with actual video ID
    releaseYear: '2023',
    tags: ['live'],
  },
  {
    id: 'video-6',
    slug: 'placeholder-6',
    title: 'Music Video 2',
    youtubeVideoId: '9bZkp7q19f0', // Placeholder - replace with actual video ID
    releaseYear: '2023',
    tags: ['music-video'],
  },
  {
    id: 'video-7',
    slug: 'placeholder-7',
    title: 'Freestyle Session',
    youtubeVideoId: 'YQHsXMglC9A', // Placeholder - replace with actual video ID
    releaseYear: '2023',
    tags: ['freestyle'],
  },
  {
    id: 'video-8',
    slug: 'placeholder-8',
    title: 'Documentary',
    youtubeVideoId: 'fJ9rUzIMcZQ', // Placeholder - replace with actual video ID
    releaseYear: '2024',
    tags: ['documentary'],
  },
];

/**
 * Get all videos
 */
export function getVideos(): Video[] {
  return VIDEOS;
}

/**
 * Get a video by slug
 */
export function getVideoBySlug(slug: string): Video | undefined {
  return VIDEOS.find((video) => video.slug === slug);
}

/**
 * Get videos by tag
 */
export function getVideosByTag(tag: string): Video[] {
  return VIDEOS.filter((video) => video.tags?.includes(tag));
}

/**
 * Add a new video (for future use)
 */
export function createVideo(
  title: string,
  youtubeVideoId: string,
  options?: { releaseYear?: string; tags?: string[] }
): Video {
  const slug = slugify(title);
  return {
    id: `video-${Date.now()}`,
    slug,
    title,
    youtubeVideoId,
    releaseYear: options?.releaseYear,
    tags: options?.tags,
  };
}
