'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import MovieCard from './MovieCard'

export default function PopularMovies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const popularMovies = [
    {
      _id: '11',
      title: 'Top Gun: Maverick',
      slug: 'top-gun-maverick',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Top+Gun',
      year: 2022,
      rating: 8.3,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '480MB' },
        { quality: '720p', size: '1.4GB' },
        { quality: '1080p', size: '2.8GB' },
        { quality: '4K', size: '6.2GB' }
      ],
      views: 234000,
      downloads: 87000
    },
    {
      _id: '12',
      title: 'Vikram',
      slug: 'vikram',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Vikram',
      year: 2022,
      rating: 8.4,
      category: 'South',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '450MB' },
        { quality: '720p', size: '1.3GB' },
        { quality: '1080p', size: '2.6GB' }
      ],
      views: 189000,
      downloads: 72000
    },
    {
      _id: '13',
      title: 'Gangubai Kathiawadi',
      slug: 'gangubai-kathiawadi',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Gangubai',
      year: 2022,
      rating: 7.8,
      category: 'Bollywood',
      isDualAudio: false,
      downloadLinks: [
        { quality: '480p', size: '430MB' },
        { quality: '720p', size: '1.2GB' },
        { quality: '1080p', size: '2.5GB' }
      ],
      views: 145000,
      downloads: 56000
    },
    {
      _id: '14',
      title: 'Doctor Strange 2',
      slug: 'doctor-strange-2',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Dr+Strange+2',
      year: 2022,
      rating: 6.9,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '500MB' },
        { quality: '720p', size: '1.5GB' },
        { quality: '1080p', size: '3.0GB' },
        { quality: '4K', size: '7.1GB' }
      ],
      views: 198000,
      downloads: 76000
    }
  ]

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)
      
      const response = await fetch(`/api/movies?limit=8&sort=views&page=${pageNum}`)
      const data = await response.json()
      
      if (response.ok && data.movies) {
        if (append) {
          setMovies(prev => [...prev, ...data.movies])
        } else {
          setMovies(data.movies)
        }
        setHasMore(data.movies.length === 8)
      } else {
        if (!append) setMovies(popularMovies)
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching popular movies:', error)
      if (!append) setMovies(popularMovies)
      setHasMore(false)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreMovies = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMovies(nextPage, true)
  }

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Most Popular</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg animate-pulse">
              <div className="h-64 sm:h-80 bg-gray-600 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-600 rounded mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto bg-gray-800 rounded-lg">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Most Popular</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="flex justify-center mt-8">
        {hasMore ? (
          <button
            onClick={loadMoreMovies}
            disabled={loadingMore}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <span>Load More Movies</span>
            )}
          </button>
        ) : (
          <Link
            href="/category/popular"
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            View All Popular Movies
          </Link>
        )}
      </div>
    </section>
  )
}
