import type { EventDetail } from "../../api/types";

type Row = { label: string; value: string };

function toValue(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "string") return v.trim().length ? v : "—";
  return String(v);
}

function rowsForEvent(e: EventDetail): Row[] {
  return [
    { label: "ID", value: toValue(e.id) },
    { label: "Timestamp (ts)", value: toValue(e.ts) },
    { label: "Received at", value: toValue(e.received_at) },
    { label: "App", value: toValue(e.app) },
    { label: "Host", value: toValue(e.host) },
    { label: "Level", value: toValue(e.level) },
    { label: "Event type", value: toValue(e.event_type) },
    { label: "Message", value: toValue(e.message) },
    { label: "Request ID", value: toValue(e.request_id) },
    { label: "User ID", value: toValue(e.user_id) },
    { label: "Source IP", value: toValue(e.src_ip) },
    { label: "User agent", value: toValue(e.user_agent) },
    { label: "HTTP method", value: toValue(e.http_method) },
    { label: "HTTP path", value: toValue(e.http_path) },
    { label: "HTTP status", value: toValue(e.http_status) },
    { label: "Latency (ms)", value: toValue(e.latency_ms) },
    { label: "Error type", value: toValue(e.error_type) },
  ];
}

export default function CoreFieldsTable({ event }: { event: EventDetail }) {
  const rows = rowsForEvent(event);

  return (
    <section className="rounded-lg border border-slate-800 bg-slate-950/30">
      <div className="border-b border-slate-800 px-3 py-2">
        <div className="text-sm font-semibold text-slate-200">Core fields</div>
      </div>

      <div className="p-3">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-slate-800">
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="w-45 py-2 pr-3 align-top text-slate-400">
                  {r.label}
                </td>
                <td className="py-2 text-slate-200">
                  <div className="whitespace-pre-wrap wrap-break-words">
                    {r.value}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
