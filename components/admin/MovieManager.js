'use client'
import { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, Download, Star, Calendar, PlayCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import AddMovieForm from './AddMovieForm'
import EditMovieForm from './EditMovieForm'
import MoviePreview from './MoviePreview'
import EpisodeManager from './EpisodeManager'

export default function MovieManager() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewMovie, setPreviewMovie] = useState(null)
  const [showEpisodeManager, setShowEpisodeManager] = useState(false)
  const [episodeMovie, setEpisodeMovie] = useState(null)

  // Fetch movies from API
  useEffect(() => {
    fetchMovies()
  }, [pagination.page, filterCategory, searchQuery])

  // Listen for edit movie events from pending approval
  useEffect(() => {
    const handleEditMovie = (event) => {
      const movie = event.detail
      setEditingMovie(movie)
      setShowEditForm(true)
    }
    
    window.addEventListener('editMovie', handleEditMovie)
    return () => window.removeEventListener('editMovie', handleEditMovie)
  }, [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...(filterCategory !== 'all' && { category: filterCategory }),
        ...(searchQuery && { search: searchQuery })
      })

      const response = await fetch(`/api/movies?${params}`)
      const data = await response.json()

      if (response.ok) {
        setMovies(data.movies)
        setPagination(data.pagination)
      } else {
        toast.error('Failed to fetch movies')
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
      toast.error('Error fetching movies')
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = (movie) => {
    setPreviewMovie(movie)
    setShowPreview(true)
  }

  const handleEdit = (movie) => {
    setEditingMovie(movie)
    setShowEditForm(true)
  }

  const handleEpisodes = (movie) => {
    setEpisodeMovie(movie)
    setShowEpisodeManager(true)
  }

  const handleDelete = async (movieId) => {
    if (!confirm('Are you sure you want to delete this movie?')) {
      return
    }

    try {
      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (response.ok) {
        toast.success('Movie deleted successfully!')
        fetchMovies() // Refresh the list
      } else {
        const data = await response.json()
        toast.error(data.message || 'Failed to delete movie')
      }
    } catch (error) {
      console.error('Error deleting movie:', error)
      toast.error('Error deleting movie')
    }
  }

  const handleMovieUpdated = (updatedMovie) => {
    setMovies(prev => prev.map(movie => 
      movie._id === updatedMovie._id ? updatedMovie : movie
    ))
  }

  const handleStatusChange = async (movieId, status) => {
    try {
      const updateData = {
        isPublished: status === 'published',
        needsReview: status === 'pending'
      }

      const response = await fetch(`/api/movies/${movieId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        const updatedMovie = await response.json()
        handleMovieUpdated(updatedMovie)
        toast.success('Movie status updated successfully!')
      } else {
        toast.error('Failed to update movie status')
      }
    } catch (error) {
      console.error('Error updating movie status:', error)
      toast.error('Error updating movie status')
    }
  }

  const sampleMovies = [
    {
      id: 1,
      title: 'Spider-Man: No Way Home',
      slug: 'spider-man-no-way-home',
      category: 'Hollywood',
      year: 2021,
      rating: 8.4,
      status: 'published',
      views: 125000,
      downloads: 45000,
      isAIGenerated: false,
      createdAt: '2024-01-15',
      poster: 'https://via.placeholder.com/100x150/1f2937/ffffff?text=Spider-Man'
    },
    {
      id: 2,
      title: 'The Batman',
      slug: 'the-batman',
      category: 'Hollywood',
      year: 2022,
      rating: 7.8,
      status: 'pending',
      views: 0,
      downloads: 0,
      isAIGenerated: true,
      createdAt: '2024-01-14',
      poster: 'https://via.placeholder.com/100x150/1f2937/ffffff?text=Batman'
    },
    {
      id: 3,
      title: 'KGF Chapter 2',
      slug: 'kgf-chapter-2',
      category: 'South',
      year: 2022,
      rating: 8.3,
      status: 'published',
      views: 98000,
      downloads: 38000,
      isAIGenerated: false,
      createdAt: '2024-01-13',
      poster: 'https://via.placeholder.com/100x150/1f2937/ffffff?text=KGF+2'
    },
    {
      id: 4,
      title: 'Brahmastra',
      slug: 'brahmastra',
      category: 'Bollywood',
      year: 2022,
      rating: 7.1,
      status: 'published',
      views: 87000,
      downloads: 32000,
      isAIGenerated: false,
      createdAt: '2024-01-12',
      poster: 'https://via.placeholder.com/100x150/1f2937/ffffff?text=Brahmastra'
    }
  ]

  const filteredMovies = movies.filter(movie => {
    const matchesStatus = filterStatus === 'all' || 
      (movie.isPublished && filterStatus === 'published') || 
      (!movie.isPublished && filterStatus === 'pending') ||
      (movie.needsReview && filterStatus === 'pending') ||
      (!movie.isPublished && !movie.needsReview && filterStatus === 'draft')
    return matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Movie Management</h2>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Add Movie</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Hollywood">Hollywood</option>
              <option value="Bollywood">Bollywood</option>
              <option value="South">South Movies</option>
              <option value="Web Series">Web Series</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending Review</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Movie</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Category</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Year</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Rating</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Views</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Downloads</th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie) => (
                <tr key={movie._id || movie.id} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={movie.poster || '/images/default-poster.webp'}
                        alt={movie.title}
                        className="w-12 h-18 object-cover rounded"
                        onError={(e) => { e.target.src = '/images/default-poster.webp' }}
                      />
                      <div>
                        <p className="text-white font-medium">{movie.title}</p>
                        <p className="text-gray-400 text-sm">{new Date(movie.createdAt).toLocaleDateString()}</p>
                        {movie.isAIGenerated && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full mt-1">
                            AI Generated
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      movie.category === 'Hollywood' ? 'bg-blue-100 text-blue-800' :
                      movie.category === 'Bollywood' ? 'bg-red-100 text-red-800' :
                      movie.category === 'South' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {movie.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300">{movie.year}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white">{movie.rating || 0}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={movie.isPublished ? 'published' : (movie.needsReview ? 'pending' : 'draft')}
                      onChange={(e) => handleStatusChange(movie._id || movie.id, e.target.value)}
                      className={`px-2 py-1 text-xs font-semibold rounded-full border-0 ${
                        movie.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : movie.needsReview
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="published">Published</option>
                      <option value="pending">Pending Review</option>
                      <option value="draft">Draft</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-gray-300">{(movie.views || 0).toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-300">{(movie.downloads || 0).toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        title="View Movie"
                        onClick={() => handlePreview(movie)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-600 rounded transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Edit Movie"
                        onClick={() => handleEdit(movie)}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-gray-600 rounded transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {movie.isWebSeries && (
                        <button
                          title="Manage Episodes"
                          onClick={() => handleEpisodes(movie)}
                          className="p-2 text-purple-400 hover:text-purple-300 hover:bg-gray-600 rounded transition-colors duration-200"
                        >
                          <PlayCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        title="Delete Movie"
                        onClick={() => handleDelete(movie._id || movie.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No movies found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          Showing {filteredMovies.length} of {pagination.total} movies
        </p>
        <div className="flex space-x-2">
          <button 
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors duration-200 disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => (
            <button 
              key={i + 1}
              onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
              className={`px-3 py-2 rounded transition-colors duration-200 ${
                pagination.page === i + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button 
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
            disabled={pagination.page === pagination.pages}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors duration-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Movie Form Modal */}
      {showAddForm && (
        <AddMovieForm
          onClose={() => setShowAddForm(false)}
          onMovieAdded={(movie) => {
            setMovies(prev => [movie, ...prev])
            setShowAddForm(false)
          }}
        />
      )}

      {/* Edit Movie Form Modal */}
      {showEditForm && editingMovie && (
        <EditMovieForm
          movie={editingMovie}
          onClose={() => {
            setShowEditForm(false)
            setEditingMovie(null)
          }}
          onMovieUpdated={handleMovieUpdated}
        />
      )}

      {/* Movie Preview Modal */}
      {showPreview && previewMovie && (
        <MoviePreview
          movie={previewMovie}
          onClose={() => {
            setShowPreview(false)
            setPreviewMovie(null)
          }}
        />
      )}

      {/* Episode Manager Modal */}
      {showEpisodeManager && episodeMovie && (
        <EpisodeManager
          movieId={episodeMovie._id || episodeMovie.id}
          movieTitle={episodeMovie.title}
          onClose={() => {
            setShowEpisodeManager(false)
            setEpisodeMovie(null)
          }}
        />
      )}
    </div>
  )
}
