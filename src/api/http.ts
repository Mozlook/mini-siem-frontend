import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config/env";
import { clearToken, getToken } from "../lib/token";
import { ApiError } from "./errors";
import { emitLogout } from "../auth/authEvents";
import toast from "react-hot-toast";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    (config.headers as any) = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status ?? 0;

    const hadToken = !!getToken();

    const base = String(err.config?.baseURL ?? "");
    const path = String(err.config?.url ?? "");
    const url = `${base}${path}`;

    const isOps = url.includes("/ready") || url.includes("/metrics");

    if (status === 0) {
      toast.error("Network error. Please check your connection.", {
        id: "net:offline",
      });
    }

    if (status === 401 && hadToken) {
      toast.error("Session expired. Please sign in again.", { id: "auth:401" });

      clearToken();
      emitLogout("401");
    }

    if (status >= 500 && !isOps) {
      toast.error(`Server error (HTTP ${status}). Please try again later.`, {
        id: `srv:${status}`,
      });
    }

    const data = err.response?.data as any;
    const message =
      typeof data?.detail === "string"
        ? data.detail
        : typeof data === "string"
          ? data
          : err.message || `HTTP ${status}`;

    return Promise.reject(
      new ApiError({
        message,
        status,
        url,
        detail: data,
      }),
    );
  },
);
