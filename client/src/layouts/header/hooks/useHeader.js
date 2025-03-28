import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/common/hooks/useTheme';
import { useNavigate } from 'react-router-dom';

export function useHeader() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Force a small delay to ensure the server has completed session cleanup
      // and CSRF token is properly reset
      await new Promise(resolve => setTimeout(resolve, 200));
      // Clear any cached data
      localStorage.clear();
      sessionStorage.clear();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user,
    isDarkMode,
    toggleTheme,
    handleLogout
  };
} 