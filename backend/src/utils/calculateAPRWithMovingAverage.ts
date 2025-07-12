type Snapshot = {
    timestamp: string | Date;
    fees: number;
    liquidity: number;
  };
  
  type APRPoint = {
    timestamp: string;
    apr: number;
    liquidity: number;
  };
  
  /**
   * Calcula el APR suavizado con una media móvil de `movingHours` sobre una lista de snapshots.
   */
  export function calculateAPRWithMovingAverage(
    snapshots: Snapshot[],
    movingHours: number
  ): APRPoint[] {
    const aprData: APRPoint[] = [];
  
    for (let i = 0; i < snapshots.length; i++) {
      const currentSnapshot = snapshots[i];
      const currentTime = new Date(currentSnapshot?.timestamp as string).getTime();
      const windowStart = currentTime - movingHours * 60 * 60 * 1000;
  
      const windowSnapshots = snapshots.filter(s => {
        const snapTime = new Date(s.timestamp).getTime();
        return snapTime >= windowStart && snapTime <= currentTime;
      });
  
      if (windowSnapshots.length > 0) {
        const avgFees =
          windowSnapshots.reduce((sum, s) => sum + s.fees, 0) /
          windowSnapshots.length;
        const avgLiquidity =
          windowSnapshots.reduce((sum, s) => sum + s.liquidity, 0) /
          windowSnapshots.length;
  
        const dailyRate = avgLiquidity > 0 ? avgFees / avgLiquidity : 0;
        const apr = dailyRate * 365 * 100;
  
        aprData.push({
          timestamp: new Date(currentSnapshot?.timestamp as string).toISOString(),
          apr: parseFloat(apr.toFixed(4)),
          liquidity: avgLiquidity,
        });
      }
    }
  
    return aprData;
  }
  