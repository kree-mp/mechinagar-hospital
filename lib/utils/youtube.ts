const YOUTUBE_ID_PATTERN = /[a-zA-Z0-9_-]{11}/;

const YOUTUBE_URL_PATTERNS = [
  /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com|youtube-nocookie\.com)\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
];

// Accepts a plain YouTube link, a short link, an embed URL, or a full pasted
// <iframe> embed snippet, and extracts just the 11-char video ID from it.
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  // Pasted iframe embed code: pull the src attribute out first, then re-check.
  const srcMatch = trimmed.match(/src=["']([^"']+)["']/);
  if (srcMatch) {
    for (const pattern of YOUTUBE_URL_PATTERNS) {
      const match = srcMatch[1].match(pattern);
      if (match) return match[1];
    }
  }

  // Bare video ID pasted directly.
  if (YOUTUBE_ID_PATTERN.test(trimmed) && trimmed.length === 11) return trimmed;

  return null;
}

export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;
}
