import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { APP_ROUTES } from "@/config/routes";
import {
  MdOutlineHome,
  MdOutlineDashboard,
  MdOutlineSearchOff,
  MdOutlineArrowBack,
} from "react-icons/md";
import { SiReact, SiNodedotjs, SiDocker, SiPostgresql } from "react-icons/si";

interface TechStackItem {
  name: string;
  icon: React.ElementType;
}

interface NavigationOption {
  name: string;
  href: string;
  icon: React.ElementType;
  isPrimary?: boolean;
}

const NotFoundPage = () => {
  const techStack: TechStackItem[] = [
    { name: "React", icon: SiReact },
    { name: "Node.js", icon: SiNodedotjs },
    { name: "Docker", icon: SiDocker },
    { name: "PostgreSQL", icon: SiPostgresql },
  ];

  const navigationOptions: NavigationOption[] = [
    {
      name: "Back to Home",
      href: APP_ROUTES.HOME,
      icon: MdOutlineHome,
      isPrimary: true,
    },
    {
      name: "Go to Dashboard",
      href: APP_ROUTES.DASHBOARD,
      icon: MdOutlineDashboard,
      isPrimary: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(2px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="min-h-screen bg-background text-foreground flex items-center justify-center p-8"
    >
      <div className="max-w-[900px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
          className="border-t bg-card/50"
        >
          <div className="px-2 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100/50 rounded-full flex items-center justify-center border-1 border-blue-200">
                    <MdOutlineSearchOff className="w-4 h-4 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Error 404
                  </h3>
                </div>
                <div className="text-center md:text-left">
                  <motion.h1
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-6xl font-bold text-blue-600 mb-2"
                  >
                    404
                  </motion.h1>
                </div>
                <div className="flex items-center space-x-3">
                  {techStack.map((tech, index) => {
                    const IconComponent = tech.icon;
                    return (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="w-8 h-8 bg-background border rounded-md flex items-center justify-center hover:shadow-sm transition-shadow"
                        title={tech.name}
                      >
                        <IconComponent className="w-4 h-4 text-primary" />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col space-y-4">
                <h4 className="font-medium text-foreground">Page not found</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The page you are looking for does not exist or has been
                    moved.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You can go back to the home page or explore the metrics
                    dashboard.
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <h4 className="font-medium text-foreground">Navigation</h4>
                <div className="space-y-3">
                  {navigationOptions.map((option, index) => {
                    const IconComponent = option.icon;
                    return (
                      <motion.div
                        key={option.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      >
                        <Link to={option.href} className="block">
                          <Button
                            variant={option.isPrimary ? "default" : "outline"}
                            className="w-full justify-start space-x-2 hover:scale-105 transition-transform"
                          >
                            <IconComponent className="w-4 h-4" />
                            <span>{option.name}</span>
                          </Button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <MdOutlineArrowBack className="w-4 h-4" />
                  <span>Helios</span>
                  <span>•</span>
                  <span>Fullstack Project</span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>React + Node.js + PostgreSQL</span>
                  <span>•</span>
                  <span>Docker + Docker Compose + Express</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500/60"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500/40"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
