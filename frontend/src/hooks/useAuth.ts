import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import type { AuthState } from '../types';

const STORAGE_KEY = 'auth_token';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(STORAGE_KEY),
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      api.getCurrentUser()
        .then((user) => {
          setAuthState({
            user,
            token,
            isAuthenticated: true,
          });
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setAuthState({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.login(email, password);
    localStorage.setItem(STORAGE_KEY, token);
    setAuthState({
      user,
      token,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  }, []);

  return {
    ...authState,
    loading,
    login,
    logout,
  };
}
