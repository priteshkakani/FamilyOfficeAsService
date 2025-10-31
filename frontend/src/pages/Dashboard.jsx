import React from "react";
import { Outlet } from "react-router-dom";
import { ClientProvider } from "../hooks/useClientContext";
import TopNav from "../components/dashboard/TopNav";
import {
  AdvisorClientProvider,
  useAdvisorClient,
} from "../contexts/AdvisorClientContext";
import ClientPicker from "../components/dashboard/ClientPicker";
import EntityFormPanel from "../components/dashboard/EntityFormPanel";
import { useAuth } from "../contexts/AuthProvider";
import SubTabs from "../components/dashboard/SubTabs";

export default function Dashboard() {
  const TABS = [
    {
      key: "profiles",
      label: "Client Profile",
      testid: "advisor-item-profiles",
    },
    {
      key: "family_members",
      label: "Family",
      testid: "advisor-item-family_members",
    },
    { key: "assets", label: "Assets", testid: "advisor-item-assets" },
    {
      key: "liabilities",
      label: "Liabilities",
      testid: "advisor-item-liabilities",
    },
    {
      key: "insurance_policies",
      label: "Insurance",
      testid: "advisor-item-insurance_policies",
    },
    {
      key: "income_records",
      label: "Cashflow",
      testid: "advisor-item-income_records",
    },
    { key: "goals", label: "Goals", testid: "advisor-item-goals" },
    { key: "documents", label: "Documents", testid: "advisor-item-documents" },
    { key: "audit", label: "Audit", testid: "advisor-item-audit" },
  ];
  const [selectedEntity, setSelectedEntity] = React.useState(null);
  const [selectedRowId, setSelectedRowId] = React.useState(null);
  const tabRefs = React.useRef([]);
  // Get userId from AuthProvider
  const { user } = useAuth();

  // Keyboard navigation for tabs
  const handleKeyDown = (e, idx) => {
    if (e.key === "ArrowRight") {
      const next = (idx + 1) % TABS.length;
      tabRefs.current[next]?.focus();
      setSelectedEntity(TABS[next].key);
    } else if (e.key === "ArrowLeft") {
      const prev = (idx - 1 + TABS.length) % TABS.length;
      tabRefs.current[prev]?.focus();
      setSelectedEntity(TABS[prev].key);
    } else if (e.key === "Home") {
      tabRefs.current[0]?.focus();
      setSelectedEntity(TABS[0].key);
    } else if (e.key === "End") {
      tabRefs.current[TABS.length - 1]?.focus();
      setSelectedEntity(TABS[TABS.length - 1].key);
    }
  };

  // Diagnostic Tailwind test class for CSS verification
  const diagnostic = (
    <div className="diagnostic-tailwind" data-testid="diagnostic-tailwind">
      Tailwind Diagnostic: If you see this yellow box, Tailwind CSS is working!
    </div>
  );
  return (
    <AdvisorClientProvider>
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-8">
        <div className="flex justify-end items-center mb-6 gap-4">
          <ClientPicker />
        </div>
        {/* Diagnostic Tailwind container for CSS verification */}
        <div className="diagnostic-tailwind mb-4" data-testid="css-diagnostic">
          Tailwind Diagnostic: If you see this yellow box, Tailwind CSS is
          working!
        </div>
        {/* Advisor entity list/cards */}
        <nav
          className="flex gap-4 mb-6 flex-wrap"
          role="tablist"
          aria-label="Advisor Entities"
        >
          {TABS.map((tab, idx) => (
            <button
              key={tab.key}
              ref={(el) => (tabRefs.current[idx] = el)}
              role="tab"
              aria-selected={selectedEntity === tab.key}
              aria-controls={`panel-${tab.key}`}
              id={`tab-${tab.key}`}
              tabIndex={selectedEntity === tab.key ? 0 : -1}
              data-testid={tab.testid}
              className={`px-6 py-3 rounded font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                selectedEntity === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => {
                setSelectedEntity(tab.key);
                setSelectedRowId(null); // Reset row selection
              }}
              onKeyDown={(e) => handleKeyDown(e, idx)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        {/* EntityFormPanel below cards, filtered by selected client */}
        <AdvisorPanelContainer
          selectedEntity={selectedEntity}
          selectedRowId={selectedRowId}
        />
      </div>
    </AdvisorClientProvider>
  );
}
