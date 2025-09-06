'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import MovieCard from '../../../components/MovieCard.js'
import { Search, Filter, X } from 'lucide-react'

export default function CategoryPage() {
  const params = useParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState({
    year: '',
    genre: '',
    quality: '',
    isDualAudio: false
  })
  const [showFilters, setShowFilters] = useState(false)

  const categoryTitles = {
    'bollywood': 'Bollywood Movies',
    'hollywood': 'Hollywood Movies',
    'south': 'South Indian Movies',
    'web-series': 'Web Series',
    'dual-audio': 'Dual Audio Movies',
    'hindi-dubbed': 'Hindi Dubbed Movies',
    'hollywood-hindi-dubbed': 'Hollywood Hindi Dubbed',
    'south-hindi-dubbed': 'South Hindi Dubbed'
  }

  const categoryTitle = categoryTitles[params.slug] || `${params.slug.charAt(0).toUpperCase() + params.slug.slice(1)} Movies`

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
      
      // Map category slugs to actual database categories or special filters
      const categoryMapping = {
        'bollywood': 'Bollywood',
        'hollywood': 'Hollywood', 
        'south': 'South',
        'web-series': 'Web Series',
        'dual-audio': null, // Special case - filter by isDualAudio
        'hindi-dubbed': null, // Special case - filter by isDualAudio
        'hollywood-hindi-dubbed': 'Hollywood',
        'south-hindi-dubbed': 'South'
      }
      
      const queryParams = new URLSearchParams(filters)
      queryParams.set('page', page.toString())
      queryParams.set('limit', '12')
      
      // Handle special category mappings
      if (params.slug === 'dual-audio' || params.slug === 'hindi-dubbed') {
        queryParams.set('isDualAudio', 'true')
      } else if (params.slug === 'hollywood-hindi-dubbed') {
        queryParams.set('category', 'Hollywood')
        queryParams.set('isDualAudio', 'true')
      } else if (params.slug === 'south-hindi-dubbed') {
        queryParams.set('category', 'South')
        queryParams.set('isDualAudio', 'true')
      } else {
        const mappedCategory = categoryMapping[params.slug]
        if (mappedCategory) {
          queryParams.set('category', mappedCategory)
        }
      }
      
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
      year: '',
      genre: '',
      quality: '',
      isDualAudio: false
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-0">
            {categoryTitle}
          </h1>
          
          {/* Filter Toggle */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Genres</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Romance">Romance</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Sci-Fi">Sci-Fi</option>
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
                <p className="text-gray-400 text-lg">No movies found in this category.</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or check back later.</p>
              </div>
            )}
          </>
        )}

        {/* Load More Button */}
        {movies.length > 0 && hasMore && (
          <div className="flex justify-center mt-8">
            <button 
              onClick={loadMoreMovies}
              disabled={loadingMore}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
            >
              {loadingMore ? 'Loading...' : 'Load More Movies'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
