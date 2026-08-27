import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-[#fcfbfc] dark:bg-[#000000] text-slate-900 dark:text-white transition-colors">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="hidden lg:block shrink-0">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <main className="grow px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
