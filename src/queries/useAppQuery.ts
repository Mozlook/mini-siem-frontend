import { useQuery } from "@tanstack/react-query";
import { getApps } from "../api/siem";

export function useAppsQuery() {
  return useQuery({
    queryKey: ["apps"],
    queryFn: getApps,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}
