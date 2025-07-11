import { useQuery } from "@tanstack/react-query";
import { getAllPairsAPR } from "@/api/api";
import type {
  AllPairsAPRResponse,
  MovingAverageOption,
  DateFilters,
} from "@/types";

export const ALL_PAIRS_APR_QUERY_KEY = ["apr", "all"] as const;

const useGetAllPairsAPR = (
  movingAverage: MovingAverageOption = "24",
  filters?: DateFilters,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  }
) => {
  return useQuery<AllPairsAPRResponse, Error>({
    queryKey: [
      ...ALL_PAIRS_APR_QUERY_KEY,
      movingAverage,
      filters?.from,
      filters?.to,
    ],
    queryFn: () => getAllPairsAPR(movingAverage, filters),

    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    enabled: options?.enabled !== false,
    refetchInterval: options?.refetchInterval,
  });
};

export default useGetAllPairsAPR;
