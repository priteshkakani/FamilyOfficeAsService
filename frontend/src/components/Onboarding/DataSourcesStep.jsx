import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import LoadingSpinner from "../LoadingSpinner";
import { fetchConnectedSources } from "../../utils/helpers";
import BankModal from "../modals/BankModal";
import MutualFundModal from "../modals/MutualFundModal";
import StocksModal from "../modals/StocksModal";
import InsuranceModal from "../modals/InsuranceModal";
import EPFOModal from "../modals/EPFOModal";
import ITRModal from "../modals/ITRModal";

const SOURCES = [
  { key: "bank", label: "Bank" },
  { key: "mutual_funds", label: "Mutual Funds" },
  { key: "stocks", label: "Stocks" },
  { key: "insurance", label: "Insurance" },
  { key: "epfo", label: "EPFO" },
  { key: "itr", label: "ITR" },
];

const MODALS = {
  bank: BankModal,
  mutual_funds: MutualFundModal,
  stocks: StocksModal,
  insurance: InsuranceModal,
  epfo: EPFOModal,
  itr: ITRModal,
};

export default function DataSourcesStep() {
  const [openModal, setOpenModal] = useState(null);
  const [connected, setConnected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchUserAndSources() {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        if (!user) throw new Error("No user session");
        setUserId(user.id);
        const sources = await fetchConnectedSources(supabase, user.id);
        if (mounted) setConnected(sources);
      } catch (e) {
        if (mounted) setConnected([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndSources();
    return () => {
      mounted = false;
    };
  }, []);

  const handleOpenModal = (key) => setOpenModal(key);
  const handleCloseModal = (refresh) => {
    setOpenModal(null);
    if (refresh && userId) {
      fetchConnectedSources(supabase, userId).then(setConnected);
    }
  };

  return (
    <div data-testid="onboarding-step-datasources">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Connect Data Sources
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {SOURCES.map((src) => (
          <button
            key={src.key}
            className="bg-gray-100 hover:bg-blue-50 border border-gray-200 rounded-xl p-6 flex flex-col items-center shadow transition focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => handleOpenModal(src.key)}
            data-testid={`ds-${src.key}-open`}
            aria-label={`Connect ${src.label}`}
          >
            <span className="text-lg font-medium text-gray-700 mb-2">
              {src.label}
            </span>
            <span className="text-xs text-gray-400">
              {connected.find((c) => c.source.toLowerCase() === src.key)
                ? "Connected"
                : "Not Connected"}
            </span>
          </button>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">
          Connected Sources
        </h3>
        {loading ? (
          <LoadingSpinner text="Loading connected sources..." />
        ) : connected.length === 0 ? (
          <div className="text-gray-400">No sources connected yet.</div>
        ) : (
          <ul className="space-y-1">
            {connected.map((c, i) => (
              <li key={i} className="text-gray-700 text-sm">
                {c.source} ({c.identifier}) -{" "}
                <span className="text-xs text-gray-500">{c.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Modals */}
      {openModal &&
        MODALS[openModal] &&
        React.createElement(MODALS[openModal], {
          open: true,
          onClose: handleCloseModal,
          userId,
        })}
    </div>
  );
}
