// Base URL - usa variable de entorno en producción, localhost en desarrollo
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || ("http://localhost:3001/api" as const);

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  METRICS: {
    PAIRS: "/metrics/pairs",
    SNAPSHOTS: "/metrics/snapshots",
    APR: "/metrics/apr",
    APR_ALL: "/metrics/apr/all",
    CHART: "/metrics/chart",
    GLOBAL: "/metrics/global",
    ANNUALIZED_RETURNS: "/metrics/annualized-returns",
  },
  HEALTH: "/health",
  DB_CHECK: "/db-check",
} as const;
