import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

function DashboardShell() {
  const location = useLocation();
  // Redirect unknown routes under /dashboard/* to /dashboard/overview
  if (
    ![
      "/dashboard/overview",
      "/dashboard/portfolio",
      "/dashboard/plan",
      "/dashboard/goals",
      "/dashboard/family",
      "/dashboard/documents",
      "/dashboard/insurance",
      "/dashboard/analytics",
      "/dashboard/recommendations",
    ].includes(location.pathname)
  ) {
    return <Navigate to="/dashboard/overview" replace />;
  }
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardShell;
