import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string;
  secondaryValue?: string;
  type: "globalMetrics" | "annualizedReturns";
  className?: string;
}

const MetricsCard = ({
  title,
  value,
  secondaryValue,
  type,
  className,
}: MetricsCardProps) => {
  const isPositiveValue = value.startsWith("+");

  const styleConfig = {
    globalMetrics: {
      valueColor: "text-[#152935]",
      secondaryValueColor:
        isPositiveValue && secondaryValue ? "text-[#5AD700]" : "text-[#152935]",
    },
    annualizedReturns: {
      valueColor: "text-[#5AD700]",
      secondaryValueColor: "text-[#5AD700]",
    },
  };

  const currentConfig = styleConfig[type];

  return (
    <Card
      className={cn(
        "border-none bg-white w-[206px] h-[70px] rounded-[8px] shadow-custom flex items-center",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-[6px]">
          <h3 className="font-normal text-[#152935] leading-[11px] text-[11px] m-0">
            {title}
          </h3>
          <div className="flex items-baseline space-x-1.5 m-0 p-0">
            <span
              className={cn(
                "text-[15px] leading-[15px] font-[600]",
                currentConfig.valueColor
              )}
            >
              {value}
            </span>
            {secondaryValue && type === "globalMetrics" && (
              <span
                className={cn(
                  "text-sm leading-[15px] font-medium",
                  currentConfig.secondaryValueColor
                )}
              >
                {secondaryValue}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
