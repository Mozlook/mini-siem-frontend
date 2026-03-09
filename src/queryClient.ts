import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api/errors";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,

      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          if (error.status === 400) return false;
          if (error.status === 401 || error.status === 403) return false;
        }
        return failureCount < 2;
      },

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
    },

    mutations: {
      retry: 0,
    },
  },
});
