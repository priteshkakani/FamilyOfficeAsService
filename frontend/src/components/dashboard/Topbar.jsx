import React, { useState } from "react";
import ClientSwitcher from "./ClientSwitcher";
import SettingsModal from "./SettingsModal";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { useClient } from "../../contexts/ClientContext";
import { RefreshCcw, Settings, LogOut } from "lucide-react";

export default function Topbar() {
  const [openSettings, setOpenSettings] = useState(false);
  const navigate = useNavigate();
  const { client } = useClient();

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

  return (
    <header className="flex items-center justify-between py-4 border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Advisor Dashboard
        </h1>
        <ClientSwitcher />
        <span className="ml-4 inline-block text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
          env: dev
        </span>
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
          <div className="text-xs text-gray-500">Selected</div>
          <div className="font-semibold" data-testid="topbar-client-name">
            {client?.full_name || client?.name || "—"}
          </div>
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
