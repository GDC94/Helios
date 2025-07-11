export interface APRDataPoint {
  timestamp: string;
  pairAddress: string;
  apr: number;
  fees: number;
  liquidity: number;
  movingAverageHours: number;
  snapshotsInWindow: number;
}

export interface PairAPRData {
  pairAddress: string;
  aprData: APRDataPoint[];
  snapshotCount: number;
}

export interface AllPairsAPRResponse {
  success: boolean;
  data: PairAPRData[];
  movingAverageHours: number;
  totalPairs: number;
}

export interface SinglePairAPRResponse {
  success: boolean;
  data: APRDataPoint[];
  count: number;
  movingAverageHours: number;
}

export interface PairInfo {
  pairAddress: string;
  snapshotCount: number;
  firstSnapshot: string;
  lastSnapshot: string;
}

export interface PairsResponse {
  success: boolean;
  data: PairInfo[];
}

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

export type MovingAverageOption = "1" | "12" | "24";

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
