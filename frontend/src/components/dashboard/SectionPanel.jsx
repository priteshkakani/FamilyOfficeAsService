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
        React.createElement(require("./PortfolioPanel.jsx").default)}
      {activeTab === "liabilities" &&
        React.createElement(require("./LiabilitiesPanel.jsx").default)}
      {activeTab === "cashflow" &&
        React.createElement(require("./CashflowPanel.jsx").default)}
      {activeTab === "goals" &&
        React.createElement(require("./GoalsPanel.jsx").default)}
      {activeTab === "family" &&
        React.createElement(require("./FamilyPanel.jsx").default)}
      {activeTab === "recommendations" &&
        React.createElement(require("./RecommendationsPanel.jsx").default)}
      {activeTab === "next-steps" &&
        React.createElement(require("./NextStepsPanel.jsx").default)}
      {activeTab === "documents" &&
        React.createElement(require("./DocumentsPanel.jsx").default)}
      {activeTab === "audit" &&
        React.createElement(require("./AuditPanel.jsx").default)}
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
