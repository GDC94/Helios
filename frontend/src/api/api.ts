import type {
  AllPairsAPRResponse,
  AnnualizedReturnsResponse,
  DateFilters,
  GlobalMetricsResponse,
  MovingAverageOption,
  PairsResponse,
  SinglePairAPRResponse,
  SnapshotsResponse,
} from "@/types";
import { API_ENDPOINTS } from "@/config/paths";
import axios from "axios";

const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
});

/**
 * Obtiene la lista de todos los pares disponibles con sus estadísticas
 *
 * @returns Promise con la información de todos los pares monitoreados
 * @throws Error si la petición falla o la respuesta no es exitosa
 */
export const getPairs = async (): Promise<PairsResponse> => {
  const response = await api.get(API_ENDPOINTS.METRICS.PAIRS);
  return response.data;
};

/**
 * Obtiene snapshots de métricas para un par específico
 *
 * @param pairAddress - Dirección del par de tokens
 * @param filters - Filtros opcionales de fecha (from/to)
 * @returns Promise con los snapshots del par
 * @throws Error si la petición falla o la respuesta no es exitosa
 *
 * @example
 * ```typescript
 * const snapshots = await getSnapshots("0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc");
 *
 * // Con filtros de fecha
 * const filteredSnapshots = await getSnapshots(
 *   "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
 *   { from: "2025-07-01", to: "2025-07-08" }
 * );
 * ```
 */
export const getSnapshots = async (
  pairAddress: string,
  filters?: DateFilters
): Promise<SnapshotsResponse> => {
  const params = new URLSearchParams({ pairAddress });

  if (filters?.from) params.append("from", filters.from);
  if (filters?.to) params.append("to", filters.to);

  const response = await api.get(
    `${API_ENDPOINTS.METRICS.SNAPSHOTS}?${params.toString()}`
  );
  return response.data;
};

/**
 * Obtiene los datos de APR para todos los pares configurados
 *
 * @param movingAverage - Horas para el promedio móvil ("1", "12", o "24")
 * @param filters - Filtros opcionales de fecha (from/to)
 * @returns Promise con datos APR de todos los pares
 * @throws Error si la petición falla o la respuesta no es exitosa
 */
export const getAllPairsAPR = async (
  movingAverage: MovingAverageOption = "24",
  filters?: DateFilters
): Promise<AllPairsAPRResponse> => {
  const params = new URLSearchParams({ movingAverage });

  if (filters?.from) params.append("from", filters.from);
  if (filters?.to) params.append("to", filters.to);

  const response = await api.get(
    `${API_ENDPOINTS.METRICS.APR_ALL}?${params.toString()}`
  );
  return response.data;
};

/**
 * Obtiene datos de APR para un par específico
 *
 * @param pairAddress - Dirección del par de tokens
 * @param movingAverage - Horas para el promedio móvil ("1", "12", o "24")
 * @param filters - Filtros opcionales de fecha (from/to)
 * @returns Promise con datos APR del par específico
 * @throws Error si la petición falla o la respuesta no es exitosa
 */
export const getPairAPR = async (
  pairAddress: string,
  movingAverage: MovingAverageOption = "24",
  filters?: DateFilters
): Promise<SinglePairAPRResponse> => {
  const params = new URLSearchParams({
    pairAddress,
    movingAverage,
  });

  if (filters?.from) params.append("from", filters.from);
  if (filters?.to) params.append("to", filters.to);

  const response = await api.get(
    `${API_ENDPOINTS.METRICS.APR}?${params.toString()}`
  );
  return response.data;
};

/**
 * Obtiene métricas globales del dashboard
 *
 * @returns Promise con las métricas globales (total allocation, day change, etc.)
 * @throws Error si la petición falla o la respuesta no es exitosa
 */
export const getGlobalMetrics = async (): Promise<GlobalMetricsResponse> => {
  const response = await api.get(API_ENDPOINTS.METRICS.GLOBAL);
  return response.data;
};

/**
 * Obtiene los retornos anualizados para diferentes períodos
 *
 * @param pairAddress - Dirección del par específico (opcional, por defecto todos los pares)
 * @returns Promise con los retornos anualizados (all time, 30d, 7d, 24h)
 * @throws Error si la petición falla o la respuesta no es exitosa
 */
export const getAnnualizedReturns = async (
  pairAddress?: string
): Promise<AnnualizedReturnsResponse> => {
  const params = new URLSearchParams();
  if (pairAddress) {
    params.append("pairAddress", pairAddress);
  }

  const response = await api.get(
    `${API_ENDPOINTS.METRICS.ANNUALIZED_RETURNS}?${params.toString()}`
  );
  return response.data;
};

export default api;
