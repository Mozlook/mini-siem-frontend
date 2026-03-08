export interface EventsQueryParams {
  from_?: string;
  to?: string;

  app?: string[];
  event_type?: string[];
  level?: string[];

  user_id?: string;
  src_ip?: string;
  request_id?: string;
  http_status?: number;

  q?: string;
  limit?: number;

  before_ts?: string;
  before_id?: number;
}

function appendList(sp: URLSearchParams, key: string, values?: string[]) {
  if (!values?.length) return;
  for (const v of values) if (v?.trim()) sp.append(key, v.trim());
}

export function buildEventsQuery(params: EventsQueryParams): URLSearchParams {
  const sp = new URLSearchParams();

  if (params.from_?.trim()) sp.set("from", params.from_.trim());
  if (params.to?.trim()) sp.set("to", params.to.trim());

  appendList(sp, "app", params.app);
  appendList(sp, "event_type", params.event_type);
  appendList(sp, "level", params.level);

  if (params.user_id?.trim()) sp.set("user_id", params.user_id.trim());
  if (params.src_ip?.trim()) sp.set("src_ip", params.src_ip.trim());
  if (params.request_id?.trim()) sp.set("request_id", params.request_id.trim());

  if (
    typeof params.http_status === "number" &&
    Number.isFinite(params.http_status)
  ) {
    sp.set("http_status", String(params.http_status));
  }

  if (params.q?.trim()) sp.set("q", params.q.trim());
  if (typeof params.limit === "number" && params.limit > 0)
    sp.set("limit", String(params.limit));

  const okCursor =
    !!params.before_ts?.trim() &&
    typeof params.before_id === "number" &&
    Number.isFinite(params.before_id);

  if (okCursor) {
    sp.set("before_ts", params.before_ts!.trim());
    sp.set("before_id", String(params.before_id));
  }

  return sp;
}
