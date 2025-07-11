import { Skeleton } from "@/components/ui/skeleton";

const ChartSkeleton = () => {
  return (
    <div className="h-[250px] w-full px-2">
      <div className="flex h-full">
        <div className="flex flex-col justify-between items-end pr-2 w-12">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-8 bg-gray-200" />
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full border-t border-gray-100"
                style={{ top: `${(i * 100) / 5}%` }}
              />
            ))}

            <div className="absolute inset-0 flex items-center max-w-[90%] mx-auto">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 100"
                preserveAspectRatio="none"
                className="absolute inset-0"
              >
                <path
                  d="M 10 70 
                     L 100 50
                     L 180 35
                     L 260 40
                     L 340 30
                     L 390 25"
                  stroke="url(#gradient)"
                  strokeWidth="1"
                  fill="none"
                  className="opacity-80"
                />
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#e6e9ee" />
                    <stop offset="50%" stopColor="#e6e9ee" />
                    <stop offset="100%" stopColor="#e6e9ee" />
                  </linearGradient>
                </defs>

                {/* Chart dots at key points */}
                <circle
                  cx="10"
                  cy="70"
                  r="2"
                  fill="#e4e7ea"
                  className="animate-pulse"
                />
                <circle
                  cx="100"
                  cy="50"
                  r="2"
                  fill="#e4e7ea"
                  className="animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                />
                <circle
                  cx="180"
                  cy="35"
                  r="2"
                  fill="#e4e7ea"
                  className="animate-pulse"
                  style={{ animationDelay: "0.4s" }}
                />
                <circle
                  cx="260"
                  cy="40"
                  r="2"
                  fill="#e4e7ea"
                  className="animate-pulse"
                  style={{ animationDelay: "0.6s" }}
                />
                <circle
                  cx="340"
                  cy="30"
                  r="2"
                  fill="#e4e7ea"
                  className="animate-pulse"
                  style={{ animationDelay: "0.8s" }}
                />
                <circle
                  cx="390"
                  cy="25"
                  r="2"
                  fill="#e4e7ea"
                  className="animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 px-10">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-12 bg-gray-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSkeleton;
