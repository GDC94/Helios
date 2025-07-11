import { motion } from "framer-motion";
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5";
import { SiReact, SiNodedotjs, SiDocker, SiPostgresql } from "react-icons/si";
import { MdOutlineEmail, MdOutlineCode } from "react-icons/md";
import { FOOTER_QUICK_LINKS, FOOTER_SOCIAL_LINKS } from "@/config/routes";

interface SocialLinkItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

interface TechStackItem {
  name: string;
  icon: React.ElementType;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = FOOTER_QUICK_LINKS;

  const socialLinks: SocialLinkItem[] = [
    { ...FOOTER_SOCIAL_LINKS[0], icon: IoLogoGithub },
    { ...FOOTER_SOCIAL_LINKS[1], icon: IoLogoLinkedin },
    { ...FOOTER_SOCIAL_LINKS[2], icon: MdOutlineEmail },
  ];

  const techStack: TechStackItem[] = [
    { name: "React", icon: SiReact },
    { name: "Node.js", icon: SiNodedotjs },
    { name: "Docker", icon: SiDocker },
    { name: "PostgreSQL", icon: SiPostgresql },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="mt-20 border-t bg-card/50"
    >
      <div className="max-w-[900px] mx-auto px-2 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100/50 rounded-full flex items-center justify-center border-2 border-gray-100">
                <MdOutlineCode className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Sentora</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AMM Dashboard for liquidity and APR monitoring of Uniswap v2 pairs
              with real-time data from The Graph.res Uniswap v2 con datos en
              tiempo real de The Graph.
            </p>
            <div className="flex items-center space-x-3">
              {techStack.map(tech => {
                const IconComponent = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="w-8 h-8 bg-background border rounded-md flex items-center justify-center hover:shadow-sm transition-shadow"
                    title={tech.name}
                  >
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="font-medium text-foreground">Quick links</h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map(link => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-col space-y-4">
            <h4 className="font-medium text-foreground">Connect</h4>
            <div className="flex items-center space-x-3">
              {socialLinks.map(social => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-background border rounded-lg flex items-center justify-center hover:shadow-md hover:scale-105 transition-all duration-200"
                    title={social.name}
                  >
                    <IconComponent className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>© {currentYear} Sentora Challenge</span>
              <span>•</span>
              <span>Fullstack Project</span>
            </div>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Backend + Frontend + Docker</span>
              <span>•</span>
              <span>React + Node.js + PostgreSQL</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary/20"></div>
            <div className="w-2 h-2 rounded-full bg-primary/40"></div>
            <div className="w-2 h-2 rounded-full bg-primary/60"></div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
