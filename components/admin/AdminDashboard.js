'use client'
import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Film, 
  Users, 
  Download, 
  Plus, 
  Settings as SettingsIcon, 
  LogOut,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Bot,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import AIMovieGenerator from './AIMovieGenerator'
import PendingMovies from './PendingMovies'
import MovieManager from './MovieManager'
import Analytics from './Analytics'
import Settings from './Settings'
import toast from 'react-hot-toast'

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalDownloads: 0,
    monthlyViews: 0,
    pendingReviews: 0,
    aiGenerated: 0
  })
  const [recentMovies, setRecentMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'movies', name: 'Movies', icon: Film },
    { id: 'pending', name: 'Pending Approval', icon: Clock, badge: stats.pendingReviews },
    { id: 'ai-generator', name: 'AI Generator', icon: Bot },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: SettingsIcon },
  ]

  useEffect(() => {
    fetchStats()
    fetchRecentMovies()
    
    // Listen for dashboard refresh events
    const handleRefresh = () => {
      fetchStats()
      fetchRecentMovies()
    }
    
    window.addEventListener('refreshDashboard', handleRefresh)
    return () => window.removeEventListener('refreshDashboard', handleRefresh)
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (response.ok) {
        setStats({
          totalMovies: data.stats.totalMovies || 0,
          publishedMovies: data.stats.publishedMovies || 0,
          pendingMovies: data.stats.pendingMovies || 0,
          pendingReviews: data.stats.pendingMovies || 0,
          totalDownloads: data.stats.totalDownloads || 0,
          monthlyViews: data.stats.totalViews || 0,
          totalUsers: Math.floor((data.stats.totalViews || 0) / 50),
          aiGenerated: data.stats.aiGenerated || 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchRecentMovies = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      
      // Fetch stats
      const [moviesRes, pendingRes] = await Promise.all([
        fetch('/api/movies?limit=1000', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/movies?needsReview=true', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const moviesData = await moviesRes.json()
      const pendingData = await pendingRes.json()

      const movies = moviesData.movies || []
      const pendingMovies = pendingData.movies || []

      // Set recent movies (last 5)
      const recent = movies
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(movie => ({
          _id: movie._id,
          title: movie.title,
          poster: movie.poster || movie.images?.find(img => img.type === 'poster')?.url,
          status: movie.needsReview ? 'pending' : (movie.isPublished ? 'published' : 'draft'),
          views: movie.views || 0,
          downloads: movie.downloads || 0,
          createdAt: movie.createdAt,
          isAIGenerated: movie.isAIGenerated || false
        }))

      setRecentMovies(recent)
      
      // Update stats with real data
      setStats({
        totalMovies: movies.length,
        totalUsers: 0, // This would need a separate API endpoint
        totalDownloads: movies.reduce((sum, movie) => sum + (movie.downloads || 0), 0),
        monthlyViews: movies.reduce((sum, movie) => sum + (movie.views || 0), 0),
        pendingReviews: pendingMovies.length,
        aiGenerated: movies.filter(movie => movie.isAIGenerated).length
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Film className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 min-h-screen border-r border-gray-700">
          <div className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span>{tab.name}</span>
                      </div>
                      {tab.badge && tab.badge > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.5rem] text-center">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Movies</p>
                      <p className="text-2xl font-bold text-white">{stats.totalMovies?.toLocaleString() || '0'}</p>
                    </div>
                    <Film className="w-8 h-8 text-blue-500" />
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Downloads</p>
                      <p className="text-2xl font-bold text-white">{stats.totalDownloads?.toLocaleString() || '0'}</p>
                    </div>
                    <Download className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Views</p>
                      <p className="text-2xl font-bold text-white">{stats.monthlyViews?.toLocaleString() || '0'}</p>
                    </div>
                    <Eye className="w-8 h-8 text-purple-500" />
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Reviews</p>
                      <p className="text-2xl font-bold text-white">{stats.pendingReviews}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
              </div>

              {/* Recent Movies */}
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Recent Movies</h3>
                  <button 
                    onClick={() => setActiveTab('movies')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Movie</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Title</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Views</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Downloads</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Type</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        [...Array(3)].map((_, i) => (
                          <tr key={i} className="border-b border-gray-700">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-16 bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-700 rounded animate-pulse flex-1"></div>
                              </div>
                            </td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-700 rounded animate-pulse w-16"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-700 rounded animate-pulse w-12"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-700 rounded animate-pulse w-12"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-700 rounded animate-pulse w-16"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-700 rounded animate-pulse w-16"></div></td>
                          </tr>
                        ))
                      ) : recentMovies.length > 0 ? (
                        recentMovies.map((movie) => (
                          <tr key={movie._id} className="border-b border-gray-700 hover:bg-gray-700">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={movie.poster || '/images/default-poster.webp'}
                                  alt={movie.title}
                                  className="w-12 h-16 object-cover rounded"
                                  onError={(e) => { e.target.src = '/images/default-poster.webp' }}
                                />
                                <span className="text-white">{movie.title}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                movie.status === 'published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : movie.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {movie.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{movie.views?.toLocaleString() || '0'}</td>
                            <td className="py-3 px-4 text-gray-300">{movie.downloads?.toLocaleString() || '0'}</td>
                            <td className="py-3 px-4">
                              {movie.isAIGenerated ? (
                                <span className="flex items-center space-x-1 text-purple-400">
                                  <Bot className="w-4 h-4" />
                                  <span>AI</span>
                                </span>
                              ) : (
                                <span className="text-gray-400">Manual</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => setActiveTab('movies')}
                                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-600 rounded"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-600 rounded">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-8 px-4 text-center text-gray-400">
                            No movies found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'movies' && <MovieManager />}
          {activeTab === 'pending' && <PendingMovies onEditMovie={(movie) => {
            setActiveTab('movies')
            // Pass movie data to MovieManager for editing
            window.dispatchEvent(new CustomEvent('editMovie', { detail: movie }))
          }} />}
          {activeTab === 'ai-generator' && <AIMovieGenerator />}
          {activeTab === 'analytics' && <Analytics />}
          
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  )
}
