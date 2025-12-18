/**
 * Studio Configuration
 * Controls visibility and access to the Studio feature
 */

// Toggle Studio visibility via environment variable or default to true for development
export const STUDIO_VISIBLE = process.env.NEXT_PUBLIC_STUDIO_VISIBLE !== 'false';

// Studio access configuration
export const STUDIO_CONFIG = {
  visible: STUDIO_VISIBLE,
  keyboardShortcut: 'Shift+S',
  footerLinkOpacity: 0.2,
} as const;

