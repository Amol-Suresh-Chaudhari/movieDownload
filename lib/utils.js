// Utility function to get image with fallback
export function getImageWithFallback(images, type = 'poster') {
  if (!images || !Array.isArray(images)) {
    return '/images/default-poster.jpg';
  }
  
  const image = images.find(img => img.type === type);
  return image ? image.url : '/images/default-poster.jpg';
}

// Utility function to format numbers
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Utility function to format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

// Utility function to generate slug
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Utility function to get quality color
export function getQualityColor(quality) {
  switch (quality) {
    case '4K':
      return 'bg-purple-600';
    case '1080p':
      return 'bg-blue-600';
    case '720p':
      return 'bg-green-600';
    case '480p':
      return 'bg-yellow-600';
    default:
      return 'bg-gray-600';
  }
}
