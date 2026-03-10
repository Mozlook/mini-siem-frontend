export type Id = string | number;

const enc = (v: Id) => encodeURIComponent(String(v));

const event = (eventId: Id) => `/events/${enc(eventId)}`;

export const apiPaths = {
  auth: {
    login: () => `/auth/login`,
  },

  apps: {
    getAll: () => `/metadata/apps`,
  },

  eventTypes: {
    getAll: () => `/metadata/event-types`,
  },

  events: {
    getAll: () => `/events`,
    getById: (eventId: Id) => event(eventId),
  },

  ops: {
    ready: () => `/ready/`,
    metrics: () => `/metrics/`,
    health: () => `/health`,
  },
} as const;
