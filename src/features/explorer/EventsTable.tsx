import type { EventListItem } from "../../api/types";

function formatTs(ts: string): string {
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? ts : d.toLocaleString();
}

function levelBadgeClass(level?: string | null): string {
  const l = (level ?? "").toUpperCase();
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1";

  if (l === "ERROR")
    return `${base} bg-red-950/40 text-red-200 ring-red-900/40`;
  if (l === "WARNING" || l === "WARN")
    return `${base} bg-amber-950/40 text-amber-200 ring-amber-900/40`;
  if (l === "INFO") return `${base} bg-sky-950/40 text-sky-200 ring-sky-900/40`;
  if (l === "DEBUG")
    return `${base} bg-slate-950/40 text-slate-300 ring-slate-800`;
  return `${base} bg-slate-950/40 text-slate-200 ring-slate-800`;
}

type Props = {
  items: EventListItem[];
  isInitialLoading: boolean;
  onRowClick?: (item: EventListItem) => void;
};

export default function EventsTable({
  items,
  isInitialLoading,
  onRowClick,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-3 py-2">Time</th>
            <th className="px-3 py-2">App</th>
            <th className="px-3 py-2">Level</th>
            <th className="px-3 py-2">Event type</th>
            <th className="px-3 py-2">Message</th>
            <th className="px-3 py-2">Source IP</th>
            <th className="px-3 py-2">User</th>
            <th className="px-3 py-2">HTTP</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-800">
          {isInitialLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <tr key={i} className="bg-slate-900/30">
                {Array.from({ length: 8 }).map((__, j) => (
                  <td key={j} className="px-3 py-2">
                    <div className="h-4 w-full animate-pulse rounded bg-slate-800/60" />
                  </td>
                ))}
              </tr>
            ))
          ) : items.length === 0 ? (
            <tr className="bg-slate-900/30">
              <td className="px-3 py-6 text-center text-slate-400" colSpan={8}>
                No events found.
              </td>
            </tr>
          ) : (
            items.map((e) => {
              const clickable = !!onRowClick;
              return (
                <tr
                  key={e.id}
                  className={[
                    "bg-slate-900/30",
                    clickable
                      ? "cursor-pointer hover:bg-slate-900/50"
                      : "hover:bg-slate-900/40",
                  ].join(" ")}
                  onClick={() => onRowClick?.(e)}
                >
                  <td className="whitespace-nowrap px-3 py-2 text-slate-200">
                    {formatTs(e.ts)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-200">
                    {e.app ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <span className={levelBadgeClass(e.level)}>
                      {e.level ?? "—"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-200">
                    {e.event_type ?? "—"}
                  </td>
                  <td className="max-w-130 px-3 py-2 text-slate-200">
                    <div className="truncate" title={e.message ?? ""}>
                      {e.message ?? "—"}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-200">
                    {e.src_ip ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-200">
                    {e.user_id ?? "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-slate-200">
                    {typeof e.http_status === "number" ? e.http_status : "—"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
