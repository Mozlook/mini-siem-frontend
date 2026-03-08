import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { clearToken, getToken, setToken as persistToken } from "../lib/token";
import { subscribeLogout } from "./authEvents";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  setAuthToken: (token: string | null) => void;
  logout: (opts?: { redirect?: boolean }) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [token, setTokenState] = useState<string | null>(() => getToken());

  const setAuthToken = useCallback((newToken: string | null) => {
    if (newToken) {
      persistToken(newToken);
      setTokenState(newToken);
    } else {
      clearToken();
      setTokenState(null);
    }
  }, []);

  const logout = useCallback(
    (opts?: { redirect?: boolean }) => {
      clearToken();
      setTokenState(null);

      queryClient.clear();

      if (opts?.redirect !== false) {
        navigate("/login", { replace: true });
      }
    },
    [navigate, queryClient],
  );

  useEffect(() => {
    return subscribeLogout(() => logout({ redirect: true }));
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: !!token,
      setAuthToken,
      logout,
    }),
    [token, setAuthToken, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
