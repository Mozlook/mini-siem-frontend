export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface EventListItem {
  id: number;
  ts: string;
  app?: string | null;
  level?: string | null;
  event_type?: string | null;
  message?: string | null;
  src_ip?: string | null;
  user_id?: string | null;
  http_status?: number | null;
  request_id?: string | null;
}

export interface EventDetail extends EventListItem {
  received_at?: string | null;
  host?: string | null;
  user_agent?: string | null;
  http_method?: string | null;
  http_path?: string | null;
  latency_ms?: number | null;
  error_type?: string | null;
  data_json?: string | null;
  raw_json?: string | null;
  source_file?: string | null;
  source_offset?: number | null;
}

export interface ReadyResponse {
  ok?: boolean;
  [k: string]: unknown;
}

export interface MetricsResponse {
  started_at?: string;
  metrics_last?: unknown;
  metrics_total?: unknown;
  [k: string]: unknown;
}
