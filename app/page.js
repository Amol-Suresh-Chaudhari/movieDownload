import Link from 'next/link'
import Hero from '../components/Hero.js'
import FeaturedMovies from '../components/FeaturedMovies.js'
import CategorySection from '../components/CategorySection.js'
import LatestMovies from '../components/LatestMovies.js'
import PopularMovies from '../components/PopularMovies.js'

export const metadata = {
  title: 'AllMoviesHub - Download Latest Bollywood, Hollywood & South Movies in HD',
  description: 'Download latest Bollywood, Hollywood, South Indian movies and web series in 480p, 720p, 1080p HD quality. Free movie downloads with dual audio support.',
  keywords: 'latest movies 2024, bollywood movies download, hollywood movies download, south movies download, web series download, HD movies, dual audio movies',
  openGraph: {
    title: 'AllMoviesHub - Download Latest Movies in HD Quality',
    description: 'Download latest Bollywood, Hollywood, South movies and web series in HD quality with dual audio support.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "AllMoviesHub - Latest Movies Download",
            "description": "Download latest Bollywood, Hollywood, South Indian movies and web series in HD quality",
            "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Movie Categories",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Bollywood Movies",
                  "url": "/category/bollywood"
                },
                {
                  "@type": "ListItem", 
                  "position": 2,
                  "name": "Hollywood Movies",
                  "url": "/category/hollywood"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "South Movies",
                  "url": "/category/south"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Web Series",
                  "url": "/category/web-series"
                }
              ]
            }
          })
        }}
      />
      <div className="min-h-screen bg-gray-900">
      <Hero />
      <FeaturedMovies />
      
      {/* Categories Section */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          <CategorySection 
            title="Dual Audio" 
            category="dual-audio"
            image="/images/dual-audio.jpg"
            count="400+"
            className="bg-gradient-to-br from-yellow-600 to-orange-600"
          />
          <CategorySection 
            title="Bollywood" 
            category="bollywood"
            image="/images/bollywood.jpg"
            count="500+"
            className="bg-gradient-to-br from-red-600 to-pink-600"
          />
          <CategorySection 
            title="Hollywood" 
            category="hollywood"
            image="/images/hollywood.jpg"
            count="800+"
            className="bg-gradient-to-br from-blue-600 to-purple-600"
          />
          <CategorySection 
            title="South Movies" 
            category="south"
            image="/images/south.jpg"
            count="300+"
            className="bg-gradient-to-br from-green-600 to-teal-600"
          />
          <CategorySection 
            title="Web Series" 
            category="web-series"
            image="/images/webseries.jpg"
            count="200+"
            className="bg-gradient-to-br from-purple-600 to-indigo-600"
          />
          <CategorySection 
            title="Hindi Dubbed" 
            category="hindi-dubbed"
            image="/images/hindi-dubbed.jpg"
            count="600+"
            className="bg-gradient-to-br from-orange-600 to-red-600"
          />
        </div>
      </section>

      {/* Quality & Platform Quick Access */}
      <section className="py-6 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Quality & Platforms</h3>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {['480P', '720P', '1080P', '2160P 4K'].map((quality) => (
              <Link
                key={quality}
                href={`/quality/${quality.toLowerCase().replace(' ', '-')}`}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full transition-colors duration-200"
              >
                {quality}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {['NETFLIX', 'PRIME VIDEO', 'DISNEY+', 'HOTSTAR', 'ZEE5', 'JIOCINEMA'].map((platform) => (
              <Link
                key={platform}
                href={`/platform/${platform.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-full transition-colors duration-200"
              >
                {platform}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LatestMovies />
      <PopularMovies />
      
      {/* Quality & Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Why Choose AllMoviesHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">HD Quality</h3>
              <p className="text-gray-300">Download movies in 480p, 720p, 1080p, and 4K quality</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Dual Audio</h3>
              <p className="text-gray-300">Movies available in Hindi dubbed and original language</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fast Downloads</h3>
              <p className="text-gray-300">High-speed download links and streaming options</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
