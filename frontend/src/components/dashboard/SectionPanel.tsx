import React from "react";

export default function SectionPanel({ activeTab }) {
  // Placeholder: swap content based on activeTab
  return (
    <div
      className="mt-4"
      role="tabpanel"
      aria-labelledby={`tab-${activeTab}`}
      id={`panel-${activeTab}`}
      tabIndex={0}
      data-testid={`panel-${activeTab}`}
    >
      {activeTab === "portfolio" &&
        React.createElement(require("./PortfolioPanel.tsx").default)}
      {activeTab === "liabilities" &&
        React.createElement(require("./LiabilitiesPanel.tsx").default)}
      {activeTab === "cashflow" &&
        React.createElement(require("./CashflowPanel.tsx").default)}
      {activeTab === "goals" &&
        React.createElement(require("./GoalsPanel.tsx").default)}
      {activeTab === "family" &&
        React.createElement(require("./FamilyPanel.tsx").default)}
      {activeTab === "recommendations" &&
        React.createElement(require("./RecommendationsPanel.tsx").default)}
      {activeTab === "next-steps" &&
        React.createElement(require("./NextStepsPanel.tsx").default)}
      {activeTab === "documents" &&
        React.createElement(require("./DocumentsPanel.tsx").default)}
      {activeTab === "audit" &&
        React.createElement(require("./AuditPanel.tsx").default)}
      {/* ...other panels to be implemented... */}
      {![
        "portfolio",
        "liabilities",
        "cashflow",
        "goals",
        "family",
        "recommendations",
        "next-steps",
        "documents",
        "audit",
      ].includes(activeTab) && (
        <div className="text-gray-500 text-center py-12">
          {`Panel for ${activeTab} (implement content)`}
        </div>
      )}
    </div>
  );
}
