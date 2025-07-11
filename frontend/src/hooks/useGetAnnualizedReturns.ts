import { useQuery } from "@tanstack/react-query";
import { getAnnualizedReturns } from "@/api/api";

export const useGetAnnualizedReturns = (pairAddress?: string) => {
  return useQuery({
    queryKey: ["annualizedReturns", pairAddress],
    queryFn: () => getAnnualizedReturns(pairAddress),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
};
