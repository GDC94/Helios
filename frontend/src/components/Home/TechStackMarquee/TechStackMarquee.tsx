import { motion } from "framer-motion";
import { IoLogoReact, IoLogoNodejs, IoLogoDocker } from "react-icons/io5";
import {
  SiTypescript,
  SiPostgresql,
  SiPrisma,
  SiExpress,
  SiGraphql,
  SiVite,
  SiTailwindcss,
} from "react-icons/si";

const TechStackMarquee = () => {
  return (
    <div className="max-w-[900px] mx-auto border my-2">
      <div className="p-4 overflow-x-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />

        <div className="flex items-center">
          <TechList list={technologies} />
          <TechList list={technologies} />
          <TechList list={technologies} />
        </div>

        <div className="absolute top-0 bottom-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  );
};

const TechList = ({ list }: { list: typeof technologies }) => {
  return (
    <motion.div
      initial={{ translateX: "0%" }}
      animate={{ translateX: "-100%" }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      className="flex gap-6 px-2"
    >
      {list.map(tech => {
        const IconComponent = tech.icon;
        return (
          <div
            key={tech.id}
            className="shrink-0 flex flex-col items-center justify-center p-4 bg-card border border-gray-300 rounded-lg min-w-[120px]"
          >
            <IconComponent className="text-blue-500 w-6 h-6 mb-3 text-primary" />
            <span className="text-sm font-medium text-center text-foreground">
              {tech.name}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
};

const technologies = [
  {
    id: 1,
    name: "React",
    icon: IoLogoReact,
  },
  {
    id: 2,
    name: "TypeScript",
    icon: SiTypescript,
  },
  {
    id: 3,
    name: "Node.js",
    icon: IoLogoNodejs,
  },
  {
    id: 4,
    name: "Express",
    icon: SiExpress,
  },
  {
    id: 5,
    name: "PostgreSQL",
    icon: SiPostgresql,
  },
  {
    id: 6,
    name: "Prisma",
    icon: SiPrisma,
  },
  {
    id: 7,
    name: "GraphQL",
    icon: SiGraphql,
  },
  {
    id: 8,
    name: "Docker",
    icon: IoLogoDocker,
  },
  {
    id: 9,
    name: "Vite",
    icon: SiVite,
  },
  {
    id: 10,
    name: "Tailwind CSS",
    icon: SiTailwindcss,
  },
];

export default TechStackMarquee;
