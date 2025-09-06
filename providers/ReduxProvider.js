'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={<LoadingSpinner size="large" text="Loading application..." />} 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
