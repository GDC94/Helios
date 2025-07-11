import type { AnnualizedReturnsResponse, GlobalMetricsResponse } from "@/types";
import { API_ENDPOINTS } from "@/config/paths";
import axios from "axios";

const api = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
});

export const getGlobalMetrics = async (): Promise<GlobalMetricsResponse> => {
  const response = await api.get(API_ENDPOINTS.METRICS.GLOBAL);
  return response.data;
};

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
