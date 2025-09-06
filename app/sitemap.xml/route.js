export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Static pages
  const staticPages = [
    '',
    '/search',
    '/category/bollywood',
    '/category/hollywood', 
    '/category/south',
    '/category/web-series',
    '/quality/480p',
    '/quality/720p',
    '/quality/1080p',
    '/quality/2160p-4k',
    '/platform/netflix',
    '/platform/prime-video',
    '/platform/disney-plus',
    '/platform/hotstar',
    '/platform/zee5',
    '/platform/jiocinema',
    '/language/hindi',
    '/language/english',
    '/language/tamil',
    '/language/telugu',
    '/language/malayalam',
    '/language/kannada',
    '/privacy',
    '/terms',
    '/sitemap',
    '/contact',
    '/dmca'
  ]

  // Fetch movies for dynamic pages
  let movies = []
  try {
    const response = await fetch(`${baseUrl}/api/movies?limit=1000`)
    const data = await response.json()
    movies = data.movies || []
  } catch (error) {
    console.error('Error fetching movies for sitemap:', error)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${movies.map(movie => `
  <url>
    <loc>${baseUrl}/movie/${movie.slug}</loc>
    <lastmod>${new Date(movie.updatedAt || movie.createdAt || Date.now()).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
