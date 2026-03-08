import type { EventsQueryParams } from "../../api/query";

export type ExplorerFilters = {
  from: string;
  to: string;

  app: string[];
  event_type: string[];
  level: string[];

  user_id: string;
  src_ip: string;
  request_id: string;

  http_status: string;
  q: string;

  limit: number;
};

export const DEFAULT_LIMIT = 200;

export function defaultExplorerFilters(): ExplorerFilters {
  return {
    from: "",
    to: "",
    app: [],
    event_type: [],
    level: [],
    user_id: "",
    src_ip: "",
    request_id: "",
    http_status: "",
    q: "",
    limit: DEFAULT_LIMIT,
  };
}

function uniqSorted(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => v.trim()).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b),
  );
}

export function normalizeExplorerFilters(f: ExplorerFilters): ExplorerFilters {
  return {
    ...f,
    from: f.from.trim(),
    to: f.to.trim(),
    app: uniqSorted(f.app),
    event_type: uniqSorted(f.event_type),
    level: uniqSorted(f.level),
    user_id: f.user_id.trim(),
    src_ip: f.src_ip.trim(),
    request_id: f.request_id.trim(),
    http_status: f.http_status.trim(),
    q: f.q.trim(),
    limit: Number.isFinite(f.limit) && f.limit > 0 ? f.limit : DEFAULT_LIMIT,
  };
}

function localToIso(local: string): string | undefined {
  if (!local) return undefined;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function isoToLocalInput(iso: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;

  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function appendMany(sp: URLSearchParams, key: string, values: string[]) {
  for (const v of values) sp.append(key, v);
}

export function filtersToEventsQueryParams(
  filters: ExplorerFilters,
): EventsQueryParams {
  const f = normalizeExplorerFilters(filters);

  const httpStatusNum =
    f.http_status.length > 0 && /^[0-9]+$/.test(f.http_status)
      ? Number(f.http_status)
      : undefined;

  return {
    from_: localToIso(f.from),
    to: localToIso(f.to),

    app: f.app.length ? f.app : undefined,
    event_type: f.event_type.length ? f.event_type : undefined,
    level: f.level.length ? f.level : undefined,

    user_id: f.user_id || undefined,
    src_ip: f.src_ip || undefined,
    request_id: f.request_id || undefined,

    http_status: httpStatusNum,
    q: f.q || undefined,

    limit: f.limit,
  };
}

export function filtersToUrlSearchParams(
  filters: ExplorerFilters,
): URLSearchParams {
  const f = normalizeExplorerFilters(filters);
  const sp = new URLSearchParams();

  const fromIso = localToIso(f.from);
  const toIso = localToIso(f.to);
  if (fromIso) sp.set("from", fromIso);
  if (toIso) sp.set("to", toIso);

  if (f.app.length) appendMany(sp, "app", f.app);
  if (f.event_type.length) appendMany(sp, "event_type", f.event_type);
  if (f.level.length) appendMany(sp, "level", f.level);

  if (f.user_id) sp.set("user_id", f.user_id);
  if (f.src_ip) sp.set("src_ip", f.src_ip);
  if (f.request_id) sp.set("request_id", f.request_id);

  if (f.http_status) sp.set("http_status", f.http_status);
  if (f.q) sp.set("q", f.q);

  if (f.limit && f.limit !== DEFAULT_LIMIT) sp.set("limit", String(f.limit));

  return sp;
}

export function filtersFromUrlSearchParams(
  sp: URLSearchParams,
): ExplorerFilters {
  const base = defaultExplorerFilters();

  const fromIso = sp.get("from") ?? "";
  const toIso = sp.get("to") ?? "";

  const limitRaw = sp.get("limit");
  const limitParsed =
    limitRaw && /^[0-9]+$/.test(limitRaw) ? Number(limitRaw) : DEFAULT_LIMIT;

  return normalizeExplorerFilters({
    ...base,
    from: isoToLocalInput(fromIso) ?? "",
    to: isoToLocalInput(toIso) ?? "",

    app: sp.getAll("app"),
    event_type: sp.getAll("event_type"),
    level: sp.getAll("level"),

    user_id: sp.get("user_id") ?? "",
    src_ip: sp.get("src_ip") ?? "",
    request_id: sp.get("request_id") ?? "",

    http_status: sp.get("http_status") ?? "",
    q: sp.get("q") ?? "",

    limit: limitParsed,
  });
}
