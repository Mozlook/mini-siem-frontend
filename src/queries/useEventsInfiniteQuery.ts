import { useInfiniteQuery } from "@tanstack/react-query";
import { getEvents } from "../api/siem";
import type { EventsQueryParams } from "../api/query";
import type { EventListItem } from "../api/types";

type Cursor = { before_ts: string; before_id: number } | null;

function nextCursorFromPage(page: EventListItem[], limit?: number): Cursor {
  if (limit && page.length < limit) return null;
  const last = page[page.length - 1];
  if (!last) return null;
  return { before_ts: last.ts, before_id: last.id };
}

export function useEventsInfiniteQuery(applied: EventsQueryParams) {
  const limit = applied.limit ?? 200;

  return useInfiniteQuery({
    queryKey: ["events", applied],
    initialPageParam: null as Cursor,
    queryFn: ({ pageParam }) => {
      const params: EventsQueryParams = {
        ...applied,
        ...(pageParam ? pageParam : {}),
      };
      return getEvents(params);
    },
    getNextPageParam: (lastPage) =>
      nextCursorFromPage(lastPage, limit) ?? undefined,
  });
}
