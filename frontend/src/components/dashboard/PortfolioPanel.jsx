import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import formatINR from "../../utils/formatINR";
import { notifyError, notifySuccess } from "../../utils/toast";
import chartColors from "./chartColors";

const CATEGORIES = [
  "stocks",
  "mutual_funds",
  "land",
  "house",
  "gold",
  "liquid",
  "epfo",
  "others",
];

function normalizeCategory(cat) {
  cat = (cat || "").toLowerCase();
  if (CATEGORIES.includes(cat)) return cat;
  return "others";
}

export default function PortfolioPanel() {
  const [assets, setAssets] = useState([]);
  const [alloc, setAlloc] = useState([]);
  const [netWorth, setNetWorth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    category: "stocks",
    amount: "",
    as_of_date: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: assetRows } = await supabase.from("assets").select("*");
        setAssets(assetRows || []);
        // Asset allocation
        const allocMap = {};
        (assetRows || []).forEach((a) => {
          const cat = normalizeCategory(a.category);
          allocMap[cat] = (allocMap[cat] || 0) + Number(a.amount || 0);
        });
        const allocArr = CATEGORIES.map((cat, i) => ({
          category: cat,
          value: allocMap[cat] || 0,
          color: chartColors[i % chartColors.length],
        })).filter((a) => a.value > 0);
        setAlloc(allocArr);
        // Net worth
        const { data: nwRows } = await supabase
          .from("vw_net_worth")
          .select("net_worth")
          .maybeSingle();
        setNetWorth(nwRows?.net_worth || 0);
      } catch (err) {
        notifyError("Failed to load portfolio");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      category: row.category,
      amount: row.amount,
      as_of_date: row.as_of_date,
    });
  };

  const handleSave = async () => {
    try {
      if (!form.name || !form.category || !form.amount)
        return notifyError("All fields required");
      // Get user_id from localStorage/session (example, adjust as needed)
      const user_id = localStorage.getItem("user_id");
      const payload = { ...form, amount: Number(form.amount), user_id };
      if (editingId) {
        const { error } = await supabase
          .from("assets")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        notifySuccess("Asset updated");
      } else {
        const { error } = await supabase.from("assets").insert(payload);
        if (error) throw error;
        notifySuccess("Asset added");
      }
      setEditingId(null);
      setForm({ name: "", category: "stocks", amount: "", as_of_date: "" });
      // Reload
      const { data: assetRows } = await supabase.from("assets").select("*");
      setAssets(assetRows || []);
    } catch (err) {
      notifyError("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this asset?")) return;
    try {
      const { error } = await supabase.from("assets").delete().eq("id", id);
      if (error) throw error;
      notifySuccess("Asset deleted");
      setAssets(assets.filter((a) => a.id !== id));
    } catch (err) {
      notifyError("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="w-full md:w-1/2">
          <h3 className="font-semibold mb-2">Asset Allocation</h3>
          <div
            data-testid="alloc-donut"
            className="bg-white rounded shadow p-4"
          >
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={alloc}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {alloc.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={formatINR} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="text-lg font-bold" data-testid="kpi-net-worth">
            Net Worth: {formatINR(netWorth)}
          </div>
          <div className="text-md font-medium mt-2">
            Total Assets: {formatINR(alloc.reduce((s, a) => s + a.value, 0))}
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Assets</h3>
        <table className="w-full text-sm" data-testid="assets-table">
          <thead>
            <tr className="bg-gray-50">
              <th>Name</th>
              <th>Category</th>
              <th>Amount</th>
              <th>% of Total</th>
              <th>As of Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((row) => {
              const totalAssets = alloc.reduce((s, a) => s + a.value, 0);
              const catAlloc = alloc.find(
                (a) => a.category === normalizeCategory(row.category)
              );
              const percent =
                catAlloc && totalAssets
                  ? ((Number(row.amount) / totalAssets) * 100).toFixed(1)
                  : "0";
              return (
                <tr key={row.id} className="border-b">
                  <td>
                    {editingId === row.id ? (
                      <input
                        value={form.name}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, name: e.target.value }))
                        }
                        onBlur={handleSave}
                        className="border rounded px-2"
                      />
                    ) : (
                      row.name
                    )}
                  </td>
                  <td>
                    {editingId === row.id ? (
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, category: e.target.value }))
                        }
                        onBlur={handleSave}
                        className="border rounded px-2"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    ) : (
                      row.category
                    )}
                  </td>
                  <td>
                    {editingId === row.id ? (
                      <input
                        type="number"
                        value={form.amount}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, amount: e.target.value }))
                        }
                        onBlur={handleSave}
                        className="border rounded px-2"
                      />
                    ) : (
                      formatINR(row.amount)
                    )}
                  </td>
                  <td>{percent}%</td>
                  <td>
                    {editingId === row.id ? (
                      <input
                        type="date"
                        value={form.as_of_date}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, as_of_date: e.target.value }))
                        }
                        onBlur={handleSave}
                        className="border rounded px-2"
                      />
                    ) : (
                      row.as_of_date
                    )}
                  </td>
                  <td>
                    {editingId === row.id ? (
                      <>
                        <button
                          className="text-green-600 mr-2"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                        <button
                          className="text-gray-500"
                          onClick={() => setEditingId(null)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-blue-600 mr-2"
                          onClick={() => handleEdit(row)}
                        >
                          <span role="img" aria-label="edit">
                            ✏️
                          </span>
                        </button>
                        <button
                          className="text-red-600"
                          onClick={() => handleDelete(row.id)}
                        >
                          <span role="img" aria-label="delete">
                            🗑️
                          </span>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="border rounded px-2"
                  placeholder="New asset"
                />
              </td>
              <td>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  className="border rounded px-2"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  className="border rounded px-2"
                  placeholder="Amount"
                />
              </td>
              <td></td>
              <td>
                <input
                  type="date"
                  value={form.as_of_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, as_of_date: e.target.value }))
                  }
                  className="border rounded px-2"
                />
              </td>
              <td>
                <button className="text-green-600" onClick={handleSave}>
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
