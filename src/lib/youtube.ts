/**
 * YouTube Data API v3 Integration
 * Fetches latest videos from Piko FG's YouTube channel
 * 
 * Setup Instructions:
 * 1. Get API key from https://console.cloud.google.com/
 * 2. Enable YouTube Data API v3
 * 3. Add YOUTUBE_API_KEY to environment variables
 * 4. Channel ID: UCD2ybRyk6b1pQDfOtq2MYIw (from URL)
 */

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
const CHANNEL_ID = 'UCD2ybRyk6b1pQDfOtq2MYIw';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  videoUrl: string;
}

interface YouTubeAPIItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

/**
 * Fetch latest videos from the channel
 * @param maxResults Number of videos to fetch (default: 3)
 */
export async function fetchLatestYouTubeVideos(
  maxResults: number = 3
): Promise<YouTubeVideo[]> {
  // Return placeholder data if API key is not configured
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured. Using placeholder data.');
    return getPlaceholderVideos(maxResults);
  }

  try {
    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?` +
        new URLSearchParams({
          key: YOUTUBE_API_KEY,
          channelId: CHANNEL_ID,
          part: 'snippet',
          order: 'date',
          maxResults: maxResults.toString(),
          type: 'video',
        }),
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json() as { items: YouTubeAPIItem[] };

    return data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return getPlaceholderVideos(maxResults);
  }
}

/**
 * Get placeholder video data
 * Used when API is not configured or fails
 */
function getPlaceholderVideos(count: number): YouTubeVideo[] {
  const placeholders: YouTubeVideo[] = [
    {
      id: '1sH88Y0DgWo',
      title: 'Te Prometo - Piko FG',
      description: 'Official music video',
      thumbnailUrl: 'https://img.youtube.com/vi/1sH88Y0DgWo/hqdefault.jpg',
      publishedAt: new Date().toISOString(),
      videoUrl: 'https://www.youtube.com/watch?v=1sH88Y0DgWo',
    },
    {
      id: 'CdcXTfvAjns',
      title: 'El Don - Piko FG',
      description: 'Official music video',
      thumbnailUrl: 'https://img.youtube.com/vi/CdcXTfvAjns/hqdefault.jpg',
      publishedAt: new Date().toISOString(),
      videoUrl: 'https://www.youtube.com/watch?v=CdcXTfvAjns',
    },
    {
      id: 'placeholder-3',
      title: 'Behind The Scenes',
      description: 'Studio session',
      thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/hqdefault.jpg',
      publishedAt: new Date().toISOString(),
      videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    },
  ];

  return placeholders.slice(0, count);
}

/**
 * Get video embed URL
 */
export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Format publish date
 */
export function formatPublishDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
