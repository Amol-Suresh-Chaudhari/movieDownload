'use client';
import { useState, useEffect } from 'react'
import { Check, X, Eye, Calendar, User, Clock, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PendingMovies({ onEditMovie }) {
  const [pendingMovies, setPendingMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    fetchPendingMovies()
    
    // Listen for dashboard refresh events
    const handleRefresh = () => {
      fetchPendingMovies()
    }
    
    window.addEventListener('refreshDashboard', handleRefresh)
    return () => window.removeEventListener('refreshDashboard', handleRefresh)
  }, [])

  const fetchPendingMovies = async () => {
    try {
      const response = await fetch('/api/movies?needsReview=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setPendingMovies(data.movies || [])
      }
    } catch (error) {
      console.error('Error fetching pending movies:', error)
      toast.error('Failed to fetch pending movies')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (movieId) => {
    try {
      const response = await fetch(`/api/movies/${movieId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ action: 'approve' })
      })

      if (response.ok) {
        toast.success('Movie approved successfully!')
        setPendingMovies(prev => prev.filter(movie => movie._id !== movieId))
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to approve movie')
      }
    } catch (error) {
      console.error('Error approving movie:', error)
      toast.error('Error approving movie')
    }
  }

  const handleReject = async (movieId) => {
    try {
      const response = await fetch(`/api/movies/${movieId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ action: 'reject' })
      })

      if (response.ok) {
        toast.success('Movie rejected and removed')
        setPendingMovies(prev => prev.filter(movie => movie._id !== movieId))
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to reject movie')
      }
    } catch (error) {
      console.error('Error rejecting movie:', error)
      toast.error('Error rejecting movie')
    }
  }

  const openPreview = (movie) => {
    setSelectedMovie(movie)
    setShowPreview(true)
  }

  const closePreview = () => {
    setSelectedMovie(null)
    setShowPreview(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Pending Movie Approvals</h2>
        <div className="text-sm text-gray-500">
          {pendingMovies.length} movies awaiting review
        </div>
      </div>

      {pendingMovies.length === 0 ? (
        <div className="text-center py-12">
          <Check className="mx-auto h-12 w-12 text-green-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending movies</h3>
          <p className="mt-1 text-sm text-gray-500">All AI-generated movies have been reviewed.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pendingMovies.map((movie) => (
            <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={movie.images?.[0]?.url || movie.poster || '/images/default-poster.webp'}
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = '/images/default-poster.webp' }}
                />
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{movie.title}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{movie.year} • {movie.category}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Generated: {new Date(movie.createdAt).toLocaleDateString()}</span>
                  </div>
                  {movie.isAIGenerated && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span className="text-blue-600">AI Generated</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                  {movie.description}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openPreview(movie)}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleApprove(movie._id)}
                    className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(movie._id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Movie Preview Modal */}
      {showPreview && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedMovie.title}</h2>
                <button
                  onClick={closePreview}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedMovie.images?.[0]?.url || selectedMovie.poster || '/images/default-poster.webp'}
                    alt={selectedMovie.title}
                    className="w-full rounded-lg"
                    onError={(e) => { e.target.src = '/images/default-poster.webp' }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Movie Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Year:</span> {selectedMovie.year}</p>
                      <p><span className="font-medium">Category:</span> {selectedMovie.category}</p>
                      <p><span className="font-medium">Genre:</span> {selectedMovie.genre?.join(', ')}</p>
                      <p><span className="font-medium">Language:</span> {selectedMovie.language?.join(', ')}</p>
                      <p><span className="font-medium">Duration:</span> {selectedMovie.duration}</p>
                      <p><span className="font-medium">Director:</span> {selectedMovie.director}</p>
                      <p><span className="font-medium">Rating:</span> {selectedMovie.rating}/10</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-700">{selectedMovie.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cast</h3>
                    <p className="text-sm text-gray-700">{selectedMovie.cast?.join(', ')}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Download Links</h3>
                    <div className="space-y-2">
                      {selectedMovie.downloadLinks?.map((quality, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{quality.quality}</span>
                          <span className="text-gray-600">{quality.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        handleApprove(selectedMovie._id)
                        closePreview()
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Movie
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedMovie._id)
                        closePreview()
                      }}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Movie
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
