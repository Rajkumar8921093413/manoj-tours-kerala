export function formatImageUrl(url) {
  if (!url || typeof url !== 'string') return '/assets/images/logo.jpg';
  const clean = url.trim();
  if (
    clean.startsWith('http://') ||
    clean.startsWith('https://') ||
    clean.startsWith('data:') ||
    clean.startsWith('blob:')
  ) {
    return clean;
  }
  if (clean.startsWith('/')) {
    return clean;
  }
  return `/${clean}`;
}

