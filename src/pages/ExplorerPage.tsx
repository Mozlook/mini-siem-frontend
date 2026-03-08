import { useMemo, useState } from "react";

import { ApiError } from "../api/errors";
import type { EventListItem } from "../api/types";

import { useAppsQuery } from "../queries/useAppQuery";
import { useEventTypesQuery } from "../queries/useEventTypesQuery";
import { useEventsInfiniteQuery } from "../queries/useEventsInfiniteQuery";

import FiltersPanel from "../features/explorer/FilterPanel";
import ResultsPanel from "../features/explorer/ResultPanel";
import EventDetailsDrawer from "../features/explorer/EventDetailDrawer";

import { filtersToEventsQueryParams } from "../features/explorer/filters";
import { useExplorerState } from "../features/explorer/useExplorerState";

function errorToText(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 0) return "Network error. Please try again.";
    if (err.status === 400) return "Invalid filters. Please review your input.";
    if (err.status === 503)
      return "Service unavailable. Please try again later.";
    return `Request failed (HTTP ${err.status}).`;
  }
  return "Request failed. Please try again.";
}

function flattenAndDedupe(pages: EventListItem[][]): EventListItem[] {
  const map = new Map<number, EventListItem>();
  for (const page of pages) {
    for (const item of page) if (!map.has(item.id)) map.set(item.id, item);
  }
  return Array.from(map.values());
}

export default function ExplorerPage() {
  const explorer = useExplorerState();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const appsQuery = useAppsQuery();

  const singleApp =
    explorer.draft.app.length === 1 ? explorer.draft.app[0] : undefined;
  const eventTypesQuery = useEventTypesQuery(singleApp);

  const appliedParams = useMemo(
    () => filtersToEventsQueryParams(explorer.applied),
    [explorer.applied],
  );

  const eventsQuery = useEventsInfiniteQuery(appliedParams);

  const items = useMemo(() => {
    const pages = eventsQuery.data?.pages ?? [];
    return flattenAndDedupe(pages);
  }, [eventsQuery.data]);

  const appsErrorText = appsQuery.isError ? errorToText(appsQuery.error) : null;
  const eventTypesErrorText = eventTypesQuery.isError
    ? errorToText(eventTypesQuery.error)
    : null;
  const eventsErrorText = eventsQuery.isError
    ? errorToText(eventsQuery.error)
    : null;

  const onApply = () => {
    explorer.apply();
    setSelectedEventId(null);
  };

  const onReset = () => {
    explorer.reset();
    setSelectedEventId(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[340px_1fr]">
        <FiltersPanel
          draft={explorer.draft}
          setDraft={explorer.setDraft}
          apps={appsQuery.data ?? []}
          appsLoading={appsQuery.isPending}
          appsErrorText={appsErrorText}
          eventTypes={eventTypesQuery.data ?? []}
          eventTypesLoading={eventTypesQuery.isPending}
          eventTypesErrorText={eventTypesErrorText}
        />

        <ResultsPanel
          isDirty={explorer.isDirty}
          onApply={onApply}
          onReset={onReset}
          onCopyLink={explorer.copyLink}
          copyState={explorer.copyState}
          items={items}
          isInitialLoading={eventsQuery.isPending}
          errorText={eventsErrorText}
          hasNextPage={!!eventsQuery.hasNextPage}
          isLoadingMore={eventsQuery.isFetchingNextPage}
          onLoadMore={() => eventsQuery.fetchNextPage()}
          selectedId={selectedEventId}
          onRowClick={(item) => setSelectedEventId(item.id)}
        />
      </div>

      <EventDetailsDrawer
        eventId={selectedEventId}
        onClose={() => setSelectedEventId(null)}
      />
    </>
  );
}
