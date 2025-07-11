import type { GlobalMetrics, AnnualizedReturns } from "@/types";

/**
 * Formatea un valor numérico como moneda USD
 */
export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toFixed(2)}`;
};

/**
 * Formatea un valor como porcentaje
 */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

/**
 * Formatea un valor como porcentaje sin signo
 */
export const formatPercentageSimple = (value: number): string => {
  return `${value.toFixed(3)}%`;
};

/**
 * Formatea los datos de métricas globales para las cards
 */
export const formatGlobalMetrics = (data: GlobalMetrics) => {
  return {
    totalAllocation: formatCurrency(data.totalAllocation),
    dayChange: {
      value: formatCurrency(data.dayChange.value),
      percentage: `(${formatPercentage(data.dayChange.percentage)})`,
    },
    ytdChange: {
      value: formatCurrency(data.ytdChange.value),
      percentage: `(${formatPercentage(data.ytdChange.percentage)})`,
    },
    averageAnnualizedYield: formatPercentageSimple(data.averageAnnualizedYield),
    totalDeployed: formatCurrency(data.totalDeployed),
  };
};

/**
 * Formatea los datos de retornos anualizados para las cards
 */
export const formatAnnualizedReturns = (data: AnnualizedReturns) => {
  return {
    allTime: formatPercentageSimple(data.allTime),
    thirtyDay: formatPercentageSimple(data.thirtyDay),
    sevenDay: formatPercentageSimple(data.sevenDay),
    twentyFourHour: formatPercentageSimple(data.twentyFourHour),
  };
};
