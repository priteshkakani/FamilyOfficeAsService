import React from "react";
import { Outlet, NavLink, useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useQuery } from "@tanstack/react-query";
import Topbar from "../components/Topbar";

function Tabs({ clientId }) {
  const tabs = [
    { key: "portfolio", label: "Portfolio", to: "portfolio" },
    { key: "transactions", label: "Transactions", to: "transactions" },
    { key: "assets", label: "Assets", to: "assets" },
    { key: "liabilities", label: "Liabilities", to: "liabilities" },
    { key: "cashflows", label: "Cash Flows", to: "cashflows" },
    { key: "profile", label: "Profile", to: "profile" },
  ];
  return (
    <div className="sticky top-16 bg-white z-20 border-b">
      <nav className="max-w-7xl mx-auto px-4">
        <ul className="flex gap-4 py-3 overflow-auto">
          {tabs.map((t) => (
            <li key={t.key}>
              <NavLink
                to={`/client/${clientId}/${t.to}`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50"
                  }`
                }
                data-testid={`tab-${t.key}`}
              >
                {t.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default function ClientConsoleLayout() {
  const { clientId } = useParams();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["client", clientId, "profile"],
    queryFn: async () => {
      if (!clientId) return null;
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", clientId)
        .maybeSingle();
      return data;
    },
    enabled: !!clientId,
  });

  React.useEffect(() => {
    if (!clientId) navigate("/dashboard/overview");
  }, [clientId, navigate]);

  return (
    <div>
      <Topbar client={profile} isLoading={isLoading} />
      <header className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold" data-testid="client-name">
              {profile?.full_name || profile?.email || "Client"}
            </h2>
          </div>
        </div>
      </header>
      <Tabs clientId={clientId} />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
