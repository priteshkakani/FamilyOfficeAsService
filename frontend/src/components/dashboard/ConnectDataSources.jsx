import React, { useEffect, useState } from "react";
import {
  FaUniversity,
  FaPiggyBank,
  FaChartLine,
  FaShieldAlt,
  FaIdBadge,
  FaFileAlt,
} from "react-icons/fa";

const DATA_SOURCES = [
  {
    key: "bank",
    title: "Bank",
    icon: <FaUniversity size={32} />,
    connectEndpoint: "/api/bank/connect",
  },
  {
    key: "mutualfunds",
    title: "Mutual Funds",
    icon: <FaPiggyBank size={32} />,
    connectEndpoint: "/api/mf/connect",
  },
  {
    key: "stocks",
    title: "Stocks",
    icon: <FaChartLine size={32} />,
    connectEndpoint: "/api/stocks/connect",
  },
  {
    key: "insurance",
    title: "Insurance",
    icon: <FaShieldAlt size={32} />,
    connectEndpoint: "/api/insurance/connect",
  },
  {
    key: "epfo",
    title: "EPFO",
    icon: <FaIdBadge size={32} />,
    connectEndpoint: "/api/surepass/epfo/generate-otp",
  },
  {
    key: "itr",
    title: "ITR",
    icon: <FaFileAlt size={32} />,
    connectEndpoint: "/api/surepass/itr/connect",
  },
];

const STATUS_BADGE = {
  connected: { text: "Connected", color: "bg-green-100 text-green-800" },
  partial: { text: "Partial", color: "bg-yellow-100 text-yellow-800" },
  error: { text: "Error", color: "bg-red-100 text-red-800" },
  not_connected: { text: "Not Connected", color: "bg-gray-100 text-gray-800" },
};

