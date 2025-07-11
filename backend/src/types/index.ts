export interface SnapshotData {
  pairAddress: string;
  timestamp: Date;
  liquidity: number;
  volume24h?: string;
  fees24h: string;   
  token0Price: string;
  token1Price: string;
  blockNumber: string;
}


export interface PairData {
  id: string;
  address: string;
  token0Address: string;
  token1Address: string;
  token0Symbol: string;
  token1Symbol: string;
  token0Name: string;
  token1Name: string;
  token0Decimals: number;
  token1Decimals: number;
}

export interface MetricsQuery {
  pairAddress: string;
  from?: Date;
  to?: Date;
  interval?: "1h" | "4h" | "1d" | "7d" | "30d";
}

export interface GraphQLPairResponse {
  pair: {
    id: string;
    token0: {
      id: string;
      symbol: string;
      name: string;
      decimals: string;
    };
    token1: {
      id: string;
      symbol: string;
      name: string;
      decimals: string;
    };
    reserveUSD: string;
    volumeUSD: string;
    untrackedVolumeUSD: string;
    totalSupply: string;
    reserve0: string;
    reserve1: string;
    token0Price: string;
    token1Price: string;
  };
}

export interface GraphQLDayDataResponse {
  pairDayDatas: Array<{
    id: string;
    date: number;
    dailyVolumeUSD: string;
    reserveUSD: string;
    token0Price: string;
    token1Price: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: Date;
  database: "connected" | "disconnected";
  graphql: "connected" | "disconnected";
} 