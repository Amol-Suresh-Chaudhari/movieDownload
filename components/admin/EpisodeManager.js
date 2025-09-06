'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download, Play, Calendar, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EpisodeManager({ movieId, movieTitle, onClose }) {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState(null);
  const [formData, setFormData] = useState({
    episodeNumber: '',
    title: '',
    description: '',
    duration: '',
    seasonNumber: 1,
    thumbnail: '',
    airDate: '',
    downloadLinks: [{ quality: '720p', size: '', links: [{ url: '', server: 'Server 1', type: 'direct' }] }]
  });

  useEffect(() => {
    fetchEpisodes();
  }, [movieId]);

  const fetchEpisodes = async () => {
    try {
      const response = await fetch(`/api/movies/${movieId}/episodes`);
      const data = await response.json();
      if (response.ok) {
        setEpisodes(data.episodes || []);
      }
    } catch (error) {
      console.error('Error fetching episodes:', error);
      toast.error('Failed to fetch episodes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    try {
      const response = await fetch(`/api/movies/${movieId}/episodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Episode added successfully');
        fetchEpisodes();
        resetForm();
        setShowAddForm(false);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add episode');
      }
    } catch (error) {
      console.error('Error adding episode:', error);
      toast.error('Failed to add episode');
    }
  };

  const resetForm = () => {
    setFormData({
      episodeNumber: '',
      title: '',
      description: '',
      duration: '',
      seasonNumber: 1,
      thumbnail: '',
      airDate: '',
      downloadLinks: [{ quality: '720p', size: '', links: [{ url: '', server: 'Server 1', type: 'direct' }] }]
    });
    setEditingEpisode(null);
  };

  const addDownloadLink = () => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: [...prev.downloadLinks, { quality: '720p', size: '', links: [{ url: '', server: 'Server 1', type: 'direct' }] }]
    }));
  };

  const updateDownloadLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const addServerLink = (downloadIndex) => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === downloadIndex 
          ? { ...link, links: [...link.links, { url: '', server: `Server ${link.links.length + 1}`, type: 'direct' }] }
          : link
      )
    }));
  };

  const updateServerLink = (downloadIndex, linkIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      downloadLinks: prev.downloadLinks.map((link, i) => 
        i === downloadIndex 
          ? { 
              ...link, 
              links: link.links.map((serverLink, j) => 
                j === linkIndex ? { ...serverLink, [field]: value } : serverLink
              )
            }
          : link
      )
    }));
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-2">Loading episodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Episodes - {movieTitle}
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Episode</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>

          {/* Episodes List */}
          <div className="space-y-4 mb-6">
            {episodes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No episodes found. Add the first episode!</p>
              </div>
            ) : (
              episodes.map((episode) => (
                <div key={episode._id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Episode {episode.episodeNumber}: {episode.title}
                      </h3>
                      {episode.description && (
                        <p className="text-gray-300 mb-3">{episode.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Season {episode.seasonNumber}</span>
                        </span>
                        {episode.duration && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{episode.duration}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Play className="w-4 h-4" />
                          <span>{episode.views || 0} views</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{episode.downloads || 0} downloads</span>
                        </span>
                      </div>
                      
                      {/* Download Links Summary */}
                      {episode.downloadLinks && episode.downloadLinks.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-400 mb-1">Available qualities:</p>
                          <div className="flex flex-wrap gap-2">
                            {episode.downloadLinks.map((link, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                                {link.quality} ({link.size || 'N/A'})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {episode.thumbnail && (
                      <img
                        src={episode.thumbnail}
                        alt={`Episode ${episode.episodeNumber}`}
                        className="w-24 h-16 object-cover rounded ml-4"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Add Episode Form */}
          {showAddForm && (
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Add New Episode</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Episode Number *
                    </label>
                    <input
                      type="number"
                      value={formData.episodeNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, episodeNumber: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Season Number
                    </label>
                    <input
                      type="number"
                      value={formData.seasonNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, seasonNumber: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Episode Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="e.g., 45 min"
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Air Date
                    </label>
                    <input
                      type="date"
                      value={formData.airDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, airDate: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Download Links */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Download Links
                    </label>
                    <button
                      type="button"
                      onClick={addDownloadLink}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                    >
                      Add Quality
                    </button>
                  </div>
                  
                  {formData.downloadLinks.map((downloadLink, downloadIndex) => (
                    <div key={downloadIndex} className="bg-gray-600 rounded p-3 mb-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Quality</label>
                          <select
                            value={downloadLink.quality}
                            onChange={(e) => updateDownloadLink(downloadIndex, 'quality', e.target.value)}
                            className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
                          >
                            <option value="480p">480p</option>
                            <option value="720p">720p</option>
                            <option value="1080p">1080p</option>
                            <option value="4K">4K</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">File Size</label>
                          <input
                            type="text"
                            value={downloadLink.size}
                            onChange={(e) => updateDownloadLink(downloadIndex, 'size', e.target.value)}
                            placeholder="e.g., 350MB"
                            className="w-full px-2 py-1 bg-gray-700 text-white rounded text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs text-gray-400">Server Links</label>
                          <button
                            type="button"
                            onClick={() => addServerLink(downloadIndex)}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                          >
                            Add Server
                          </button>
                        </div>
                        
                        {downloadLink.links.map((serverLink, linkIndex) => (
                          <div key={linkIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input
                              type="url"
                              value={serverLink.url}
                              onChange={(e) => updateServerLink(downloadIndex, linkIndex, 'url', e.target.value)}
                              placeholder="Download URL"
                              className="px-2 py-1 bg-gray-700 text-white rounded text-sm"
                            />
                            <input
                              type="text"
                              value={serverLink.server}
                              onChange={(e) => updateServerLink(downloadIndex, linkIndex, 'server', e.target.value)}
                              placeholder="Server Name"
                              className="px-2 py-1 bg-gray-700 text-white rounded text-sm"
                            />
                            <select
                              value={serverLink.type}
                              onChange={(e) => updateServerLink(downloadIndex, linkIndex, 'type', e.target.value)}
                              className="px-2 py-1 bg-gray-700 text-white rounded text-sm"
                            >
                              <option value="direct">Direct</option>
                              <option value="torrent">Torrent</option>
                              <option value="streaming">Streaming</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Add Episode
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
