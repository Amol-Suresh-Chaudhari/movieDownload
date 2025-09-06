'use client'
import { useState, useEffect } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EditMovieForm({ movie, onClose, onMovieUpdated }) {
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    category: 'Hollywood',
    description: '',
    genre: [],
    director: '',
    cast: [],
    duration: '',
    language: 'English',
    rating: '',
    isDualAudio: false,
    isPublished: true
  })
  
  const [images, setImages] = useState([])
  const [downloadLinks, setDownloadLinks] = useState([
    { quality: '480p', size: '', links: [{ url: '', server: 'Server 1', type: 'direct' }] },
    { quality: '720p', size: '', links: [{ url: '', server: 'Server 1', type: 'direct' }] },
    { quality: '1080p', size: '', links: [{ url: '', server: 'Server 1', type: 'direct' }] }
  ])
  const [streamingLinks, setStreamingLinks] = useState([])
  const [loading, setLoading] = useState(false)

  const categories = ['Hollywood', 'Bollywood', 'South', 'Web Series']
  const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Animation', 'Documentary']

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        year: movie.year || new Date().getFullYear(),
        category: movie.category || 'Hollywood',
        description: movie.description || '',
        genre: movie.genre || [],
        director: movie.director || '',
        cast: movie.cast || [],
        duration: movie.duration || '',
        language: movie.language || 'English',
        rating: movie.rating || '',
        isDualAudio: movie.isDualAudio || false,
        isPublished: movie.isPublished || true
      })
      setImages(movie.images || [])
      setDownloadLinks(movie.downloadLinks || [
        { quality: '480p', size: '', links: [{ url: '', server: 'Server 1', type: 'direct' }] },
        { quality: '720p', size: '', links: [{ url: '', server: 'Server 1', type: 'direct' }] },
        { quality: '1080p', size: '', links: [{ url: '', server: 'Server 1', type: 'direct' }] }
      ])
      setStreamingLinks(movie.streamingLinks || [])
    }
  }, [movie])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayInputChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({ ...prev, [field]: array }))
  }

  const updateDownloadLink = (qualityIndex, linkIndex, field, value) => {
    setDownloadLinks(prev => prev.map((quality, qIdx) => 
      qIdx === qualityIndex 
        ? {
            ...quality,
            [field === 'url' || field === 'server' || field === 'type' ? 'links' : field]: 
              field === 'url' || field === 'server' || field === 'type'
                ? quality.links.map((link, lIdx) => 
                    lIdx === linkIndex ? { ...link, [field]: value } : link
                  )
                : value
          }
        : quality
    ))
  }

  const addDownloadLink = (qualityIndex) => {
    setDownloadLinks(prev => prev.map((quality, idx) => 
      idx === qualityIndex 
        ? { ...quality, links: [...quality.links, { url: '', server: `Server ${quality.links.length + 1}`, type: 'direct' }] }
        : quality
    ))
  }

  const removeDownloadLink = (qualityIndex, linkIndex) => {
    setDownloadLinks(prev => prev.map((quality, idx) => 
      idx === qualityIndex 
        ? { ...quality, links: quality.links.filter((_, lIdx) => lIdx !== linkIndex) }
        : quality
    ))
  }

  const addStreamingLink = () => {
    setStreamingLinks(prev => [...prev, { platform: '', url: '', embedCode: '' }])
  }

  const updateStreamingLink = (index, field, value) => {
    setStreamingLinks(prev => prev.map((link, idx) => 
      idx === index ? { ...link, [field]: value } : link
    ))
  }

  const removeStreamingLink = (index) => {
    setStreamingLinks(prev => prev.filter((_, idx) => idx !== index))
  }

  const addImage = () => {
    setImages(prev => [...prev, { url: '', type: 'poster', alt: '' }])
  }

  const updateImage = (index, field, value) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, [field]: value } : img))
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const movieData = {
        ...formData,
        images,
        downloadLinks: downloadLinks.filter(quality => 
          quality.links.some(link => link.url.trim())
        ),
        streamingLinks: streamingLinks.filter(link => link.url.trim())
      }

      const response = await fetch(`/api/movies/${movie._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(movieData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Movie updated successfully!')
        onMovieUpdated(data)
        onClose()
      } else {
        toast.error(data.message || 'Failed to update movie')
      }
    } catch (error) {
      console.error('Error updating movie:', error)
      toast.error('Error updating movie')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Movie</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
              <input
                type="number"
                required
                min="1900"
                max="2030"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={(e) => handleInputChange('rating', parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter movie description..."
            />
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre (comma-separated)</label>
              <input
                type="text"
                value={formData.genre.join(', ')}
                onChange={(e) => handleArrayInputChange('genre', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Action, Adventure, Drama"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Director</label>
              <input
                type="text"
                value={formData.director}
                onChange={(e) => handleInputChange('director', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cast (comma-separated)</label>
              <input
                type="text"
                value={formData.cast.join(', ')}
                onChange={(e) => handleArrayInputChange('cast', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Actor 1, Actor 2, Actor 3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="120 min"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Images Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-300">Movie Images</label>
              <button
                type="button"
                onClick={addImage}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>
            
            {images.map((image, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-700 rounded">
                <input
                  type="url"
                  placeholder="Image URL"
                  value={image.url}
                  onChange={(e) => updateImage(index, 'url', e.target.value)}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                />
                <select
                  value={image.type}
                  onChange={(e) => updateImage(index, 'type', e.target.value)}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                >
                  <option value="poster">Poster</option>
                  <option value="backdrop">Backdrop</option>
                  <option value="screenshot">Screenshot</option>
                  <option value="banner">Banner</option>
                </select>
                <input
                  type="text"
                  placeholder="Alt text"
                  value={image.alt}
                  onChange={(e) => updateImage(index, 'alt', e.target.value)}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Download Links */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">Download Links</label>
            {downloadLinks.map((quality, qualityIndex) => (
              <div key={quality.quality} className="mb-6 p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-white">{quality.quality}</h4>
                  <input
                    type="text"
                    placeholder="File size (e.g., 1.2GB)"
                    value={quality.size}
                    onChange={(e) => updateDownloadLink(qualityIndex, 0, 'size', e.target.value)}
                    className="px-3 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm w-32"
                  />
                </div>
                
                {quality.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <input
                      type="url"
                      placeholder="Download URL"
                      value={link.url}
                      onChange={(e) => updateDownloadLink(qualityIndex, linkIndex, 'url', e.target.value)}
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Server name"
                      value={link.server}
                      onChange={(e) => updateDownloadLink(qualityIndex, linkIndex, 'server', e.target.value)}
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                    />
                    <select
                      value={link.type}
                      onChange={(e) => updateDownloadLink(qualityIndex, linkIndex, 'type', e.target.value)}
                      className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                    >
                      <option value="direct">Direct</option>
                      <option value="torrent">Torrent</option>
                      <option value="streaming">Streaming</option>
                    </select>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => addDownloadLink(qualityIndex)}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      {quality.links.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDownloadLink(qualityIndex, linkIndex)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Streaming Links */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-300">Streaming Links</label>
              <button
                type="button"
                onClick={addStreamingLink}
                className="flex items-center space-x-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Streaming Link</span>
              </button>
            </div>
            
            {streamingLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-700 rounded">
                <input
                  type="text"
                  placeholder="Platform (e.g., Netflix)"
                  value={link.platform}
                  onChange={(e) => updateStreamingLink(index, 'platform', e.target.value)}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                />
                <input
                  type="url"
                  placeholder="Streaming URL"
                  value={link.url}
                  onChange={(e) => updateStreamingLink(index, 'url', e.target.value)}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                />
                <input
                  type="text"
                  placeholder="Embed code (optional)"
                  value={link.embedCode}
                  onChange={(e) => updateStreamingLink(index, 'embedCode', e.target.value)}
                  className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeStreamingLink(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isDualAudio}
                onChange={(e) => handleInputChange('isDualAudio', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Dual Audio</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-300">Published</span>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
