import { useQuery } from "@tanstack/react-query";
import { getSnapshots } from "@/api/api";
import type { SnapshotsResponse, DateFilters } from "@/types";

export const SNAPSHOTS_QUERY_KEY = ["snapshots"] as const;

/**
 * Custom hook para obtener snapshots de métricas para un par específico
 *
 * @param pairAddress - Dirección del par de tokens
 * @param filters - Filtros opcionales de fecha (from/to)
 * @param options - Opciones adicionales de React Query
 * @returns Objeto con datos de React Query incluyendo data, loading, error, etc.
 *
 * @example
 * ```typescript
 * function SnapshotsTable() {
 *   const { data: snapshots, isLoading, error } = useGetSnapshots(
 *     "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"
 *   );
 *
 *   if (isLoading) return <div>Cargando snapshots...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <table>
 *       {snapshots?.data.map(snap => (
 *         <tr key={snap.id}>
 *           <td>{snap.timestamp}</td>
 *           <td>${snap.liquidity.toLocaleString()}</td>
 *           <td>${snap.volume.toLocaleString()}</td>
 *           <td>${snap.fees.toLocaleString()}</td>
 *         </tr>
 *       ))}
 *     </table>
 *   );
 * }
 * ```
 */
const useGetSnapshots = (
  pairAddress: string,
  filters?: DateFilters,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery<SnapshotsResponse, Error>({
    queryKey: [...SNAPSHOTS_QUERY_KEY, pairAddress, filters?.from, filters?.to],
    queryFn: () => getSnapshots(pairAddress, filters),

    staleTime: 1 * 60 * 1000,
    gcTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,

    // Opciones personalizables
    enabled: options?.enabled !== false && !!pairAddress, // Requiere pairAddress
    refetchInterval: options?.refetchInterval,
  });
};

export default useGetSnapshots;
