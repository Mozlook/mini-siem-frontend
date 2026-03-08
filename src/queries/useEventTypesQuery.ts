import { useQuery } from "@tanstack/react-query";
import { getEventTypes } from "../api/siem";

export function useEventTypesQuery(app?: string) {
  return useQuery({
    queryKey: ["event-types", app ?? ""],
    queryFn: () => getEventTypes(app),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
}
