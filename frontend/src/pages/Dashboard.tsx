import { motion } from "framer-motion";
import { MetricsCard, PerformanceChart, SectionTitle } from "@/components";
import Transition from "@/components/commons/Transition";

const DashboardPage = () => {
  return (
    <motion.div
      initial={{
        filter: "blur(2px)",
      }}
      whileInView={{
        filter: "blur(0px)",
      }}
      transition={{
        duration: 1.3,
        ease: "easeInOut",
        delay: 0.25,
      }}
      className="flex flex-col h-full max-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 mx-auto max-w-[1340px]"
    >
      <div className="px-[41px] pt-[23px] pb-[45px] flex-grow">
        <section>
          <SectionTitle>Global Metrics</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 h-auto">
            <MetricsCard
              title="Total Allocation"
              value="$2,533,557.32"
              type="globalMetrics"
            />
            <MetricsCard
              title="Day Change"
              value="+$4,482.29"
              secondaryValue="(0.18%)"
              type="globalMetrics"
            />
            <MetricsCard
              title="YDT Change"
              value="+$1,360,225"
              secondaryValue="(115.93%)"
              type="globalMetrics"
            />
            <MetricsCard
              title="Average Annualized Yield"
              value="23%"
              type="globalMetrics"
            />
            <MetricsCard
              title="Total Depolyed"
              value="$21,000,000"
              type="globalMetrics"
            />
          </div>
        </section>
        <section className="my-[20px]">
          <SectionTitle>Annualized Returns</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 h-auto">
            <MetricsCard
              title="All time"
              value="8.838%"
              type="annualizedReturns"
            />
            <MetricsCard
              title="30-Day"
              value="8.838%"
              type="annualizedReturns"
            />
            <MetricsCard
              title="7-Day"
              value="7.765%"
              type="annualizedReturns"
            />
            <MetricsCard
              title="24-Hour"
              value="7.765%"
              type="annualizedReturns"
            />
          </div>
        </section>
        <section className="mt-[20px]">
          <SectionTitle>Performance</SectionTitle>
          <PerformanceChart />
        </section>
      </div>
    </motion.div>
  );
};

const TransitionedDashboardPage = Transition(DashboardPage);
export default TransitionedDashboardPage;
