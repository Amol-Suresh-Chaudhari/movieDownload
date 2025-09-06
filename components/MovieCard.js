'use client'
import Link from 'next/link'
import { Star, Download, Play, Eye } from 'lucide-react'
import { getImageWithFallback } from '../lib/constants'

export default function MovieCard({ movie }) {
  const {
    _id,
    title,
    slug,
    poster,
    images = [],
    year,
    rating,
    category,
    isDualAudio,
    downloadLinks = [],
    views = 0,
    downloads = 0
  } = movie

  // Get poster image with fallback
  const getPosterImage = () => {
    return getImageWithFallback(images, 'poster') || poster || '/images/default-poster.webp'
  }

  const getQualityBadges = () => {
    const qualities = downloadLinks.map(link => link.quality)
    const uniqueQualities = [...new Set(qualities)]
    return uniqueQualities.slice(0, 3) // Show max 3 quality badges
  }

  return (
    <div className="movie-card group">
      <div className="relative overflow-hidden">
        <img
          src={getPosterImage()}
          alt={title}
          className="movie-poster w-full h-64 sm:h-72 lg:h-80 object-cover"
          onError={(e) => {
            e.target.src = '/images/default-poster.webp'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-3">
            <Link
              href={`/movie/${slug}`}
              className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200"
            >
              <Play className="w-5 h-5 text-white" />
            </Link>
            <Link
              href={`/movie/${slug}#download`}
              className="p-3 bg-green-600 hover:bg-green-700 rounded-full transition-colors duration-200"
            >
              <Download className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2 hidden sm:block">
          <span className={`category-badge category-${category.toLowerCase().replace(' ', '')}`}>
            {category}
          </span>
        </div>

        {/* Dual Audio Badge */}
        {isDualAudio && (
          <div className="absolute top-2 right-2">
            <span className="dual-audio-badge">Dual Audio</span>
          </div>
        )}

        {/* Quality Badges */}
        <div className="absolute bottom-2 left-2 flex space-x-1 hidden sm:flex">
          {getQualityBadges().map((quality) => (
            <span key={quality} className={`quality-badge quality-${quality.toLowerCase()}`}>
              {quality}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        <Link href={`/movie/${slug}`}>
          <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 hover:text-blue-400 transition-colors duration-200">
            {title}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
          <span>{year}</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span>{rating || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{views.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-3 h-3" />
            <span>{downloads.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
