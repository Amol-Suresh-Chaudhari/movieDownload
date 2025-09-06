'use client'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Wand2, Upload, Eye, Send, Trash2, Plus, Minus, Shuffle, Loader, Bot, CheckCircle } from 'lucide-react'

function RecentGenerations() {
  const [recentMovies, setRecentMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentGenerations()
  }, [])

  const fetchRecentGenerations = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/movies?limit=10&sort=createdAt&needsReview=true', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setRecentMovies(data.movies || [])
      }
    } catch (error) {
      console.error('Error fetching recent generations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent AI Generations</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-3 bg-gray-700 rounded-lg animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Recent AI Generations</h3>
      <div className="space-y-3">
        {recentMovies.length > 0 ? recentMovies.map((movie) => (
          <div key={movie._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bot className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium">{movie.title}</p>
                <p className="text-gray-400 text-sm">
                  {new Date(movie.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              movie.isPublished 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {movie.isPublished ? 'published' : 'pending'}
            </span>
          </div>
        )) : (
          <div className="text-center py-8">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No AI generated movies yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AIMovieGenerator() {
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    sourcePlatform: '',
    category: 'Hollywood',
    count: 1
  })
  const [generatedContent, setGeneratedContent] = useState(null)
  const [generatedMovies, setGeneratedMovies] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [bulkMode, setBulkMode] = useState(false)

  const generateBulkMovies = async () => {
    if (!formData.count || formData.count < 1) {
      toast.error('Please enter a valid count')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/movies/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          count: formData.count,
          category: formData.category,
          year: formData.year,
          sourcePlatform: formData.sourcePlatform
        })
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedMovies(data.movies || [])
        toast.success(`${data.movies?.length || 0} movies generated successfully!`)
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('refreshDashboard'))
      } else {
        toast.error(data.error || data.message || 'Failed to generate movies')
      }
    } catch (error) {
      console.error('Error generating movies:', error)
      toast.error('Error generating movies')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublishDirect = async (needsReview = false) => {
    if (!generatedContent) return

    setIsPublishing(true)
    try {
      const token = localStorage.getItem('admin_token')
      
      // Update the existing movie's status
      const response = await fetch(`/api/movies/${generatedContent._id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: needsReview ? 'pending' : 'approve'
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(needsReview ? 'Movie saved for review!' : 'Movie published successfully!')
        setGeneratedContent(null)
        setGeneratedMovies([])
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('refreshDashboard'))
      } else {
        throw new Error(data.message || 'Failed to save movie')
      }
    } catch (error) {
      console.error('Error publishing movie:', error)
      toast.error(error.message || 'Failed to save movie')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleGenerate = async () => {
    if (bulkMode) {
      return generateBulkMovies()
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a movie title')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/movies/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          year: formData.year,
          sourcePlatform: formData.sourcePlatform
        })
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedContent(data.movie)
        toast.success('Movie content generated successfully!')
      } else {
        toast.error(data.error || data.message || 'Failed to generate content')
      }
    } catch (error) {
      console.error('Error generating movie:', error)
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = async (needsReview = true) => {
    if (!generatedContent) {
      toast.error('No content to publish')
      return
    }

    setIsPublishing(true)
    try {
      // The movie is already saved when generated, so we just need to update its status
      const response = await fetch(`/api/movies/${generatedContent._id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          action: needsReview ? 'pending' : 'approve'
        })
      })

      const data = await response.json()

      if (response.ok) {
        if (needsReview) {
          toast.success('Movie saved for review!')
          // Trigger a refresh of the dashboard stats
          window.dispatchEvent(new CustomEvent('refreshDashboard'))
        } else {
          toast.success('Movie published successfully!')
        }
        
        // Reset form
        setFormData({
          title: '',
          year: new Date().getFullYear(),
          sourcePlatform: '',
          category: 'Hollywood'
        })
        setGeneratedContent(null)
      } else {
        toast.error(data.message || 'Failed to publish movie')
      }
    } catch (error) {
      console.error('Error publishing movie:', error)
      toast.error('Failed to publish movie')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Bot className="w-8 h-8 text-purple-500" />
        <h2 className="text-2xl font-bold text-white">AI Movie Generator</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Movie Information</h3>
          
          <div className="space-y-4">
            {/* Mode Toggle */}
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="mode"
                  checked={!bulkMode}
                  onChange={() => setBulkMode(false)}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-gray-300">Single Movie</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="mode"
                  checked={bulkMode}
                  onChange={() => setBulkMode(true)}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-gray-300">Bulk Generate</span>
              </label>
            </div>

            {!bulkMode ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Movie Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter movie title..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Movies to Generate *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.count}
                  onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                  placeholder="Enter count (e.g., 10)"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-gray-400 text-xs mt-1">Generate multiple movies automatically (max 50)</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Release Year
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                min="1900"
                max="2030"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Hollywood">Hollywood</option>
                <option value="Bollywood">Bollywood</option>
                <option value="South">South Movies</option>
                <option value="Web Series">Web Series</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Source Platform (Optional)
              </label>
              <input
                type="text"
                value={formData.sourcePlatform}
                onChange={(e) => setFormData({ ...formData, sourcePlatform: e.target.value })}
                placeholder="e.g., Netflix, Prime Video, Disney+"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!bulkMode && !formData.title.trim()) || (bulkMode && !formData.count)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>{bulkMode ? `Generating ${formData.count} movies...` : 'Generating...'}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>{bulkMode ? `Generate ${formData.count} Movies` : 'Generate with AI'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Content Preview */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Generated Content</h3>
          
          {!generatedContent ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bot className="w-16 h-16 mb-4 opacity-50" />
              <p>Generated content will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="flex items-center space-x-2">
                <img
                  src={generatedContent.poster || '/images/default-poster.webp'}
                  alt={generatedContent.title}
                  className="w-16 h-24 object-cover rounded"
                  onError={(e) => { e.target.src = '/images/default-poster.webp' }}
                />
                <div>
                  <h4 className="text-white font-semibold">{generatedContent.title}</h4>
                  <p className="text-gray-400 text-sm">{generatedContent.year} • {generatedContent.category}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {generatedContent.isDualAudio && (
                      <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">Dual Audio</span>
                    )}
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      Rating: {generatedContent.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-white font-medium mb-2">Description</h5>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {generatedContent.description}
                </p>
              </div>

              <div>
                <h5 className="text-white font-medium mb-2">Details</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-400">Genre:</span>
                    <span className="text-white ml-2">{generatedContent.genre.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white ml-2">{generatedContent.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Language:</span>
                    <span className="text-white ml-2">{generatedContent.language.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Director:</span>
                    <span className="text-white ml-2">{generatedContent.director}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="text-white font-medium mb-2">Download Links</h5>
                <div className="space-y-1">
                  {generatedContent.downloadLinks.map((link, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-300">{link.quality}</span>
                      <span className="text-gray-400">{link.size}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-white font-medium mb-2">Tags</h5>
                <div className="flex flex-wrap gap-1">
                  {generatedContent.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                <button
                  onClick={() => handlePublishDirect(true)}
                  disabled={isPublishing}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>Save for Review</span>
                </button>
                
                <button
                  onClick={() => handlePublishDirect(false)}
                  disabled={isPublishing}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Publish Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent AI Generations */}
      <RecentGenerations />
    </div>
  )
}
