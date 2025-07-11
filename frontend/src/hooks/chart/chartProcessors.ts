import type {
  SnapshotData,
  DailyDataGroup,
  MonthlyDataGroup,
} from "@/types/chart";
import type {
  ChartDataPoint,
  ChartResponse,
  TimeRange,
} from "../useGetChartData";

// Constantes para configuración
const DEFAULT_Y_AXIS_MAX = 40;
const MOVING_AVERAGE_TWELVE_HOURS = 12; // Cambio: 12 horas para 7d
const MOVING_AVERAGE_DAILY = 24;

// Helper: Calcular promedios de snapshots
export const calculateAverages = (snapshots: SnapshotData[]) => {
  if (snapshots.length === 0) {
    return { avgLiquidity: 0, avgFees: 0, apr: 0 };
  }

  const avgLiquidity =
    snapshots.reduce((sum, s) => sum + s.liquidity, 0) / snapshots.length;
  const avgFees =
    snapshots.reduce((sum, s) => sum + s.fees, 0) / snapshots.length;
  const dailyRate = avgLiquidity > 0 ? avgFees / avgLiquidity : 0;
  const apr = dailyRate * 365 * 100;

  return { avgLiquidity, avgFees, apr };
};

// Helper: Crear punto de datos para chart
export const createChartDataPoint = (
  avgLiquidity: number,
  apr: number,
  timestamp: string,
  displayType?: "hour" | "date" | "fullDate"
): ChartDataPoint => ({
  value: Math.round(avgLiquidity / 1_000_000), // Convertir a millones
  apr: Number(apr.toFixed(1)),
  timestamp,
  displayType,
});

// Helper: Agrupar snapshots por día
export const groupSnapshotsByDay = (
  snapshots: SnapshotData[]
): DailyDataGroup => {
  const dailyData: DailyDataGroup = {};

  snapshots.forEach(snapshot => {
    const timestampStr =
      typeof snapshot.timestamp === "string"
        ? snapshot.timestamp
        : snapshot.timestamp.toISOString();
    const day = timestampStr.split("T")[0]; // YYYY-MM-DD

    if (!dailyData[day]) {
      dailyData[day] = [];
    }
    dailyData[day].push(snapshot);
  });

  return dailyData;
};

