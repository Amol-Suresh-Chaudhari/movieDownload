'use client'
import { useState, useEffect } from 'react'
import MovieCard from './MovieCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function FeaturedMovies() {
  const [movies, setMovies] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  // Sample featured movies data
  const sampleMovies = [
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
      title: 'KGF Chapter 2',
      slug: 'kgf-chapter-2',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=KGF+2',
      year: 2022,
      rating: 8.3,
      category: 'South',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '450MB' },
        { quality: '720p', size: '1.1GB' },
        { quality: '1080p', size: '2.2GB' }
      ],
      views: 98000,
      downloads: 38000
    },
    {
      _id: '3',
      title: 'Brahmastra',
      slug: 'brahmastra',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Brahmastra',
      year: 2022,
      rating: 7.1,
      category: 'Bollywood',
      isDualAudio: false,
      downloadLinks: [
        { quality: '480p', size: '420MB' },
        { quality: '720p', size: '1.3GB' },
        { quality: '1080p', size: '2.8GB' }
      ],
      views: 87000,
      downloads: 32000
    },
    {
      _id: '4',
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
    },
    {
      _id: '5',
      title: 'Pushpa',
      slug: 'pushpa',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Pushpa',
      year: 2021,
      rating: 7.6,
      category: 'South',
      isDualAudio: true,
      downloadLinks: [
        { quality: '480p', size: '380MB' },
        { quality: '720p', size: '1.0GB' },
        { quality: '1080p', size: '2.1GB' }
      ],
      views: 134000,
      downloads: 47000
    },
    {
      _id: '6',
      title: 'Sooryavanshi',
      slug: 'sooryavanshi',
      poster: 'https://via.placeholder.com/300x450/1f2937/ffffff?text=Sooryavanshi',
      year: 2021,
      rating: 6.8,
      category: 'Bollywood',
      isDualAudio: false,
      downloadLinks: [
        { quality: '480p', size: '410MB' },
        { quality: '720p', size: '1.2GB' },
        { quality: '1080p', size: '2.4GB' }
      ],
      views: 76000,
      downloads: 28000
    }
  ]

  useEffect(() => {
    // Fetch movies from API
    const fetchMovies = async () => {
      try {
        const response = await fetch('/api/movies?limit=8&sort=rating')
        const data = await response.json()
        setMovies(data.movies || [])
      } catch (error) {
        console.error('Error fetching featured movies:', error)
        // Fallback to sample movies if API fails
        setMovies(sampleMovies)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const [itemsPerPage, setItemsPerPage] = useState(4)
  
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1) // Show 1 item on mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2) // Show 2 items on tablet
      } else {
        setItemsPerPage(4) // Show 4 items on desktop
      }
    }
    
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])
  
  const maxIndex = Math.max(0, movies.length - itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0))
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Featured Movies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-lg animate-pulse border-4 border-green-600">
              <div className="h-64 sm:h-72 lg:h-80 bg-gray-700 rounded-t-lg"></div>
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
    <section className="py-8 sm:py-12 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Movies</h2>
        <div className="flex space-x-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors duration-200"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex >= maxIndex}
            className="p-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors duration-200"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
        >
          {movies.map((movie) => (
            <div key={movie._id} className={`flex-shrink-0 px-2 sm:px-3 ${
              itemsPerPage === 1 ? 'w-full' : 
              itemsPerPage === 2 ? 'w-1/2' : 
              'w-1/4'
            }`}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
