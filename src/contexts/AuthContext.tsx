'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAdmin: boolean;
  username: string | null;
  token: string | null;
  login: (t: string, u: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'japan_surplus_admin_token';
const USERNAME_KEY = 'japan_surplus_admin_username';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const t = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (!t) {
      setToken(null);
      setUsername(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json();
      if (data.authenticated && data.username) {
        setToken(t);
        setUsername(data.username);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USERNAME_KEY);
        setToken(null);
        setUsername(null);
      }
    } catch {
      setToken(null);
      setUsername(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    const u = typeof window !== 'undefined' ? localStorage.getItem(USERNAME_KEY) : null;
    if (t && u) {
      setToken(t);
      setUsername(u);
    }
    checkAuth();
  }, [checkAuth]);

  const login = useCallback((t: string, u: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USERNAME_KEY, u);
    setToken(t);
    setUsername(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  const value: AuthContextType = {
    isAdmin: !!token && !!username,
    username,
    token,
    login,
    logout,
    checkAuth,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
