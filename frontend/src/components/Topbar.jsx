import React from "react";
import { LogOut, Settings } from "lucide-react";
// ClientPicker removed for Client Mode

export default function Topbar({ client, isLoading, onSettings, onLogout }) {
  const username = client?.full_name || client?.email || "User";
  return (
    <header className="flex justify-between items-center py-4 border-b bg-white shadow-sm px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-semibold text-gray-800">Client Console</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="font-bold text-gray-700">{username}</span>
        <button
          onClick={onSettings}
          className="text-gray-500 hover:text-blue-600"
          aria-label="Settings"
          data-testid="settings-open"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={onLogout}
          className="text-gray-500 hover:text-red-600"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
