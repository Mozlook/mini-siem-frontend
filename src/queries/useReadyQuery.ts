import { useQuery } from "@tanstack/react-query";
import { getReady } from "../api/siem";
import type { ReadyResponse } from "../api/types";
import { ApiError } from "../api/errors";

export function useReadyQuery(refetchIntervalMs: number | false = 7000) {
  return useQuery<ReadyResponse>({
    queryKey: ["ready"],
    queryFn: getReady,
    refetchInterval: refetchIntervalMs,
    refetchOnWindowFocus: false,

    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        if (error.status === 503) return false;
        if (error.status === 401 || error.status === 403) return false;
        if (error.status === 400) return false;
      }
      return failureCount < 2;
    },

    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000),
  });
}
