import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/state/auth.store';

export const useAuthGuard = () => {
  const { isAuthenticated, hydrateFromStorage } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Hydrate auth state from storage on mount
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return { isAuthenticated };
};

export const useRedirectIfAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return { isAuthenticated };
};
