import React from "react";
import { Outlet } from "react-router-dom";
import { ClientProvider } from "../hooks/useClientContext";
import TopNav from "../components/dashboard/TopNav";
import SubTabs from "../components/dashboard/SubTabs";

export default function Dashboard() {
  return (
    <ClientProvider>
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
        <TopNav />
        <SubTabs />
        {/* SectionShell, loaders, toasts, etc. can be added here */}
        <Outlet />
      </div>
    </ClientProvider>
  );
}