// Helper: Agrupar snapshots por mes
export const groupSnapshotsByMonth = (
  snapshots: SnapshotData[]
): MonthlyDataGroup => {
  const monthlyData: MonthlyDataGroup = {};

  snapshots.forEach(snapshot => {
    const date = new Date(snapshot.timestamp);
    const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`; // YYYY-MM

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = [];
    }
    monthlyData[monthKey].push(snapshot);
  });

  return monthlyData;
};

// Procesador: 7 días y All
export const processSevenDaysData = (
  snapshots: SnapshotData[],
  timeRange: TimeRange
): ChartResponse => {
  const dailyData = groupSnapshotsByDay(snapshots);
  const availableDays = Object.keys(dailyData).sort();

  // Para "7d": Generar exactamente 7 días consecutivos
  // Para "All": Usar todos los días disponibles
  let targetDays: string[] = [];

  if (timeRange === "7d") {
    // Generar 7 días consecutivos desde el primer día disponible
    if (availableDays.length > 0) {
      const startDate = new Date(availableDays[0]);
      targetDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return date.toISOString().split("T")[0]; // YYYY-MM-DD
      });
    }
  } else {
    // "All": usar todos los días disponibles
    targetDays = availableDays;
  }

  const chartData: ChartDataPoint[] = [];

  targetDays.forEach(day => {
    const daySnapshots = dailyData[day] || [];

    if (daySnapshots.length > 0) {
      // Hay datos reales para este día
      const { avgLiquidity, apr } = calculateAverages(daySnapshots);

      // Punto 1: Fecha completa (ej: "2jul")
      chartData.push(
        createChartDataPoint(
          avgLiquidity,
          apr,
          new Date(day + "T09:00:00.000Z").toISOString(),
          "fullDate"
        )
      );

      // Punto 2: Hora ("12h")
      chartData.push(
        createChartDataPoint(
          avgLiquidity,
          apr,
          new Date(day + "T21:00:00.000Z").toISOString(), // 12h después
          "hour"
        )
      );
    } else {
      // No hay datos para este día - usar datos simulados o promedio
      const avgValue = 15; // Valor por defecto en millones
      const avgAPR = 18.5; // APR por defecto

      // Punto 1: Fecha completa
      chartData.push({
        value: avgValue,
        apr: avgAPR,
        timestamp: new Date(day + "T09:00:00.000Z").toISOString(),
        displayType: "fullDate",
      });

      // Punto 2: Hora
      chartData.push({
        value: avgValue,
        apr: avgAPR,
        timestamp: new Date(day + "T21:00:00.000Z").toISOString(),
        displayType: "hour",
      });
    }
  });

  return {
    success: true,
    data: chartData,
    config: {
      timeRange,
      movingAverage: MOVING_AVERAGE_TWELVE_HOURS, // 12 horas para 7d
      totalDataPoints: chartData.length,
      yAxisMax: DEFAULT_Y_AXIS_MAX,
    },
  };
};

// Procesador: 1 mes
export const processMonthlyData = (
  snapshots: SnapshotData[],
  timeRange: TimeRange
): ChartResponse => {
  const dailyData = groupSnapshotsByDay(snapshots);
  const chartData: ChartDataPoint[] = [];
  const daysInJuly = 31;

  for (let day = 1; day <= daysInJuly; day++) {
    const dateStr = `2025-07-${day.toString().padStart(2, "0")}`;

    if (dailyData[dateStr]) {
      const daySnapshots = dailyData[dateStr];
      const { avgLiquidity, apr } = calculateAverages(daySnapshots);

      chartData.push(
        createChartDataPoint(
          avgLiquidity,
          apr,
          new Date(dateStr + "T12:00:00.000Z").toISOString(),
          "date"
        )
      );
    } else {
      // Gap para días sin datos
      chartData.push({
        value: null,
        apr: 0,
        timestamp: new Date(dateStr + "T12:00:00.000Z").toISOString(),
        displayType: "date",
      });
    }
  }

  return {
    success: true,
    data: chartData,
    config: {
      timeRange,
      movingAverage: MOVING_AVERAGE_DAILY,
      totalDataPoints: chartData.length,
      yAxisMax: DEFAULT_Y_AXIS_MAX,
    },
  };
};

// Procesador: 3 meses
export const processThreeMonthsData = (
  snapshots: SnapshotData[],
  timeRange: TimeRange
): ChartResponse => {
  const monthlyData = groupSnapshotsByMonth(snapshots);
  const chartData: ChartDataPoint[] = [];
  const months = ["2025-07", "2025-08", "2025-09", "2025-10"];

  months.forEach(monthKey => {
    if (monthlyData[monthKey]) {
      const monthSnapshots = monthlyData[monthKey];
      const { avgLiquidity, apr } = calculateAverages(monthSnapshots);

      chartData.push({
        value: avgLiquidity / 1_000_000,
        apr: parseFloat(apr.toFixed(2)),
        timestamp: `${monthKey}-15T12:00:00Z`,
        displayType: "date",
      });
    } else {
      // Gap para meses sin datos
      chartData.push({
        value: null,
        apr: 0,
        timestamp: `${monthKey}-15T12:00:00Z`,
        displayType: "date",
      });
    }
  });

  return {
    success: true,
    data: chartData,
    config: {
      timeRange,
      movingAverage: MOVING_AVERAGE_DAILY, // 24 horas para 3m
      totalDataPoints: chartData.length,
      yAxisMax: DEFAULT_Y_AXIS_MAX,
    },
  };
};

// Procesador: 6 meses
export const processSixMonthsData = (
  snapshots: SnapshotData[],
  timeRange: TimeRange
): ChartResponse => {
  const dataMap = new Map<string, SnapshotData[]>();

  snapshots.forEach(snapshot => {
    const date = new Date(snapshot.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!dataMap.has(monthKey)) {
      dataMap.set(monthKey, []);
    }
    dataMap.get(monthKey)?.push(snapshot);
  });

  const result = [];
  const currentDate = new Date(2025, 6, 1); // Julio 2025

  for (let i = 0; i < 7; i++) {
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
    const monthData = dataMap.get(monthKey) || [];

    if (monthData.length > 0) {
      const { avgLiquidity, apr } = calculateAverages(monthData);
      result.push({
        timestamp: currentDate.toISOString(),
        value: avgLiquidity / 1_000_000,
        apr: parseFloat(apr.toFixed(2)),
      });
    } else {
      result.push({
        timestamp: currentDate.toISOString(),
        value: null,
        apr: 0,
      });
    }

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return {
    success: true,
    data: result,
    config: {
      timeRange,
      movingAverage: MOVING_AVERAGE_DAILY,
      totalDataPoints: result.length,
      yAxisMax: DEFAULT_Y_AXIS_MAX,
    },
  };
};

// Procesador: 1 año
export const processYearlyData = (
  snapshots: SnapshotData[],
  timeRange: TimeRange
): ChartResponse => {
  const dataMap = new Map<string, SnapshotData[]>();

  snapshots.forEach(snapshot => {
    const date = new Date(snapshot.timestamp);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!dataMap.has(monthKey)) {
      dataMap.set(monthKey, []);
    }
    dataMap.get(monthKey)!.push(snapshot);
  });

  const result = [];
  const currentDate = new Date(2025, 6, 1); // Julio 2025

  for (let i = 0; i < 13; i++) {
    const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
    const monthData = dataMap.get(monthKey) || [];

    if (monthData.length > 0) {
      const { avgLiquidity, apr } = calculateAverages(monthData);
      result.push({
        timestamp: currentDate.toISOString(),
        value: avgLiquidity / 1_000_000,
        apr: parseFloat(apr.toFixed(2)),
      });
    } else {
      result.push({
        timestamp: currentDate.toISOString(),
        value: null,
        apr: 0,
      });
    }

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return {
    success: true,
    data: result,
    config: {
      timeRange,
      movingAverage: MOVING_AVERAGE_DAILY,
      totalDataPoints: result.length,
      yAxisMax: DEFAULT_Y_AXIS_MAX,
    },
  };
};

// Procesador: Datos por defecto
export const processDefaultData = (
  snapshots: SnapshotData[],
  timeRange: TimeRange
): ChartResponse => {
  const dailyData = groupSnapshotsByDay(snapshots);
  const chartData: ChartDataPoint[] = [];

  Object.keys(dailyData)
    .sort()
    .forEach(day => {
      const daySnapshots = dailyData[day];
      const { avgLiquidity, apr } = calculateAverages(daySnapshots);

      chartData.push(
        createChartDataPoint(
          avgLiquidity,
          apr,
          new Date(day + "T12:00:00.000Z").toISOString()
        )
      );
    });

  return {
    success: true,
    data: chartData,
    config: {
      timeRange,
      movingAverage: MOVING_AVERAGE_DAILY,
      totalDataPoints: chartData.length,
      yAxisMax: DEFAULT_Y_AXIS_MAX,
    },
  };
};
