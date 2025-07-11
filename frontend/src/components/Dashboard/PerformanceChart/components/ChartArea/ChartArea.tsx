// src/components/ChartArea.tsx
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ChartAreaProps {
  chartData: Array<{
    date: string;
    value: number;
    apr: number;
    timestamp: string;
  }>;
  config: ChartConfig;
  xAxisConfig: { interval: number | "preserveStartEnd"; minTickGap: number };
  yAxisConfig: {
    domain: [number, number];
    ticks: number[];
    tickFormatter: (n: number) => string;
    tickSpacing?: number;
  };
}

const ChartArea = ({
  chartData,
  config,
  xAxisConfig,
  yAxisConfig,
}: ChartAreaProps) => {
  const tickSpacing = yAxisConfig.tickSpacing || 34;
  const tickCount = yAxisConfig.ticks.length;
  const optimalHeight = Math.max(250, (tickCount - 1) * tickSpacing);

  return (
    <ChartContainer
      config={config}
      className="w-full"
      style={{ height: `${optimalHeight}px` }}
    >
      <ResponsiveContainer width="100%" height="100%" maxHeight={optimalHeight}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: -7, bottom: 0 }}
        >
          <CartesianGrid stroke="#F5F7F8" horizontal vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={{ stroke: "#627086", strokeWidth: 0.6 }}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#485465" }}
            tickMargin={12}
            interval={xAxisConfig.interval}
            minTickGap={xAxisConfig.minTickGap}
            padding={{ left: 40, right: 40 }}
          />
          <YAxis
            domain={yAxisConfig.domain}
            ticks={yAxisConfig.ticks}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#485465" }}
            tickFormatter={yAxisConfig.tickFormatter}
            tickMargin={2}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(v: unknown) => [`$${Number(v)}M`, "Volume"]}
                labelFormatter={(label: string, payload) =>
                  payload?.[0]
                    ? `${label}｜$${payload[0].payload.value}M｜${payload[0].payload.apr.toFixed(1)}% APR`
                    : label
                }
              />
            }
          />
          <Line
            type="linear"
            dataKey="value"
            stroke="#2E71F0"
            strokeWidth={1.5}
            dot={{ fill: "#fff", strokeWidth: 1.5, r: 4, stroke: "#2E71F0" }}
            activeDot={{ r: 4, fill: "#2E71F0" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default ChartArea;
