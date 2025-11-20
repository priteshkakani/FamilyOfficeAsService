import { Home, LogOut, RefreshCw, Settings } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthProvider";
import supabase from "../../supabaseClient";
import SettingsModal from "../SettingsModal";

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
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard/overview')}
              className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
            >
              <Home className="h-6 w-6" />
              <span className="font-bold text-lg">Family Office</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-gray-500">
              {loading ? 'Loading...' : (profile?.full_name || user?.email || 'User')}
            </div>

            <button
              onClick={onRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              aria-label="Refresh data"
              title="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setOpenSettings(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <SettingsModal open={openSettings} onClose={() => setOpenSettings(false)} />
    </header>
  );
}
