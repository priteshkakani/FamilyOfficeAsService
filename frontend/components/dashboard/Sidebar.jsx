import React from "react";
import { NavLink } from "react-router-dom";

const sections = [
  { path: "/dashboard/overview", label: "Overview" },
  { path: "/dashboard/portfolio", label: "Portfolio" },
  { path: "/dashboard/plan", label: "Plan" },
  { path: "/dashboard/goals", label: "Goals" },
  { path: "/dashboard/family", label: "Family" },
  { path: "/dashboard/documents", label: "Documents" },
  { path: "/dashboard/insurance", label: "Insurance" },
  { path: "/dashboard/analytics", label: "Analytics" },
  { path: "/dashboard/recommendations", label: "Recommendations" },
];

function Sidebar() {
  return (
    <nav className="flex flex-col gap-2 p-4 bg-gray-50 border-r min-w-[180px]">
      {sections.map((s) => (
        <NavLink
          key={s.path}
          to={s.path}
          className={({ isActive }) =>
            `px-3 py-2 rounded font-medium transition-colors ${
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
          data-testid={`nav-${s.label.toLowerCase()}`}
        >
          {s.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default Sidebar;
