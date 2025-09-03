import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const LibrarianLayout = () => {
  const location = useLocation();
  const hideSearchRoutes = ["/profile"];
  const showSearch = !hideSearchRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar showSearch={showSearch} />
        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LibrarianLayout;
