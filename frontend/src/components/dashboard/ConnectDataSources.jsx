import React, { useEffect, useState } from "react";
import ITRModal from "../modals/ITRModal";
import UpcomingGoals from "./UpcomingGoals";
import { supabase } from "../../supabaseClient";
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
  // Diagnostics for totals
  if (statuses) {
    Object.entries(statuses).forEach(([key, statusObj]) => {
      if (statusObj && typeof statusObj.summary === "object") {
        Object.entries(statusObj.summary).forEach(([k, v]) => {
          if (k.toLowerCase().includes("total")) {
            console.log(`[TotalDebug] ${key} ${k}:`, v);
          }
        });
      }
    });
  }
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id || null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id || null);
      }
    );
    return () => listener?.unsubscribe?.();
  }, []);
  console.log("[Debug] ConnectDataSources component is rendering");
  React.useEffect(() => {
    console.log(
      "[ITRModal Debug] modalVisible:",
      modalVisible,
      "modalType:",
      modalType
    );
  }, [modalVisible, modalType]);
  const [statuses, setStatuses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [itrForm, setItrForm] = useState({ pan: "", year: "" });
  // Modal state for EPFO / ITR flows
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'itr' | 'epfo' | null
  const [modalForm, setModalForm] = useState({
    pan: "",
    year: "",
    mobile: "",
    otp: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    fetchStatuses();
  }, []);
  // Centralized refresh for goals
  window.refreshGoals = async function () {
    // This can be called after goal save
    // If you use context, trigger context update here
    // Otherwise, force re-render or refetch in UpcomingGoals
    // For demo, just log
    console.log("[refreshGoals] called");
  };
  window.refreshConnectedSources = fetchStatuses;

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
    console.log(
      `[Button Click] handleConnect called for key: ${key}, endpoint: ${endpoint}`
    );
    if (key === "itr") {
      console.log("[ITRModal] Opening modal for ITR");
    }
    // Open modal for EPFO and ITR so user can enter required fields
    if (key === "itr") {
      setModalType("itr");
      setModalForm({ pan: "", year: "", mobile: "", otp: "" });
      setModalError("");
      setModalVisible(true);
      return;
    }
    if (key === "epfo") {
      setModalType("epfo");
      setModalForm({ pan: "", year: "", mobile: "", otp: "" });
      setModalError("");
      setModalVisible(true);
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
    // keep backward compatible but now we use modalForm
    setModalLoading(true);
    setModalError("");
    try {
      const body = {
        pan: modalForm.pan || itrForm.pan,
        year: modalForm.year || itrForm.year,
      };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setModalVisible(false);
        setModalForm({ pan: "", year: "", mobile: "", otp: "" });
        await fetchStatuses();
      } else {
        const err = await res.json();
        setModalError(err.detail || "Failed to connect ITR");
      }
    } catch (e) {
      setModalError("Network error");
    } finally {
      setModalLoading(false);
    }
  }

  async function submitEpfoForm(endpoint) {
    setModalLoading(true);
    setModalError("");
    try {
      const body = { pan: modalForm.pan, mobile: modalForm.mobile };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        // Normally Surepass returns txn id — you may want to prompt for OTP next.
        setModalVisible(false);
        setModalForm({ pan: "", year: "", mobile: "", otp: "" });
        await fetchStatuses();
      } else {
        const err = await res.json();
        setModalError(err.detail || "Failed to generate EPFO OTP");
      }
    } catch (e) {
      setModalError("Network error");
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="absolute top-6 right-8">
        <a
          href="/onboarding"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          data-testid="link-onboarding"
        >
          Go to Onboarding
        </a>
      </div>
      {/* Render ITRModal when modalVisible and modalType is 'itr' */}
      {modalVisible && modalType === "itr" && (
        <ITRModal
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          userId={userId}
        />
      )}
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Connect Data Sources</h1>
          {lastSynced && (
            <span className="text-sm text-gray-500">
              Last synced: {new Date(lastSynced).toLocaleString()}
            </span>
          )}
        </div>
        {/* Render UpcomingGoals below header */}
        <div className="mb-8">
          <UpcomingGoals userId={userId} />
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
                console.log(`[CardGrid Debug] Rendering card for: ${ds.key}`);
                const statusObj = statuses[ds.key] || {};
                const status = statusObj.status || "not_connected";
                // Diagnostics for totals
                if (statusObj && typeof statusObj.summary === "object") {
                  Object.entries(statusObj.summary).forEach(([k, v]) => {
                    if (k.toLowerCase().includes("total")) {
                      console.log(`[TotalDebug] ${ds.key} ${k}:`, v);
                    }
                  });
                }
                STATUS_BADGE[status] || STATUS_BADGE.not_connected;
                const summary = statusObj.summary;
                return (
                  <div
                    key={ds.key}
                    className="bg-white rounded-xl shadow p-6 flex flex-col items-center min-h-[220px] focus-within:ring-2 focus-within:ring-blue-400"
                    tabIndex={0}
                    aria-label={ds.title + " data source card"}
                  >
                    {ds.key === "itr" && (
                      <div style={{ color: "red", fontWeight: "bold" }}>
                        ITR Button Debug: Should be visible
                      </div>
                    )}
                    <div className="mb-2">{ds.icon}</div>
                    <div className="text-lg font-semibold mb-1">{ds.title}</div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium mb-3 ${badge.color}`}
                      aria-label={`Status: ${badge.text}`}
                    >
                      {badge.text}
                    </span>
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
                      {ds.key === "itr" &&
                      status === "not_connected" &&
                      !showItrForm ? (
                        <button
                          className={`w-full py-2 px-4 rounded bg-blue-600 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50 mt-auto ${
                            actionLoading[ds.key]
                              ? "opacity-60 cursor-wait"
                              : "hover:bg-blue-700"
                          }`}
                          onClick={() => {
                            console.log(
                              `[Button Click] ${ds.key} Connect button clicked`
                            );
                            handleConnect(ds.key, ds.connectEndpoint);
                          }}
                          disabled={actionLoading[ds.key]}
                          aria-label="Connect"
                          data-testid="open-itr"
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
                          onClick={() => {
                            console.log(
                              `[Button Click] ${ds.key} ${status} button clicked`
                            );
                            handleConnect(ds.key, ds.connectEndpoint);
                          }}
                          disabled={actionLoading[ds.key]}
                          aria-label={
                            status === "connected"
                              ? "Manage"
                              : status === "partial"
                              ? "Reconnect"
                              : "Connect"
                          }
                          data-testid={
                            ds.key === "itr" ? "open-itr" : undefined
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
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default ConnectDataSources;
