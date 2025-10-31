import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import PortfolioPanel from "./Portfolio";
import TransactionPanel from "./Transaction";
import ProfilePanel from "./Profile";
import formatINR from "../../utils/formatINR";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import KpiCard from "../../components/dashboard/KpiCard";
import IncomeExpenseChart from "../../components/dashboard/IncomeExpenseChart";
import AssetAllocationDonut from "../../components/dashboard/AssetAllocationDonut";

export default function Overview() {
  // Sub-tabs
  const subTabs = [
    { key: "overview", label: "Overview", testid: "tab-ov-overview" },
    { key: "portfolio", label: "Portfolio", testid: "tab-ov-portfolio" },
    { key: "transaction", label: "Transaction", testid: "tab-ov-transaction" },
    { key: "profile", label: "Profile", testid: "tab-ov-profile" },
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname.split("/").pop() || "overview";
  React.useEffect(() => {
    localStorage.setItem("last-ov-subtab", currentTab);
  }, [currentTab]);
  React.useEffect(() => {
    if (location.pathname === "/dashboard/overview") {
      const last = localStorage.getItem("last-ov-subtab") || "overview";
      navigate(`/dashboard/overview/${last}`, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="space-y-6" data-testid="panel-overview">
      <nav
        className="sticky top-0 bg-white z-10 flex gap-4 mb-6 border-b"
        role="tablist"
        aria-label="Overview Sub-Tabs"
      >
        {subTabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={currentTab === tab.key}
            data-testid={tab.testid}
            className={`px-6 py-3 rounded-t font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              currentTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => navigate(`/dashboard/overview/${tab.key}`)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="mt-4">
        <Routes>
          <Route path="overview" element={<OverviewPanel />} />
          <Route path="portfolio" element={<PortfolioPanel />} />
          <Route path="transaction" element={<TransactionPanel />} />
          <Route path="profile" element={<ProfilePanel />} />
        </Routes>
      </div>
    </div>
  );
}

function OverviewPanel() {
  // ...existing summary panel code from previous Overview.jsx...
  return <div data-testid="panel-ov-overview">{/* summary panel here */}</div>;
}
