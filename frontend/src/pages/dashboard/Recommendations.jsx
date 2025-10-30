import React from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import { getInvestmentRecs, getInsuranceRecs } from "../../lib/ruleEngine";

export default function Recommendations() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, profile, views, goals } = useClientData(userId);

  if (loading) return <div data-testid="recommendations-loading">Loading…</div>;

  const savingsRate = profile ? Math.round(((profile.monthly_income - profile.monthly_expenses) / (profile.monthly_income || 1)) * 100) : 0;
  const allocation = views?.allocation || [];
  // convert allocation array to map for engine
  const allocMap = allocation.reduce((acc, a) => {
    acc[a.category] = a.value || a.share || 0;
    return acc;
  }, {});

  const invRecs = getInvestmentRecs({ savingsRate, emergencyFundMonths: profile?.emergency_fund_months || 0, allocation: allocMap });
  const insRecs = getInsuranceRecs(profile, [], []);

  return (
    <div data-testid="recommendations-page">
      <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className="font-semibold mb-2">Investments</h3>
          <div className="space-y-3">
            {invRecs.map((r) => (
              <div key={r.id} className="bg-white rounded-xl shadow p-4" data-testid={`rec-inv-${r.id}`}>
                <div className="font-semibold">{r.title}</div>
                <div className="text-sm text-gray-500">{r.rationale}</div>
                <div className="mt-3">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" data-testid={`rec-inv-cta-${r.id}`}>{r.cta || 'Add Task'}</button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3 className="font-semibold mb-2">Insurance</h3>
          <div className="space-y-3">
            {insRecs.map((r) => (
              <div key={r.id} className="bg-white rounded-xl shadow p-4" data-testid={`rec-ins-${r.id}`}>
                <div className="font-semibold">{r.title}</div>
                <div className="text-sm text-gray-500">{r.rationale}</div>
                <div className="mt-3">
                  <button className="px-3 py-1 bg-blue-600 text-white rounded" data-testid={`rec-ins-cta-${r.id}`}>Add Task</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
import React from "react";

export default function Recommendations() {
  return <div data-testid="page-recommendations">Recommendations page (placeholder)</div>;
}
import React from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import { getInvestmentRecs, getInsuranceRecs } from "../../lib/ruleEngine";

export default function Recommendations() {
  const { selectedClient } = useClient();
  const { loading, profile, views, goals } = useClientData(selectedClient);

  const inv = getInvestmentRecs(
    profile || {},
    views.cashflow || [],
    views.allocation || []
  );
  const ins = getInsuranceRecs(profile || {}, [], []);

  return (
    <div data-testid="recommendations-page">
      <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className="text-lg font-medium mb-2">Investments</h3>
          {inv.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow p-4 mb-3">
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-500">{r.rationale}</div>
              <div className="mt-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  data-testid={`rec-addtask-${r.id}`}
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("task:add", {
                        detail: { title: r.title, notes: r.rationale },
                      })
                    )
                  }
                >
                  Add Task
                </button>
              </div>
            </div>
          ))}
        </section>
        <section>
          <h3 className="text-lg font-medium mb-2">Insurance</h3>
          {ins.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow p-4 mb-3">
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-500">{r.rationale}</div>
              <div className="mt-2">
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                  data-testid={`rec-addtask-${r.id}`}
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("task:add", {
                        detail: { title: r.title, notes: r.rationale },
                      })
                    )
                  }
                >
                  Add Task
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
