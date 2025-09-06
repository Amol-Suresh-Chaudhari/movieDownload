'use client';
import { useState } from 'react';
import { Star, Download, Eye, Heart, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useRedux';
import { useApp } from '../../contexts/AppContext';
import { getImageWithFallback } from '../../lib/utils';

export default function MovieCardWithRedux({ movie }) {
  const { isAuthenticated } = useAuth();
  const { state, actions, isInFavorites, isInWatchlist } = useApp();
  const [imageError, setImageError] = useState(false);

  const handleAddToFavorites = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInFavorites(movie._id)) {
      actions.removeFromFavorites(movie._id);
    } else {
      actions.addToFavorites({
        id: movie._id,
        title: movie.title,
        poster: movie.poster,
        year: movie.year,
        rating: movie.rating,
      });
    }
  };

  const handleAddToWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWatchlist(movie._id)) {
      actions.removeFromWatchlist(movie._id);
    } else {
      actions.addToWatchlist({
        id: movie._id,
        title: movie.title,
        poster: movie.poster,
        year: movie.year,
        category: movie.category,
      });
    }
  };

  const handleCardClick = () => {
    // Add to recently viewed
    actions.addToRecentlyViewed({
      id: movie._id,
      title: movie.title,
      poster: movie.poster,
      year: movie.year,
      category: movie.category,
      viewedAt: new Date().toISOString(),
    });
  };

  const posterUrl = getImageWithFallback(movie.images, 'poster') || movie.poster;

  return (
    <Link 
      href={`/movie/${movie.slug}`} 
      className="group block"
      onClick={handleCardClick}
    >
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={imageError ? '/images/default-poster.jpg' : posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-3">
              <button
                onClick={handleAddToFavorites}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isInFavorites(movie._id)
                    ? 'bg-red-600 text-white'
                    : 'bg-white bg-opacity-20 text-white hover:bg-red-600'
                }`}
                title={isInFavorites(movie._id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${isInFavorites(movie._id) ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleAddToWatchlist}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isInWatchlist(movie._id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-white bg-opacity-20 text-white hover:bg-blue-600'
                }`}
                title={isInWatchlist(movie._id) ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Bookmark className={`w-5 h-5 ${isInWatchlist(movie._id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              movie.category === 'Hollywood' ? 'bg-blue-600 text-white' :
              movie.category === 'Bollywood' ? 'bg-red-600 text-white' :
              movie.category === 'South' ? 'bg-green-600 text-white' :
              movie.category === 'Web Series' ? 'bg-purple-600 text-white' :
              'bg-gray-600 text-white'
            }`}>
              {movie.category}
            </span>
          </div>

          {/* Web Series Badge */}
          {movie.isWebSeries && (
            <div className="absolute top-2 right-2">
              <span className="px-2 py-1 text-xs font-semibold bg-purple-600 text-white rounded-full">
                Series
              </span>
            </div>
          )}

          {/* Quality Badge */}
          {movie.downloadLinks && movie.downloadLinks.length > 0 && (
            <div className="absolute bottom-2 left-2">
              <span className="px-2 py-1 text-xs font-semibold bg-green-600 text-white rounded-full">
                {movie.downloadLinks[movie.downloadLinks.length - 1]?.quality || 'HD'}
              </span>
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
            <span>{movie.year}</span>
            {movie.rating > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-yellow-500 font-medium">{movie.rating}</span>
              </div>
            )}
          </div>

          {/* Genre Tags */}
          {movie.genre && movie.genre.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.slice(0, 2).map((g, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                >
                  {g}
                </span>
              ))}
              {movie.genre.length > 2 && (
                <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                  +{movie.genre.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{(movie.views || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{(movie.downloads || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Episode Count for Web Series */}
          {movie.isWebSeries && movie.totalEpisodes > 0 && (
            <div className="mt-2 text-xs text-purple-400">
              {movie.totalEpisodes} Episodes • {movie.totalSeasons} Season{movie.totalSeasons > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
