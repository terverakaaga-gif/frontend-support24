import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking auth
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // Not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If the user hasn't verified their email
  if (!user.isEmailVerified) {
    return <Navigate to="/register" replace />;
  }
  
  // If the user is a support worker who hasn't completed onboarding
  if (user.role === 'support-worker' && !user.isOnboarded) {
    return <Navigate to="/support-worker-setup" replace />;
  }
  
  // Check if the user has the required role
  if (!allowedRoles.includes(user.role)) {
    // Determine where to redirect based on user's role
    let redirectPath;
    
    switch (user.role) {
      case 'admin':
        redirectPath = '/admin';
        break;
      case 'guardian':
        redirectPath = '/guardian';
        break;
      case 'participant':
        redirectPath = '/participant';
        break;
      case 'support-worker':
        redirectPath = '/support-worker';
        break;
      default:
        redirectPath = '/login';
    }
    
    // Only redirect if not already on the target path to prevent loops
    if (location.pathname !== redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }
  }
  
  // User is authenticated and has the required role
  return <>{children}</>;
}