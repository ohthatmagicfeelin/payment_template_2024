import { useNavigate } from 'react-router-dom';
import { logoutApi } from '../api/logoutApi';
import { resetCsrfToken } from '@/common/services/csrfService';

export function useLogout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
      // Reset the CSRF token cache
      resetCsrfToken();
      // Navigate to login page
      navigate('/login', { 
        replace: true,
        state: { 
          message: 'You have been logged out successfully.',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we should still try to navigate to login
      navigate('/login', { replace: true });
    }
  };

  return { handleLogout };
} 