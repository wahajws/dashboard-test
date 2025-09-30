import React from 'react';
import { AppRouter } from './router';
import { useAuthStore } from '@/state/auth.store';
import { useUIStore } from '@/state/ui.store';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hydrateFromStorage } = useAuthStore();
  const { setTheme } = useUIStore();

  React.useEffect(() => {
    // Hydrate auth state from localStorage
    hydrateFromStorage();
    
    // Initialize theme
    const savedTheme = localStorage.getItem('ui-storage');
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        if (parsed.state?.theme) {
          setTheme(parsed.state.theme);
        }
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, [hydrateFromStorage, setTheme]);

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};
