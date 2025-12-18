/**
 * Convert a string into a URL-safe slug
 * Used for generating stable routes from track/video titles
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens and underscores
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Extract a clean title from a filename
 * Removes file extension and cleans up the name
 */
export function filenameToTitle(filename: string): string {
  return filename
    .replace(/\.(mp3|wav|ogg|m4a)$/i, '')
    .trim();
}
