import React, { useEffect, useState } from "react";
import { useClient } from "../../hooks/useClientContext";
import supabase from "../../supabaseClient";

export default function ClientSwitcher() {
  const { selectedClient, setSelectedClient } = useClient();
  const [clients, setClients] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .limit(100);
        if (error) throw error;
        if (mounted) setClients(data || []);
      } catch (err) {
        console.error("[ClientSwitcher] failed to load clients", err);
      }
    };
    fetchClients();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    // pick the first client as default when none selected
    if (!selectedClient && clients && clients.length)
      setSelectedClient(clients[0]);
  }, [clients, selectedClient, setSelectedClient]);

  const filtered = clients.filter(
    (c) =>
      !q ||
      (c.full_name || "").toLowerCase().includes(q.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="relative" data-testid="client-switcher">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search clients..."
          className="border rounded px-2 py-1 text-sm w-44"
          data-testid="client-search"
        />
        <select
          value={(selectedClient && selectedClient.id) || ""}
          onChange={(e) => {
            const id = e.target.value;
            const found = clients.find((c) => c.id === id) || null;
            setSelectedClient(found);
          }}
          className="border rounded px-2 py-1 text-sm"
          data-testid="client-select"
        >
          <option value="">Select client</option>
          {filtered.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name || c.email}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
