/**
 * Image Assets Manifest
 * Lists available images for backgrounds and hero sections
 */

export const heroImages = [
  '/assets/images/hero/white_hero.jpg',
  '/assets/images/hero/black_and_white_standing_low_shot.jpg',
  // Add more hero images here as they become available
];

export const bgImages = [
  '/assets/images/bg/graffiti_1874452_1280.jpg',
  '/assets/images/bg/street_art_2254155_1280.jpg',
  '/assets/images/bg/wall_2602116_1280.jpg',
  '/assets/images/bg/window_999882_1280.jpg',
  '/assets/images/bg/green_shillioette.jpg',
  '/assets/images/bg/sillhoette.jpg',
  '/assets/images/bg/piko_fg_block_rectangel_logo.jpg',
  // Add more background images here as they become available
];

export const artistImages = [
  '/assets/images/artist/channels4_profile.jpg',
  '/assets/images/artist/close_up_face.jpg',
  '/assets/images/artist/on_the_mic.jpg',
  '/assets/images/artist/piko_musician_bio_photo.jpg',
  // Add more artist images here as they become available
];

/**
 * Get a random image from a collection
 */
export function getRandomImage(images: string[]): string {
  return images[Math.floor(Math.random() * images.length)];
}

/**
 * Get a random background image
 */
export function getRandomBg(): string {
  return getRandomImage(bgImages);
}

/**
 * Get a random hero image
 */
export function getRandomHero(): string {
  return getRandomImage(heroImages);
}

/**
 * Get a random artist image
 */
export function getRandomArtist(): string {
  return getRandomImage(artistImages);
}
