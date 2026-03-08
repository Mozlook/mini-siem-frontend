import { useQuery } from "@tanstack/react-query";
import { getEvent } from "../api/siem";
import type { EventDetail } from "../api/types";

export function useEventDetailsQuery(eventId: number | null) {
  return useQuery<EventDetail>({
    queryKey: ["event", eventId],
    queryFn: () => getEvent(eventId!),
    enabled: typeof eventId === "number",
    staleTime: 60_000,
    retry: 1,
  });
}
