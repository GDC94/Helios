import { useQuery } from "@tanstack/react-query";
import { getPairs } from "@/api/api";
import type { PairsResponse } from "@/types";

export const PAIRS_QUERY_KEY = ["pairs"] as const;

const useGetPairs = () => {
  return useQuery<PairsResponse, Error>({
    queryKey: PAIRS_QUERY_KEY,
    queryFn: getPairs,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
  });
};

export default useGetPairs;
