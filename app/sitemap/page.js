import { Map, ExternalLink, Film, Users, Shield } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Sitemap - AllMoviesHub',
  description: 'Complete sitemap and navigation guide for AllMoviesHub website.',
}

export default function SitemapPage() {
  const siteStructure = {
    'Main Pages': [
      { name: 'Home', url: '/', description: 'Latest movies and featured content' },
      { name: 'Search', url: '/search', description: 'Search for movies and content' },
    ],
    'Movie Categories': [
      { name: 'Bollywood Movies', url: '/category/bollywood', description: 'Hindi movies and films' },
      { name: 'Hollywood Movies', url: '/category/hollywood', description: 'English movies and blockbusters' },
      { name: 'South Movies', url: '/category/south', description: 'Tamil, Telugu, and other South Indian films' },
      { name: 'Web Series', url: '/category/web-series', description: 'TV shows and web series' },
      { name: 'Dual Audio', url: '/category/dual-audio', description: 'Movies with multiple language options' },
      { name: 'Hindi Dubbed', url: '/category/hindi-dubbed', description: 'Foreign movies dubbed in Hindi' },
    ],
    'Quality Categories': [
      { name: '480P Movies', url: '/quality/480p', description: 'Standard definition movies' },
      { name: '720P Movies', url: '/quality/720p', description: 'High definition movies' },
      { name: '1080P Movies', url: '/quality/1080p', description: 'Full HD movies' },
      { name: '4K Movies', url: '/quality/4k', description: 'Ultra HD 4K movies' },
    ],
    'Streaming Platforms': [
      { name: 'Netflix Movies', url: '/platform/netflix', description: 'Movies from Netflix' },
      { name: 'Prime Video', url: '/platform/prime-video', description: 'Amazon Prime Video content' },
      { name: 'Disney+ Hotstar', url: '/platform/disney-hotstar', description: 'Disney+ Hotstar movies and shows' },
      { name: 'Sony LIV', url: '/platform/sonyliv', description: 'Sony LIV exclusive content' },
      { name: 'ZEE5', url: '/platform/zee5', description: 'ZEE5 movies and series' },
      { name: 'JioCinema', url: '/platform/jiocinema', description: 'JioCinema content' },
    ],
    'Language Categories': [
      { name: 'Bengali Movies', url: '/language/bengali', description: 'Bengali films and cinema' },
      { name: 'Gujarati Movies', url: '/language/gujarati', description: 'Gujarati films' },
      { name: 'Punjabi Movies', url: '/language/punjabi', description: 'Punjabi cinema' },
      { name: 'Marathi Movies', url: '/language/marathi', description: 'Marathi films' },
    ],
    'Legal & Support': [
      { name: 'Contact Us', url: '/contact', description: 'Get in touch with our support team' },
      { name: 'DMCA Policy', url: '/dmca', description: 'Copyright and DMCA information' },
      { name: 'Privacy Policy', url: '/privacy', description: 'How we protect your privacy' },
      { name: 'Terms of Service', url: '/terms', description: 'Terms and conditions of use' },
      { name: 'Sitemap', url: '/sitemap', description: 'Complete site navigation' },
    ]
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center space-x-3 mb-8">
            <Map className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-white">Sitemap</h1>
          </div>

          <div className="mb-8">
            <p className="text-xl text-gray-300 mb-4">
              Navigate through all sections of AllMoviesHub easily with our complete sitemap.
            </p>
            <div className="bg-blue-900 border border-blue-600 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Film className="w-5 h-5 text-blue-400" />
                <span className="text-blue-200 font-semibold">Quick Stats</span>
              </div>
              <p className="text-blue-100 mt-2 mb-0">
                Explore thousands of movies across multiple categories, qualities, and languages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(siteStructure).map(([category, pages]) => (
              <div key={category} className="bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  {category === 'Main Pages' && <Film className="w-5 h-5 mr-2 text-blue-400" />}
                  {category === 'Movie Categories' && <Film className="w-5 h-5 mr-2 text-red-400" />}
                  {category === 'Quality Categories' && <Shield className="w-5 h-5 mr-2 text-green-400" />}
                  {category === 'Streaming Platforms' && <ExternalLink className="w-5 h-5 mr-2 text-purple-400" />}
                  {category === 'Language Categories' && <Users className="w-5 h-5 mr-2 text-yellow-400" />}
                  {category === 'Legal & Support' && <Shield className="w-5 h-5 mr-2 text-gray-400" />}
                  {category}
                </h2>
                <div className="space-y-3">
                  {pages.map((page) => (
                    <div key={page.url} className="border-l-2 border-gray-600 pl-4">
                      <Link
                        href={page.url}
                        className="block text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
                      >
                        {page.name}
                      </Link>
                      <p className="text-gray-400 text-sm mt-1">{page.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">How to Navigate</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Use the main navigation menu for quick access</li>
                  <li>• Search functionality is available on every page</li>
                  <li>• Categories are organized by genre, quality, and language</li>
                  <li>• Each movie page contains detailed information and download links</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Need Help?</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Visit our <Link href="/contact" className="text-blue-400 hover:text-blue-300">Contact page</Link> for support</li>
                  <li>• Check our <Link href="/dmca" className="text-blue-400 hover:text-blue-300">DMCA policy</Link> for copyright info</li>
                  <li>• Read our <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link></li>
                  <li>• Review <Link href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Last updated: January 2024 | 
              <Link href="/contact" className="text-blue-400 hover:text-blue-300 ml-1">
                Report broken links
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
