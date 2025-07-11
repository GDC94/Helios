import { motion } from "framer-motion";
import {
  MdOutlineApi,
  MdOutlineAnalytics,
  MdOutlineShowChart,
  MdOutlineStorage,
  MdOutlineHealthAndSafety,
  MdOutlinePercent,
  MdOutlineAccountBalanceWallet,
} from "react-icons/md";

interface APIEndpoint {
  name: string;
  path: string;
  description: string;
  icon: React.ElementType;
  method: "GET" | "POST" | "PUT" | "DELETE";
}

const APIEndpointsSection = () => {
  const coreEndpoints: APIEndpoint[] = [
    {
      name: "Global Metrics",
      path: "/api/metrics/global",
      description: "Global dashboard metrics (allocation, day change, YTD)",
      icon: MdOutlineAnalytics,
      method: "GET",
    },
    {
      name: "Annualized Returns",
      path: "/api/metrics/annualized-returns",
      description:
        "Annualized returns for different periods (24h, 7d, 30d, all)",
      icon: MdOutlinePercent,
      method: "GET",
    },
    {
      name: "Chart Data",
      path: "/api/metrics/chart",
      description: "Optimized data for charts with dynamic time ranges",
      icon: MdOutlineShowChart,
      method: "GET",
    },
  ];

  const dataEndpoints: APIEndpoint[] = [
    {
      name: "Snapshots",
      path: "/api/metrics/snapshots",
      description: "Historical metrics snapshots with date filters",
      icon: MdOutlineStorage,
      method: "GET",
    },
    {
      name: "Monitored Pairs",
      path: "/api/metrics/pairs",
      description: "List of monitored peers with statistics",
      icon: MdOutlineAccountBalanceWallet,
      method: "GET",
    },
    {
      name: "APR Calculation",
      path: "/api/metrics/apr",
      description: "Individual APR calculation with moving averages",
      icon: MdOutlinePercent,
      method: "GET",
    },
  ];

  const systemEndpoints: APIEndpoint[] = [
    {
      name: "Health Check",
      path: "/api/health",
      description: "Server status and database connection",
      icon: MdOutlineHealthAndSafety,
      method: "GET",
    },
    {
      name: "Database Check",
      path: "/api/db-check",
      description: "Database connection and data verification",
      icon: MdOutlineStorage,
      method: "GET",
    },
  ];

  const renderEndpointCard = (endpoint: APIEndpoint) => {
    const IconComponent = endpoint.icon;
    return (
      <motion.div
        key={endpoint.path}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="bg-background border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-foreground text-sm">
                {endpoint.name}
              </h4>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-md font-mono">
                {endpoint.method}
              </span>
            </div>
            <code className="text-xs text-muted-foreground font-mono">
              {endpoint.path}
            </code>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {endpoint.description}
        </p>
      </motion.div>
    );
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="mt-16 border-t bg-card/30"
    >
      <div className="max-w-[900px] mx-auto px-2 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-100/50 rounded-full flex items-center justify-center border-2 border-gray-100">
              <MdOutlineApi className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              API Endpoints
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            All endpoints return data in JSON format and are optimized for
            frontend integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm text-center">
              Core Metrics
            </h3>
            <div className="space-y-3">
              {coreEndpoints.map(renderEndpointCard)}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm text-center">
              Data Access
            </h3>
            <div className="space-y-3">
              {dataEndpoints.map(renderEndpointCard)}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-sm text-center">
              System Status
            </h3>
            <div className="space-y-3">
              {systemEndpoints.map(renderEndpointCard)}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground mb-2">
              <span>
                Base URL:{" "}
                <code className="font-mono">http://localhost:3001</code>
              </span>
              <span>•</span>
              <span>
                Content-Type:{" "}
                <code className="font-mono">application/json</code>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              All endpoints support CORS and are documented with optional query
              parametersAll endpoints support CORS and are documented with
              optional query parameters
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500/60"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500/40"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default APIEndpointsSection;
