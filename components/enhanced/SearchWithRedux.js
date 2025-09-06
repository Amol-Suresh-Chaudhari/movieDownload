'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useMovieStore } from '../../hooks/useRedux';
import { useApp } from '../../contexts/AppContext';

export default function SearchWithRedux() {
  const { filters, setFilters, clearFilters, fetchMovies } = useMovieStore();
  const { state, actions } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        setFilters({ search: localSearch });
        actions.setSearchQuery(localSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, filters.search, setFilters, actions]);

  // Fetch movies when filters change
  useEffect(() => {
    fetchMovies({ page: 1 });
  }, [filters, fetchMovies]);

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
    actions.setFilters({ [key]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
    actions.clearFilters();
    setLocalSearch('');
  };

  const categories = ['Bollywood', 'Hollywood', 'South', 'South Dubbed', 'Dual Audio', 'Web Series'];
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Adventure'];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  const languages = ['Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam', 'Kannada'];

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '' && filter !== 'createdAt');

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search movies, web series..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {localSearch && (
          <button
            onClick={() => setLocalSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre
            </label>
            <select
              value={filters.genre || ''}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Year
            </label>
            <select
              value={filters.year || ''}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <select
              value={filters.language || ''}
              onChange={(e) => handleFilterChange('language', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Languages</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || value === 'createdAt') return null;
            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
              >
                {key}: {value}
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="ml-2 hover:text-gray-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