function ConnectDataSources() {
  const [statuses, setStatuses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [itrForm, setItrForm] = useState({ pan: "", year: "" });
  // Track ITR form per card (avoid global reset)
  const [showItrForm, setShowItrForm] = useState(false);
  const [itrError, setItrError] = useState("");

  useEffect(() => {
    fetchStatuses();
  }, []);

  async function fetchStatuses() {
    setLoading(true);
    try {
      const res = await fetch("/api/datasources/status");
      const data = await res.json();
      setStatuses(data.statuses || {});
      setLastSynced(data.last_synced || null);
    } catch (e) {
      setStatuses({});
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect(key, endpoint) {
    if (key === "itr") {
      setShowItrForm(true);
      return;
    }
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(endpoint, { method: "POST" });
      if (res.ok) {
        await fetchStatuses();
      }
    } catch (e) {
      // Optionally show error
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  }

  async function submitItrForm(endpoint) {
    setActionLoading((prev) => ({ ...prev, itr: true }));
    setItrError("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pan: itrForm.pan, year: itrForm.year }),
      });
      if (res.ok) {
        setShowItrForm(false);
        setItrForm({ pan: "", year: "" });
        await fetchStatuses();
      } else {
        const err = await res.json();
        setItrError(err.detail || "Failed to connect ITR");
      }
    } catch (e) {
      setItrError("Network error");
    } finally {
      setActionLoading((prev) => ({ ...prev, itr: false }));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Connect Data Sources</h1>
          {lastSynced && (
            <span className="text-sm text-gray-500">
              Last synced: {new Date(lastSynced).toLocaleString()}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? DATA_SOURCES.map((ds) => (
                <div
                  key={ds.key}
                  className="animate-pulse bg-white rounded-xl shadow p-6 flex flex-col items-center min-h-[220px]"
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full mb-4" />
                  <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-16 bg-gray-200 rounded mb-4" />
                  <div className="h-10 w-32 bg-gray-200 rounded" />
                </div>
              ))
            : DATA_SOURCES.map((ds) => {
                const statusObj = statuses[ds.key] || {};
                const status = statusObj.status || "not_connected";
                const badge =
                  STATUS_BADGE[status] || STATUS_BADGE.not_connected;
                const summary = statusObj.summary;
                return (
                  <div
                    key={ds.key}
                    className="bg-white rounded-xl shadow p-6 flex flex-col items-center min-h-[220px] focus-within:ring-2 focus-within:ring-blue-400"
                    tabIndex={0}
                    aria-label={ds.title + " data source card"}
                  >
                    <div className="mb-2">{ds.icon}</div>
                    <div className="text-lg font-semibold mb-1">{ds.title}</div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium mb-3 ${badge.color}`}
                      aria-label={`Status: ${badge.text}`}
                    >
                      {badge.text}
                    </span>
                    {ds.key === "itr" && showItrForm ? (
                      <form
                        className="w-full mb-3 flex flex-col gap-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          submitItrForm(ds.connectEndpoint);
                        }}
                        aria-label="ITR Connect Form"
                      >
                        <input
                          type="text"
                          className="border rounded px-2 py-1"
                          placeholder="PAN"
                          value={itrForm.pan}
                          onChange={(e) =>
                            setItrForm((f) => ({ ...f, pan: e.target.value }))
                          }
                          required
                          aria-label="PAN"
                        />
                        <input
                          type="text"
                          className="border rounded px-2 py-1"
                          placeholder="Year (e.g. 2024)"
                          value={itrForm.year}
                          onChange={(e) =>
                            setItrForm((f) => ({ ...f, year: e.target.value }))
                          }
                          required
                          aria-label="Year"
                        />
                        {itrError && (
                          <div className="text-red-600 text-xs">{itrError}</div>
                        )}
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className={`py-2 px-4 rounded bg-blue-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 ${
                              actionLoading.itr
                                ? "opacity-60 cursor-wait"
                                : "hover:bg-blue-700"
                            }`}
                            disabled={actionLoading.itr}
                          >
                            {actionLoading.itr ? "Connecting..." : "Submit"}
                          </button>
                          <button
                            type="button"
                            className="py-2 px-4 rounded bg-gray-200 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400"
                            onClick={() => {
                              setShowItrForm(false);
                              setItrError("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        {summary &&
                        (status === "connected" || status === "partial") ? (
                          <div
                            className="w-full mb-3 text-xs bg-gray-50 rounded p-2 text-gray-700"
                            aria-live="polite"
                          >
                            {typeof summary === "object" ? (
                              Object.entries(summary).map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="font-medium text-gray-600">
                                    {k}:
                                  </span>
                                  <span>{String(v)}</span>
                                </div>
                              ))
                            ) : (
                              <span>{summary}</span>
                            )}
                          </div>
                        ) : (
                          <div className="mb-3 text-xs text-gray-500">
                            No sources connected yet
                          </div>
                        )}
                        {ds.key === "itr" && status === "not_connected" && !showItrForm ? (
                          <button
                            className={`w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 mt-auto ${
                              actionLoading[ds.key]
                                ? "opacity-60 cursor-wait"
                                : "hover:bg-blue-700"
                            }`}
                            onClick={() => handleConnect(ds.key, ds.connectEndpoint)}
                            disabled={actionLoading[ds.key]}
                            aria-label="Connect"
                          >
                            {actionLoading[ds.key] ? "Loading..." : "Connect"}
                          </button>
                        ) : (
                          <button
                            className={`w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 mt-auto ${
                              actionLoading[ds.key]
                                ? "opacity-60 cursor-wait"
                                : "hover:bg-blue-700"
                            }`}
                            onClick={() => handleConnect(ds.key, ds.connectEndpoint)}
                            disabled={actionLoading[ds.key]}
                            aria-label={
                              status === "connected"
                                ? "Manage"
                                : status === "partial"
                                ? "Reconnect"
                                : "Connect"
                            }
                          >
                            {actionLoading[ds.key]
                              ? "Loading..."
                              : status === "connected"
                              ? "Manage"
                              : status === "partial"
                              ? "Reconnect"
                              : "Connect"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default ConnectDataSources;
