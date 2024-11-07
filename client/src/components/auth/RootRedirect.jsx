import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or return a loading spinner if you prefer
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/signup'} replace />;
} 