import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getSecondaryValueColor, METRICS_STYLE_CONFIG } from "./helpers";

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
  const styleConfig = {
    globalMetrics: {
      valueColor: METRICS_STYLE_CONFIG.globalMetrics.valueColor,
      secondaryValueColor: getSecondaryValueColor(secondaryValue),
    },
    annualizedReturns: {
      valueColor: METRICS_STYLE_CONFIG.annualizedReturns.valueColor,
      secondaryValueColor:
        METRICS_STYLE_CONFIG.annualizedReturns.secondaryValueColor,
    },
  };

  const currentConfig = styleConfig[type];

  return (
    <motion.div
      whileHover={{
        scale: 1,
        y: -2,
      }}
      whileTap={{
        scale: 0.4,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.1,
      }}
      className={cn("cursor-pointer", className)}
    >
      <Card
        className={cn(
          "border-none bg-white w-[206px] h-[70px] rounded-[8px] flex items-center transition-shadow duration-200 ease-in-out",
          "shadow-custom hover:shadow-lg hover:shadow-gray-200/50"
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
    </motion.div>
  );
};

export default MetricsCard;
