import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  PieChart,
  CreditCard,
  DollarSign,
  Target,
  Lightbulb,
  CheckSquare,
  FileText,
  Clock,
} from "lucide-react";

const items = [
  { to: "/dashboard/overview", label: "Overview", Icon: Home },
  { to: "/dashboard/portfolio", label: "Portfolio", Icon: PieChart },
  { to: "/dashboard/liabilities", label: "Liabilities", Icon: CreditCard },
  { to: "/dashboard/insurance", label: "Insurance", Icon: DollarSign },
  { to: "/dashboard/analytics", label: "Analytics", Icon: PieChart },
  { to: "/dashboard/cashflow", label: "Cashflow", Icon: DollarSign },
  { to: "/dashboard/goals", label: "Goals", Icon: Target },
  { to: "/dashboard/family", label: "Family", Icon: CheckSquare },
  {
    to: "/dashboard/recommendations",
    label: "Recommendations",
    Icon: Lightbulb,
  },
  { to: "/dashboard/next-steps", label: "Next Steps", Icon: CheckSquare },
  { to: "/dashboard/documents", label: "Documents", Icon: FileText },
  { to: "/dashboard/audit", label: "Audit", Icon: Clock },
];

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r hidden md:block">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Advisor Console</h2>
          <p className="text-xs text-gray-500 mt-1">Clients & Insights</p>
        </div>
        <nav className="p-4 flex-1">
          <ul className="space-y-1">
            {items.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  data-testid={`nav-${label
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <small className="text-xs text-gray-400">v1.0 • Advisor</small>
        </div>
      </div>
    </aside>
  );
}
