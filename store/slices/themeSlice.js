import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: 'dark', // 'light' or 'dark'
    colors: {
      primary: '#3B82F6',
      accent: '#10B981',
      background: '#1F2937',
      card: '#374151',
      text: '#F9FAFB',
    },
    settings: {
      enableAnimations: true,
      compactMode: false,
      autoRefresh: true,
      refreshInterval: 30000,
    },
    presets: [
      { name: 'Blue Ocean', primary: '#3B82F6', accent: '#10B981' },
      { name: 'Purple Night', primary: '#8B5CF6', accent: '#F59E0B' },
      { name: 'Red Fire', primary: '#EF4444', accent: '#F97316' },
      { name: 'Green Forest', primary: '#10B981', accent: '#3B82F6' },
      { name: 'Pink Sunset', primary: '#EC4899', accent: '#8B5CF6' },
      { name: 'Orange Glow', primary: '#F97316', accent: '#EF4444' }
    ],
  },
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      // Apply theme to document
      if (typeof window !== 'undefined') {
        document.documentElement.classList.toggle('dark', action.payload === 'dark');
      }
    },
    setThemeColors: (state, action) => {
      state.colors = { ...state.colors, ...action.payload };
      // Apply colors to CSS variables
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        Object.entries(action.payload).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value);
        });
      }
    },
    setThemeSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    applyPreset: (state, action) => {
      const preset = action.payload;
      state.colors.primary = preset.primary;
      state.colors.accent = preset.accent;
      
      // Apply to CSS variables
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', preset.primary);
        root.style.setProperty('--color-accent', preset.accent);
      }
    },
    resetTheme: (state) => {
      state.mode = 'dark';
      state.colors = {
        primary: '#3B82F6',
        accent: '#10B981',
        background: '#1F2937',
        card: '#374151',
        text: '#F9FAFB',
      };
      state.settings = {
        enableAnimations: true,
        compactMode: false,
        autoRefresh: true,
        refreshInterval: 30000,
      };
      
      // Reset CSS variables
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', '#3B82F6');
        root.style.setProperty('--color-accent', '#10B981');
        root.style.setProperty('--color-background', '#1F2937');
        root.style.setProperty('--color-card', '#374151');
        root.style.setProperty('--color-text', '#F9FAFB');
        document.documentElement.classList.add('dark');
      }
    },
    loadThemeFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme-settings');
        if (savedTheme) {
          const parsed = JSON.parse(savedTheme);
          state.mode = parsed.mode || 'dark';
          state.colors = { ...state.colors, ...parsed.colors };
          state.settings = { ...state.settings, ...parsed.settings };
          
          // Apply to DOM
          document.documentElement.classList.toggle('dark', state.mode === 'dark');
          const root = document.documentElement;
          Object.entries(state.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
          });
        }
      }
    },
    saveThemeToStorage: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-settings', JSON.stringify({
          mode: state.mode,
          colors: state.colors,
          settings: state.settings,
        }));
      }
    },
  },
});

export const {
  setThemeMode,
  setThemeColors,
  setThemeSettings,
  applyPreset,
  resetTheme,
  loadThemeFromStorage,
  saveThemeToStorage,
} = themeSlice.actions;

export default themeSlice.reducer;
