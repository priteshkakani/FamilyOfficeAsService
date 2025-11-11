import React, { useState } from "react";
// ClientPicker removed for Client Mode
import SettingsModal from "./SettingsModal";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { useAuth } from "../../contexts/AuthProvider";
import { RefreshCcw, Settings, LogOut } from "lucide-react";

export default function Topbar() {
  const [openSettings, setOpenSettings] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(data);
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    navigate("/login");
  };

  const onRefresh = () => {
    window.dispatchEvent(new Event("refresh-client-data"));
  };

  const [showResume, setShowResume] = useState(false);
  React.useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const userId = data?.user?.id;
      if (!userId) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_onboarded,onboarding_step")
        .eq("id", userId)
        .maybeSingle();
      if (!profile?.is_onboarded) setShowResume(true);
      else setShowResume(false);
      console.log("[Dashboard][onboarding state]", profile);
    });
  }, []);
  let displayName =
    profile?.full_name || user?.user_metadata?.full_name || user?.email || "";
  return (
    <header className="flex items-center justify-between py-4 border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* App/logo left, no Client Console text */}
      </div>
      <div className="flex items-center gap-4">
        <button
          aria-label="refresh"
          onClick={onRefresh}
          className="p-2 rounded hover:bg-gray-100"
          data-testid="refresh-btn"
        >
          <RefreshCcw size={18} />
        </button>
        <button
          aria-label="settings"
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => setOpenSettings(true)}
          data-testid="settings-btn"
        >
          <Settings size={18} />
        </button>
        <div className="px-3 py-1 text-sm">
          {loading ? (
            <span
              data-testid="header-username-skeleton"
              className="animate-pulse bg-gray-200 rounded w-24 h-6 inline-block"
            ></span>
          ) : (
            <span data-testid="header-username" className="font-bold">
              {displayName}
            </span>
          )}
        </div>
        <button
          aria-label="logout"
          onClick={logout}
          className="p-2 rounded hover:bg-gray-100"
          data-testid="logout-btn"
        >
          <LogOut size={18} />
        </button>
      </div>
      {openSettings && <SettingsModal onClose={() => setOpenSettings(false)} />}
    </header>
  );
}
