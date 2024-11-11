// client/src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer, useEffect, useRef, useMemo } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  initialized: false
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
        loading: false,
        initialized: true
      };
    case 'AUTH_INIT_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        initialized: true
      };
    case 'AUTH_INIT_COMPLETE':
      return {
        ...state,
        loading: false,
        initialized: true
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
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    
    async function initAuth() {
      const hasInitialized = localStorage.getItem('auth_initialized');
      
      if (hasInitialized === 'true') {
        dispatch({ type: 'AUTH_INIT_COMPLETE' });
        return;
      }

      dispatch({ type: 'AUTH_INIT_START' });
      
      try {
        const data = await authService.validateSession();
        
        if (!mounted.current) return;
        
        localStorage.setItem('auth_initialized', 'true');
        
        if (data?.user) {
          dispatch({ type: 'AUTH_INIT_SUCCESS', payload: data.user });
        } else {
          dispatch({ type: 'AUTH_INIT_COMPLETE' });
        }
      } catch (error) {
        if (!mounted.current) return;
        
        localStorage.setItem('auth_initialized', 'true');
        
        if (error.response?.status === 401) {
          dispatch({ type: 'AUTH_INIT_COMPLETE' });
        } else {
          dispatch({ type: 'AUTH_INIT_ERROR' });
        }
      }
    }

    initAuth();

    return () => {
      mounted.current = false;
    };
  }, []);

  const value = useMemo(() => ({
    ...state,
    login: async (credentials) => {
      try {
        const { user } = await authService.login(credentials);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return user;
      } catch (error) {
        dispatch({ type: 'LOGIN_ERROR', payload: error.message });
        throw error;
      }
    },
    logout: async () => {
      try {
        await authService.logout();
        localStorage.removeItem('auth_initialized');
        dispatch({ type: 'LOGOUT' });
      } catch (error) {
        dispatch({ type: 'LOGOUT' });
        throw error;
      }
    }
  }), [state]);

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