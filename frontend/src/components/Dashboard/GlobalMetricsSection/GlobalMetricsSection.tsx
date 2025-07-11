import MetricsCard from "../MetricsCard/MetricsCard";
import {
  MetricsCardEmptyState,
  MetricsCardSkeleton,
} from "../MetricsCard/components";

import type { GlobalMetrics } from "@/types";

interface GlobalMetricsSectionProps {
  data?: GlobalMetrics;
  isLoading: boolean;
  isError: boolean;
}

interface MetricCardConfig {
  title: string;
  getValue: (data: GlobalMetrics) => string;
  getSecondaryValue?: (data: GlobalMetrics) => string;
}

const GLOBAL_METRICS_CONFIG: MetricCardConfig[] = [
  {
    title: "Total Allocation",
    getValue: data =>
      data.totalAllocation.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        notation: data.totalAllocation >= 1000000 ? "compact" : "standard",
        maximumFractionDigits: 1,
      }),
  },
  {
    title: "Day Change",
    getValue: data =>
      data.dayChange.value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        notation:
          Math.abs(data.dayChange.value) >= 1000 ? "compact" : "standard",
        maximumFractionDigits: 1,
        signDisplay: "always",
      }),
    getSecondaryValue: data =>
      `(${data.dayChange.percentage >= 0 ? "+" : ""}${data.dayChange.percentage.toFixed(2)}%)`,
  },
  {
    title: "YTD Change",
    getValue: data =>
      data.ytdChange.value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        notation:
          Math.abs(data.ytdChange.value) >= 1000 ? "compact" : "standard",
        maximumFractionDigits: 1,
        signDisplay: "always",
      }),
    getSecondaryValue: data =>
      `(${data.ytdChange.percentage >= 0 ? "+" : ""}${data.ytdChange.percentage.toFixed(2)}%)`,
  },
  {
    title: "Average Annualized Yield",
    getValue: data => `${data.averageAnnualizedYield.toFixed(3)}%`,
  },
  {
    title: "Total Deployed",
    getValue: data =>
      data.totalDeployed.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        notation: data.totalDeployed >= 1000000 ? "compact" : "standard",
        maximumFractionDigits: 1,
      }),
  },
];

const GlobalMetricsSection = ({
  data,
  isLoading,
  isError,
}: GlobalMetricsSectionProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 h-auto">
        {GLOBAL_METRICS_CONFIG.map((_, index) => (
          <MetricsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 h-auto">
        {GLOBAL_METRICS_CONFIG.map((config, index) => (
          <MetricsCardEmptyState key={index} title={config.title} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 h-auto">
      {GLOBAL_METRICS_CONFIG.map((config, index) => (
        <MetricsCard
          key={index}
          title={config.title}
          value={config.getValue(data)}
          secondaryValue={config.getSecondaryValue?.(data)}
          type="globalMetrics"
        />
      ))}
    </div>
  );
};

export default GlobalMetricsSection;
