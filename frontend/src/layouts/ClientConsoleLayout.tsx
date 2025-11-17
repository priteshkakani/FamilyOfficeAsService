import React, { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useQuery } from "@tanstack/react-query";
import Topbar from "../components/Topbar";
import { useAuth } from "../contexts/AuthProvider";

function Tabs() {
  const tabs = [
    { key: "portfolio", label: "Portfolio", to: "/dashboard/portfolio" },
    { key: "transactions", label: "Transactions", to: "/dashboard/transactions" },
    { key: "assets", label: "Assets", to: "/dashboard/assets" },
    { key: "liabilities", label: "Liabilities", to: "/dashboard/liabilities" },
    { key: "cashflows", label: "Cash Flows", to: "/dashboard/cashflows" },
    { key: "profile", label: "Profile", to: "/dashboard/profile" },
  ];
  
  // Get current path to determine active tab
  const currentPath = window.location.pathname;
  
  return (
    <div className="sticky top-16 bg-white z-20 border-b">
      <nav className="max-w-7xl mx-auto px-4">
        <ul className="flex gap-4 py-3 overflow-auto">
          {tabs.map((t) => {
            const isActive = currentPath.startsWith(t.to);
            return (
              <li key={t.key}>
                <NavLink
                  to={t.to}
                  className={`px-3 py-2 rounded ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                  data-testid={`tab-${t.key}`}
                >
                  {t.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default function ClientConsoleLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user", user?.id, "profile"],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      return data || { full_name: user.email?.split('@')[0], email: user.email };
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
      <Tabs />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
