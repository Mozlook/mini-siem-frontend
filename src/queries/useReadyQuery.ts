import { useQuery } from "@tanstack/react-query";
import { getReady } from "../api/siem";

export function useReadyQuery(enabled = true) {
  return useQuery({
    queryKey: ["ready"],
    queryFn: getReady,
    enabled,
    refetchInterval: 7_000,
    retry: 0,
  });
}
