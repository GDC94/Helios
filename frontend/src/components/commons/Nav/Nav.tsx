import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/config/routes";
import { FiArrowRight } from "react-icons/fi";

const Nav = () => {
  return (
    <nav className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 rounded-lg border border-[#2467E8] bg-white px-4 py-2 text-sm text-[#43484D] shadow-md">
      <Link to={APP_ROUTES.HOME}>
        <Avatar className="w-[21px] h-[25px] cursor-pointer">
          <AvatarImage src="/Logo.svg" alt="LOGO" />
          <AvatarFallback className="text-black">Logo</AvatarFallback>
        </Avatar>
      </Link>
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
    <button className="group flex h-10 items-center gap-2 rounded-full bg-neutral-200 pl-3 pr-4 transition-all duration-300 ease-in-out hover:bg-white hover:pl-2 hover:text-black active:bg-gray-200">
      <span className="rounded-full bg-black p-1 text-sm transition-colors duration-300 group-hover:bg-[#2467E8]">
        <FiArrowRight className="-translate-x-[200%] text-[0px] transition-all duration-300 group-hover:translate-x-0 group-hover:text-lg group-hover:text-white group-active:-rotate-45" />
      </span>
      <span className="font-semibold">Go to the Dashboard</span>
    </button>
  );
};

export default Nav;
