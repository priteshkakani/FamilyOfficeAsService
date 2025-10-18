import React, { useState, useEffect } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

const ROWS = [
  { key: "home_loan", label: "Home Loan" },
  { key: "car_loan", label: "Car Loan" },
  { key: "personal_loan", label: "Personal Loan" },
  { key: "credit_card", label: "Credit Card Outstanding" },
  { key: "other", label: "Other" },
];

export default function LiabilitiesSummaryStep({ userId, onChange }) {
  const [rows, setRows] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("liabilities_summary")
        .eq("id", userId)
        .maybeSingle();
      if (data) {
        const next = data.liabilities_summary || {};
        setRows(next);
        if (typeof onChange === "function") onChange(next);
      }
    })();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { liabilities_summary: rows };
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, ...payload });
      if (error) throw error;
      // Insert rows into liabilities table
      const toInsert = Object.keys(rows).map((k) => ({
        user_id: userId,
        type: k,
        ...rows[k],
      }));
      if (toInsert.length > 0)
        await supabase.from("liabilities").insert(toInsert);
      notifySuccess("Liabilities saved");
    } catch (e) {
      console.error("[LiabilitiesSummaryStep][save]", e.message);
      notifyError("Failed to save liabilities");
    } finally {
      setSaving(false);
    }
  };

  const updateCell = (key, field, value) =>
    setRows((prev) => {
      const next = { ...prev, [key]: { ...(prev[key] || {}), [field]: value } };
      if (typeof onChange === "function") onChange(next);
      return next;
    });

  return (
    <OnboardingLayout title="Liabilities Summary">
      <div className="space-y-5" data-testid="onboarding-step-liabilities">
        {ROWS.map((r) => (
          <div key={r.key} className="border p-3 rounded-md">
            <div className="font-medium mb-2">{r.label}</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <input
                data-testid={`liab-${r.key}-amount`}
                placeholder="Outstanding Amount"
                type="number"
                value={rows[r.key]?.outstanding_amount || ""}
                onChange={(e) =>
                  updateCell(r.key, "outstanding_amount", e.target.value)
                }
                className="border rounded-lg p-2"
              />
              <input
                data-testid={`liab-${r.key}-rate`}
                placeholder="Interest Rate (%)"
                type="number"
                value={rows[r.key]?.interest_rate || ""}
                onChange={(e) =>
                  updateCell(r.key, "interest_rate", e.target.value)
                }
                className="border rounded-lg p-2"
              />
              <input
                data-testid={`liab-${r.key}-emi`}
                placeholder="EMI"
                type="number"
                value={rows[r.key]?.emi_amount || ""}
                onChange={(e) =>
                  updateCell(r.key, "emi_amount", e.target.value)
                }
                className="border rounded-lg p-2"
              />
              <input
                data-testid={`liab-${r.key}-due`}
                placeholder="Next due (YYYY-MM-DD)"
                value={rows[r.key]?.next_due_date || ""}
                onChange={(e) =>
                  updateCell(r.key, "next_due_date", e.target.value)
                }
                className="border rounded-lg p-2"
              />
            </div>
          </div>
        ))}

        <div>
          <button
            disabled={saving}
            onClick={handleSave}
            data-testid="submit-button"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5"
          >
            {saving ? "Saving..." : "Save Liabilities"}
          </button>
        </div>
      </div>
    </OnboardingLayout>
  );
}
