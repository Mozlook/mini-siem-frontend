import type { EventListItem } from "../../api/types";
import EventsTable from "./EventsTable";

type CopyState = "idle" | "copied" | "failed";

type Props = {
  isDirty: boolean;
  onApply: () => void;
  onReset: () => void;
  onCopyLink: () => void;
  copyState: CopyState;

  items: EventListItem[];
  isInitialLoading: boolean;
  errorText: string | null;

  hasNextPage: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

export default function ResultsPanel(props: Props) {
  const {
    isDirty,
    onApply,
    onReset,
    onCopyLink,
    copyState,
    items,
    isInitialLoading,
    errorText,
    hasNextPage,
    isLoadingMore,
    onLoadMore,
  } = props;

  const statusText = isInitialLoading
    ? "Loading events..."
    : `Showing ${items.length} events`;

  const copyText =
    copyState === "copied"
      ? "Copied."
      : copyState === "failed"
        ? "Copy failed."
        : null;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40">
      {/* IMPORTANT: no overflow-hidden here, otherwise sticky behaves weirdly */}
      <div className="sticky top-14 z-10 flex flex-wrap items-center gap-2 rounded-t-xl border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
        <button
          type="button"
          onClick={onApply}
          disabled={!isDirty}
          className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-900 shadow-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center rounded-md border border-slate-700 bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-200 hover:bg-slate-900"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={onCopyLink}
          className="inline-flex items-center rounded-md border border-slate-700 bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-200 hover:bg-slate-900"
        >
          Copy link
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-3 text-xs">
          {errorText ? <span className="text-red-200">{errorText}</span> : null}
          <span className="text-slate-400">{statusText}</span>
          {copyText ? <span className="text-slate-400">{copyText}</span> : null}
        </div>
      </div>

      <div className="px-4 py-3">
        <EventsTable items={items} isInitialLoading={isInitialLoading} />

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {hasNextPage ? "More events available." : "End of results."}
          </div>

          <button
            type="button"
            onClick={onLoadMore}
            disabled={!hasNextPage || isLoadingMore}
            className="inline-flex items-center rounded-md border border-slate-700 bg-transparent px-3 py-1.5 text-sm font-semibold text-slate-200 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      </div>
    </section>
  );
}
