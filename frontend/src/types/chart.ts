export interface SnapshotData {
  id: string;
  pairAddress: string;
  timestamp: Date | string;
  liquidity: number;
  volume: number;
  fees: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number | null;
  apr: number;
  displayType?: "hour" | "date" | "fullDate";
}

export interface DailyDataGroup {
  [date: string]: SnapshotData[];
}

export interface MonthlyDataGroup {
  [month: string]: SnapshotData[];
}
