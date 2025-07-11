export interface Snapshot {
  id: string;
  pairAddress: string;
  timestamp: string;
  liquidity: number;
  volume: number;
  fees: number;
  createdAt: string;
  updatedAt: string;
}

export interface SnapshotsResponse {
  success: boolean;
  data: Snapshot[];
  count: number;
}
export interface DateFilters {
  from?: string;
  to?: string;
}
export interface GlobalMetrics {
  totalAllocation: number;
  dayChange: {
    value: number;
    percentage: number;
  };
  ytdChange: {
    value: number;
    percentage: number;
  };
  averageAnnualizedYield: number;
  totalDeployed: number;
}

export interface GlobalMetricsResponse {
  success: boolean;
  data: GlobalMetrics;
}
export interface AnnualizedReturns {
  allTime: number;
  thirtyDay: number;
  sevenDay: number;
  twentyFourHour: number;
}
export interface AnnualizedReturnsResponse {
  success: boolean;
  data: AnnualizedReturns;
}
