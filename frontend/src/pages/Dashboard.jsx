import React from "react";
import { Outlet } from "react-router-dom";
import { ClientProvider } from "../hooks/useClientContext";
import TopNav from "../components/dashboard/TopNav";
import SubTabs from "../components/dashboard/SubTabs";

export default function Dashboard() {
  const TABS = [
    { key: "portfolio", label: "Portfolio", testid: "tab-portfolio" },
    { key: "liabilities", label: "Liabilities", testid: "tab-liabilities" },
    { key: "cashflow", label: "Cashflow", testid: "tab-cashflow" },
    { key: "goals", label: "Goals", testid: "tab-goals" },
    { key: "family", label: "Family", testid: "tab-family" },
    {
      key: "recommendations",
      label: "Recommendations",
      testid: "tab-recommendations",
    },
    { key: "next-steps", label: "Next Steps", testid: "tab-next-steps" },
    { key: "documents", label: "Documents", testid: "tab-documents" },
    { key: "audit", label: "Audit", testid: "tab-audit" },
  ];
  const [activeTab, setActiveTab] = React.useState(() => {
    return localStorage.getItem("dashboard-active-tab") || "portfolio";
  });
  const tabRefs = React.useRef([]);
  React.useEffect(() => {
    localStorage.setItem("dashboard-active-tab", activeTab);
  }, [activeTab]);

  // Keyboard navigation for tabs
  const handleKeyDown = (e, idx) => {
    if (e.key === "ArrowRight") {
      const next = (idx + 1) % TABS.length;
      tabRefs.current[next]?.focus();
      setActiveTab(TABS[next].key);
    } else if (e.key === "ArrowLeft") {
      const prev = (idx - 1 + TABS.length) % TABS.length;
      tabRefs.current[prev]?.focus();
      setActiveTab(TABS[prev].key);
    } else if (e.key === "Home") {
      tabRefs.current[0]?.focus();
      setActiveTab(TABS[0].key);
    } else if (e.key === "End") {
      tabRefs.current[TABS.length - 1]?.focus();
      setActiveTab(TABS[TABS.length - 1].key);
    }
  };

  return (
    <ClientProvider>
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
        <nav
          className="flex gap-2 mb-6"
          role="tablist"
          aria-label="Dashboard Tabs"
        >
          {TABS.map((tab, idx) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[idx] = el)}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
              id={`tab-${tab.key}`}
              tabIndex={activeTab === tab.key ? 0 : -1}
              data-testid={tab.testid}
              className={`px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setActiveTab(tab.key)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        {/* SectionPanel renders below tabs, swaps content by activeTab */}
        <SectionPanel activeTab={activeTab} />
      </div>
    </ClientProvider>
  );
}
