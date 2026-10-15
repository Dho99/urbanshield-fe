"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService, type BackendUserOut } from "@/lib/api/services/auth.service";

const TOKEN_KEY = "urbanshield_token";
const USER_KEY = "urbanshield_user";

function readStored(): { token: string | null; user: BackendUserOut | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  try {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const rawUser = window.localStorage.getItem(USER_KEY);
    return {
      token,
      user: rawUser ? (JSON.parse(rawUser) as BackendUserOut) : null,
    };
  } catch {
    return { token: null, user: null };
  }
}

interface AuthContextValue {
  user: BackendUserOut | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<BackendUserOut | null>(() => readStored().user);
  const [token, setToken] = useState<string | null>(() => readStored().token);
  const [isLoading, setIsLoading] = useState<boolean>(() => readStored().token !== null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    authService
      .me()
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        window.localStorage.setItem(USER_KEY, JSON.stringify(me));
      })
      .catch(() => {
        if (cancelled) return;
        setToken(null);
        setUser(null);
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    await authService.login({ email, password });
    const me = await authService.me();
    setToken(window.localStorage.getItem(TOKEN_KEY));
    setUser(me);
    window.localStorage.setItem(USER_KEY, JSON.stringify(me));
  }, []);

  const register = useCallback(async (payload: { name: string; email: string; password: string; role: string }) => {
    await authService.register({
      email: payload.email,
      password: payload.password,
      full_name: payload.name,
      role: payload.role,
    });
    await login(payload.email, payload.password);
  }, [login]);

  const logout = useCallback(() => {
    authService.logout();
    if (typeof window !== "undefined") window.localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const me = await authService.me();
    setUser(me);
    window.localStorage.setItem(USER_KEY, JSON.stringify(me));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, isLoading, isAuthenticated: !!token && !!user, login, register, logout, refresh }),
    [user, token, isLoading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}
