import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const SECTIONS = [
  { name: "Overview", path: "/dashboard/overview", testid: "tab-overview" },
  { name: "Portfolio", path: "/dashboard/portfolio", testid: "tab-portfolio" },
  { name: "Plan", path: "/dashboard/plan", testid: "tab-plan" },
  { name: "Activity", path: "/dashboard/activity", testid: "tab-activity" },
  {
    name: "Transactions",
    path: "/dashboard/transactions",
    testid: "tab-transactions",
  },
];

export default function TopNav() {
  const location = useLocation();
  return (
    <nav
      className="sticky top-0 z-20 bg-white border-b flex items-center px-4 py-2"
      role="tablist"
      aria-label="Dashboard Sections"
    >
      {SECTIONS.map((section) => (
        <NavLink
          key={section.name}
          to={section.path}
          className={({ isActive }) =>
            `px-4 py-2 rounded-full font-medium mx-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isActive
                ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
          role="tab"
          aria-selected={location.pathname.startsWith(section.path)}
          tabIndex={0}
          data-testid={section.testid}
        >
          {section.name}
        </NavLink>
      ))}
    </nav>
  );
}
