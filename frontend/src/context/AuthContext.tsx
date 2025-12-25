import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api, User, LoginRequest, ApiError } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: ApiError | null;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refreshUser = useCallback(async () => {
    if (!api.isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await api.getMe();
      setUser(userData);
      setError(null);
    } catch (err) {
      setUser(null);
      // Only set error if it's not an auth error (user just not logged in)
      if ((err as ApiError).error !== 'unauthorized') {
        setError(err as ApiError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (request: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.login(request);
      setUser(response.user);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await api.logout();
    } catch (err) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        logout,
        refreshUser,
        clearError,
      }}
    >
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
