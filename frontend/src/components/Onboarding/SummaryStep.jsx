import React, { useEffect, useState } from "react";
import formatINR from "../../utils/formatINR";
import { supabase } from "../../supabaseClient";

export default function SummaryStep() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await supabase.auth.getUser();
      const userId = user?.data?.user?.id;
      if (!userId) throw new Error("No user session");
      // Family Members
      const { data: family, error: famErr } = await supabase
        .from("family_members")
        .select("id,name,relation")
        .eq("user_id", userId);
      console.log("[Summary][family]", family);
      // Data Sources
      const { data: sources, error: srcErr } = await supabase
        .from("consents")
        .select("source,identifier,status")
        .eq("user_id", userId);
      console.log("[Summary][sources]", sources);
      // Profile
      const { data: profile, error: profErr } = await supabase
        .from("profiles")
        .select("full_name,email,mobile_number,monthly_income,monthly_expenses")
        .eq("id", userId)
        .maybeSingle();
      console.log("[Summary][profile]", profile);
      // Liabilities
      const { data: liabilities, error: liabErr } = await supabase
        .from("liabilities")
        .select("type,institution,outstanding_amount")
        .eq("user_id", userId);
      console.log("[Summary][liabilities]", liabilities);
      // Goals
      const { data: goals, error: goalsErr } = await supabase
        .from("goals")
        .select(
          "title,target_amount,target_date,target_year,priority,is_completed"
        )
        .eq("user_id", userId);
      console.log("[Summary][goals]", goals);
      setData({
        full_name: profile?.full_name || "",
        email: profile?.email || "",
        mobile_number: profile?.mobile_number || "",
        family_members: family?.length ? family : [],
        data_sources: sources?.length ? sources : [],
        monthly_income: formatINR(profile?.monthly_income),
        monthly_expenses: formatINR(profile?.monthly_expenses),
        liabilities: liabilities?.length ? liabilities : [],
        goals: goals?.length ? goals : [],
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5">
        <div className="mb-4 font-medium">
          Review your details before finishing onboarding:
        </div>
        <div className="mb-2">
          <b>Name:</b> {data.full_name}
        </div>
        <div className="mb-2">
          <b>Email:</b> {data.email}
        </div>
        <div className="mb-2">
          <b>Mobile:</b> {data.mobile_number}
        </div>
        <div className="mb-2" data-testid="summary-family">
          <b>Family Members:</b>
          {data.family_members.length === 0 ? (
            <div className="text-gray-500">None added yet.</div>
          ) : (
            <ul className="list-disc ml-6">
              {data.family_members.map((m, i) => (
                <li key={i}>
                  {m.name} ({m.relation})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-2" data-testid="summary-sources">
          <b>Data Sources:</b>
          {data.data_sources.length === 0 ? (
            <div className="text-gray-500">No sources connected.</div>
          ) : (
            <ul className="list-disc ml-6">
              {data.data_sources.map((s, i) => (
                <li key={i}>
                  {s.source} ({s.status})
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-2" data-testid="summary-income">
          <b>Monthly Income:</b> {data.monthly_income || formatINR(0)}
        </div>
        <div className="mb-2" data-testid="summary-expenses">
          <b>Monthly Expenses:</b> {data.monthly_expenses || formatINR(0)}
        </div>
        <div className="mb-2" data-testid="summary-liabilities">
          <b>Liabilities:</b>
          {data.liabilities.length === 0 ? (
            <div className="text-gray-500">No liabilities recorded.</div>
          ) : (
            <ul className="list-disc ml-6">
              {data.liabilities.map((l, i) => (
                <li key={i}>
                  {l.type} - {l.institution} - {formatINR(l.outstanding_amount)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-2" data-testid="summary-goals">
          <b>Goals:</b>
          {data.goals.length === 0 ? (
            <div className="text-gray-500">No goals yet.</div>
          ) : (
            <ul className="list-disc ml-6">
              {data.goals.map((g, i) => (
                <li key={i}>
                  {g.title} - {formatINR(g.target_amount)} -{" "}
                  {g.target_date ||
                    (g.target_year ? `${g.target_year}-12-31` : "")}{" "}
                  - {g.priority}
                </li>
              ))}
            </ul>
          )}
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={fetchAll}
            disabled={loading}
          >
            Refresh
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => (window.location.href = "/onboarding/documents")}
            disabled={loading}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
