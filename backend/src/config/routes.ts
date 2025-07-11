export const API_ROUTES = {
  ROOT: "/",
  HEALTH: "/api/health",
  DB_CHECK: "/api/db-check",
  METRICS: {
    BASE: "/api/metrics",
    SNAPSHOTS: "/api/metrics/snapshots",
    PAIRS: "/api/metrics/pairs",
    APR: "/api/metrics/apr",
    APR_ALL: "/api/metrics/apr/all",
    CHART: "/api/metrics/chart",
  },
} as const;

export const SERVER_CONFIG = {
  DEFAULT_PORT: 3001,
  DEFAULT_HOST: "localhost",
} as const;

export const buildApiRoute = (path: string): string => `/api${path}`;
export const buildMetricsRoute = (path: string): string => `/api/metrics${path}`;

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;

export type HTTPMethod = typeof HTTP_METHODS[keyof typeof HTTP_METHODS]; 