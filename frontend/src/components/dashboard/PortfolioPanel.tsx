import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import formatINR from "../../utils/formatINR";
import { notifyError, notifySuccess } from "../../utils/toast";
import chartColors from "./chartColors";
import { useAuth } from "../../contexts/AuthProvider";

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

interface Asset {
  id: string;
  name: string;
  category: string;
  amount: number;
  as_of_date: string;
  metadata?: Record<string, any>;
}

export default function PortfolioPanel() {
  const { user } = useAuth();
  const userId = user?.id;
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alloc, setAlloc] = useState<{name: string; value: number}[]>([]);
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
    if (!userId) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: assetRows, error: assetError } = await supabase
          .from("assets")
          .select("*")
          .eq("user_id", userId);
          
        if (assetError) throw assetError;
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
        const { data: nwRows, error: nwError } = await supabase
          .from("vw_net_worth")
          .select("net_worth")
          .eq("user_id", userId)
          .maybeSingle();
          
        if (nwError) throw nwError;
        setNetWorth(nwRows?.net_worth || 0);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
        notifyError("Failed to load portfolio data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      category: row.category,
      amount: row.amount,
      as_of_date: row.as_of_date,
    });
  };

  const handleSave = async (form: Omit<Asset, 'id' | 'user_id'>, editingId?: string) => {
    try {
      if (!form.name || !form.category || !form.amount) {
        return notifyError("All fields required");
      }
      if (!userId) {
        return notifyError("You must be logged in to save assets");
      }
      
      const payload = {
        ...form,
        amount: Number(form.amount),
        user_id: userId,
      };
      
      if (editingId) {
        const { error } = await supabase
          .from("assets")
          .update(payload)
          .eq("id", editingId)
          .eq("user_id", userId);
        if (error) throw error;
        notifySuccess("Asset updated");
      } else {
        const { error } = await supabase.from("assets").insert([payload]);
        if (error) throw error;
        notifySuccess("Asset added");
      }
      setEditingId(null);
      setForm({ name: "", category: "stocks", amount: "", as_of_date: "" });
    } catch (err) {
      notifyError("Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this asset?")) return;
    if (!userId) {
      notifyError("You must be logged in to delete assets");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("assets")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
      notifySuccess("Asset deleted");
      setAssets(assets.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting asset:", err);
      notifyError("Failed to delete asset");
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
            {assets.slice((page - 1) * 10, page * 10).map((row) => {
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
                        <div
                          className="relative inline-block text-left"
                          data-testid={`menu-assets-${row.id}`}
                        >
                          <button
                            className="text-gray-600 px-2 py-1 rounded hover:bg-gray-100"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            ⋮
                          </button>
                          <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => alert(JSON.stringify(row))}
                              data-testid="action-view"
                            >
                              View
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => handleEdit(row)}
                              data-testid="action-edit"
                            >
                              Edit
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                              onClick={() => handleDelete(row.id)}
                              data-testid="action-delete"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
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
      {assets.length > 10 && (
        <div className="flex gap-2 justify-center mt-2">
          {[...Array(Math.ceil(assets.length / 10))].map((_, i) => (
            <button
              key={i}
              className={`px-2 py-1 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
              onClick={() => setPage(i + 1)}
              data-testid={`assets-page-${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
