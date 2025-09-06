import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  // Movie data
  movies: [],
  featuredMovies: [],
  popularMovies: [],
  latestMovies: [],
  currentMovie: null,
  
  // Loading states
  loading: false,
  featuredLoading: false,
  popularLoading: false,
  latestLoading: false,
  currentMovieLoading: false,
  
  // Error states
  error: null,
  
  // Pagination
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  
  // Filters and search
  filters: {
    category: '',
    search: '',
    genre: '',
    year: '',
    language: '',
    sort: 'createdAt',
  },
  
  // Cache for performance
  cache: {
    movies: new Map(),
    lastFetch: null,
    ttl: 5 * 60 * 1000, // 5 minutes
  },
};

// Action types
const ActionTypes = {
  // Loading actions
  SET_LOADING: 'SET_LOADING',
  SET_FEATURED_LOADING: 'SET_FEATURED_LOADING',
  SET_POPULAR_LOADING: 'SET_POPULAR_LOADING',
  SET_LATEST_LOADING: 'SET_LATEST_LOADING',
  SET_CURRENT_MOVIE_LOADING: 'SET_CURRENT_MOVIE_LOADING',
  
  // Data actions
  SET_MOVIES: 'SET_MOVIES',
  SET_FEATURED_MOVIES: 'SET_FEATURED_MOVIES',
  SET_POPULAR_MOVIES: 'SET_POPULAR_MOVIES',
  SET_LATEST_MOVIES: 'SET_LATEST_MOVIES',
  SET_CURRENT_MOVIE: 'SET_CURRENT_MOVIE',
  
  // Pagination
  SET_PAGINATION: 'SET_PAGINATION',
  
  // Filters
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  
  // Error handling
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Cache
  SET_CACHE: 'SET_CACHE',
  CLEAR_CACHE: 'CLEAR_CACHE',
  
  // CRUD operations
  ADD_MOVIE: 'ADD_MOVIE',
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  DELETE_MOVIE: 'DELETE_MOVIE',
};

// Reducer function
function movieReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_FEATURED_LOADING:
      return { ...state, featuredLoading: action.payload };
    
    case ActionTypes.SET_POPULAR_LOADING:
      return { ...state, popularLoading: action.payload };
    
    case ActionTypes.SET_LATEST_LOADING:
      return { ...state, latestLoading: action.payload };
    
    case ActionTypes.SET_CURRENT_MOVIE_LOADING:
      return { ...state, currentMovieLoading: action.payload };
    
    case ActionTypes.SET_MOVIES:
      return { ...state, movies: action.payload, loading: false };
    
    case ActionTypes.SET_FEATURED_MOVIES:
      return { ...state, featuredMovies: action.payload, featuredLoading: false };
    
    case ActionTypes.SET_POPULAR_MOVIES:
      return { ...state, popularMovies: action.payload, popularLoading: false };
    
    case ActionTypes.SET_LATEST_MOVIES:
      return { ...state, latestMovies: action.payload, latestLoading: false };
    
    case ActionTypes.SET_CURRENT_MOVIE:
      return { ...state, currentMovie: action.payload, currentMovieLoading: false };
    
    case ActionTypes.SET_PAGINATION:
      return { ...state, pagination: action.payload };
    
    case ActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case ActionTypes.CLEAR_FILTERS:
      return { 
        ...state, 
        filters: {
          category: '',
          search: '',
          genre: '',
          year: '',
          language: '',
          sort: 'createdAt',
        }
      };
    
    case ActionTypes.SET_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        loading: false,
        featuredLoading: false,
        popularLoading: false,
        latestLoading: false,
        currentMovieLoading: false,
      };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.SET_CACHE:
      return { 
        ...state, 
        cache: { 
          ...state.cache, 
          movies: action.payload.movies,
          lastFetch: action.payload.lastFetch 
        } 
      };
    
    case ActionTypes.CLEAR_CACHE:
      return { 
        ...state, 
        cache: { 
          movies: new Map(), 
          lastFetch: null, 
          ttl: 5 * 60 * 1000 
        } 
      };
    
    case ActionTypes.ADD_MOVIE:
      return { 
        ...state, 
        movies: [action.payload, ...state.movies] 
      };
    
    case ActionTypes.UPDATE_MOVIE:
      return {
        ...state,
        movies: state.movies.map(movie => 
          movie._id === action.payload._id ? action.payload : movie
        ),
        currentMovie: state.currentMovie && state.currentMovie._id === action.payload._id 
          ? action.payload 
          : state.currentMovie,
      };
    
    case ActionTypes.DELETE_MOVIE:
      return {
        ...state,
        movies: state.movies.filter(movie => movie._id !== action.payload),
        currentMovie: state.currentMovie && state.currentMovie._id === action.payload 
          ? null 
          : state.currentMovie,
      };
    
    default:
      return state;
  }
}

