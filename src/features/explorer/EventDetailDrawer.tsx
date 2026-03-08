import { useEffect, useMemo } from "react";
import { ApiError } from "../../api/errors";
import JsonBlock from "./JsonBlock";
import CoreFieldsTable from "./CoreFieldsTable";
import { useEventDetailsQuery } from "../../queries/useEventDetailsQuery";

function errorToText(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 0) return "Network error. Please try again.";
    if (err.status === 404) return "Event not found.";
    return `Request failed (HTTP ${err.status}).`;
  }
  return "Request failed. Please try again.";
}

type Props = {
  eventId: number | null;
  onClose: () => void;
};

export default function EventDetailsDrawer({ eventId, onClose }: Props) {
  const isOpen = typeof eventId === "number";

  const query = useEventDetailsQuery(eventId);

  const title = useMemo(() => {
    if (!isOpen) return "";
    return `Event details`;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-3xl border-l border-slate-800 bg-slate-950 text-slate-100 shadow-xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="mt-1 text-xs text-slate-400">
              {typeof eventId === "number" ? `ID: ${eventId}` : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md border border-slate-700 px-2 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-900"
          >
            Close
          </button>
        </div>

        <div className="h-[calc(100%-52px)] overflow-auto p-4">
          {query.isPending ? (
            <div className="space-y-3">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-800/60" />
              <div className="h-24 animate-pulse rounded bg-slate-900/40" />
              <div className="h-24 animate-pulse rounded bg-slate-900/40" />
            </div>
          ) : query.isError ? (
            <div className="rounded-lg border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {errorToText(query.error)}
            </div>
          ) : query.data ? (
            <div className="space-y-4">
              <CoreFieldsTable event={query.data} />

              <section className="rounded-lg border border-slate-800 bg-slate-950/30">
                <div className="border-b border-slate-800 px-3 py-2">
                  <div className="text-sm font-semibold text-slate-200">
                    Source
                  </div>
                </div>
                <div className="p-3 text-sm">
                  <div className="grid grid-cols-1 gap-2">
                    <div>
                      <div className="text-xs text-slate-400">source_file</div>
                      <div className="mt-1 wrap-break-words text-slate-200">
                        {query.data.source_file ?? "—"}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-slate-400">
                        source_offset
                      </div>
                      <div className="mt-1 text-slate-200">
                        {query.data.source_offset ?? "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <JsonBlock title="Raw JSON" value={query.data.raw_json} />
              <JsonBlock title="Data JSON" value={query.data.data_json} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
