import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../config/env";
import { clearToken, getToken } from "../lib/token";
import { ApiError } from "./errors";
import { emitLogout } from "../auth/authEvents";

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

    if (status === 401 && getToken()) {
      clearToken();
      emitLogout("401");
    }

    const url = `${err.config?.baseURL ?? ""}${err.config?.url ?? ""}`;

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
