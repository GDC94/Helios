import { useQuery } from "@tanstack/react-query";
import { getPairAPR } from "@/api/api";
import type {
  SinglePairAPRResponse,
  MovingAverageOption,
  DateFilters,
} from "@/types";

export const PAIR_APR_QUERY_KEY = ["apr", "pair"] as const;

/**
 * Custom hook para obtener datos de APR de un par específico
 *
 * @param pairAddress - Dirección del par de tokens
 * @param movingAverage - Horas para el promedio móvil ("1", "12", o "24")
 * @param filters - Filtros opcionales de fecha (from/to)
 * @param options - Opciones adicionales de React Query
 * @returns Objeto con datos de React Query incluyendo data, loading, error, etc.
 *
 * @example
 * ```typescript
 * function PairAPRChart() {
 *   const { data: aprData, isLoading, error } = useGetPairAPR(
 *     "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
 *     "24"
 *   );
 *
 *   if (isLoading) return <div>Cargando APR del par...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <h3>APR del Par</h3>
 *       <p>Moving Average: {aprData?.movingAverageHours}h</p>
 *       <p>Puntos de datos: {aprData?.count}</p>
 *       {aprData?.data.map(point => (
 *         <div key={point.timestamp}>
 *           {new Date(point.timestamp).toLocaleDateString()}: {point.apr.toFixed(2)}%
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
const useGetPairAPR = (
  pairAddress: string,
  movingAverage: MovingAverageOption = "24",
  filters?: DateFilters,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery<SinglePairAPRResponse, Error>({
    queryKey: [
      ...PAIR_APR_QUERY_KEY,
      pairAddress,
      movingAverage,
      filters?.from,
      filters?.to,
    ],
    queryFn: () => getPairAPR(pairAddress, movingAverage, filters),

    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos en cache
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,

    // Opciones personalizables
    enabled: options?.enabled !== false && !!pairAddress, // Requiere pairAddress
    refetchInterval: options?.refetchInterval,
  });
};

export default useGetPairAPR;
