export const QUERY_KEYS = {
  PAIRS: ["pairs"] as const,

  SNAPSHOTS: ["snapshots"] as const,

  APR: {
    BASE: ["apr"] as const,
    ALL_PAIRS: ["apr", "all"] as const,
    SINGLE_PAIR: ["apr", "pair"] as const,
  },

  METRICS: {
    BASE: ["metrics"] as const,
  },
} as const;

export type QueryKeysPairs = typeof QUERY_KEYS.PAIRS;
export type QueryKeysSnapshots = typeof QUERY_KEYS.SNAPSHOTS;
export type QueryKeysAPRAll = typeof QUERY_KEYS.APR.ALL_PAIRS;
export type QueryKeysAPRPair = typeof QUERY_KEYS.APR.SINGLE_PAIR;

export default QUERY_KEYS;
