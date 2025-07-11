import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MetricsCardSkeletonProps {
  className?: string;
}

const MetricsCardSkeleton = ({ className }: MetricsCardSkeletonProps) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.01,
        y: -1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.2,
      }}
      className={cn("cursor-default", className)}
    >
      <Card
        className={cn(
          "border-none bg-white w-[206px] h-[70px] rounded-xs shadow-custom flex items-center transition-shadow duration-200 ease-in-out",
          "hover:shadow-md hover:shadow-gray-100/50"
        )}
      >
        <CardContent className="p-4 w-full">
          <div className="space-y-[6px]">
            <Skeleton className="h-[11px] w-20 bg-gray-200 animate-pulse" />
            <div className="flex items-baseline space-x-1.5">
              <Skeleton className="h-[15px] w-16 bg-gray-200 animate-pulse" />
              <Skeleton className="h-[15px] w-12 bg-gray-200 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricsCardSkeleton;
