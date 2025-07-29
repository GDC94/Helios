import { motion } from "framer-motion";
import { MdOutlineFolder } from "react-icons/md";
import Transition from "@/components/commons/Transition";
import Nav from "@/components/commons/Nav/Nav";
import Footer from "@/components/commons/Footer";
import {
  FolderStructure,
  TechStackMarquee,
  APIEndpointsSection,
} from "@/components/Home";

export const HomePage = () => {
  return (
    <motion.div
      initial={{
        filter: "blur(2px)",
      }}
      whileInView={{
        filter: "blur(0px)",
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        delay: 0.25,
      }}
      className="min-h-screen bg-background text-foreground px-8 pt-20 pb-8"
    >
      <Nav />
      <div className="max-w-4xl mx-auto mt-4 rounded-[2px]">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Fullstack Project
        </h1>
      </div>
      <div className="mt-2 w-full mx-auto max-w-[900px] flex justify-between items-center rounded-[2px] ">
        <div className="p-6 bg-card border">
          <h2 className="text-[18px] font-semibold mb-4 text-center max-w-[350px] mx-auto">
            This project is organized as a monorepository with two main folders:
          </h2>

          <div className="flex flex-col items-center w-full mb-3">
            <div className="px-4 flex flex-col items-center gap-1 h-full">
              <div className="w-8 h-8 bg-blue-100/50 rounded-full flex items-center justify-center border-2 border-gray-100">
                <MdOutlineFolder className="w-4 h-4 text-blue-600 rounded-full" />
              </div>
              <p className="text-black font-semibold font-mono"> Backend</p>
            </div>
            <p className="text-center text-sm">
              Node.js service with Express in TypeScript, which exposes an API
              GraphQL/REST, takes periodic snapshots via node-cron and persists
              data in PostgreSQL using Prisma.
            </p>
          </div>
          <div className="flex flex-col items-center w-full mt-2">
            <div className="px-4 flex flex-col items-center gap-1 h-full ">
              <div className="w-8 h-8 bg-blue-100/50 rounded-full flex items-center justify-center border-2 border-gray-100">
                <MdOutlineFolder className="w-4 h-4 text-blue-600 rounded-full" />
              </div>
              <p className="text-black font-semibold font-mono"> Frontend</p>
            </div>
            <p className="text-center text-sm">
              Built with React + Vite and TypeScript, styled with Tailwind CSS,
              which consumes the API and draws the APR graphs. For ease of
              deployment and local development, everything runs inside of Docker
              containers, orchestrated with Docker Compose.
            </p>
          </div>
        </div>
      </div>
      <TechStackMarquee />
      <div className="mt-2 w-full mx-auto max-w-[900px] gap-4 flex justify-between items-start rounded-[2px] ">
        <FolderStructure type="backend" />
        <FolderStructure type="frontend" />
      </div>
      <APIEndpointsSection />
      <Footer />
    </motion.div>
  );
};

const TransitionedHomePage = Transition(HomePage);
export default TransitionedHomePage;
