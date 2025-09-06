export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const robots = `User-agent: *
Allow: /

# Block admin areas
Disallow: /admin
Disallow: /admin-secret-dashboard-2024
Disallow: /api/

# Allow important pages
Allow: /api/movies
Allow: /search
Allow: /category/
Allow: /movie/
Allow: /quality/
Allow: /platform/
Allow: /language/

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml`

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}
