import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { AuthState } from '../types';

const STORAGE_KEY = 'auth_token';
const DEMO_EMAIL = 'demo@agreement-tracker.com';
const DEMO_PASSWORD = 'Demo123!';
const AUTH_TIMEOUT_MS = 3000; // Fall back to demo mode after 3 seconds

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

// Helper to add timeout to promises
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), ms)
    ),
  ]);
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: safeGetItem(STORAGE_KEY),
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const token = safeGetItem(STORAGE_KEY);
      
      if (token) {
        // Try to use existing token with timeout
        try {
          const user = await withTimeout(api.getCurrentUser(), AUTH_TIMEOUT_MS);
          if (isMounted) {
            setAuthState({ user, token, isAuthenticated: true });
            setLoading(false);
          }
          return;
        } catch {
          // Token invalid or timeout, try auto-login
          safeRemoveItem(STORAGE_KEY);
        }
      }

      // Try auto-login with timeout
      try {
        const { token: newToken, user } = await withTimeout(
          api.login(DEMO_EMAIL, DEMO_PASSWORD),
          AUTH_TIMEOUT_MS
        );
        if (isMounted) {
          safeSetItem(STORAGE_KEY, newToken);
          setAuthState({ user, token: newToken, isAuthenticated: true });
        }
      } catch {
        // Backend unavailable or timeout - use demo user fallback immediately
        console.log('Backend unavailable or timeout, using demo mode');
        if (isMounted) {
          setAuthState({ user: DEMO_USER, token: 'demo-mode', isAuthenticated: true });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...authState,
    loading,
  };
}
