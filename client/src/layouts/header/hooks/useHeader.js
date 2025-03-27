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
      navigate('/login');
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