import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { AuthState } from '../types';

const STORAGE_KEY = 'auth_token';
const DEMO_EMAIL = 'demo@agreement-tracker.com';
const DEMO_PASSWORD = 'Demo123!';

// Demo user fallback when backend is unavailable
const DEMO_USER = {
  email: 'demo@agreement-tracker.com',
  displayName: 'Demo User',
};

// Safe localStorage helpers for corporate/restricted environments
function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage unavailable - token won't persist but app will still work
  }
}

function safeRemoveItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // localStorage unavailable
  }
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: safeGetItem(STORAGE_KEY),
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = safeGetItem(STORAGE_KEY);
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
          // Token invalid, try auto-login
          safeRemoveItem(STORAGE_KEY);
          autoLoginDemo();
        });
    } else {
      // No token, try auto-login
      autoLoginDemo();
    }

    async function autoLoginDemo() {
      try {
        const { token: newToken, user } = await api.login(DEMO_EMAIL, DEMO_PASSWORD);
        safeSetItem(STORAGE_KEY, newToken);
        setAuthState({
          user,
          token: newToken,
          isAuthenticated: true,
        });
      } catch {
        // Backend unavailable - use demo user fallback
        console.log('Backend unavailable, using demo mode');
        setAuthState({
          user: DEMO_USER,
          token: 'demo-mode',
          isAuthenticated: true,
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
