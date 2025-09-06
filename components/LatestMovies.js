'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import MovieCard from './MovieCard'

export default function LatestMovies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  const latestMovies = [
    {
      _id: '7',
      title: 'Jawan',
      slug: 'jawan',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Jawan',
      year: 2023,
      rating: 7.0,
      category: 'Bollywood',
      isDualAudio: false,
      downloadLinks: [
        { quality: '480p', size: '450MB' },
        { quality: '720p', size: '1.3GB' },
        { quality: '1080p', size: '2.7GB' }
      ],
      views: 89000,
      downloads: 34000
    },
    {
      _id: '8',
      title: 'Fast X',
      slug: 'fast-x',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Fast+X',
      year: 2023,
      rating: 5.8,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '520MB' },
        { quality: '720p', size: '1.5GB' },
        { quality: '1080p', size: '3.2GB' }
      ],
      views: 112000,
      downloads: 41000
    },
    {
      _id: '9',
      title: 'Salaar',
      slug: 'salaar',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Salaar',
      year: 2023,
      rating: 7.8,
      category: 'South',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '480MB' },
        { quality: '720p', size: '1.4GB' },
        { quality: '1080p', size: '2.9GB' }
      ],
      views: 156000,
      downloads: 58000
    },
    {
      _id: '10',
      title: 'Scream VI',
      slug: 'scream-vi',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Scream+VI',
      year: 2023,
      rating: 6.5,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '420MB' },
        { quality: '720p', size: '1.2GB' },
        { quality: '1080p', size: '2.4GB' }
      ],
      views: 78000,
      downloads: 29000
    }
  ]

  useEffect(() => {
    fetchMovies()
  }, [])

  const fetchMovies = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true)
      else setLoadingMore(true)
      
      const response = await fetch(`/api/movies?limit=8&sort=createdAt&page=${pageNum}`)
      const data = await response.json()
      
      if (response.ok && data.movies) {
        if (append) {
          setMovies(prev => [...prev, ...data.movies])
        } else {
          setMovies(data.movies)
        }
        setHasMore(data.movies.length === 8) // If we got less than 8, no more movies
      } else {
        if (!append) setMovies(latestMovies)
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching latest movies:', error)
      if (!append) setMovies(latestMovies)
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
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Latest Movies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg animate-pulse">
              <div className="h-64 sm:h-80 bg-gray-700 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">Latest Movies</h2>
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
            href="/category/latest"
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            View All Latest Movies
          </Link>
        )}
      </div>
    </section>
  )
}
