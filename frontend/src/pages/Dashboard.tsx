import { motion } from "framer-motion";
import { PerformanceChart, SectionTitle } from "@/components";
import Transition from "@/components/commons/Transition";
import { useGetGlobalMetrics } from "@/hooks/useGetGlobalMetrics";
import { useGetAnnualizedReturns } from "@/hooks/useGetAnnualizedReturns";
import {
  GlobalMetricsSection,
  AnnualizedReturnsSection,
} from "@/components/Dashboard/MetricsCard/components";

const DashboardPage = () => {
  const {
    data: globalMetricsData,
    isLoading: globalMetricsLoading,
    error: globalMetricsError,
  } = useGetGlobalMetrics();
  const {
    data: annualizedReturnsData,
    isLoading: annualizedReturnsLoading,
    error: annualizedReturnsError,
  } = useGetAnnualizedReturns();

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
          <GlobalMetricsSection
            data={globalMetricsData?.data}
            isLoading={globalMetricsLoading}
            isError={!!globalMetricsError}
          />
        </section>
        <section className="my-[20px]">
          <SectionTitle>Annualized Returns</SectionTitle>
          <AnnualizedReturnsSection
            data={annualizedReturnsData?.data}
            isLoading={annualizedReturnsLoading}
            isError={!!annualizedReturnsError}
          />
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
