import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { APP_ROUTES } from "@/config/routes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { MdOutlineHome } from "react-icons/md";
import { MdOutlineReceiptLong } from "react-icons/md";
import { MdLightbulbOutline } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { MdPerson } from "react-icons/md";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = () => {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const navItems = [
    {
      icon: <MdOutlineHome className="h-6 w-6" />,
      label: "Inicio",
      href: APP_ROUTES.HOME,
    },
    {
      icon: <MdOutlineLibraryBooks className="h-6 w-6" />,
      label: "Dashboard",
      href: APP_ROUTES.DASHBOARD,
    },
    {
      icon: <MdOutlineReceiptLong className="h-6 w-6" />,
      label: "Reportes",
      href: APP_ROUTES.REPORTS,
    },
    {
      icon: <MdLightbulbOutline className="h-6 w-6" />,
      label: "Ideas",
      href: APP_ROUTES.IDEAS,
    },
    {
      icon: <MdOutlineSettings className="h-6 w-6" />,
      label: "Configuración",
      href: APP_ROUTES.SETTINGS,
    },
  ];

  const isActiveLink = (href: string) => {
    return window.location.pathname === href;
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-white text-gray-400 w-16 items-center py-5 border-r border-gray-100">
        <div className="mb-[40px]">
          <Link to={APP_ROUTES.HOME}>
            <Avatar className="w-[21px] h-[25px] cursor-pointer">
              <AvatarImage src="/Logo.svg" alt="LOGO" />{" "}
              <AvatarFallback className="text-black">Logo</AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* Íconos de Navegación */}
        <nav className="flex flex-col gap-[20px] flex-grow">
          {navItems &&
            navItems.map((item, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={` w-10 h-10 p-2 flex items-center justify-center rounded-lg transition-colors ${
                      isActiveLink(item.href)
                        ? "text-blue-600 bg-[#E7F1FF]"
                        : "text-gray-500 bg-transparent hover:text-blue-600 hover:bg-[#E7F1FF]"
                    }`}
                  >
                    {item.icon}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
        </nav>
        <div className="flex flex-col items-center space-y-6 mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <IoMdNotificationsOutline className="w-6 h-6 text-black cursor-pointer" />
            </TooltipTrigger>
            <TooltipContent side="right">Notificaciones</TooltipContent>
          </Tooltip>

          <Dialog
            open={isProfileDialogOpen}
            onOpenChange={setIsProfileDialogOpen}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage src="/logo.png" alt="@shadcn" />{" "}
                    <AvatarFallback className="bg-blue-950 text-white text-sm">
                      GD
                    </AvatarFallback>
                  </Avatar>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">Perfil de usuario</TooltipContent>
            </Tooltip>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MdPerson className="h-5 w-5" />
                  Perfil de Usuario
                </DialogTitle>
                <DialogDescription>
                  Gestiona tu información personal y configuración de cuenta.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="/logo.png" alt="Usuario" />
                    <AvatarFallback className="bg-blue-950 text-white text-lg">
                      GD
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">German Derbes</h3>
                  <p className="text-sm text-muted-foreground">
                    germanderbescatoni@gmail.com
                  </p>
                  <p className="text-xs text-muted-foreground">Developer</p>
                </div>

                <div className="grid gap-2 pt-4">
                  <Button variant="outline" className="w-full justify-center">
                    Cerrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
