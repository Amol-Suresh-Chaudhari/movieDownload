// Default images for fallback
export const DEFAULT_IMAGES = {
  poster: '/images/default-poster.webp',
  backdrop: '/images/default-poster.webp',
  screenshot: '/images/default-poster.webp',
  banner: '/images/default-poster.webp'
}

// Image quality mappings
export const QUALITY_IMAGES = {
  '480p': '/images/480p-quality.png',
  '720p': '/images/720p-quality.png', 
  '1080p': '/images/1080p-quality.png',
  '4K': '/images/4k-quality.png'
}

// Helper function to get image with fallback
export const getImageWithFallback = (images, type, fallbackType = 'poster') => {
  if (images && images.length > 0) {
    const image = images.find(img => img.type === type)
    if (image && image.url) return image.url
    
    // Try fallback type
    const fallbackImage = images.find(img => img.type === fallbackType)
    if (fallbackImage && fallbackImage.url) return fallbackImage.url
    
    // Use first available image
    if (images[0] && images[0].url) return images[0].url
  }
  
  return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.poster
}
