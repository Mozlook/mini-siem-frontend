import { http } from "./http";
import { apiPaths } from "./apiPaths";
import type {
  EventDetail,
  EventListItem,
  LoginResponse,
  MetricsResponse,
  ReadyResponse,
} from "./types";
import { buildEventsQuery, type EventsQueryParams } from "./query";

export async function login(password: string): Promise<LoginResponse> {
  const res = await http.post<LoginResponse>(apiPaths.auth.login(), {
    password,
  });
  return res.data;
}

export async function getApps(): Promise<string[]> {
  const res = await http.get<string[]>(apiPaths.apps.getAll());
  return res.data;
}

export async function getEventTypes(app?: string): Promise<string[]> {
  const params = new URLSearchParams();
  if (app?.trim()) params.set("app", app.trim());

  const res = await http.get<string[]>(apiPaths.eventTypes.getAll(), {
    params,
  });
  return res.data;
}

export async function getEvents(
  params: EventsQueryParams,
): Promise<EventListItem[]> {
  const sp = buildEventsQuery(params);

  const res = await http.get<EventListItem[]>(apiPaths.events.getAll(), {
    params: sp,
  });
  return res.data;
}

export async function getEvent(id: number): Promise<EventDetail> {
  const res = await http.get<EventDetail>(apiPaths.events.getById(id));
  return res.data;
}

export async function getReady(): Promise<ReadyResponse> {
  const res = await http.get<ReadyResponse>(apiPaths.ops.ready());
  return res.data;
}

export async function getMetrics(): Promise<MetricsResponse> {
  const res = await http.get<MetricsResponse>(apiPaths.ops.metrics());
  return res.data;
}
