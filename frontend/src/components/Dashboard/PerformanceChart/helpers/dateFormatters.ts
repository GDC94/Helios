import type { TimeRange } from "@/hooks/useGetChartData";
import { MONTH_NAMES, CHART_CONSTANTS } from "@/config/constants";

type DateFormatter = (
  timestamp: string,
  displayType?: "hour" | "date" | "fullDate"
) => string;

function shouldUseDailyFormat(timestamps: string[]): boolean {
  if (timestamps.length <= 1) return true;
  const firstDate = new Date(timestamps[0]);
  const lastDate = new Date(timestamps[timestamps.length - 1]);
  const diffDays = Math.ceil(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays <= 30;
}

export const dateFormatters: Record<TimeRange, DateFormatter> = {
  "7d": (timestamp, displayType) => {
    if (displayType === "hour") {
      return CHART_CONSTANTS.HOUR_LABEL;
    }
    const date = new Date(timestamp);
    return `${date.getDate()}${MONTH_NAMES[date.getMonth()].toLowerCase()}`;
  },
  "1m": timestamp => {
    const date = new Date(timestamp);
    return `${date.getDate()}${MONTH_NAMES[date.getMonth()].toLowerCase()}`;
  },
  "3m": timestamp => MONTH_NAMES[new Date(timestamp).getMonth()],
  "6m": timestamp => MONTH_NAMES[new Date(timestamp).getMonth()],
  "1y": timestamp => MONTH_NAMES[new Date(timestamp).getMonth()],
  YTD: timestamp => MONTH_NAMES[new Date(timestamp).getMonth()],
  custom: timestamp => {
    const date = new Date(timestamp);
    return `${date.getDate()}${MONTH_NAMES[date.getMonth()].toLowerCase()}`;
  },
  All: (timestamp, displayType) => {
    // Usar la misma lógica que 7d
    if (displayType === "hour") {
      return CHART_CONSTANTS.HOUR_LABEL;
    }
    const date = new Date(timestamp);
    return `${date.getDate()}${MONTH_NAMES[date.getMonth()].toLowerCase()}`;
  },
};

export function formatDateForCustom(
  timestamp: string,
  allTimestamps: string[]
): string {
  const date = new Date(timestamp);

  if (shouldUseDailyFormat(allTimestamps)) {
    return `${date.getDate()}${MONTH_NAMES[date.getMonth()].toLowerCase()}`;
  } else {
    return MONTH_NAMES[date.getMonth()];
  }
}

export function formatDateForAxis(
  timestamp: string,
  timeRange: TimeRange,
  displayType?: "hour" | "date" | "fullDate"
): string {
  const formatter = dateFormatters[timeRange];
  return formatter(timestamp, displayType);
}
