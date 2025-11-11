import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import TopNav from "../components/TopNav";
import SubTabs from "../components/SubTabs";
import { useLocation } from "react-router-dom";
// import { ClientProvider } from "../hooks/useClientContext";

export default function DashboardShell() {
  const location = useLocation();
  // Determine section from path
  const section =
    ["overview", "portfolio", "plan", "activity", "transactions"].find((s) =>
      location.pathname.includes(s)
    ) || "overview";
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <TopNav />
          <SubTabs section={section} />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
