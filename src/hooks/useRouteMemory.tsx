
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useRouteMemory = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user && location.pathname !== '/login') {
      // Only store routes that belong to the current user's role
      const isValidRouteForRole = location.pathname.startsWith(`/${user.role === 'supportWorker' ? 'support-worker' : user.role}`);
      
      if (isValidRouteForRole) {
        sessionStorage.setItem("returnUrl", location.pathname);
        sessionStorage.setItem("lastUserRole", user.role);
      }
    }
  }, [location.pathname, user]);
};