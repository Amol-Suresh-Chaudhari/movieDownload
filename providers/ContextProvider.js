'use client';
import { AppProvider } from '../contexts/AppContext';
import { MovieProvider } from '../contexts/MovieContext';

export default function ContextProvider({ children }) {
  return (
    <AppProvider>
      <MovieProvider>
        {children}
      </MovieProvider>
    </AppProvider>
  );
}
