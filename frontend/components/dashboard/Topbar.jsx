import React from "react";
import { useAuth } from "@/hooks/useAuth";

function Topbar() {
  const { user, profile } = useAuth();
  // Prefer profile.full_name, fallback to user.user_metadata.full_name, then user.email
  const clientName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    "Client";
  return (
    <div className="flex items-center px-6 py-3 bg-white border-b shadow-sm">
      <span className="font-bold text-lg" data-testid="header-username">
        {clientName}
      </span>
    </div>
  );
}

export default Topbar;
