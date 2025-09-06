'use client'
import { useState, useEffect } from 'react'
import MovieCard from './MovieCard'

export default function RelatedMovies({ currentMovie }) {
  const [relatedMovies, setRelatedMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRelatedMovies()
  }, [currentMovie])

  const fetchRelatedMovies = async () => {
    try {
      const response = await fetch(`/api/movies?category=${currentMovie.category}&limit=8`)
      const data = await response.json()
      
      if (response.ok && data.movies) {
        // Filter out current movie and get random related movies
        const filtered = data.movies
          .filter(movie => movie._id !== currentMovie._id)
          .slice(0, 4)
        setRelatedMovies(filtered)
      } else {
        // Use sample data if API fails
        setRelatedMovies(sampleRelatedMovies.slice(0, 4))
      }
    } catch (error) {
      console.error('Error fetching related movies:', error)
      // Fallback to sample data
      setRelatedMovies(sampleRelatedMovies.slice(0, 4))
    } finally {
      setLoading(false)
    }
  }

  // Sample related movies as fallback
  const sampleRelatedMovies = [
    {
      _id: '15',
      title: 'Avengers: Infinity War',
      slug: 'avengers-infinity-war',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Infinity+War',
      year: 2018,
      rating: 8.4,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '480MB' },
        { quality: '720p', size: '1.4GB' },
        { quality: '1080p', size: '2.8GB' }
      ],
      views: 189000,
      downloads: 72000
    },
    {
      _id: '16',
      title: 'Spider-Man: Far From Home',
      slug: 'spider-man-far-from-home',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Far+From+Home',
      year: 2019,
      rating: 7.4,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '420MB' },
        { quality: '720p', size: '1.2GB' },
        { quality: '1080p', size: '2.4GB' }
      ],
      views: 145000,
      downloads: 56000
    },
    {
      _id: '17',
      title: 'Venom: Let There Be Carnage',
      slug: 'venom-let-there-be-carnage',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Venom+2',
      year: 2021,
      rating: 5.9,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '400MB' },
        { quality: '720p', size: '1.1GB' },
        { quality: '1080p', size: '2.2GB' }
      ],
      views: 98000,
      downloads: 38000
    },
    {
      _id: '18',
      title: 'Black Widow',
      slug: 'black-widow',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Black+Widow',
      year: 2021,
      rating: 6.7,
      category: 'Hollywood',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '450MB' },
        { quality: '720p', size: '1.3GB' },
        { quality: '1080p', size: '2.6GB' }
      ],
      views: 112000,
      downloads: 43000
    }
  ]

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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

  if (!relatedMovies || relatedMovies.length === 0) {
    return (
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {sampleRelatedMovies.slice(0, 4).map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedMovies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
