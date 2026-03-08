import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "../api/siem";
import type { MetricsResponse } from "../api/types";

export function useMetricsQuery(refetchIntervalMs: number | false = 7000) {
  return useQuery<MetricsResponse>({
    queryKey: ["metrics"],
    queryFn: getMetrics,
    refetchInterval: refetchIntervalMs,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
