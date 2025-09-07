'use client'
import { useState } from 'react'
import { Star, Download, Play, Eye, Calendar, Clock, User, Film, Share2, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { getImageWithFallback } from '../lib/constants'

export default function MovieDetails({ movie }) {
  const [selectedQuality, setSelectedQuality] = useState((movie.downloadLinks || [])[0]?.quality || '720p')
  const [activeTab, setActiveTab] = useState('download')

  const handleDownload = (link) => {
    // Increment download count
    toast.success(`Starting download: ${movie.title} (${link.quality})`)
    // In production, this would track downloads and redirect to download link
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: movie.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const selectedLink = (movie.downloadLinks || []).find(link => link.quality === selectedQuality)

  return (
    <div className="relative">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.images?.find(img => img.type === 'backdrop')?.url || movie.backdrop || 'https://via.placeholder.com/1920x1080/1f2937/ffffff?text=Backdrop'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <img
                src={getImageWithFallback(movie.images, 'poster') || movie.poster || '/images/default-poster.webp'}
                alt={movie.title}
                className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.src = '/images/default-poster.webp'
                }}
              />
              
              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Movie</span>
                </button>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Title and Basic Info */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`category-badge category-${movie.category.toLowerCase()}`}>
                    {movie.category}
                  </span>
                  {movie.isDualAudio && (
                    <span className="dual-audio-badge">Dual Audio</span>
                  )}
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-medium">{movie.rating}/10</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{movie.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{movie.director}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{movie.views.toLocaleString()} views</span>
                  </div>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {movie.description}
                </p>

                {/* Genre and Languages */}
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 font-medium">Genres: </span>
                    <span className="text-white">{movie.genre.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Languages: </span>
                    <span className="text-white">{movie.language.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-medium">Cast: </span>
                    <span className="text-white">{movie.cast.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-700">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('download')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'download'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Download Links
                  </button>
                  <button
                    onClick={() => setActiveTab('streaming')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'streaming'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Watch Online
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'download' && (
                  <div className="space-y-6">
                    {/* Web Series Episodes */}
                    {movie.isWebSeries && (movie.episodes || []).length > 0 ? (
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white mb-4">Episodes</h3>
                        <div className="grid gap-4">
                          {(movie.episodes || []).map((episode) => (
                            <div key={episode._id} className="bg-gray-800 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-white mb-1">
                                    Episode {episode.episodeNumber}: {episode.title}
                                  </h4>
                                  {episode.description && (
                                    <p className="text-gray-400 text-sm mb-2">{episode.description}</p>
                                  )}
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    {episode.duration && <span>Duration: {episode.duration}</span>}
                                    <span>Season {episode.seasonNumber}</span>
                                    <span>{episode.views || 0} views</span>
                                    <span>{episode.downloads || 0} downloads</span>
                                  </div>
                                </div>
                                {episode.thumbnail && (
                                  <img
                                    src={episode.thumbnail}
                                    alt={`Episode ${episode.episodeNumber}`}
                                    className="w-24 h-16 object-cover rounded ml-4"
                                  />
                                )}
                              </div>
                              
                              {/* Episode Download Links */}
                              {(episode.downloadLinks || []).length > 0 ? (
                                <div className="space-y-2">
                                  {(episode.downloadLinks || []).map((quality, qualityIndex) => (
                                    <div key={qualityIndex} className="bg-gray-700 rounded p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-white font-medium">{quality.quality}</span>
                                        {quality.size && (
                                          <span className="text-gray-400 text-sm">{quality.size}</span>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {quality.links?.map((link, linkIndex) => (
                                          <a
                                            key={linkIndex}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors duration-200"
                                          >
                                            <Download className="w-3 h-3 mr-1" />
                                            {link.server} ({link.type})
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="bg-gray-700 rounded p-3 text-center">
                                  <p className="text-yellow-400 font-medium">Coming Soon</p>
                                  <p className="text-gray-400 text-sm">Download links will be available soon</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Regular Movie Downloads */
                      <div className="space-y-6">
                        {(movie.downloadLinks || []).length > 0 && (movie.downloadLinks || []).some(link => 
                          link.links && link.links.some(l => l.url && l.url.trim())
                        ) ? (
                          <>
                            {/* Quality Selector */}
                            <div>
                              <h3 className="text-xl font-semibold text-white mb-4">Select Quality</h3>
                              <div className="flex flex-wrap gap-3">
                                {(movie.downloadLinks || []).filter(link => 
                                  link.links && link.links.some(l => l.url && l.url.trim())
                                ).map((link) => (
                                  <button
                                    key={link.quality}
                                    onClick={() => setSelectedQuality(link.quality)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                      selectedQuality === link.quality
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                  >
                                    {link.quality} ({link.size})
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Download Links */}
                            {selectedLink && selectedLink.links && selectedLink.links.some(l => l.url && l.url.trim()) && (
                              <div className="bg-gray-800 rounded-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                  <div>
                                    <h4 className="text-lg font-semibold text-white">
                                      {movie.title} ({selectedLink.quality})
                                    </h4>
                                    <p className="text-gray-400">Size: {selectedLink.size}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-400">Downloads</p>
                                    <p className="text-lg font-semibold text-white">
                                      {movie.downloads?.toLocaleString() || '0'}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Multiple Download Links for Selected Quality */}
                                <div className="space-y-3">
                                  {selectedLink.links.filter(link => link.url && link.url.trim()).map((link, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <Download className="w-5 h-5 text-green-400" />
                                        <div>
                                          <p className="text-white font-medium">{link.server}</p>
                                          <p className="text-gray-400 text-sm capitalize">{link.type} download</p>
                                        </div>
                                      </div>
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => handleDownload({ ...selectedLink, url: link.url, server: link.server })}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 inline-block text-center"
                                      >
                                        Download
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Screenshots for Selected Quality */}
                            {selectedLink && (
                              <div className="bg-gray-800 rounded-lg p-6 mt-6">
                                <h4 className="text-lg font-semibold text-white mb-4">
                                  Screenshots ({selectedLink.quality})
                                </h4>
                                
                                
                                {movie.images?.filter(img => img.type === 'screenshot' && img.quality === selectedLink.quality).length > 0 ? (
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {movie.images
                                      .filter(img => img.type === 'screenshot' && img.quality === selectedLink.quality)
                                      .map((screenshotImg, index) => (
                                        <div key={index} className="bg-gray-700 rounded-lg p-3">
                                          <div className="mb-2">
                                            <span className="text-xs text-green-400">Quality: {screenshotImg.quality}</span>
                                          </div>
                                          <img
                                            src={screenshotImg.url}
                                            alt={screenshotImg.alt || `${movie.title} ${selectedLink.quality} screenshot ${index + 1}`}
                                            className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-90 transition-opacity"
                                            onError={(e) => {
                                              e.target.src = '/images/default-poster.webp'
                                            }}
                                            onClick={() => window.open(screenshotImg.url, '_blank')}
                                          />
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4">
                                    <p className="text-gray-400 text-sm">No screenshots available for {selectedLink.quality} quality.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="bg-gray-800 rounded-lg p-8 text-center">
                            <Download className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-yellow-400 mb-2">Coming Soon</h3>
                            <p className="text-gray-400">Download links will be available soon. Please check back later.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              {activeTab === 'streaming' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">Watch Online</h3>
                    {(movie.streamingLinks || []).length > 0 && (movie.streamingLinks || []).some(link => link.url && link.url.trim()) ? (
                      <div className="grid gap-4">
                        {(movie.streamingLinks || []).filter(link => link.url && link.url.trim()).map((link, index) => (
                          <div key={index} className="bg-gray-800 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Play className="w-6 h-6 text-blue-400" />
                                <span className="text-white font-medium">{link.platform}</span>
                              </div>
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                              >
                                Watch Now
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-lg p-8 text-center">
                        <Play className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-yellow-400 mb-2">Coming Soon</h3>
                        <p className="text-gray-400">Streaming links will be available soon. Please check back later.</p>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {(movie.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full hover:bg-gray-600 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
