/**
 * Track data layer
 * Provides track metadata for the music player and pages
 */

import { slugify, filenameToTitle } from '@/lib/media/slugify';
import { getAudioFiles, getPreviewUrl, getFullUrl } from '@/lib/media/listLocalAudio';

export interface Track {
  id: string;
  slug: string;
  title: string;
  artist: string;
  previewUrl: string;
  fullUrl?: string;
  coverArt?: string;
  releaseYear?: string;
  tags?: string[];
  links?: {
    spotify?: string;
    youtubeMusic?: string;
    youtube?: string;
  };
}

/**
 * Generate tracks from local audio files
 * This is the source of truth for all music on the site
 */
function generateTracks(): Track[] {
  const audioFiles = getAudioFiles();
  
  return audioFiles.map((file, index) => {
    const title = filenameToTitle(file.filename);
    const slug = slugify(title);
    
    return {
      id: `track-${index + 1}`,
      slug,
      title,
      artist: 'Piko FG',
      previewUrl: getPreviewUrl(file.filename),
      fullUrl: file.hasFullVersion ? getFullUrl(file.filename) : undefined,
      coverArt: '/piko-logo.jpg',
      releaseYear: '2024',
      tags: ['urban', 'digital-graffiti'],
      links: {
        // TODO: Add real links per track
        // spotify: 'https://open.spotify.com/track/...',
        // youtubeMusic: 'https://music.youtube.com/watch?v=...',
        // youtube: 'https://www.youtube.com/watch?v=...',
      },
    };
  });
}

/**
 * All available tracks
 */
export const TRACKS: Track[] = generateTracks();

/**
 * Get all tracks
 */
export function getTracks(): Track[] {
  return TRACKS;
}

/**
 * Get a track by slug
 */
export function getTrackBySlug(slug: string): Track | undefined {
  return TRACKS.find((track) => track.slug === slug);
}

/**
 * Get tracks by tag
 */
export function getTracksByTag(tag: string): Track[] {
  return TRACKS.filter((track) => track.tags?.includes(tag));
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  TRACKS.forEach((track) => {
    track.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
