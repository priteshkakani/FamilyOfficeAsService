import React, { useEffect, useState } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { fetchConnectedSources } from "../../utils/dataSources";
import BankModal from "../modals/BankModal";
import EPFOModal from "../modals/EPFOModal";
// import { ClientProvider } from "../../hooks/useClientContext";

const TILES = [
  { key: "bank", label: "Bank" },
  { key: "mf", label: "Mutual Funds" },
  { key: "stocks", label: "Stocks" },
  { key: "insurance", label: "Insurance" },
  { key: "epfo", label: "EPFO" },
  { key: "itr", label: "ITR" },
];

export default function DataSourcesStep({ userId }) {
  const [connected, setConnected] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [ownerId, setOwnerId] = useState(userId || null);
  const [epfoSummaries, setEpfoSummaries] = useState([]);

  useEffect(() => {
    async function load() {
      let uid = userId;
      if (!uid) {
        // try to read from supabase session if parent didn't pass userId
        try {
          const mod = await import("../../supabaseClient");
          const { supabase } = mod;
          const { data: sessionData } = await supabase.auth.getSession();
          uid = sessionData?.session?.user?.id;
        } catch (e) {
          console.warn("DataSourcesStep: failed to get session", e);
        }
      }
      if (!uid) return setConnected([]);
      setOwnerId(uid);
      const list = await fetchConnectedSources(uid);
      setConnected(list || []);
      // fetch EPFO summaries if EPFO consent exists
      const hasEPFO = (list || []).some(
        (c) => (c.source || "").toLowerCase() === "epfo"
      );
      if (hasEPFO) {
        try {
          const token = (await import("../../supabaseClient")).supabase.auth
            .getSession()
            .then((r) => r.data.session?.access_token);
          const t = await token;
          const res = await fetch("/api/epfo/latest", {
            headers: {
              ...(t ? { Authorization: `Bearer ${t}` } : {}),
            },
          });
          if (res.ok) {
            const pj = await res.json();
            setEpfoSummaries(pj?.data ? [pj.data] : []);
          }
        } catch (e) {
          console.warn("Failed to fetch EPFO summaries", e);
        }
      }
    }
    load();
  }, [userId]);

  const handleOpen = (k) => setOpenModal(k);
  const handleClose = (refresh = false) => {
    setOpenModal(null);
    if (refresh) {
      const uid = ownerId || userId;
      if (uid)
        fetchConnectedSources(uid).then((list) => setConnected(list || []));
    }
  };

  return (
    <OnboardingLayout title="Connect Data Sources">
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        data-testid="onboarding-step-datasources"
      >
        {TILES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => handleOpen(t.key)}
            className="border border-gray-200 rounded-lg p-4 text-left hover:shadow"
            data-testid={`ds-${t.key}-open`}
          >
            <div className="text-sm font-medium">{t.label}</div>
            <div className="text-xs text-gray-500">Connect</div>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Connected Sources</h3>
        {!connected || connected.length === 0 ? (
          <div className="text-sm text-gray-500">No sources connected yet</div>
        ) : (
          <ul className="space-y-2">
            {connected.map((c) => (
              <li
                key={`${c.source}-${c.identifier || Math.random()}`}
                className="border p-2 rounded-md flex justify-between items-center"
              >
                <div>
                  <div className="text-sm font-medium">{c.source}</div>
                  <div className="text-xs text-gray-500">{c.identifier}</div>
                </div>
                <div className="text-sm">{c.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {epfoSummaries && epfoSummaries.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">EPFO Summary</h3>
          {epfoSummaries.map((s) => {
            const norm = s.normalized || {};
            return (
              <div key={s.id} className="border p-3 rounded-md bg-white">
                <div className="text-sm text-gray-600 mb-2">
                  Transaction: {s.transaction_id}
                </div>
                <table className="w-full text-sm mb-2">
                  <tbody>
                    <tr>
                      <td className="font-medium py-1">Member</td>
                      <td className="py-1">{norm.member_name || "—"}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">UAN</td>
                      <td className="py-1">{norm.uan || "—"}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Employer</td>
                      <td className="py-1">{norm.employer || "—"}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Balance</td>
                      <td className="py-1">{norm.balance ?? "—"}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Last contribution</td>
                      <td className="py-1">{norm.last_contribution || "—"}</td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Contributions</td>
                      <td className="py-1">
                        {norm.contributions_count ?? "—"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-medium py-1">Fetched at</td>
                      <td className="py-1">
                        {s.created_at || norm.normalized_at || "—"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <details className="text-xs mt-2">
                  <summary className="cursor-pointer text-blue-600">
                    Show raw JSON
                  </summary>
                  <pre className="text-xs max-h-48 overflow-auto bg-gray-50 p-2 rounded mt-2">
                    {JSON.stringify(s.raw, null, 2)}
                  </pre>
                </details>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Modals for data sources */}
      <BankModal
        open={openModal === "bank"}
        userId={ownerId || userId}
        onClose={handleClose}
      />
      <EPFOModal
        open={openModal === "epfo"}
        userId={ownerId || userId}
        onClose={handleClose}
      />
    </OnboardingLayout>
  );
}
