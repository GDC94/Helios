import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components";
import Header from "@/components/commons/Header/Header";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full max-h-screen overflow-hidden">
      <aside className="hidden lg:flex">
        <Sidebar />
      </aside>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                      w-64 bg-blue-800 z-50 transition-transform duration-300 ease-in-out lg:hidden`}
      >
        <Sidebar />
        <button
          className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-blue-700"
          onClick={() => setIsSidebarOpen(false)}
        >
          <span className="h-6 w-6" />
        </button>
      </div>
      <div className="flex flex-col flex-grow">
        <header className="flex items-center p-4 text-black shadow-sm lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="mr-4 text-black"
          >
            <span className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>

        <div className="hidden lg:block">
          <Header />
        </div>

        <main className="flex-grow p-0 max-h-screen overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
