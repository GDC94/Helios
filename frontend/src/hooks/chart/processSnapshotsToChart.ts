import type { SnapshotData } from "@/types/chart";
import type { ChartResponse, TimeRange } from "../useGetChartData";
import {
  processSevenDaysData,
  processMonthlyData,
  processThreeMonthsData,
  processSixMonthsData,
  processYearlyData,
  processDefaultData,
} from "./chartProcessors";

/**
 * Función principal para procesar snapshots en datos de chart
 * Refactorizada para mayor mantenibilidad y legibilidad
 */
export const processSnapshotsToChart = (
  snapshots: SnapshotData[],
  timeRange: TimeRange
): ChartResponse => {
  // Validación inicial
  if (!snapshots || snapshots.length === 0) {
    return {
      success: true,
      data: [],
      config: {
        timeRange,
        movingAverage: 24,
        totalDataPoints: 0,
        yAxisMax: 40, // Cambio de 45 a 40
      },
    };
  }

  // Router a la función apropiada según el timeRange
  switch (timeRange) {
    case "7d":
    case "All":
      return processSevenDaysData(snapshots, timeRange);

    case "1m":
      return processMonthlyData(snapshots, timeRange);

    case "3m":
      return processThreeMonthsData(snapshots, timeRange);

    case "6m":
      return processSixMonthsData(snapshots, timeRange);

    case "1y":
      return processYearlyData(snapshots, timeRange);

    default:
      return processDefaultData(snapshots, timeRange);
  }
};
