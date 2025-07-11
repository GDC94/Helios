export type TimeRange = '7d' | '1m' | '3m' | '6m' | '1y' | 'YTD' | 'custom' | 'All';

export interface ChartDataPoint {
  value: number;           // Liquidity en millones (para eje Y)
  apr: number;             // APR para tooltip  
  timestamp: string;       // ISO string para frontend
  displayType?: 'hour' | 'date' | 'fullDate'; // Tipo de etiqueta a mostrar
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
  from: string;            // YYYY-MM-DD
  to: string;              // YYYY-MM-DD
}

export interface TimeRangeStrategy {
  getMovingAverage(): number;
  getDateRange(): { from: Date; to: Date };
  processData(snapshots: any[]): ChartDataPoint[];
} 