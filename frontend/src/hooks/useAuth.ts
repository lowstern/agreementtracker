import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { AuthState } from '../types';

const STORAGE_KEY = 'auth_token';
const DEMO_EMAIL = 'demo@agreement-tracker.com';
const DEMO_PASSWORD = 'Demo123!';

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
      // Try to use existing token
      api.getCurrentUser()
        .then((user) => {
          setAuthState({
            user,
            token,
            isAuthenticated: true,
          });
          setLoading(false);
        })
        .catch(() => {
          // Token invalid, auto-login with demo credentials
          localStorage.removeItem(STORAGE_KEY);
          autoLoginDemo();
        });
    } else {
      // No token, auto-login with demo credentials
      autoLoginDemo();
    }

    async function autoLoginDemo() {
      try {
        const { token: newToken, user } = await api.login(DEMO_EMAIL, DEMO_PASSWORD);
        localStorage.setItem(STORAGE_KEY, newToken);
        setAuthState({
          user,
          token: newToken,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error('Auto-login failed:', error);
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      } finally {
        setLoading(false);
      }
    }
  }, []);

  return {
    ...authState,
    loading,
  };
}
