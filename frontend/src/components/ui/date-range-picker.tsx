import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  date?: DateRange;
  className?: string;
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  date,
  className,
  onDateChange,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-1", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "border text-[#43484D] border-[#2467E8] max-h-[22px] justify-start text-left font-normal h-6 text-[11px] rounded-[2px]",
              !date && "text-[#43484D]"
            )}
          >
            <CalendarIcon className="max-h-[12px] w-[2px]" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Select dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-1" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            className="bg-white p-0 text-[11px] [&_button]:text-[11px] [&_th]:text-[11px] [&_td]:text-[11px] [&_.rdp-caption]:text-[11px] [&_.rdp-weekday]:text-[10px] [&_.rdp-day]:text-[11px] [&_.rdp-day]:h-7 [&_.rdp-day]:w-7 [&_.rdp-cell]:p-0 [&_.rdp-table]:text-[11px] scale-90"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
