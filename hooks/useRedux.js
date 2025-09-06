import { useSelector, useDispatch } from 'react-redux';
import { 
  loginUser, 
  logoutUser, 
  checkAuthStatus, 
  clearError as clearAuthError 
} from '../store/slices/authSlice';
import { 
  fetchMovies, 
  fetchFeaturedMovies, 
  fetchPopularMovies, 
  fetchLatestMovies, 
  fetchMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
  setFilters,
  clearFilters,
  clearError as clearMovieError 
} from '../store/slices/movieSlice';
import { 
  setThemeMode, 
  setThemeColors, 
  setThemeSettings, 
  applyPreset, 
  resetTheme,
  loadThemeFromStorage,
  saveThemeToStorage 
} from '../store/slices/themeSlice';

// Custom hook for authentication
export function useAuth() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    ...auth,
    login: (credentials) => dispatch(loginUser(credentials)),
    logout: () => dispatch(logoutUser()),
    checkAuth: () => dispatch(checkAuthStatus()),
    clearError: () => dispatch(clearAuthError()),
  };
}

// Custom hook for movies
export function useMovieStore() {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies);

  return {
    ...movies,
    fetchMovies: (params) => dispatch(fetchMovies(params)),
    fetchFeaturedMovies: () => dispatch(fetchFeaturedMovies()),
    fetchPopularMovies: () => dispatch(fetchPopularMovies()),
    fetchLatestMovies: () => dispatch(fetchLatestMovies()),
    fetchMovieById: (id) => dispatch(fetchMovieById(id)),
    createMovie: (movieData) => dispatch(createMovie(movieData)),
    updateMovie: (id, movieData) => dispatch(updateMovie({ id, movieData })),
    deleteMovie: (id) => dispatch(deleteMovie(id)),
    setFilters: (filters) => dispatch(setFilters(filters)),
    clearFilters: () => dispatch(clearFilters()),
    clearError: () => dispatch(clearMovieError()),
  };
}

// Custom hook for theme
export function useTheme() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);

  return {
    ...theme,
    setMode: (mode) => dispatch(setThemeMode(mode)),
    setColors: (colors) => dispatch(setThemeColors(colors)),
    setSettings: (settings) => dispatch(setThemeSettings(settings)),
    applyPreset: (preset) => dispatch(applyPreset(preset)),
    resetTheme: () => dispatch(resetTheme()),
    loadFromStorage: () => dispatch(loadThemeFromStorage()),
    saveToStorage: () => dispatch(saveThemeToStorage()),
  };
}

// Combined hook for all Redux state
export function useReduxStore() {
  const auth = useAuth();
  const movies = useMovieStore();
  const theme = useTheme();

  return {
    auth,
    movies,
    theme,
  };
}
