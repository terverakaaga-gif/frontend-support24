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

  // If the user hasn't verified their email and isn't in the process of verifying
  // Only redirect if not already on the registration page to prevent loops
  if (!user.isEmailVerified && location.pathname !== "/register") {
    return <Navigate to="/register" replace />;
  }

  // If the user hasn't completed onboarding (support worker only)
  // Only redirect if not already on the registration page to prevent loops
  if (user.role === 'support-worker' && !user.isOnboarded && location.pathname !== "/register") {
    return <Navigate to="/register" replace />;
  }

  // Check if the user has the required role
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    // Only redirect if not already on the target path to prevent loops
    switch (user.role) {
      case 'admin':
        return location.pathname !== "/admin" ? <Navigate to="/admin" replace /> : <>{children}</>;
      case 'guardian':
        return location.pathname !== "/guardian" ? <Navigate to="/guardian" replace /> : <>{children}</>;
      case 'participant':
        return location.pathname !== "/participant" ? <Navigate to="/participant" replace /> : <>{children}</>;
      case 'support-worker':
        return location.pathname !== "/support-worker" ? <Navigate to="/support-worker" replace /> : <>{children}</>;
      default:
        return location.pathname !== "/login" ? <Navigate to="/login" replace /> : <>{children}</>;
    }
  }

  // User is authenticated, has verified email, completed onboarding (if required), and has the required role
  return <>{children}</>;
}