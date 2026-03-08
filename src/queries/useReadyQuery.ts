import { useQuery } from "@tanstack/react-query";
import { getReady } from "../api/siem";
import type { ReadyResponse } from "../api/types";

export function useReadyQuery(refetchIntervalMs: number | false = 7000) {
  return useQuery<ReadyResponse>({
    queryKey: ["ready"],
    queryFn: getReady,
    refetchInterval: refetchIntervalMs,
    retry: 0,
    refetchOnWindowFocus: false,
  });
}
