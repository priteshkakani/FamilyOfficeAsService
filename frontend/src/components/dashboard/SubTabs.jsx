import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";

const SUBTABS = {
  overview: [
    { name: "All Feeds", path: "feeds", testid: "subtab-overview-feeds" },
    {
      name: "Portfolio",
      path: "portfolio",
      testid: "subtab-overview-portfolio",
    },
    {
      name: "Transaction",
      path: "transactions",
      testid: "subtab-overview-transactions",
    },
    { name: "Profile", path: "profile", testid: "subtab-overview-profile" },
  ],
  portfolio: [
    { name: "Summary", path: "summary", testid: "subtab-portfolio-summary" },
    { name: "Assets", path: "assets", testid: "subtab-portfolio-assets" },
    {
      name: "Liabilities",
      path: "liabilities",
      testid: "subtab-portfolio-liabilities",
    },
    {
      name: "Insurance",
      path: "insurance",
      testid: "subtab-portfolio-insurance",
    },
    {
      name: "Analytics",
      path: "analytics",
      testid: "subtab-portfolio-analytics",
    },
  ],
  plan: [
    { name: "Summary", path: "summary", testid: "subtab-plan-summary" },
    { name: "Ratio", path: "ratio", testid: "subtab-plan-ratio" },
    { name: "Insurance", path: "insurance", testid: "subtab-plan-insurance" },
    { name: "Goals", path: "goals", testid: "subtab-plan-goals" },
  ],
  activity: [
    { name: "Notes", path: "notes", testid: "subtab-activity-notes" },
    {
      name: "Calculator",
      path: "calculator",
      testid: "subtab-activity-calculator",
    },
  ],
  transactions: [
    {
      name: "Mandates",
      path: "mandates",
      testid: "subtab-transactions-mandates",
    },
    {
      name: "Mutual Funds",
      path: "mutual-funds",
      testid: "subtab-transactions-mutual-funds",
    },
    { name: "Stocks", path: "stocks", testid: "subtab-transactions-stocks" },
  ],
};

export default function SubTabs() {
  const { section, subtab } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSubtab, setActiveSubtab] = useState(subtab);

  // Persist last visited sub-tab per section
  useEffect(() => {
    if (subtab) {
      localStorage.setItem(`dashboard-last-subtab-${section}`, subtab);
      setActiveSubtab(subtab);
    } else {
      const last = localStorage.getItem(`dashboard-last-subtab-${section}`);
      if (last && SUBTABS[section]?.find((t) => t.path === last)) {
        navigate(`/dashboard/${section}/${last}`, { replace: true });
      } else if (SUBTABS[section]) {
        navigate(`/dashboard/${section}/${SUBTABS[section][0].path}`, {
          replace: true,
        });
      }
    }
  }, [section, subtab, navigate]);

  if (!SUBTABS[section]) return null;

  return (
    <nav
      className="sticky top-12 z-10 bg-white border-b flex items-center px-2 py-1"
      role="tablist"
      aria-label={`${section} Subtabs`}
    >
      {SUBTABS[section].map((tab) => (
        <NavLink
          key={tab.path}
          to={`/dashboard/${section}/${tab.path}`}
          className={({ isActive }) =>
            `px-3 py-1 rounded font-medium mx-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isActive || activeSubtab === tab.path
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
          role="tab"
          aria-selected={activeSubtab === tab.path}
          tabIndex={0}
          data-testid={tab.testid}
        >
          {tab.name}
        </NavLink>
      ))}
    </nav>
  );
}
