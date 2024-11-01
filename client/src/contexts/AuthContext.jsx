// client/src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_INIT_START':
      return { ...state, loading: true };
    case 'AUTH_INIT_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_INIT_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    async function initAuth() {
      dispatch({ type: 'AUTH_INIT_START' });
      try {
        const user = await authService.validateSession();
        if (user) {
          dispatch({ type: 'AUTH_INIT_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'AUTH_INIT_ERROR' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_INIT_ERROR' });
      }
    }
    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const user = await authService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return user;
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};