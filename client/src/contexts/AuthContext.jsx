// client/src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { validateSessionApi } from '@/features/auth/session/api/sessionApi';
import { logoutApi } from '@/features/auth/logout/api/logoutApi';
import { loginApi } from '@/features/auth/login/api/loginApi';
import { resetCsrfToken } from '@/common/services/csrfService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        const response = await validateSessionApi();
        if (isMounted) {
          setUser(response.data?.user || null);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
          // Only set error if it's not a 401 on signup page
          if (!(err.response?.status === 401 && window.location.pathname === '/signup')) {
            setError(err.message);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      const { user } = await loginApi(credentials);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      resetCsrfToken();
      localStorage.removeItem('auth_initialized');
      setUser(null);
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}