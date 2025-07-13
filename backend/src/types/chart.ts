export type TimeRange = '7d' | '1m' | '3m' | '6m' | '1y' | 'YTD' | 'custom' | 'All';

export interface ChartDataPoint {
  value: number;      
  apr: number;             
  timestamp: string;      
  displayType?: 'hour' | 'date' | 'fullDate'; 
}

export interface ChartResponse {
  success: boolean;
  data: ChartDataPoint[];
  config: {
    timeRange: TimeRange;
    movingAverage: number;
    totalDataPoints: number;
    yAxisMax: number;
    from?: string;
    to?: string;
  };
}
export interface CustomDateRange {
  from: string;        
  to: string;             
}

export interface TimeRangeStrategy {
  getMovingAverage(): number;
  getDateRange(): { from: Date; to: Date };
  processData(snapshots: any[]): ChartDataPoint[];
} 