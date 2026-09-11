/**
 * Image URL Sanitizer & Cloud Drive Link Normalizer
 * Automatically converts Google Drive, Dropbox, GitHub, and other web links
 * into direct, high-resolution renderable image URLs.
 */

export function sanitizeImageUrl(url: string | undefined | null): string {
  if (!url) return '';
  let clean = url.trim();
  if (!clean) return '';

  // Already a valid Base64 data URL
  if (clean.startsWith('data:image/')) {
    return clean;
  }

  // Prepend protocol if missing
  if (!/^https?:\/\//i.test(clean)) {
    clean = 'https://' + clean.replace(/^\/\//, '');
  }

  // 1. Google Drive Sharing Links:
  // e.g. https://drive.google.com/file/d/1B6.../view?usp=sharing
  // e.g. https://drive.google.com/open?id=1B6...
  // e.g. https://drive.google.com/uc?id=1B6...
  const gdriveMatch1 = clean.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  const gdriveMatch2 = clean.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/i);
  const gdriveId = gdriveMatch1?.[1] || gdriveMatch2?.[1];
  if (gdriveId) {
    // Google direct CDN endpoint for public Drive files:
    return `https://lh3.googleusercontent.com/d/${gdriveId}`;
  }

  // 2. Dropbox Links:
  // e.g. https://www.dropbox.com/s/xyz/photo.jpg?dl=0
  if (/dropbox\.com/i.test(clean)) {
    clean = clean.replace(/[?&]dl=[01]/, '');
    clean = clean.replace(/[?&]raw=1/, '');
    const separator = clean.includes('?') ? '&' : '?';
    return `${clean}${separator}raw=1`;
  }

  // 3. GitHub Profile or Avatar URL:
  // e.g. https://github.com/torvalds -> https://github.com/torvalds.png
  const githubUserMatch = clean.match(/^https?:\/\/(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)\/?$/i);
  if (githubUserMatch && !clean.includes('.png') && !clean.includes('.jpg') && !clean.includes('/assets/')) {
    return `https://github.com/${githubUserMatch[1]}.png`;
  }

  // 4. Imgur Links:
  // e.g. https://imgur.com/aBcDeFg -> https://i.imgur.com/aBcDeFg.jpg
  const imgurMatch = clean.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]+)$/i);
  if (imgurMatch) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
  }

  return clean;
}

export interface SampleImagePreset {
  id: string;
  label: string;
  category: string;
  url: string;
}

export const SAMPLE_IMAGE_PRESETS: SampleImagePreset[] = [
  {
    id: 'unsplash-ai-scholar',
    label: 'AI Scholar',
    category: 'Academic',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'unsplash-systems-dev',
    label: 'Systems Architect',
    category: 'Tech',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'unsplash-tech-lead',
    label: 'Tech Lead',
    category: 'Leadership',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'unsplash-researcher',
    label: 'Faculty Mentor',
    category: 'Academic',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'github-octocat',
    label: 'GitHub Octocat',
    category: 'Developer',
    url: 'https://github.com/github.png',
  },
  {
    id: 'unsplash-founder',
    label: 'Startup Innovator',
    category: 'Leadership',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
  },
];

/**
 * Validates if an image URL can be loaded successfully by the browser.
 */
export function testImageLoad(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}
