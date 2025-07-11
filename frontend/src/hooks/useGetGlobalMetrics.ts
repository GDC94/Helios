import { useQuery } from "@tanstack/react-query";
import { getGlobalMetrics } from "@/api/api";

export const useGetGlobalMetrics = () => {
  return useQuery({
    queryKey: ["globalMetrics"],
    queryFn: getGlobalMetrics,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};