// Create context
const MovieContext = createContext();

// Provider component
export function MovieProvider({ children }) {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // API functions
  const fetchMovies = async (params = {}) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.CLEAR_ERROR });

      const queryParams = new URLSearchParams({
        page: params.page || state.pagination.page,
        limit: params.limit || state.pagination.limit,
        ...state.filters,
        ...params,
      });

      const response = await fetch(`/api/movies?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch movies');
      }

      dispatch({ type: ActionTypes.SET_MOVIES, payload: data.movies });
      dispatch({ type: ActionTypes.SET_PAGINATION, payload: data.pagination });
      
      // Update cache
      dispatch({ 
        type: ActionTypes.SET_CACHE, 
        payload: { 
          movies: new Map(data.movies.map(movie => [movie._id, movie])),
          lastFetch: Date.now()
        }
      });

    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  const fetchFeaturedMovies = async () => {
    try {
      dispatch({ type: ActionTypes.SET_FEATURED_LOADING, payload: true });
      
      const response = await fetch('/api/movies?featured=true&limit=6');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch featured movies');
      }

      dispatch({ type: ActionTypes.SET_FEATURED_MOVIES, payload: data.movies });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  const fetchPopularMovies = async () => {
    try {
      dispatch({ type: ActionTypes.SET_POPULAR_LOADING, payload: true });
      
      const response = await fetch('/api/movies?sort=views&limit=8');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch popular movies');
      }

      dispatch({ type: ActionTypes.SET_POPULAR_MOVIES, payload: data.movies });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  const fetchLatestMovies = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LATEST_LOADING, payload: true });
      
      const response = await fetch('/api/movies?sort=createdAt&limit=8');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch latest movies');
      }

      dispatch({ type: ActionTypes.SET_LATEST_MOVIES, payload: data.movies });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
    }
  };

  const fetchMovieById = async (id) => {
    try {
      // Check cache first
      if (state.cache.movies.has(id)) {
        const cachedMovie = state.cache.movies.get(id);
        const isExpired = Date.now() - state.cache.lastFetch > state.cache.ttl;
        
        if (!isExpired) {
          dispatch({ type: ActionTypes.SET_CURRENT_MOVIE, payload: cachedMovie });
          return cachedMovie;
        }
      }

      dispatch({ type: ActionTypes.SET_CURRENT_MOVIE_LOADING, payload: true });
      
      const response = await fetch(`/api/movies/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch movie');
      }

      dispatch({ type: ActionTypes.SET_CURRENT_MOVIE, payload: data });
      
      // Update cache
      const newCache = new Map(state.cache.movies);
      newCache.set(id, data);
      dispatch({ 
        type: ActionTypes.SET_CACHE, 
        payload: { 
          movies: newCache,
          lastFetch: Date.now()
        }
      });

      return data;
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Action creators
  const actions = {
    // Fetch actions
    fetchMovies,
    fetchFeaturedMovies,
    fetchPopularMovies,
    fetchLatestMovies,
    fetchMovieById,
    
    // Filter actions
    setFilters: (filters) => dispatch({ type: ActionTypes.SET_FILTERS, payload: filters }),
    clearFilters: () => dispatch({ type: ActionTypes.CLEAR_FILTERS }),
    
    // Pagination actions
    setPagination: (pagination) => dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination }),
    
    // Error actions
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    
    // Cache actions
    clearCache: () => dispatch({ type: ActionTypes.CLEAR_CACHE }),
    
    // CRUD actions
    addMovie: (movie) => dispatch({ type: ActionTypes.ADD_MOVIE, payload: movie }),
    updateMovie: (movie) => dispatch({ type: ActionTypes.UPDATE_MOVIE, payload: movie }),
    deleteMovie: (id) => dispatch({ type: ActionTypes.DELETE_MOVIE, payload: id }),
    
    // Current movie actions
    setCurrentMovie: (movie) => dispatch({ type: ActionTypes.SET_CURRENT_MOVIE, payload: movie }),
    clearCurrentMovie: () => dispatch({ type: ActionTypes.SET_CURRENT_MOVIE, payload: null }),
  };

  const value = {
    state,
    actions,
    // Computed values
    hasMovies: state.movies.length > 0,
    hasFeaturedMovies: state.featuredMovies.length > 0,
    hasPopularMovies: state.popularMovies.length > 0,
    hasLatestMovies: state.latestMovies.length > 0,
    isLoading: state.loading || state.featuredLoading || state.popularLoading || state.latestLoading,
    hasActiveFilters: Object.values(state.filters).some(filter => filter !== '' && filter !== 'createdAt'),
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
}

// Custom hook to use the context
export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
}

// Export action types for external use
export { ActionTypes };
