import React, { useState } from "react";
import { useClient } from "../../hooks/useClientContext";
import { supabase } from "../../supabaseClient";
export default function Recommendations() {
  const { selectedClient } = useClient();
  const [inv, setInv] = useState([]);
  const [ins, setIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  React.useEffect(() => {
    async function fetchRecs() {
      setLoading(true);
      setError("");
      try {
        const [invRes, insRes] = await Promise.all([
          supabase
            .from("investment_recommendations")
            .select("id, title, description, priority, created_at")
            .eq("user_id", selectedClient),
          supabase
            .from("insurance_recommendations")
            .select("id, title, description, priority, created_at")
            .eq("user_id", selectedClient),
        ]);
        if (invRes.error || insRes.error) throw invRes.error || insRes.error;
        setInv(invRes.data || []);
        setIns(insRes.data || []);
      } catch (err) {
        setError("Failed to load recommendations");
      }
      setLoading(false);
    }
    if (selectedClient) fetchRecs();
  }, [selectedClient]);

  if (loading)
    return (
      <div
        data-testid="recommendations-loading"
        aria-busy="true"
        className="p-4"
      >
        Loading recommendations…
      </div>
    );
  if (error)
    return (
      <div
        data-testid="recommendations-error"
        role="alert"
        className="p-4 text-red-600"
      >
        {error}
      </div>
    );

  const handleAddTask = (r) => {
    window.dispatchEvent(
      new CustomEvent("task:add", {
        detail: { title: r.title, notes: r.rationale },
      })
    );
    setFeedback(`Added to Next Steps: ${r.title}`);
    setTimeout(() => setFeedback(""), 2000);
  };

  return (
    <div data-testid="recommendations-page" className="p-4">
      <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
      {feedback && (
        <div
          className="text-green-600 mb-2"
          role="status"
          data-testid="recommendations-feedback"
        >
          {feedback}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className="text-lg font-medium mb-2">Investments</h3>
          {inv.length === 0 ? (
            <div
              className="text-gray-500"
              data-testid="recommendations-empty-inv"
            >
              No investment recommendations.
            </div>
          ) : (
            inv.map((r) => (
              <div key={r.id} className="bg-white rounded-xl shadow p-4 mb-3">
                <div className="font-semibold">{r.title}</div>
                <div className="text-sm text-gray-500 mb-1">
                  {r.description}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Priority: {r.priority}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  Created:{" "}
                  {r.created_at && new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </section>
        <section>
          <h3 className="text-lg font-medium mb-2">Insurance</h3>
          {ins.length === 0 ? (
            <div
              className="text-gray-500"
              data-testid="recommendations-empty-ins"
            >
              No insurance recommendations.
            </div>
          ) : (
            ins.map((r) => (
              <div key={r.id} className="bg-white rounded-xl shadow p-4 mb-3">
                <div className="font-semibold">{r.title}</div>
                <div className="text-sm text-gray-500 mb-1">
                  {r.description}
                </div>
                <div className="text-xs text-gray-400 mb-1">
                  Priority: {r.priority}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  Created:{" "}
                  {r.created_at && new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
