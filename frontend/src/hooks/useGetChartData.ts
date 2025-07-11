import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { processSnapshotsToChart } from "./chart/processSnapshotsToChart";

export type TimeRange =
  | "7d"
  | "1m"
  | "3m"
  | "6m"
  | "1y"
  | "YTD"
  | "custom"
  | "All";

export interface ChartDataPoint {
  value: number | null;
  apr: number;
  timestamp: string;
  displayType?: "hour" | "date" | "fullDate";
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

const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

export const useGetChartData = (
  timeRange: TimeRange,
  customRange?: CustomDateRange,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery<ChartResponse, Error>({
    queryKey: [
      "chart-data-temp",
      timeRange,
      customRange?.from,
      customRange?.to,
    ],
    queryFn: async () => {
      const specialTimeRanges: TimeRange[] = ["7d", "1m", "3m", "6m", "1y"];

      if (specialTimeRanges.includes(timeRange)) {
        const snapshotsResponse = await api.get("/metrics/snapshots");
        if (!snapshotsResponse.data.success) {
          throw new Error(
            "Failed to fetch snapshots data for special timeRange"
          );
        }
        return processSnapshotsToChart(snapshotsResponse.data.data, timeRange);
      }

      try {
        const params = new URLSearchParams({ timeRange });
        if (timeRange === "custom" && customRange) {
          params.append("from", customRange.from);
          params.append("to", customRange.to);
        }

        const chartResponse = await api.get(
          `/metrics/chart?${params.toString()}`
        );
        if (chartResponse.data.success && chartResponse.data.data.length > 0) {
          return chartResponse.data;
        }
      } catch (error) {
        console.warn("Falle:", error);
      }

      const snapshotsResponse = await api.get("/metrics/snapshots");
      if (!snapshotsResponse.data.success) {
        throw new Error("Failed to fetch fallback data");
      }

      return processSnapshotsToChart(snapshotsResponse.data.data, timeRange);
    },
    staleTime: timeRange === "7d" ? 2 * 60 * 1000 : 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
  });
};
