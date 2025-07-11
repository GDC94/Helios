import { useQueryClient } from "@tanstack/react-query";
import QUERY_KEYS from "./queryKeys";

const useMetricsCache = () => {
  const queryClient = useQueryClient();
  const refreshAllAPRData = async () => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.APR.BASE,
    });
  };

  const refreshPairData = async (pairAddress: string) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.SNAPSHOTS, pairAddress],
      }),
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.APR.SINGLE_PAIR, pairAddress],
      }),
    ]);
  };

  const refreshSnapshotsData = async () => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.SNAPSHOTS,
    });
  };

  const refreshPairsData = async () => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.PAIRS,
    });
  };

  const refreshAllData = async () => {
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.METRICS.BASE,
    });
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.PAIRS,
    });
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.SNAPSHOTS,
    });
    await queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.APR.BASE,
    });
  };

  const clearCache = () => {
    queryClient.clear();
  };

  const prefetchPairData = async (
    pairAddress: string,
    movingAverage: "1" | "12" | "24" = "24"
  ) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: [...QUERY_KEYS.SNAPSHOTS, pairAddress],
        queryFn: () =>
          import("@/api/api").then(api => api.getSnapshots(pairAddress)),
        staleTime: 1 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: [...QUERY_KEYS.APR.SINGLE_PAIR, pairAddress, movingAverage],
        queryFn: () =>
          import("@/api/api").then(api =>
            api.getPairAPR(pairAddress, movingAverage)
          ),
        staleTime: 2 * 60 * 1000,
      }),
    ]);
  };

  const getCacheInfo = () => {
    const allQueries = queryClient.getQueryCache().getAll();
    const activeQueries = allQueries.filter(query => query.isActive());
    const staleQueries = allQueries.filter(query => query.isStale());
    const loadingQueries = allQueries.filter(
      query => query.state.fetchStatus === "fetching"
    );

    return {
      total: allQueries.length,
      active: activeQueries.length,
      stale: staleQueries.length,
      loading: loadingQueries.length,
    };
  };

  return {
    refreshAllAPRData,
    refreshPairData,
    refreshSnapshotsData,
    refreshPairsData,
    refreshAllData,
    clearCache,
    prefetchPairData,
    getCacheInfo,
    queryClient,
  };
};

export default useMetricsCache;
