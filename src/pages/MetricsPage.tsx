import { useMemo, useState } from "react";
import { ApiError } from "../api/errors";
import JsonCard from "../components/JsonCard";
import { useMetricsQuery } from "../queries/useMetricsQuery";

function formatWhen(tsMs: number): string {
  if (!tsMs) return "—";
  const d = new Date(tsMs);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString();
}

function getNumber(x: unknown): number | null {
  return typeof x === "number" && Number.isFinite(x) ? x : null;
}

function pickStats(metrics: any) {
  const totalInserted = getNumber(metrics?.total_inserted);
  const jsonErrors = getNumber(metrics?.stats?.json_errors);
  const validationErrors = getNumber(metrics?.stats?.validation_errors);
  return { totalInserted, jsonErrors, validationErrors };
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

export default function MetricsPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [intervalMs, setIntervalMs] = useState(7000);

  const query = useMetricsQuery(autoRefresh ? intervalMs : false);

  const startedAt = (query.data as any)?.started_at ?? null;
  const metricsLast = (query.data as any)?.metrics_last ?? null;
  const metricsTotal = (query.data as any)?.metrics_total ?? null;

  const totalStats = useMemo(() => pickStats(metricsTotal), [metricsTotal]);
  const lastStats = useMemo(() => pickStats(metricsLast), [metricsLast]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Metrics</h1>
          <p className="mt-1 text-sm text-slate-400">
            Ingestion counters and error rates.
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
          <div className="text-sm text-slate-400">
            Started at:
            <span className="text-slate-200">{startedAt ?? "—"}</span>
          </div>

          <div className="text-sm text-slate-400">
            Last update:
            <span className="text-slate-200">
              {formatWhen(
                query.isSuccess ? query.dataUpdatedAt : query.errorUpdatedAt,
              )}
            </span>
          </div>
        </div>

        {query.isError && query.error ? (
          <div className="mt-3 rounded-lg border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {query.error instanceof ApiError
              ? `Request failed (HTTP ${query.error.status}).`
              : "Request failed."}
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
            <div className="text-sm font-semibold text-slate-200">Totals</div>
            <div className="mt-2 space-y-1 text-sm text-slate-300">
              <div>
                Total inserted:
                <span className="text-slate-100">
                  {totalStats.totalInserted ?? "—"}
                </span>
              </div>
              <div>
                JSON errors:
                <span className="text-slate-100">
                  {totalStats.jsonErrors ?? "—"}
                </span>
              </div>
              <div>
                Validation errors:
                <span className="text-slate-100">
                  {totalStats.validationErrors ?? "—"}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-3">
            <div className="text-sm font-semibold text-slate-200">
              Last poll
            </div>
            <div className="mt-2 space-y-1 text-sm text-slate-300">
              <div>
                Total inserted:
                <span className="text-slate-100">
                  {lastStats.totalInserted ?? "—"}
                </span>
              </div>
              <div>
                JSON errors:
                <span className="text-slate-100">
                  {lastStats.jsonErrors ?? "—"}
                </span>
              </div>
              <div>
                Validation errors:
                <span className="text-slate-100">
                  {lastStats.validationErrors ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <JsonCard title="metrics_total" value={metricsTotal ?? {}} />
        <JsonCard title="metrics_last" value={metricsLast ?? {}} />
      </div>

      <JsonCard
        title="Full payload"
        value={query.isSuccess ? query.data : errorPayload(query.error)}
      />
    </div>
  );
}
