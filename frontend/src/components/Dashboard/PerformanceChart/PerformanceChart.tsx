import { useState, useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGetChartData, type TimeRange } from "@/hooks/useGetChartData";
import { xAxisConfigs, type AxisConfig } from "./helpers/axisConfigs";
import {
  formatDateForAxis,
  formatDateForCustom,
} from "./helpers/dateFormatters";
import { CHART_CONSTANTS } from "@/config/constants";
import {
  ChartArea,
  PerformanceChartHeader,
  TimeRangeSelector,
  ChartSkeleton,
  ChartEmptyState,
} from "./components";

const PerformanceChart = () => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("7d");
  const [customRange, setCustomRange] = useState<DateRange>();

  const customParams = useMemo(() => {
    if (selectedRange === "custom" && customRange?.from && customRange?.to) {
      return {
        from: format(customRange.from, "yyyy-MM-dd"),
        to: format(customRange.to, "yyyy-MM-dd"),
      };
    }
    return undefined;
  }, [selectedRange, customRange]);

  const {
    data: response,
    isLoading,
    error,
  } = useGetChartData(selectedRange, customParams);

  const chartData = useMemo(() => {
    return (
      response?.data.map(dataPoint => ({
        date:
          selectedRange === "custom" && response?.data
            ? formatDateForCustom(
                dataPoint.timestamp,
                response.data.map(d => d.timestamp)
              )
            : formatDateForAxis(
                dataPoint.timestamp,
                selectedRange,
                dataPoint.displayType
              ),
        value: dataPoint.value ?? 0,
        apr: dataPoint.apr,
        timestamp: dataPoint.timestamp,
      })) || []
    );
  }, [response, selectedRange]);

  const yAxisConfig = useMemo(() => {
    const maxValue =
      response?.config.yAxisMax ?? CHART_CONSTANTS.DEFAULT_Y_AXIS_MAX;
    const ticks: number[] = [];
    for (
      let tickValue = 0;
      tickValue <= maxValue;
      tickValue += CHART_CONSTANTS.Y_AXIS_TICK_INTERVAL
    ) {
      ticks.push(tickValue);
    }
    return {
      domain: [0, maxValue] as [number, number],
      ticks,
      tickFormatter: (value: number) =>
        value === 0
          ? "$0"
          : value >= maxValue
            ? `+$${maxValue}M`
            : `$${value}M`,
      tickSpacing: CHART_CONSTANTS.Y_AXIS_TICK_SPACING,
    };
  }, [response]);

  const xAxisConfig: AxisConfig =
    xAxisConfigs[selectedRange] ?? xAxisConfigs.custom;

  const renderChartCard = (content: React.ReactNode) => (
    <TooltipProvider>
      <Card className="w-full bg-gray-50 border border-[#EFEFF4] shadow-custom mt-2">
        <PerformanceChartHeader>
          <TimeRangeSelector
            selected={selectedRange}
            onSelect={setSelectedRange}
            customRange={customRange}
            onCustomChange={setCustomRange}
          />
        </PerformanceChartHeader>
        <CardContent className="px-0 pb-7">{content}</CardContent>
      </Card>
    </TooltipProvider>
  );

  if (isLoading) {
    return renderChartCard(<ChartSkeleton />);
  }

  if (error) {
    return renderChartCard(<ChartEmptyState />);
  }

  const renderContent = () => {
    if (chartData.length === 0) {
      return <ChartEmptyState />;
    }
    return (
      <ChartArea
        chartData={chartData}
        xAxisConfig={xAxisConfig}
        yAxisConfig={yAxisConfig}
        config={{ value: { label: "APR", color: "#3b82f6" } }}
      />
    );
  };

  return renderChartCard(renderContent());
};

export default PerformanceChart;
