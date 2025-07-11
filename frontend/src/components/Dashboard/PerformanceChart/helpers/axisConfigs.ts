import type { TimeRange } from "@/hooks/useGetChartData";

export interface AxisConfig {
  interval: number | "preserveStartEnd";
  minTickGap: number;
}

const defaultConfig: AxisConfig = {
  interval: "preserveStartEnd",
  minTickGap: 5,
};

export const xAxisConfigs: Record<TimeRange, AxisConfig> = {
  "7d": { interval: 0, minTickGap: 15 },
  "1m": { interval: 0, minTickGap: 5 },
  "3m": { interval: 0, minTickGap: 20 },
  "6m": { interval: 0, minTickGap: 15 },
  "1y": { interval: 0, minTickGap: 10 },
  YTD: defaultConfig,
  custom: defaultConfig,
  All: { interval: 0, minTickGap: 15 },
};
