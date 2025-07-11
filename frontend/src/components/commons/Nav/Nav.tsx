import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/config/routes";

const Nav = () => {
  return (
    <nav
      className="
        fixed top-8 left-1/2 z-50   /* posición fija, centrada y encima */
        transform -translate-x-1/2
        flex items-center gap-6
        rounded-lg border border-[#2467E8]
        bg-white bg-opacity-90   /* fondo semitransparente */
        px-4 py-2 text-sm text-[#43484D]
        shadow-md
      "
    >
      <Link to={APP_ROUTES.HOME}>
        <Avatar className="w-[21px] h-[25px] cursor-pointer">
          <AvatarImage src="/Logo.svg" alt="LOGO" />
          <AvatarFallback className="text-black">Logo</AvatarFallback>
        </Avatar>
      </Link>
      <NavLink href={APP_ROUTES.HOME}>Home</NavLink>
      <NavLink href="https://github.com/GDC94/sentora/blob/main/README.md">
        Docs
      </NavLink>
      <NavLink href="https://github.com/GDC94/sentora">Repo</NavLink>
      <Link to={APP_ROUTES.DASHBOARD}>
        <DashboardButton />
      </Link>
    </nav>
  );
};

const NavLink = ({ children, href }: { children: string; href: string }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow"
      className="block overflow-hidden"
    >
      <motion.div
        whileHover={{ y: -20 }}
        transition={{ ease: "backInOut", duration: 0.5 }}
        className="h-[20px]"
      >
        <span className="flex h-[20px] items-center">{children}</span>
        <span className="flex h-[20px] items-center text-[#43484D]">
          {children}
        </span>
      </motion.div>
    </a>
  );
};

const DashboardButton = () => {
  return (
    <button
      className={`
          relative z-0 flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-[1px] 
          px-4 py-1.5 font-medium
          transition-all duration-300
          
          before:absolute before:inset-0
          before:-z-10 before:translate-y-[200%]
          before:scale-[2.5]
          before:rounded-[100%] before:bg-neutral-50
          before:transition-transform before:duration-1000
          before:content-[""]
  
          hover:scale-105  hover:text-neutral-900
          hover:before:translate-y-[0%]
          active:scale-100  bg-[#2467E8] text-white`}
    >
      Go to the Dashboard
    </button>
  );
};

export default Nav;
