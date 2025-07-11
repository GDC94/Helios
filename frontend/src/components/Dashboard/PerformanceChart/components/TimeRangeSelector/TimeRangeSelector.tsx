import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import type { TimeRange } from "@/hooks/useGetChartData";

const timeRanges: TimeRange[] = [
  "7d",
  "1m",
  "3m",
  "6m",
  "1y",
  "YTD",
  "custom",
  "All",
];

interface TimeRangeSelectorProps {
  selected: TimeRange;
  customRange?: DateRange;
  onCustomChange?: (dateRange: DateRange | undefined) => void;
  onSelect: (range: TimeRange) => void;
}

const TimeRangeSelector = ({
  selected,
  customRange,
  onSelect,
  onCustomChange,
}: TimeRangeSelectorProps) => (
  <div className="flex flex-wrap items-center gap-1 px-4 pb-4">
    {timeRanges.map(range => (
      <Button
        key={range}
        onClick={() => onSelect(range)}
        className={`group h-6 font-normal pt-[4px] pb-[5px] max-h-[22px] px-2 text-[11px] rounded-[2px] hover:bg-[#f2f2f2] transition-colors
          ${
            selected === range
              ? "bg-[#E2E8F3] border border-[#2467E8] text-[#43484D]"
              : "bg-[#F6F6F6] border border-transparent text-[#43484D]"
          }`}
      >
        {range === "custom" ? "Custom" : range}
      </Button>
    ))}
    {selected === "custom" && onCustomChange && (
      <DateRangePicker
        date={customRange}
        onDateChange={onCustomChange}
        className=" hover:bg-[#f2f2f2] "
      />
    )}
  </div>
);

export default TimeRangeSelector;
