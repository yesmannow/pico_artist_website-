/**
 * Social Media Links Configuration
 * Central source of truth for all Piko FG social media URLs
 */

export interface SocialLink {
  name: string;
  url: string;
  platform: 'youtube-music' | 'youtube' | 'facebook' | 'instagram';
  icon?: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'YouTube Music',
    url: 'https://music.youtube.com/channel/UCD2ybRyk6b1pQDfOtq2MYIw',
    platform: 'youtube-music',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@pikofg-unamasmusic-1203/videos',
    platform: 'youtube',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/Unamasmusic',
    platform: 'facebook',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/piko289/',
    platform: 'instagram',
  },
];

/**
 * Get social link by platform
 */
export function getSocialLink(platform: SocialLink['platform']): SocialLink | undefined {
  return SOCIAL_LINKS.find((link) => link.platform === platform);
}

/**
 * Get all social links
 */
export function getSocialLinks(): SocialLink[] {
  return SOCIAL_LINKS;
}
