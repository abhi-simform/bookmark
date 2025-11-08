import type { MetadataResult, BookmarkType, BookmarkPlatform } from '@/types';

export async function fetchMetadata(url: string): Promise<MetadataResult> {
  try {
    const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.status === 'success') {
      return {
        title: data.data.title || new URL(url).hostname,
        description: data.data.description,
        favicon: data.data.logo?.url,
        thumbnail: data.data.image?.url || data.data.screenshot?.url,
        type: detectType(url, data.data),
        platform: detectPlatform(url),
      };
    }

    // Fallback to basic metadata
    return {
      title: new URL(url).hostname,
      type: detectType(url),
      platform: detectPlatform(url),
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: new URL(url).hostname,
      type: 'webpage',
      platform: 'other',
    };
  }
}

function detectType(url: string, data?: any): BookmarkType {
  const urlLower = url.toLowerCase();

  // Video platforms
  if (
    urlLower.includes('youtube.com') ||
    urlLower.includes('youtu.be') ||
    urlLower.includes('vimeo.com') ||
    urlLower.includes('twitch.tv') ||
    data?.video
  ) {
    return 'video';
  }

  // Social platforms
  if (
    urlLower.includes('twitter.com') ||
    urlLower.includes('x.com') ||
    urlLower.includes('instagram.com') ||
    urlLower.includes('facebook.com') ||
    urlLower.includes('linkedin.com/posts')
  ) {
    return 'social';
  }

  // Article indicators
  if (
    urlLower.includes('medium.com') ||
    urlLower.includes('dev.to') ||
    urlLower.includes('/blog/') ||
    urlLower.includes('/article/') ||
    data?.author
  ) {
    return 'article';
  }

  return 'webpage';
}

function detectPlatform(url: string): BookmarkPlatform {
  const urlLower = url.toLowerCase();

  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
    return 'youtube';
  }
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com')) {
    return 'twitter';
  }
  if (urlLower.includes('github.com')) {
    return 'github';
  }
  if (urlLower.includes('medium.com')) {
    return 'medium';
  }
  if (urlLower.includes('reddit.com')) {
    return 'reddit';
  }
  if (urlLower.includes('linkedin.com')) {
    return 'linkedin';
  }

  return 'other';
}

export function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
