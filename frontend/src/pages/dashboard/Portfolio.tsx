import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthProvider";

// Example modal stub
function AddInsuranceModal({ open, onClose, clientId }) {
  return null; // Implement modal logic as needed
}

function DashboardHeader({ loading, error, clientName, updatedAt }) {
  return (
    <header className="sticky top-0 z-10 bg-white pt-2 pb-3 mb-4">
      {loading ? (
        <div className="animate-pulse">
          <div className="h-7 w-48 bg-gray-200 rounded mb-1" />
          <div className="h-4 w-32 bg-gray-100 rounded" />
        </div>
      ) : error ? (
        <div className="text-red-600 text-sm">{error}</div>
      ) : (
        <div className="flex flex-col items-start">
          <span className="text-2xl font-semibold text-gray-900 leading-tight">
            {clientName || "Client"}
          </span>
          <span className="text-sm text-gray-500 italic mt-0.5">
            {/* No advisorName in Client Mode */}
          </span>
          {updatedAt && (
            <span className="text-xs text-gray-400 mt-1">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </span>
          )}
        </div>
      )}
    </header>
  );
}

function Portfolio() {
  const { user, authLoading } = useAuth();
  const userId = user?.id;
  const [headerLoading, setHeaderLoading] = useState(true);
  const [headerError, setHeaderError] = useState("");
  const [clientName, setClientName] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    // Simulate header loading
    setTimeout(() => {
      setHeaderLoading(false);
      setClientName("Test User");
      setUpdatedAt(new Date().toISOString());
    }, 500);
  }, []);

  if (authLoading || headerLoading) {
    return <div data-testid="nav-portfolio">Loading portfolio...</div>;
  }
  if (headerError) {
    return <div data-testid="nav-portfolio">{headerError}</div>;
  }
  return (
    <div data-testid="nav-portfolio">
      <DashboardHeader
        loading={headerLoading}
        error={headerError}
        clientName={clientName}
        updatedAt={updatedAt}
      />
      {/* Add dashboard sections here: Plan, Goals, Assets, Liabilities, Insurance, Analytics, etc. */}
    </div>
  );
}

export default Portfolio;
