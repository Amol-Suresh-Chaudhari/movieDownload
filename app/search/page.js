'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import MovieCard from '../../components/MovieCard.js'
import { Search, Filter, X } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [filters, setFilters] = useState({
    category: 'all',
    year: '',
    genre: '',
    quality: '',
    isDualAudio: false
  })
  const [showFilters, setShowFilters] = useState(false)

  // Sample search results
  const sampleResults = [
    {
      _id: '1',
      title: 'Spider-Man: No Way Home',
      slug: 'spider-man-no-way-home',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Spider-Man',
      year: 2021,
      rating: 8.4,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '400MB' },
        { quality: '720p', size: '1.2GB' },
        { quality: '1080p', size: '2.5GB' }
      ],
      views: 125000,
      downloads: 45000
    },
    {
      _id: '2',
      title: 'The Batman',
      slug: 'the-batman',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=The+Batman',
      year: 2022,
      rating: 7.8,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '500MB' },
        { quality: '720p', size: '1.4GB' },
        { quality: '1080p', size: '3.1GB' }
      ],
      views: 156000,
      downloads: 52000
    }
  ]

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        
        if (searchQuery) params.append('search', searchQuery)
        if (filters.category !== 'all') params.append('category', filters.category)
        if (filters.year) params.append('year', filters.year)
        if (filters.genre) params.append('genre', filters.genre)
        if (filters.quality) params.append('quality', filters.quality)
        if (filters.isDualAudio) params.append('isDualAudio', 'true')
        
        params.append('limit', '20')
        
        const response = await fetch(`/api/movies?${params.toString()}`)
        const data = await response.json()
        
        if (response.ok) {
          setMovies(data.movies || [])
        } else {
          console.error('Search API error:', data.error)
          setMovies([])
        }
      } catch (error) {
        console.error('Error searching movies:', error)
        setMovies([])
      } finally {
        setLoading(false)
      }
    }

    if (searchQuery || Object.values(filters).some(filter => filter && filter !== 'all' && filter !== false)) {
      fetchMovies()
    } else {
      setMovies([])
      setLoading(false)
    }
  }, [searchQuery, filters])

  const handleSearch = (e) => {
    e.preventDefault()
    // Update URL with search query
    const url = new URL(window.location)
    url.searchParams.set('q', searchQuery)
    window.history.pushState({}, '', url)
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      year: '',
      genre: '',
      quality: '',
      isDualAudio: false
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Movies'}
          </h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, series..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Hollywood">Hollywood</option>
                    <option value="Bollywood">Bollywood</option>
                    <option value="South">South Movies</option>
                    <option value="Web Series">Web Series</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <select
                    value={filters.genre}
                    onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Genres</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Romance">Romance</option>
                    <option value="Thriller">Thriller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
                  <select
                    value={filters.quality}
                    onChange={(e) => setFilters({ ...filters, quality: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Qualities</option>
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p</option>
                    <option value="4K">4K</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Audio</label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isDualAudio}
                      onChange={(e) => setFilters({ ...filters, isDualAudio: e.target.checked })}
                      className="mr-2 rounded"
                    />
                    <span className="text-white text-sm">Dual Audio Only</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg animate-pulse">
                <div className="h-64 sm:h-80 bg-gray-700 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400">
                Found {movies.length} results {searchQuery && `for "${searchQuery}"`}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          </>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-gray-400 mb-4">
              We couldn't find any movies matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start your search</h3>
            <p className="text-gray-400">
              Enter a movie title, actor name, or genre to find what you're looking for
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
