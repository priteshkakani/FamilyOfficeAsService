import React, { useEffect, useState } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { fetchConnectedSources } from "../../utils/dataSources";
import BankModal from "../modals/BankModal";
import EPFOModal from "../modals/EPFOModal";

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

  useEffect(() => {
    async function load() {
      if (!userId) return;
      const list = await fetchConnectedSources(userId);
      setConnected(list || []);
    }
    load();
  }, [userId]);

  const handleOpen = (k) => setOpenModal(k);
  const handleClose = (refresh = false) => {
    setOpenModal(null);
    if (refresh && userId) {
      fetchConnectedSources(userId).then((list) => setConnected(list || []));
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

      {/* Modals for data sources */}
      <BankModal
        open={openModal === "bank"}
        userId={userId}
        onClose={handleClose}
      />
      <EPFOModal
        open={openModal === "epfo"}
        userId={userId}
        onClose={handleClose}
      />
    </OnboardingLayout>
  );
}
