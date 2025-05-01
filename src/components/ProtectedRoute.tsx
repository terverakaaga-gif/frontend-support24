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
  
  // For support workers who haven't completed onboarding, we don't redirect
  // We'll show a warning banner instead (in their dashboard component)
  // This allows them to access their dashboard without being forced to complete setup
  
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
      case 'supportWorker':
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