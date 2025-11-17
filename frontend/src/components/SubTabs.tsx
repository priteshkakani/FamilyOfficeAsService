import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SUBTABS = {
  overview: [
    { key: "feeds", label: "All Feeds" },
    { key: "portfolio", label: "Portfolio" },
    { key: "transactions", label: "Transaction" },
    { key: "profile", label: "Profile" },
  ],
  portfolio: [
    { key: "summary", label: "Summary" },
    { key: "assets", label: "Assets" },
    { key: "liabilities", label: "Liabilities" },
    { key: "insurance", label: "Insurance" },
    { key: "analytics", label: "Analytics" },
  ],
  plan: [
    { key: "summary", label: "Summary" },
    { key: "ratio", label: "Ratio" },
    { key: "insurance", label: "Insurance" },
    { key: "goals", label: "Goals" },
  ],
  activity: [
    { key: "notes", label: "Notes" },
    { key: "calculator", label: "Calculator" },
  ],
  transactions: [
    { key: "mandates", label: "Mandates" },
    { key: "mutual-funds", label: "Mutual Funds" },
    { key: "stocks", label: "Stocks" },
  ],
};

export default function SubTabs({ section }) {
  const location = useLocation();
  const navigate = useNavigate();
  const subtabs = SUBTABS[section] || [];
  // Persist last visited sub-tab per section
  const [activeSubtab, setActiveSubtab] = React.useState(() => {
    const stored = localStorage.getItem(`dashboard-last-subtab-${section}`);
    return (
      subtabs.find((st) => location.pathname.includes(st.key))?.key ||
      stored ||
      subtabs[0]?.key
    );
  });
  React.useEffect(() => {
    const found = subtabs.find((st) => location.pathname.includes(st.key));
    if (found && found.key !== activeSubtab) {
      setActiveSubtab(found.key);
      localStorage.setItem(`dashboard-last-subtab-${section}`, found.key);
    }
  }, [location.pathname, section, subtabs, activeSubtab]);

  // Keyboard navigation (left/right)
  const navRef = React.useRef();
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        document.activeElement &&
        navRef.current &&
        navRef.current.contains(document.activeElement)
      ) {
        const idx = subtabs.findIndex((st) => st.key === activeSubtab);
        if (e.key === "ArrowRight" && idx < subtabs.length - 1) {
          navigate(`/dashboard/${section}/${subtabs[idx + 1].key}`);
        }
        if (e.key === "ArrowLeft" && idx > 0) {
          navigate(`/dashboard/${section}/${subtabs[idx - 1].key}`);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSubtab, subtabs, section, navigate]);

  return (
    <nav
      ref={navRef}
      className="sticky top-12 z-30 bg-white border-b flex items-center px-2 md:px-6 py-1 border-2 border-green-500"
      role="tablist"
      aria-label="Subtabs"
      style={{ zIndex: 900 }}
    >
      {subtabs.map((subtab) => (
        <button
          key={subtab.key}
          className={`px-3 py-1 mx-1 rounded focus:outline-none font-medium transition-all
            ${activeSubtab === subtab.key
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
              : "text-gray-500 hover:bg-gray-100"
            }`}
          onClick={() => {
            setActiveSubtab(subtab.key);
            localStorage.setItem(
              `dashboard-last-subtab-${section}`,
              subtab.key
            );
            navigate(`/dashboard/${section}/${subtab.key}`);
          }}
          data-testid={`subtab-${section}-${subtab.key}`}
          role="tab"
          aria-selected={activeSubtab === subtab.key}
          tabIndex={0}
        >
          {subtab.label}
        </button>
      ))}
    </nav>
  );
}
