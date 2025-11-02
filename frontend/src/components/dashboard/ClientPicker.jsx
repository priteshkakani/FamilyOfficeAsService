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
    // Update URL
    window.history.replaceState({}, "", `/advisor/${client.id}`);
    // Optionally: trigger global refetch (if using react-query context)
    // window.dispatchEvent(new Event('advisor-client-changed'));
  };

  return (
    <div
      className="relative flex items-center gap-2"
      data-testid="client-picker"
    >
      <input
        type="text"
        className="border rounded px-3 py-2 w-64"
        placeholder="Search clients by name/email/mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        data-testid="client-search-input"
        onKeyDown={(e) => {
          if (e.key === "Enter") setDebounced(search);
        }}
      />
      <button
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded font-bold"
        onClick={() => setDebounced(search)}
        data-testid="client-search-button"
      >
        Search
      </button>
      <div className="absolute bg-white shadow rounded mt-2 w-64 z-10">
        {isLoading && <div className="p-2">Loading…</div>}
        {!isLoading && data && data.length === 0 && debounced && (
          <div className="p-2 text-gray-500">No clients found.</div>
        )}
        {!isLoading && data && data.length > 0 && (
          <ul className="divide-y">
            {data.map((client) => (
              <li
                key={client.id}
                className="p-2 cursor-pointer hover:bg-blue-50"
                onClick={() => handleSelect(client)}
                data-testid={`client-option-${client.id}`}
              >
                <div className="font-semibold">
                  {client.full_name || client.name}
                </div>
                <div className="text-xs text-gray-500">
                  {client.email} · {client.phone}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {isError && <div className="p-2 text-red-600">Error loading clients</div>}
      {clientId && clientMeta ? (
        <span
          className="ml-4 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold"
          data-testid="selected-client-badge"
        >
          Selected: {clientMeta.full_name || clientMeta.name || clientId}
        </span>
      ) : (
        <span
          className="ml-4 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs"
          data-testid="empty-client-state"
        >
          Select a client to begin.
        </span>
      )}
    </div>
  );
}
