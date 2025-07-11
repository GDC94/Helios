import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardEmptyStateProps {
  title?: string;
  className?: string;
}

const MetricsCardEmptyState = ({
  title = "Sin datos",
  className,
}: MetricsCardEmptyStateProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.005,
        y: -1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      className={cn("cursor-help", className)}
    >
      <Card
        className={cn(
          "border-none bg-white w-[206px] h-[70px] rounded-xs shadow-custom flex items-center transition-all duration-300 ease-in-out",
          "hover:shadow-md hover:shadow-gray-100/40 hover:border hover:border-gray-100"
        )}
      >
        <CardContent className="p-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.h3
                className="font-normal text-[#152935] leading-[11px] text-[11px] m-0 mb-1"
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {title}
              </motion.h3>
              <div className="flex items-center space-x-1">
                <motion.span
                  className="text-[15px] leading-[15px] font-[600] text-gray-300"
                  whileHover={{ color: "#9CA3AF" }}
                  transition={{ duration: 0.2 }}
                >
                  --
                </motion.span>
                <motion.span
                  className="text-sm leading-[15px] font-medium text-gray-300"
                  whileHover={{ color: "#9CA3AF" }}
                  transition={{ duration: 0.2 }}
                >
                  (--%)
                </motion.span>
              </div>
            </div>

            <div className="relative ml-2">
              <motion.div
                className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100"
                whileHover={{
                  backgroundColor: "#F9FAFB",
                  borderColor: "#E5E7EB",
                  scale: 1.05,
                }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <TrendingUp className="w-4 h-4 text-gray-300" />
                </motion.div>
              </motion.div>
              <motion.div
                className="absolute -top-1 -right-1 w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center"
                whileHover={{
                  backgroundColor: "#DBEAFE",
                  scale: 1.1,
                }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="w-2 h-2 text-blue-600" />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricsCardEmptyState;
