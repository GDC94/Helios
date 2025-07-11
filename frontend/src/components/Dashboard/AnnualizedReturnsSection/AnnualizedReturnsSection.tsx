import {
  MetricsCardEmptyState,
  MetricsCardSkeleton,
} from "../MetricsCard/components";
import MetricsCard from "../MetricsCard/MetricsCard";

import type { AnnualizedReturns } from "@/types";

interface AnnualizedReturnsSectionProps {
  data?: AnnualizedReturns;
  isLoading: boolean;
  isError: boolean;
}

interface AnnualizedReturnsCardConfig {
  title: string;
  getValue: (data: AnnualizedReturns) => string;
}

const ANNUALIZED_RETURNS_CONFIG: AnnualizedReturnsCardConfig[] = [
  {
    title: "All time",
    getValue: data => `${data.allTime.toFixed(3)}%`,
  },
  {
    title: "30-Day",
    getValue: data => `${data.thirtyDay.toFixed(3)}%`,
  },
  {
    title: "7-Day",
    getValue: data => `${data.sevenDay.toFixed(3)}%`,
  },
  {
    title: "24-Hour",
    getValue: data => `${data.twentyFourHour.toFixed(3)}%`,
  },
];

const AnnualizedReturnsSection = ({
  data,
  isLoading,
  isError,
}: AnnualizedReturnsSectionProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 h-auto">
        {ANNUALIZED_RETURNS_CONFIG.map((_, index) => (
          <MetricsCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 h-auto">
        {ANNUALIZED_RETURNS_CONFIG.map((config, index) => (
          <MetricsCardEmptyState key={index} title={config.title} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 h-auto">
      {ANNUALIZED_RETURNS_CONFIG.map((config, index) => (
        <MetricsCard
          key={index}
          title={config.title}
          value={config.getValue(data)}
          type="annualizedReturns"
        />
      ))}
    </div>
  );
};

export default AnnualizedReturnsSection;
