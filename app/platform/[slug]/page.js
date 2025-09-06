'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import MovieCard from '../../../components/MovieCard.js'
import { Filter, X, Play } from 'lucide-react'

export default function PlatformPage() {
  const params = useParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    year: '',
    genre: '',
    quality: '',
    isDualAudio: false
  })
  const [showFilters, setShowFilters] = useState(false)

  const platformTitles = {
    'netflix': 'Netflix Movies & Series',
    'prime-video': 'Amazon Prime Video',
    'disney-hotstar': 'Disney+ Hotstar',
    'sonyliv': 'SonyLIV',
    'zee5': 'ZEE5',
    'jiocinema': 'JioCinema',
    'hoichoi': 'Hoichoi',
    'altbalaji': 'ALTBalaji'
  }

  const platformTitle = platformTitles[params.slug] || `${params.slug.charAt(0).toUpperCase() + params.slug.slice(1)} Content`

  useEffect(() => {
    setCurrentPage(1)
    setHasMore(true)
    fetchMovies(1, true)
  }, [params.slug, filters])

  const fetchMovies = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      
      const queryParams = new URLSearchParams({
        platform: params.slug,
        page: page.toString(),
        limit: '12',
        ...filters
      })
      
      const response = await fetch(`/api/movies?${queryParams}`)
      const data = await response.json()
      
      if (response.ok) {
        const newMovies = data.movies || []
        if (reset) {
          setMovies(newMovies)
        } else {
          setMovies(prev => [...prev, ...newMovies])
        }
        setHasMore(newMovies.length === 12)
        setCurrentPage(page)
      } else {
        console.error('Failed to fetch movies:', data.error)
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreMovies = () => {
    if (!loadingMore && hasMore) {
      fetchMovies(currentPage + 1, false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      year: '',
      genre: '',
      quality: '',
      isDualAudio: false
    })
  }

  return (
    <>
      <div className="min-h-screen bg-gray-900 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <Play className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {platformTitle}
            </h1>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Bollywood">Bollywood</option>
                  <option value="Hollywood">Hollywood</option>
                  <option value="South">South Movies</option>
                  <option value="Web Series">Web Series</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Years</option>
                  {Array.from({length: 10}, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
                <select
                  value={filters.quality}
                  onChange={(e) => handleFilterChange('quality', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Quality</option>
                  <option value="480p">480P</option>
                  <option value="720p">720P</option>
                  <option value="1080p">1080P</option>
                  <option value="4k">2160P 4K</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={filters.isDualAudio}
                    onChange={(e) => handleFilterChange('isDualAudio', e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span>Dual Audio</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {movies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                  <MovieCard key={movie._id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No content found from {platformTitle}.</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or check back later for new releases.</p>
              </div>
            )}
          </>
        )}

        {/* Load More Button */}
        {movies.length > 0 && hasMore && (
          <div className="flex justify-center mt-8 mb-8">
            <button 
              onClick={loadMoreMovies}
              disabled={loadingMore}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
            >
              {loadingMore ? 'Loading...' : 'Load More Content'}
            </button>
          </div>
        )}
        </div>
      </div>
    </>
  )
}
