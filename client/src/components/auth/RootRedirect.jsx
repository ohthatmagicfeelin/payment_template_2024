import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return <Navigate to={isAuthenticated ? '/' : '/signup'} replace />;
} 