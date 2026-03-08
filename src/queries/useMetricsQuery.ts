import { useQuery } from "@tanstack/react-query";
import { getMetrics } from "../api/siem";

export function useMetricsQuery(enabled = true) {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: getMetrics,
    enabled,
    refetchInterval: 7_000,
  });
}
