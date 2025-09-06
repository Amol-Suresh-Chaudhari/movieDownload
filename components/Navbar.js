'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Home, Film, Tv, Star, Download, MessageCircle, Globe, Play } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState(null)

  const mainCategories = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dual Audio', href: '/category/dual-audio', icon: Film },
    { name: 'Bollywood', href: '/category/bollywood', icon: Film },
    { name: 'Hollywood', href: '/category/hollywood', icon: Film },
    { name: 'South Movies', href: '/category/south', icon: Film },
    { name: 'Web Series', href: '/category/web-series', icon: Tv },
  ]

  const qualityOptions = [
    { name: '480P', href: '/quality/480p' },
    { name: '720P', href: '/quality/720p' },
    { name: '1080P', href: '/quality/1080p' },
    { name: '2160P 4K', href: '/quality/4k' },
  ]

  const streamingPlatforms = [
    { name: 'NETFLIX', href: '/platform/netflix' },
    { name: 'AMZN PRIME VIDEO', href: '/platform/prime-video' },
    { name: 'DISNEY+ HOTSTAR', href: '/platform/disney-hotstar' },
    { name: 'SONYLIV', href: '/platform/sonyliv' },
    { name: 'ZEE5', href: '/platform/zee5' },
    { name: 'JIOCINEMA', href: '/platform/jiocinema' },
    { name: 'HOICHOI', href: '/platform/hoichoi' },
    { name: 'ALTBALAJI', href: '/platform/altbalaji' },
  ]

  const languageCategories = [
    { name: 'BENGALI', href: '/language/bengali' },
    { name: 'GUJARATI', href: '/language/gujarati' },
    { name: 'PUNJABI MOVIES', href: '/language/punjabi' },
    { name: 'MARATHI MOVIES', href: '/language/marathi' },
    { name: 'HINDI DUBBED MOVIES', href: '/category/hindi-dubbed' },
    { name: 'HOLLYWOOD HINDI DUBBED', href: '/category/hollywood-hindi-dubbed' },
    { name: 'SOUTH HINDI DUBBED', href: '/category/south-hindi-dubbed' },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-xl sticky top-0 z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Left */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  AllMoviesHub
                </span>
              </Link>
            </div>

            {/* Main Navigation - Center */}
            <div className="hidden lg:flex items-center space-x-1">
              {mainCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 group"
                >
                  <category.icon className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                  <span className="text-sm font-medium">{category.name}</span>
                </Link>
              ))}
            </div>

            {/* Right Section - Dropdowns & Search */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Quality Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'quality' ? null : 'quality')}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 text-sm font-medium transition-all duration-200"
                >
                  <span>Quality</span>
                  <span className="text-xs">▼</span>
                </button>
                {activeDropdown === 'quality' && (
                  <div className="absolute top-full right-0 mt-2 w-36 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
                    {qualityOptions.map((quality) => (
                      <Link
                        key={quality.name}
                        href={quality.href}
                        className="block px-4 py-3 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {quality.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Platforms Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === 'platforms' ? null : 'platforms')}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 text-sm font-medium transition-all duration-200"
                >
                  <span>Platforms</span>
                  <span className="text-xs">▼</span>
                </button>
                {activeDropdown === 'platforms' && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 max-h-64 overflow-y-auto">
                    {streamingPlatforms.map((platform) => (
                      <Link
                        key={platform.name}
                        href={platform.href}
                        className="block px-4 py-3 text-sm text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {platform.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-56 px-4 py-2.5 pl-11 bg-gray-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm backdrop-blur-sm transition-all duration-200"
                  />
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </form>
              </div>
            </div>


            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 focus:outline-none transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-gray-900 to-black border-t border-gray-700">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Menu Items */}
              <div className="space-y-1">
                {mainCategories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <category.icon className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                    <span className="font-medium">{category.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Sections */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-700">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Quality</p>
                  {qualityOptions.map((option) => (
                    <Link
                      key={option.name}
                      href={option.href}
                      className="block px-2 py-1 text-xs text-gray-300 hover:text-white transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {option.name}
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Platforms</p>
                  {streamingPlatforms.slice(0, 4).map((platform) => (
                    <Link
                      key={platform.name}
                      href={platform.href}
                      className="block px-2 py-1 text-xs text-gray-300 hover:text-white transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {platform.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Search Section - Below main navbar */}
      <div className="md:hidden bg-gray-800 border-t border-gray-700">
        <div className="px-4 py-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-11 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </form>
        </div>
      </div>
    </>
  )
}
