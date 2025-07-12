import { ChartDataPoint } from '../types/chart';

/**
 * Calcula el valor máximo del eje Y con un 15% de buffer,
 * redondeado hacia el siguiente múltiplo de 5.
 */
export function calculateYAxisMax(data: ChartDataPoint[]): number {
  if (data.length === 0) return 40;

  const maxValue = Math.max(...data.map(point => point.value ?? 0));
  const bufferedMax = maxValue * 1.15;
  const roundedMax = Math.ceil(bufferedMax / 5) * 5;

  return Math.max(roundedMax, 40);
}
