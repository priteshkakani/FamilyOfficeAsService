import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import { useAdvisorClient } from "../../contexts/AdvisorClientContext";

export default function ClientPicker() {
  const { clientId, setClientId, clientMeta } = useAdvisorClient();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("advisor-recent-clients") || "[]"
    );
    setRecent(stored);
  }, [clientId]);

  // Search clients (advisor scope)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["advisor", "searchClients", debounced],
    queryFn: async () => {
      if (!debounced) return [];
      // Secure RPC/view: advisor_clients join profiles
      const { data, error } = await supabase
        .rpc("search_advisor_clients", { q: debounced })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!debounced,
    staleTime: 1000 * 60,
  });

  // Select client
  const handleSelect = (client) => {
    setClientId(client.id);
    // Update recent clients
    let updated = [client, ...recent.filter((c) => c.id !== client.id)].slice(
      0,
      5
    );
    setRecent(updated);
    localStorage.setItem("advisor-recent-clients", JSON.stringify(updated));
  };

  return (
    <div className="relative" data-testid="client-picker">
      <input
        type="text"
        className="border rounded px-3 py-2 w-64"
        placeholder="Search clients by name/email/mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        data-testid="client-search-input"
      />
      <div className="absolute bg-white shadow rounded mt-2 w-64 z-10">
        {isLoading && <div className="p-2">Loading…</div>}
        {isError && (
          <div className="p-2 text-red-600">Error loading clients</div>
        )}
        {!search && recent.length > 0 && (
          <div className="p-2 text-gray-500">Recent clients</div>
        )}
        {(search ? data : recent).map((client) => (
          <div
            key={client.id}
            className={`p-2 cursor-pointer hover:bg-blue-50 flex items-center gap-2 ${
              clientId === client.id ? "bg-blue-100" : ""
            }`}
            onClick={() => handleSelect(client)}
            data-testid={`client-option-${client.id}`}
            tabIndex={0}
          >
            <div className="rounded-full bg-gray-200 w-8 h-8 flex items-center justify-center font-bold">
              {client.name?.[0] || client.email?.[0] || "?"}
            </div>
            <div>
              <div className="font-medium">{client.name || client.email}</div>
              <div className="text-xs text-gray-500">
                {client.email} {client.mobile}
              </div>
            </div>
          </div>
        ))}
        <div
          className="p-2 cursor-pointer text-gray-500 hover:bg-gray-100"
          onClick={() => setClientId(null)}
          data-testid="client-clear"
        >
          Clear selection
        </div>
      </div>
      {clientId && clientMeta && (
        <div
          className="ml-4 inline-flex items-center gap-2"
          data-testid="selected-client-badge"
        >
          <span className="rounded-full bg-blue-100 px-3 py-1 font-bold">
            {clientMeta.name || clientMeta.email}
          </span>
          <button
            className="text-blue-600 underline text-sm"
            onClick={() => setClientId(null)}
          >
            Switch
          </button>
        </div>
      )}
    </div>
  );
}
