/**
 * Track cover art selection
 * Maps track slugs to cover art images
 * No runtime filesystem access - Cloudflare Pages safe
 */

import type { Track } from '@/data/tracks';

/**
 * Manual mapping of track slugs to cover art images
 * Curated for thematic fit with track titles/vibes
 */
const TRACK_ART_MAP: Record<string, string> = {
  // Urban/Street themes
  'ganja': '/assets/images/tracks/graffiti-1476119_1280.jpg',
  'entre-humos': '/assets/images/tracks/graffiti-3750912_1280.jpg',
  'street-art': '/assets/images/tracks/street-art-1499524_1280.jpg',
  'gunster': '/assets/images/tracks/skull-and-crossbones-414207_1280.jpg',
  'crussin': '/assets/images/tracks/bicycle-3045580_1280.jpg',
  'party': '/assets/images/tracks/dj-2581269_1280.jpg',
  
  // Love/Romance themes
  'amor-sincero': '/assets/images/tracks/love-2724141_1280.png',
  'amores-perdidos': '/assets/images/tracks/woman-3633737_1280.jpg',
  'te-prometo': '/assets/images/tracks/starry-sky-1655503_1280.jpg',
  'te-perdi': '/assets/images/tracks/wall-2583885_1280.jpg',
  'jardin-de-rosas': '/assets/images/tracks/aurora-borealis-9267515_1280.jpg',
  
  // Emotional/Introspective themes
  'im-sorry': '/assets/images/tracks/background-1833056_1280.jpg',
  'falle': '/assets/images/tracks/abstract-1846847_1280.jpg',
  'sin-rencores': '/assets/images/tracks/hamburg-2718329_1280.jpg',
  'sentimientos': '/assets/images/tracks/wallpaper-5928106_1280.png',
  'corazon-y-mente': '/assets/images/tracks/tube-7260586_1280.jpg',
  
  // Upbeat/Party themes
  'dejate-llevar': '/assets/images/tracks/skateboard-447147_1280.jpg',
  'bungalow': '/assets/images/tracks/architecture-3189972_1280.jpg',
  'los-5': '/assets/images/tracks/vinyl-1595847_1280.jpg',
  'f-7': '/assets/images/tracks/gong-8255081_1280.jpg',
  
  // Default assignments for remaining tracks
  'un-dia-mas': '/assets/images/tracks/abstract-1846847_1280.jpg',
  '12-05': '/assets/images/tracks/wallpaper-5928106_1280.png',
  'me-cuentan': '/assets/images/tracks/dj-2581269_1280.jpg',
  'el-don': '/assets/images/tracks/graffiti-1476119_1280.jpg',
  'quejas': '/assets/images/tracks/wall-2583885_1280.jpg',
  'noches-enteras': '/assets/images/tracks/starry-sky-1655503_1280.jpg',
  'tortas-de-jamon': '/assets/images/tracks/street-art-1499524_1280.jpg',
};

/**
 * Default fallback cover art
 */
const DEFAULT_COVER_ART = '/piko-logo.jpg';

/**
 * Get cover art URL for a track
 * Uses curated mapping or falls back to default
 * 
 * @param track - Track object with slug
 * @returns Public URL path to cover art image
 */
export function getTrackCoverArt(track: Track): string {
  // If track already has coverArt defined, use it
  if (track.coverArt) {
    return track.coverArt;
  }
  
  // Look up in curated map
  const mappedArt = TRACK_ART_MAP[track.slug];
  if (mappedArt) {
    return mappedArt;
  }
  
  // Fall back to default
  return DEFAULT_COVER_ART;
}

/**
 * Get all unique cover art images being used
 * Useful for preloading
 */
export function getAllCoverArtImages(): string[] {
  const images = new Set(Object.values(TRACK_ART_MAP));
  images.add(DEFAULT_COVER_ART);
  return Array.from(images);
}
