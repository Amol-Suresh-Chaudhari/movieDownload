import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  // UI State
  loading: false,
  error: null,
  notification: null,
  
  // User preferences
  preferences: {
    theme: 'dark',
    language: 'en',
    autoplay: false,
    quality: 'auto',
  },
  
  // Search and filters
  searchQuery: '',
  activeFilters: {
    category: '',
    genre: '',
    year: '',
    language: '',
    rating: '',
  },
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 12,
  
  // Recently viewed
  recentlyViewed: [],
  
  // Favorites/Watchlist
  favorites: [],
  watchlist: [],
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_NOTIFICATION: 'SET_NOTIFICATION',
  CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
  SET_PREFERENCES: 'SET_PREFERENCES',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  ADD_TO_RECENTLY_VIEWED: 'ADD_TO_RECENTLY_VIEWED',
  ADD_TO_FAVORITES: 'ADD_TO_FAVORITES',
  REMOVE_FROM_FAVORITES: 'REMOVE_FROM_FAVORITES',
  ADD_TO_WATCHLIST: 'ADD_TO_WATCHLIST',
  REMOVE_FROM_WATCHLIST: 'REMOVE_FROM_WATCHLIST',
  RESET_STATE: 'RESET_STATE',
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.SET_NOTIFICATION:
      return { ...state, notification: action.payload };
    
    case ActionTypes.CLEAR_NOTIFICATION:
      return { ...state, notification: null };
    
    case ActionTypes.SET_PREFERENCES:
      return { 
        ...state, 
        preferences: { ...state.preferences, ...action.payload } 
      };
    
    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case ActionTypes.SET_FILTERS:
      return { 
        ...state, 
        activeFilters: { ...state.activeFilters, ...action.payload } 
      };
    
    case ActionTypes.CLEAR_FILTERS:
      return { 
        ...state, 
        activeFilters: {
          category: '',
          genre: '',
          year: '',
          language: '',
          rating: '',
        }
      };
    
    case ActionTypes.SET_PAGINATION:
      return { 
        ...state, 
        currentPage: action.payload.page || state.currentPage,
        itemsPerPage: action.payload.itemsPerPage || state.itemsPerPage
      };
    
    case ActionTypes.ADD_TO_RECENTLY_VIEWED:
      const newRecentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter(item => item.id !== action.payload.id)
      ].slice(0, 10); // Keep only last 10 items
      return { ...state, recentlyViewed: newRecentlyViewed };
    
    case ActionTypes.ADD_TO_FAVORITES:
      if (state.favorites.find(item => item.id === action.payload.id)) {
        return state; // Already in favorites
      }
      return { 
        ...state, 
        favorites: [...state.favorites, action.payload] 
      };
    
    case ActionTypes.REMOVE_FROM_FAVORITES:
      return { 
        ...state, 
        favorites: state.favorites.filter(item => item.id !== action.payload) 
      };
    
    case ActionTypes.ADD_TO_WATCHLIST:
      if (state.watchlist.find(item => item.id === action.payload.id)) {
        return state; // Already in watchlist
      }
      return { 
        ...state, 
        watchlist: [...state.watchlist, action.payload] 
      };
    
    case ActionTypes.REMOVE_FROM_WATCHLIST:
      return { 
        ...state, 
        watchlist: state.watchlist.filter(item => item.id !== action.payload) 
      };
    
    case ActionTypes.RESET_STATE:
      return initialState;
    
    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreferences = localStorage.getItem('app-preferences');
      const savedFavorites = localStorage.getItem('app-favorites');
      const savedWatchlist = localStorage.getItem('app-watchlist');
      const savedRecentlyViewed = localStorage.getItem('app-recently-viewed');

      if (savedPreferences) {
        dispatch({
          type: ActionTypes.SET_PREFERENCES,
          payload: JSON.parse(savedPreferences),
        });
      }

      if (savedFavorites) {
        dispatch({
          type: ActionTypes.ADD_TO_FAVORITES,
          payload: JSON.parse(savedFavorites),
        });
      }

      if (savedWatchlist) {
        dispatch({
          type: ActionTypes.ADD_TO_WATCHLIST,
          payload: JSON.parse(savedWatchlist),
        });
      }

      if (savedRecentlyViewed) {
        state.recentlyViewed = JSON.parse(savedRecentlyViewed);
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-preferences', JSON.stringify(state.preferences));
      localStorage.setItem('app-favorites', JSON.stringify(state.favorites));
      localStorage.setItem('app-watchlist', JSON.stringify(state.watchlist));
      localStorage.setItem('app-recently-viewed', JSON.stringify(state.recentlyViewed));
    }
  }, [state.preferences, state.favorites, state.watchlist, state.recentlyViewed]);

  // Action creators
  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    setNotification: (notification) => dispatch({ type: ActionTypes.SET_NOTIFICATION, payload: notification }),
    clearNotification: () => dispatch({ type: ActionTypes.CLEAR_NOTIFICATION }),
    setPreferences: (preferences) => dispatch({ type: ActionTypes.SET_PREFERENCES, payload: preferences }),
    setSearchQuery: (query) => dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query }),
    setFilters: (filters) => dispatch({ type: ActionTypes.SET_FILTERS, payload: filters }),
    clearFilters: () => dispatch({ type: ActionTypes.CLEAR_FILTERS }),
    setPagination: (pagination) => dispatch({ type: ActionTypes.SET_PAGINATION, payload: pagination }),
    addToRecentlyViewed: (item) => dispatch({ type: ActionTypes.ADD_TO_RECENTLY_VIEWED, payload: item }),
    addToFavorites: (item) => dispatch({ type: ActionTypes.ADD_TO_FAVORITES, payload: item }),
    removeFromFavorites: (id) => dispatch({ type: ActionTypes.REMOVE_FROM_FAVORITES, payload: id }),
    addToWatchlist: (item) => dispatch({ type: ActionTypes.ADD_TO_WATCHLIST, payload: item }),
    removeFromWatchlist: (id) => dispatch({ type: ActionTypes.REMOVE_FROM_WATCHLIST, payload: id }),
    resetState: () => dispatch({ type: ActionTypes.RESET_STATE }),
  };

  const value = {
    state,
    actions,
    // Computed values
    isInFavorites: (id) => state.favorites.some(item => item.id === id),
    isInWatchlist: (id) => state.watchlist.some(item => item.id === id),
    hasActiveFilters: () => Object.values(state.activeFilters).some(filter => filter !== ''),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Export action types for external use
export { ActionTypes };
