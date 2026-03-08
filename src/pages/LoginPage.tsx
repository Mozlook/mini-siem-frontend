import { useEffect, useMemo, useState } from "react";
import type { SyntheticEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/siem";
import { ApiError } from "../api/errors";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");

  const fromLocation = (location.state as any)?.from;
  const redirectTo = useMemo(() => {
    const pathname = fromLocation?.pathname ?? "/";
    const search = fromLocation?.search ?? "";
    return `${pathname}${search}`;
  }, [fromLocation]);

  useEffect(() => {
    if (auth.isAuthenticated) navigate(redirectTo, { replace: true });
  }, [auth.isAuthenticated, navigate, redirectTo]);

  const mutation = useMutation({
    mutationFn: (pwd: string) => login(pwd),
    onSuccess: (data) => {
      auth.setAuthToken(data.access_token);
      navigate(redirectTo, { replace: true });
    },
  });

  const errorText = useMemo(() => {
    if (!mutation.error) return null;

    if (mutation.error instanceof ApiError) {
      if (mutation.error.status === 401) return "Invalid password.";
      if (mutation.error.status === 0)
        return "Network error. Please try again.";
      return `Login failed (HTTP ${mutation.error.status}).`;
    }

    return "Login failed. Please try again.";
  }, [mutation.error]);

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const pwd = password.trim();
    if (!pwd) return;
    mutation.mutate(pwd);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm backdrop-blur">
        <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-1 text-sm text-slate-400">
          Enter the admin password to access the dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300">
              Admin password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending || password.trim().length === 0}
            className="w-full rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </button>

          {errorText ? (
            <div className="rounded-md border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {errorText}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}
