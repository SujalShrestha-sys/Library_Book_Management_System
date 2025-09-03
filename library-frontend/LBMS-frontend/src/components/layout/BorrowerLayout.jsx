
import React from "react";
import Navbar from "./Navbar"; 
import BorrowerSidebar from "./BorrowerSidebar";
import { useLocation, Outlet } from "react-router-dom";

const BorrowerLayout = () => {
  const location = useLocation();
  const hideSearchRoutes = ["/profile"];
  const showSearch = !hideSearchRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      <BorrowerSidebar /> {/* Borrower Sidebar */}
      <div className="flex flex-col flex-1">
        <Navbar showSearch={showSearch} />
        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BorrowerLayout;
