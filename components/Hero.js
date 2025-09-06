'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Play, Download, Star } from 'lucide-react'
import { getImageWithFallback } from '../lib/constants'

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [featuredMovies, setFeaturedMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedMovies()
  }, [])

  const fetchFeaturedMovies = async () => {
    try {
      const response = await fetch('/api/movies?limit=5&sort=views')
      const data = await response.json()
      
      if (response.ok && data.movies && data.movies.length > 0) {
        setFeaturedMovies(data.movies.slice(0, 3))
      } else {
        setFeaturedMovies(fallbackMovies)
      }
    } catch (error) {
      console.error('Error fetching featured movies:', error)
      setFeaturedMovies(fallbackMovies)
    } finally {
      setLoading(false)
    }
  }

  const fallbackMovies = [
    {
      id: 1,
      title: "Avengers: Endgame",
      description: "The epic conclusion to the Infinity Saga that became a defining moment in cinema history.",
      backdrop: "https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Avengers+Endgame",
      year: 2019,
      rating: 8.4,
      category: "Hollywood",
      isDualAudio: true,
      qualities: ["480p", "720p", "1080p", "4K"]
    },
    {
      id: 2,
      title: "RRR",
      description: "A fictional story about two legendary revolutionaries and their journey away from home.",
      backdrop: "https://via.placeholder.com/1920x1080/1f2937/ffffff?text=RRR",
      year: 2022,
      rating: 8.8,
      category: "South",
      isDualAudio: true,
      qualities: ["480p", "720p", "1080p"]
    },
    {
      id: 3,
      title: "Pathaan",
      description: "An action thriller that follows a spy who must stop a mercenary organization.",
      backdrop: "https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Pathaan",
      year: 2023,
      rating: 7.2,
      category: "Bollywood",
      isDualAudio: false,
      qualities: ["480p", "720p", "1080p"]
    }
  ]

  useEffect(() => {
    if (featuredMovies.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredMovies.length)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [featuredMovies])

  if (loading || featuredMovies.length === 0) {
    return (
      <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const currentMovie = featuredMovies[currentSlide]

  return (
    <div className="relative h-[60vh] sm:h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${getImageWithFallback(currentMovie.images, 'backdrop') || currentMovie.backdrop || '/images/default-backdrop.png'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-full sm:max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
              <span className={`px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                currentMovie.category === 'Hollywood' ? 'bg-blue-600 text-white' :
                currentMovie.category === 'Bollywood' ? 'bg-red-600 text-white' :
                currentMovie.category === 'South' ? 'bg-green-600 text-white' :
                'bg-purple-600 text-white'
              }`}>
                {currentMovie.category}
              </span>
              {(currentMovie.isDualAudio || currentMovie.dualAudio) && (
                <span className="px-3 py-1 bg-yellow-600 text-white text-xs sm:text-sm font-semibold rounded-full">
                  🎵 Dual Audio
                </span>
              )}
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                <span className="text-white font-medium text-sm sm:text-base">{currentMovie.rating}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              {currentMovie.title}
            </h1>
            
            <p className="text-sm sm:text-lg text-gray-300 mb-4 sm:mb-6 leading-relaxed line-clamp-3">
              {currentMovie.description}
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
              <span className="text-gray-400 text-sm">Available in:</span>
              {(currentMovie.qualities || ['720p', '1080p']).map((quality) => (
                <span key={quality} className="px-2 py-1 bg-gray-700 text-white text-xs rounded-full">
                  {quality}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={`/movie/${currentMovie._id || currentMovie.id}`}
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Watch Now
              </Link>
              <Link
                href={`/movie/${currentMovie._id || currentMovie.id}#download`}
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Download
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
