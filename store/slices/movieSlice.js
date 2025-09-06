import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 12,
        ...(params.category && { category: params.category }),
        ...(params.search && { search: params.search }),
        ...(params.genre && { genre: params.genre }),
        ...(params.year && { year: params.year }),
        ...(params.language && { language: params.language }),
        ...(params.sort && { sort: params.sort }),
      });

      const response = await fetch(`/api/movies?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch movies');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching featured movies
export const fetchFeaturedMovies = createAsyncThunk(
  'movies/fetchFeaturedMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/movies?featured=true&limit=6');
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch featured movies');
      }

      return data.movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching popular movies
export const fetchPopularMovies = createAsyncThunk(
  'movies/fetchPopularMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/movies?sort=views&limit=8');
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch popular movies');
      }

      return data.movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching latest movies
export const fetchLatestMovies = createAsyncThunk(
  'movies/fetchLatestMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/movies?sort=createdAt&limit=8');
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch latest movies');
      }

      return data.movies;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching single movie
export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/movies/${id}`);
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch movie');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating movie
export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(movieData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to create movie');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating movie
export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, movieData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify(movieData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to update movie');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for deleting movie
export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/movies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return rejectWithValue(data.error || 'Failed to delete movie');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    featuredMovies: [],
    popularMovies: [],
    latestMovies: [],
    currentMovie: null,
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      pages: 0,
    },
    filters: {
      category: '',
      search: '',
      genre: '',
      year: '',
      language: '',
      sort: 'createdAt',
    },
    loading: false,
    featuredLoading: false,
    popularLoading: false,
    latestLoading: false,
    currentMovieLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        search: '',
        genre: '',
        year: '',
        language: '',
        sort: 'createdAt',
      };
    },
    setCurrentMovie: (state, action) => {
      state.currentMovie = action.payload;
    },
    clearCurrentMovie: (state) => {
      state.currentMovie = null;
    },
    updateMovieInList: (state, action) => {
      const updatedMovie = action.payload;
      state.movies = state.movies.map(movie => 
        movie._id === updatedMovie._id ? updatedMovie : movie
      );
    },
    removeMovieFromList: (state, action) => {
      const movieId = action.payload;
      state.movies = state.movies.filter(movie => movie._id !== movieId);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch movies cases
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.movies;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch featured movies cases
      .addCase(fetchFeaturedMovies.pending, (state) => {
        state.featuredLoading = true;
      })
      .addCase(fetchFeaturedMovies.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredMovies = action.payload;
      })
      .addCase(fetchFeaturedMovies.rejected, (state, action) => {
        state.featuredLoading = false;
        state.error = action.payload;
      })
      // Fetch popular movies cases
      .addCase(fetchPopularMovies.pending, (state) => {
        state.popularLoading = true;
      })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.popularLoading = false;
        state.popularMovies = action.payload;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.popularLoading = false;
        state.error = action.payload;
      })
      // Fetch latest movies cases
      .addCase(fetchLatestMovies.pending, (state) => {
        state.latestLoading = true;
      })
      .addCase(fetchLatestMovies.fulfilled, (state, action) => {
        state.latestLoading = false;
        state.latestMovies = action.payload;
      })
      .addCase(fetchLatestMovies.rejected, (state, action) => {
        state.latestLoading = false;
        state.error = action.payload;
      })
      // Fetch movie by ID cases
      .addCase(fetchMovieById.pending, (state) => {
        state.currentMovieLoading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.currentMovieLoading = false;
        state.currentMovie = action.payload;
        state.error = null;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.currentMovieLoading = false;
        state.error = action.payload;
      })
      // Create movie cases
      .addCase(createMovie.fulfilled, (state, action) => {
        state.movies.unshift(action.payload);
      })
      // Update movie cases
      .addCase(updateMovie.fulfilled, (state, action) => {
        const updatedMovie = action.payload;
        state.movies = state.movies.map(movie => 
          movie._id === updatedMovie._id ? updatedMovie : movie
        );
        if (state.currentMovie && state.currentMovie._id === updatedMovie._id) {
          state.currentMovie = updatedMovie;
        }
      })
      // Delete movie cases
      .addCase(deleteMovie.fulfilled, (state, action) => {
        const movieId = action.payload;
        state.movies = state.movies.filter(movie => movie._id !== movieId);
        if (state.currentMovie && state.currentMovie._id === movieId) {
          state.currentMovie = null;
        }
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentMovie,
  clearCurrentMovie,
  updateMovieInList,
  removeMovieFromList,
} = movieSlice.actions;

export default movieSlice.reducer;
