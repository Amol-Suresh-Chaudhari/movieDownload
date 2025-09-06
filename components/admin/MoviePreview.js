'use client'
import { X, Star, Calendar, Clock, Globe, Download, Play } from 'lucide-react'

export default function MoviePreview({ movie, onClose }) {
  if (!movie) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Movie Preview</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Movie Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.images?.[0]?.url || movie.poster || '/images/default-poster.webp'}
                alt={movie.title}
                className="w-64 h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/default-poster.webp'
                }}
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  movie.category === 'Hollywood' ? 'bg-blue-600 text-white' :
                  movie.category === 'Bollywood' ? 'bg-red-600 text-white' :
                  movie.category === 'South' ? 'bg-green-600 text-white' :
                  'bg-purple-600 text-white'
                }`}>
                  {movie.category}
                </span>
                
                {movie.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">{movie.rating}</span>
                  </div>
                )}

                <div className="flex items-center space-x-1 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>

                {movie.duration && (
                  <div className="flex items-center space-x-1 text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>{movie.duration}</span>
                  </div>
                )}

                {movie.language && (
                  <div className="flex items-center space-x-1 text-gray-300">
                    <Globe className="w-4 h-4" />
                    <span>{movie.language}</span>
                  </div>
                )}
              </div>

              {/* Genre */}
              {movie.genre && movie.genre.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Genre</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Director & Cast */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {movie.director && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Director</h3>
                    <p className="text-gray-300">{movie.director}</p>
                  </div>
                )}

                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Cast</h3>
                    <p className="text-gray-300">{movie.cast.join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="mb-4">
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  movie.isPublished ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                }`}>
                  {movie.isPublished ? 'Published' : 'Pending Review'}
                </span>
                
                {movie.isDualAudio && (
                  <span className="ml-2 px-3 py-1 text-sm font-semibold rounded-full bg-purple-600 text-white">
                    Dual Audio
                  </span>
                )}

                {movie.isAIGenerated && (
                  <span className="ml-2 px-3 py-1 text-sm font-semibold rounded-full bg-blue-600 text-white">
                    AI Generated
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {movie.description && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Description</h3>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </div>
          )}

          {/* Additional Images */}
          {movie.images && movie.images.length > 1 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {movie.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image?.url || image || '/images/default-poster.webp'}
                    alt={`${movie.title} ${index + 2}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/images/default-poster.webp'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Download Links */}
          {movie.downloadLinks && movie.downloadLinks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Download Links</h3>
              <div className="space-y-4">
                {movie.downloadLinks.map((quality, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-white">{quality.quality}</h4>
                      {quality.size && (
                        <span className="text-gray-300 text-sm">{quality.size}</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {quality.links?.map((link, linkIndex) => (
                        <div key={linkIndex} className="flex items-center justify-between bg-gray-600 rounded p-2">
                          <div className="flex items-center space-x-2">
                            <Download className="w-4 h-4 text-blue-400" />
                            <span className="text-white text-sm">{link.server}</span>
                            <span className="text-gray-400 text-xs">({link.type})</span>
                          </div>
                          <span className="text-gray-300 text-xs">
                            {link.url ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Streaming Links */}
          {movie.streamingLinks && movie.streamingLinks.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-3">Streaming Links</h3>
              <div className="space-y-2">
                {movie.streamingLinks.map((stream, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 rounded p-3">
                    <div className="flex items-center space-x-2">
                      <Play className="w-4 h-4 text-green-400" />
                      <span className="text-white">{stream.platform}</span>
                    </div>
                    <span className="text-gray-300 text-sm">
                      {stream.url ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{(movie.views || 0).toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Views</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{(movie.downloads || 0).toLocaleString()}</div>
              <div className="text-gray-400 text-sm">Downloads</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : 'N/A'}</div>
              <div className="text-gray-400 text-sm">Added</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{movie.updatedAt ? new Date(movie.updatedAt).toLocaleDateString() : 'N/A'}</div>
              <div className="text-gray-400 text-sm">Updated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
