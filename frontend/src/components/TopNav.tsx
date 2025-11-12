import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "portfolio", label: "Portfolio" },
  { key: "plan", label: "Plan" },
  { key: "activity", label: "Activity" },
  { key: "transactions", label: "Transactions" },
];

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentSection =
    SECTIONS.find((s) => location.pathname.includes(s.key))?.key || "overview";

  return (
    <nav
      className="sticky top-0 z-40 bg-white border-b flex items-center px-2 md:px-6 py-2"
      role="tablist"
      aria-label="Dashboard Sections"
    >
      {SECTIONS.map((section) => (
        <button
          key={section.key}
          className={`px-4 py-2 rounded-full mx-1 font-semibold focus:outline-none transition-all
            ${
              currentSection === section.key
                ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          onClick={() => navigate(`/dashboard/${section.key}`)}
          data-testid={`tab-${section.key}`}
          role="tab"
          aria-selected={currentSection === section.key}
          tabIndex={0}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}
