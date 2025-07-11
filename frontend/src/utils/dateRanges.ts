import type { DateFilters } from "@/types";

/**
 * Tipos de rangos de tiempo disponibles
 */
export type TimeRange =
  | "7d"
  | "1m"
  | "3m"
  | "6m"
  | "1y"
  | "YTD"
  | "Custom"
  | "All";

/**
 * Configuración de rangos de tiempo con sus labels
 */
export const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "1m", label: "1m" },
  { value: "3m", label: "3m" },
  { value: "6m", label: "6m" },
  { value: "1y", label: "1y" },
  { value: "YTD", label: "YTD" },
  { value: "Custom", label: "Custom" },
  { value: "All", label: "All" },
];

/**
 * Función helper para obtener fecha formateada en formato YYYY-MM-DD
 */
const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Función helper para obtener fecha de hoy
 */
const getToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Diccionario de funciones para calcular rangos de fecha
 */
const DATE_RANGE_CALCULATORS: Record<
  TimeRange,
  (customDates?: DateFilters) => DateFilters | undefined
> = {
  "7d": () => {
    const today = getToday();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    return {
      from: formatDate(sevenDaysAgo),
      to: formatDate(today),
    };
  },

  "1m": () => {
    const today = getToday();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    return {
      from: formatDate(oneMonthAgo),
      to: formatDate(today),
    };
  },

  "3m": () => {
    const today = getToday();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    return {
      from: formatDate(threeMonthsAgo),
      to: formatDate(today),
    };
  },

  "6m": () => {
    const today = getToday();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    return {
      from: formatDate(sixMonthsAgo),
      to: formatDate(today),
    };
  },

  "1y": () => {
    const today = getToday();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    return {
      from: formatDate(oneYearAgo),
      to: formatDate(today),
    };
  },

  YTD: () => {
    const today = getToday();
    const yearStart = new Date(today.getFullYear(), 0, 1);

    return {
      from: formatDate(yearStart),
      to: formatDate(today),
    };
  },

  Custom: (customDates?: DateFilters) => customDates,

  All: () => undefined, // Sin filtros = todos los datos
};

/**
 * Convierte un rango de tiempo en filtros de fecha específicos
 *
 * @param timeRange - El rango de tiempo seleccionado
 * @param customDates - Fechas personalizadas para el rango "Custom"
 * @returns Filtros de fecha para usar en la API
 *
 * @example
 * ```typescript
 * // Últimos 7 días
 * const filters = getDateFiltersFromTimeRange("7d");
 * // { from: "2025-01-07", to: "2025-01-14" }
 *
 * // Rango personalizado
 * const customFilters = getDateFiltersFromTimeRange("Custom", {
 *   from: "2025-01-01",
 *   to: "2025-01-31"
 * });
 *
 * // Todos los datos
 * const allFilters = getDateFiltersFromTimeRange("All");
 * // undefined
 * ```
 */
export const getDateFiltersFromTimeRange = (
  timeRange: TimeRange,
  customDates?: DateFilters
): DateFilters | undefined => {
  const calculator = DATE_RANGE_CALCULATORS[timeRange];
  return calculator(customDates);
};

/**
 * Obtiene el label descriptivo para un rango de tiempo
 */
export const getTimeRangeLabel = (timeRange: TimeRange): string => {
  const range = TIME_RANGES.find(r => r.value === timeRange);
  return range?.label || timeRange;
};
