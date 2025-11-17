import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import supabase from "../../supabaseClient";

execute

```typescript
export default function GoalsTab() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [goalsRes, invRes, notesRes] = await Promise.all([
          supabase
            .from("goals")
            .select("*", { count: "exact" })
            .eq("user_id", user.id),
          supabase
            .from("investments")
            .select("*", { count: "exact" })
            .eq("user_id", user.id),
          supabase
            .from("goal_notes")
            .select("*", { count: "exact" })
            .eq("user_id", user.id)
            .maybeSingle(),
        ]);

        setGoals(goalsRes.data || []);
        setInvestments(invRes.data || []);
        setNotes(notesRes?.data?.notes || "");
      } catch (error) {
        console.error("Error fetching goals data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  // Calculate summary
  const totalCorpus = goals.reduce((sum, g) => sum + (g.target_amount || 0), 0);
  const totalInvested = goals.reduce((sum, g) => sum + (g.invested || 0), 0);
  const shortfall = totalCorpus - totalInvested;
  const surplus = totalInvested - totalCorpus;
  const totalGoals = goals.length;
  // Example: segregate SIP/Lumpsum
  const sip = investments.filter((i) => i.type === "SIP");
  const lumpsum = investments.filter((i) => i.type === "Lumpsum");

  // Suggestions (placeholder logic)
  const recommendedSIP = shortfall > 0 ? Math.ceil(shortfall / 12) : 0;
  const recommendedLumpsum = shortfall > 0 ? shortfall : 0;

  // Upcoming goals (next 12 months, 2–5 years)
  const now = new Date();
  const next12mo = goals.filter(
    (g) =>
      g.target_date &&
      new Date(g.target_date) > now &&
      new Date(g.target_date) <=
        new Date(now.getFullYear(), now.getMonth() + 12, now.getDate())
  );
  const next2to5y = goals.filter(
    (g) =>
      g.target_date &&
      new Date(g.target_date) >
        new Date(now.getFullYear(), now.getMonth() + 12, now.getDate()) &&
      new Date(g.target_date) <=
        new Date(now.getFullYear() + 5, now.getMonth(), now.getDate())
  );

  // Year-wise details
  const yearWise = {};
  goals.forEach((g) => {
    const year = g.target_date ? new Date(g.target_date).getFullYear() : "N/A";
    if (!yearWise[year]) yearWise[year] = [];
    yearWise[year].push(g);
  });

  if (loading) return <div>Loading goals…</div>;

  return (
    <div className="space-y-6">
      {/* Goal Summary Card */}
      <div className="bg-blue-50 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <div className="text-lg font-bold mb-1">Goal Summary</div>
          <div>
            Total Corpus Required:{" "}
            <span className="font-semibold">
              ₹{totalCorpus.toLocaleString()}
            </span>
          </div>
          <div>
            Total Invested:{" "}
            <span className="font-semibold">
              ₹{totalInvested.toLocaleString()}
            </span>
          </div>
          <div>
            Shortfall/Surplus:{" "}
            <span className={shortfall > 0 ? "text-red-600" : "text-green-600"}>
              {shortfall > 0
                ? `₹${shortfall.toLocaleString()}`
                : `+₹${surplus.toLocaleString()}`}
            </span>
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{totalGoals}</div>
          <div className="text-gray-600">Total Goals</div>
        </div>
      </div>

      {/* Investments mapped to goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-2">Investments mapped to goals</div>
          <div className="flex gap-4">
            <div>
              <div className="font-bold text-blue-700">SIP</div>
              <div>{sip.length} plans</div>
              <div>
                Total: ₹
                {sip
                  .reduce((sum, s) => sum + (s.amount || 0), 0)
                  .toLocaleString()}
              </div>
            </div>
            <div>
              <div className="font-bold text-green-700">Lumpsum</div>
              <div>{lumpsum.length} plans</div>
              <div>
                Total: ₹
                {lumpsum
                  .reduce((sum, l) => sum + (l.amount || 0), 0)
                  .toLocaleString()}
              </div>
            </div>
          </div>
        </div>
        {/* Pie chart placeholder */}
        <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center">
          <div className="font-semibold mb-2">Investment Split</div>
          <div className="h-32 w-32 flex items-center justify-center bg-gray-100 rounded-full">
            [Pie Chart]
          </div>
        </div>
      </div>

      {/* Additional Suggestions */}
      <div className="bg-yellow-50 rounded-xl p-4">
        <div className="font-semibold mb-2">Additional Suggestions</div>
        <div>
          Recommended Monthly SIP:{" "}
          <span className="font-bold">₹{recommendedSIP.toLocaleString()}</span>
        </div>
        <div>
          Recommended Lumpsum:{" "}
          <span className="font-bold">
            ₹{recommendedLumpsum.toLocaleString()}
          </span>
        </div>
        {shortfall <= 0 && (
          <div className="text-green-700 font-semibold mt-2">
            You are on track to meet your goals!
          </div>
        )}
      </div>

      {/* Upcoming Goals Timeline */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-2">Upcoming Goals</div>
        <div className="mb-2">Next 12 months:</div>
        {next12mo.length ? (
          <ul className="list-disc pl-6 mb-4">
            {next12mo.map((g) => (
              <li key={g.id}>
                {g.title} – {g.target_date} – ₹
                {g.target_amount?.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 mb-4">No goals in next 12 months</div>
        )}
        <div className="mb-2">2–5 years:</div>
        {next2to5y.length ? (
          <ul className="list-disc pl-6">
            {next2to5y.map((g) => (
              <li key={g.id}>
                {g.title} – {g.target_date} – ₹
                {g.target_amount?.toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500">No goals in 2–5 years</div>
        )}
      </div>

      {/* Goal Year-wise Details */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-2">Goal Year-wise Details</div>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-2 py-1">Goal Name</th>
              <th className="px-2 py-1">Year</th>
              <th className="px-2 py-1">Corpus</th>
              <th className="px-2 py-1">Invested</th>
              <th className="px-2 py-1">Remaining</th>
              <th className="px-2 py-1">Priority</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(yearWise).map(([year, goals]) =>
              goals.map((g, i) => (
                <tr key={g.id} className="border-b">
                  <td className="px-2 py-1">{g.title}</td>
                  <td className="px-2 py-1">{year}</td>
                  <td className="px-2 py-1">
                    ₹{g.target_amount?.toLocaleString()}
                  </td>
                  <td className="px-2 py-1">
                    ₹{g.invested?.toLocaleString() || 0}
                  </td>
                  <td className="px-2 py-1">
                    ₹
                    {(
                      (g.target_amount || 0) - (g.invested || 0)
                    ).toLocaleString()}
                  </td>
                  <td className="px-2 py-1">{g.priority}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Planner Notes */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="font-semibold mb-2">Planner Notes</div>
        <textarea
          className="w-full border rounded p-2 min-h-[80px]"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Advisor recommendations or notes for client"
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={async () => {
            if (!user?.id) return;
            await supabase
              .from("goal_notes")
              .upsert({ user_id: user.id, notes });
          }}
        >
          Save Notes
        </button>
      </div>
    </div>
  );
}
