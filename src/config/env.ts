const DEFAULT_DEV_BASE_URL = "http://localhost:8000";

function normalizeBaseUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, "");
}

export const API_BASE_URL: string = (() => {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (!raw || raw.trim().length === 0) {
    if (import.meta.env.DEV) return DEFAULT_DEV_BASE_URL;
    throw new Error("VITE_API_BASE_URL is not set");
  }

  return normalizeBaseUrl(raw);
})();
