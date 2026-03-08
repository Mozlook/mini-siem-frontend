import { useMemo, useState } from "react";
import { ApiError } from "../api/errors";
import JsonCard from "../components/JsonCard";
import { useReadyQuery } from "../queries/useReadyQuery";

type Badge = "ok" | "warn" | "error" | "neutral";

function badgeClass(kind: Badge): string {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1";
  if (kind === "ok")
    return `${base} bg-emerald-950/40 text-emerald-200 ring-emerald-900/40`;
  if (kind === "warn")
    return `${base} bg-amber-950/40 text-amber-200 ring-amber-900/40`;
  if (kind === "error")
    return `${base} bg-red-950/40 text-red-200 ring-red-900/40`;
  return `${base} bg-slate-950/40 text-slate-200 ring-slate-800`;
}

function formatWhen(tsMs: number): string {
  if (!tsMs) return "—";
  const d = new Date(tsMs);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function errorPayload(err: unknown) {
  if (err instanceof ApiError) {
    return {
      status: err.status,
      message: err.message,
      detail: err.detail,
      url: err.url,
    };
  }
  return { message: "Request failed." };
}

export default function StatusPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [intervalMs, setIntervalMs] = useState(7000);

  const query = useReadyQuery(autoRefresh ? intervalMs : false);

  const badge = useMemo<Badge>(() => {
    if (query.isPending) return "neutral";
    if (query.isSuccess) {
      const okVal = (query.data as any)?.ok;
      if (typeof okVal === "boolean" && okVal === false) return "warn";
      return "ok";
    }
    return "error";
  }, [query.isPending, query.isSuccess, query.data]);

  const label = useMemo(() => {
    if (query.isPending) return "Checking";
    if (query.isSuccess) {
      const okVal = (query.data as any)?.ok;
      if (typeof okVal === "boolean" && okVal === false) return "Degraded";
      return "Ready";
    }
    if (query.error instanceof ApiError && query.error.status === 503)
      return "Not ready";
    return "Error";
  }, [query.isPending, query.isSuccess, query.data, query.error]);

  const lastUpdateMs = query.isSuccess
    ? query.dataUpdatedAt
    : query.errorUpdatedAt;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Status</h1>
          <p className="mt-1 text-sm text-slate-400">
            Readiness check for database and ingestor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950/40"
            />
            Auto-refresh
          </label>

          <select
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            disabled={!autoRefresh}
            className="rounded-md border border-slate-800 bg-slate-950/40 px-2 py-1 text-sm text-slate-200 disabled:opacity-60"
          >
            <option value={5000}>5s</option>
            <option value={7000}>7s</option>
            <option value={10000}>10s</option>
          </select>

          <button
            type="button"
            onClick={() => query.refetch()}
            className="inline-flex items-center rounded-md border border-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-200 hover:bg-slate-900"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={badgeClass(badge)}>{label}</span>

            {query.error instanceof ApiError ? (
              <span className="text-sm text-slate-400">
                HTTP {query.error.status}
              </span>
            ) : null}

            {query.isFetching ? (
              <span className="text-sm text-slate-400">Refreshing...</span>
            ) : null}
          </div>

          <div className="text-sm text-slate-400">
            Last update:
            <span className="text-slate-200">{formatWhen(lastUpdateMs)}</span>
          </div>
        </div>
      </div>

      <JsonCard
        title="Raw response"
        value={query.isSuccess ? query.data : errorPayload(query.error)}
      />
    </div>
  );
}
