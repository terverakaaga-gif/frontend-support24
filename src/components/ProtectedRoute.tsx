import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import Loader from './Loader';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Save the attempted location for redirecting after login
  useEffect(() => {
    if (!user && !isLoading) {
      // Store the full path including search params
      const returnUrl = `${location.pathname}${location.search}${location.hash}`;
      sessionStorage.setItem('returnUrl', returnUrl);
    }
  }, [user, isLoading, location]);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <Loader type='bounce'/>
    );
  }
  
  // Not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If the user hasn't verified their email, redirect to OTP verification
  if (!user.isEmailVerified) {
    return <Navigate to="/otp-verify" state={{ email: user.email, userId: user._id }} replace />;
  }
  
  // Check if the user has the required role
  if (!allowedRoles.includes(user.role)) {
    // Determine where to redirect based on user's role
    const getRoleBasedPath = () => {
      switch (user.role) {
        case 'admin':
          return '/admin';
        case 'guardian':
          return '/guardian';
        case 'participant':
          return '/participant';
        case 'supportWorker':
          return '/support-worker';
        default:
          return '/login';
      }
    };
    
    const redirectPath = getRoleBasedPath();
    
    // Only redirect if not already on the target path to prevent loops
    if (!location.pathname.startsWith(redirectPath)) {
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  // User is authenticated and has the required role
  return <>{children}</>;
}