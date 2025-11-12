import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ClientPicker({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [empty, setEmpty] = useState(false);

  const searchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clients")
      .select("id, name, email, phone")
      .ilike("name", `%${query}%`);
    setLoading(false);
    if (error || !data || data.length === 0) {
      setResults([]);
      setEmpty(true);
    } else {
      setResults(data);
      setEmpty(false);
    }
  };

  const handleSelect = (client) => {
    setSelected(client);
    localStorage.setItem("selectedClientId", client.id);
    window.history.replaceState({}, "", `/advisor/${client.id}`);
    if (onSelect) onSelect(client.id);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && searchClients()}
        placeholder="Search clients..."
        className="border rounded px-2 py-1"
        data-testid="client-search-input"
      />
      <button
        onClick={searchClients}
        className="bg-blue-500 text-white px-3 py-1 rounded"
        data-testid="client-search-button"
      >
        Search
      </button>
      <div className="relative">
        {loading && (
          <div className="absolute left-0 mt-2 text-xs">Searching…</div>
        )}
        {results.length > 0 && (
          <ul className="absolute left-0 mt-2 bg-white border rounded shadow w-64 z-10">
            {results.map((c) => (
              <li
                key={c.id}
                className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                onClick={() => handleSelect(c)}
                data-testid={`client-option-${c.id}`}
              >
                {c.name}{" "}
                <span className="text-xs text-gray-500">
                  {c.email} · {c.phone}
                </span>
              </li>
            ))}
          </ul>
        )}
        {empty && (
          <div className="absolute left-0 mt-2 text-xs text-gray-500">
            No clients found.
          </div>
        )}
      </div>
      {selected && (
        <span
          className="ml-4 px-2 py-1 bg-green-100 text-green-700 rounded"
          data-testid="selected-client-badge"
        >
          {selected.name}
        </span>
      )}
    </div>
  );
}
