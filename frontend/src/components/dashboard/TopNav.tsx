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
  // Settings dropdown/modal logic
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const handleSettings = () => setSettingsOpen((v) => !v);
  const handleSignOut = async () => {
    if (window.confirm("Sign out?")) {
      const { auth } = require("../../supabaseClient");
      await auth.signOut();
      window.location.href = "/login";
      if (window.notifySuccess) window.notifySuccess("Signed out successfully");
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b shadow flex items-center justify-between px-4 py-2">
      <nav
        className="flex-1 flex items-center justify-start"
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
      {/* Desktop: show buttons side by side */}
      <div className="hidden sm:flex items-center gap-2 ml-4">
        <button
          type="button"
          aria-label="Settings"
          data-testid="btn-settings"
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSettings}
        >
          {/* Lucide or Heroicons: Gear icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0-6V7m-6 6h2m6 0h2m-7.07-4.93l1.41 1.41m4.24 4.24l1.41 1.41m0-8.49l-1.41 1.41m-4.24 4.24l-1.41 1.41"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Sign Out"
          data-testid="btn-signout"
          className="p-2 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={handleSignOut}
        >
          {/* Lucide or Heroicons: LogOut icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
        </button>
      </div>
      {/* Mobile: collapse into ellipsis menu */}
      <div className="sm:hidden ml-2 relative">
        <button
          type="button"
          aria-label="Menu"
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSettings}
        >
          {/* Lucide or Heroicons: Ellipsis icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
        {/* Dropdown menu for mobile */}
        {settingsOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-30">
            <button
              type="button"
              aria-label="Settings"
              data-testid="btn-settings"
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                setSettingsOpen(false);
                handleSettings();
              }}
            >
              Settings
            </button>
            <button
              type="button"
              aria-label="Sign Out"
              data-testid="btn-signout"
              className="w-full text-left px-4 py-2 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
      {/* Settings modal (placeholder) */}
      {settingsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40"
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Profile & Preferences</h2>
            {/* ...settings form... */}
            <button
              className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSettingsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
