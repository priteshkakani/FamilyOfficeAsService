import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import formatINR from "../../utils/formatINR";
import { notifyError, notifySuccess } from "../../utils/toast";

const SCHEDULES = ["Monthly", "Quarterly", "Yearly"];
const TYPES = [
  "Home",
  "Car",
  "Education",
  "Personal",
  "Credit Card",
  "Business",
  "Gold",
  "Other",
];

export default function LiabilitiesPanel() {
  const [liabilities, setLiabilities] = useState([]);
  const [form, setForm] = useState({
    type: "Home",
    institution: "",
    total_amount: "",
    outstanding_amount: "",
    emi: "",
    interest_rate: "",
    schedule: "Monthly",
    remaining_emis: "",
    emi_date: "",
    as_of_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [totalLiabilities, setTotalLiabilities] = useState(0);
  const [debtAssetRatio, setDebtAssetRatio] = useState(0);
  const [totalAssets, setTotalAssets] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Fetch liabilities
        const { data: rows } = await supabase.from("liabilities").select("*");
        setLiabilities(rows || []);
        const totalLiab = (rows || []).reduce(
          (s, l) => s + Number(l.outstanding_amount || 0),
          0
        );
        setTotalLiabilities(totalLiab);
        // Fetch assets for ratio
        const { data: assetRows } = await supabase
          .from("assets")
          .select("amount");
        const totalAsset = (assetRows || []).reduce(
          (s, a) => s + Number(a.amount || 0),
          0
        );
        setTotalAssets(totalAsset);
        setDebtAssetRatio(totalAsset ? totalLiab / totalAsset : 0);
      } catch (err) {
        notifyError("Failed to load liabilities");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    // Validation
    if (
      !form.type ||
      !form.institution ||
      !form.total_amount ||
      !form.outstanding_amount ||
      !form.emi ||
      !form.interest_rate ||
      !form.schedule ||
      !form.remaining_emis ||
      !form.emi_date ||
      !form.as_of_date
    ) {
      return notifyError("All fields required");
    }
    if (Number(form.interest_rate) < 0 || Number(form.interest_rate) > 100) {
      return notifyError("Interest rate must be 0–100");
    }
    if (
      Number(form.total_amount) < 0 ||
      Number(form.outstanding_amount) < 0 ||
      Number(form.emi) < 0
    ) {
      return notifyError("Amounts must be non-negative");
    }
    try {
      // Get user_id from localStorage/session (example, adjust as needed)
      const user_id = localStorage.getItem("user_id");
      const payload = {
        ...form,
        total_amount: Number(form.total_amount),
        outstanding_amount: Number(form.outstanding_amount),
        emi: Number(form.emi),
        interest_rate: Number(form.interest_rate),
        remaining_emis: Number(form.remaining_emis),
        user_id,
      };
      if (editingId) {
        const { error } = await supabase
          .from("liabilities")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        notifySuccess("Liability updated");
      } else {
        const { error } = await supabase.from("liabilities").insert(payload);
        if (error) throw error;
        notifySuccess("Liability added");
      }
      setEditingId(null);
      setForm({
        type: "Home",
        institution: "",
        total_amount: "",
        outstanding_amount: "",
        emi: "",
        interest_rate: "",
        schedule: "Monthly",
        remaining_emis: "",
        emi_date: "",
        as_of_date: "",
      });
      // Reload
      const { data: rows } = await supabase.from("liabilities").select("*");
      setLiabilities(rows || []);
      setTotalLiabilities(
        (rows || []).reduce((s, l) => s + Number(l.outstanding_amount || 0), 0)
      );
    } catch (err) {
      notifyError("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this liability?")) return;
    try {
      const { error } = await supabase
        .from("liabilities")
        .delete()
        .eq("id", id);
      if (error) throw error;
      notifySuccess("Liability deleted");
      setLiabilities(liabilities.filter((l) => l.id !== id));
      setTotalLiabilities(
        liabilities
          .filter((l) => l.id !== id)
          .reduce((s, l) => s + Number(l.outstanding_amount || 0), 0)
      );
    } catch (err) {
      notifyError("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="w-full md:w-1/2">
          <h3 className="font-semibold mb-2">Liabilities</h3>
          <div className="text-lg font-bold" data-testid="liabilities-table">
            Total Liabilities: {formatINR(totalLiabilities)}
          </div>
          <div className="text-md font-medium mt-2">
            Debt-to-Asset Ratio: {debtAssetRatio.toFixed(2)}
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Liabilities Table</h3>
        <table className="w-full text-sm" data-testid="liabilities-table">
          <thead>
            <tr className="bg-gray-50">
              <th>Type</th>
              <th>Institution</th>
              <th>Total Amount</th>
              <th>Outstanding</th>
              <th>EMI</th>
              <th>Interest Rate</th>
              <th>Schedule</th>
              <th>Remaining EMIs</th>
              <th>EMI Date</th>
              <th>As of Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {liabilities.map((row) => (
              <tr key={row.id} className="border-b">
                <td>
                  {editingId === row.id ? (
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, type: e.target.value }))
                      }
                      onBlur={handleSave}
                      className="border rounded px-2"
                    >
                      {TYPES.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  ) : (
                    row.type
                  )}
                </td>
                <td>
                  {editingId === row.id ? (
                    <input
                      value={form.institution}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, institution: e.target.value }))
                      }
                      onBlur={handleSave}
                      className="border rounded px-2"
                    />
                  ) : (
                    row.institution
                  )}
                </td>
                <td>
                  {editingId === row.id ? (
                    <input
                      type="number"
                      value={form.total_amount}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, total_amount: e.target.value }))
                      }
                      onBlur={handleSave}
                      className="border rounded px-2"
                    />
                  ) : (
                    formatINR(row.total_amount)
                  )}
                </td>
                <td>
                  {editingId === row.id ? (
                    <input
                      type="number"
                      value={form.outstanding_amount}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          outstanding_amount: e.target.value,
                        }))
                      }
                      onBlur={handleSave}
                      className="border rounded px-2"
                    />
                  ) : (
                    formatINR(row.outstanding_amount)
                  )}
                </td>
                <td>
                  {editingId === row.id ? (
                    <input
                      type="number"
                      value={form.emi}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, emi: e.target.value }))
                      }
                      onBlur={handleSave}
                      className="border rounded px-2"
                    />
                  ) : (
                    formatINR(row.emi)
                  )}
                </td>
                <td>
                  {editingId === row.id ? (
                    <input
                      type="number"
                      value={form.interest_rate}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          interest_rate: e.target.value,
                        }))
                      }
                      onBlur={handleSave}
                      className="border rounded px-2"
                    />
                  ) : (
                    row.interest_rate
                  )}
                </td>
                <td>
                  {editingId === row.id ? (
                    <select
                      value={form.schedule}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, schedule: e.target.value }))
                      }
                      onBlur={handleSave}
                      className="border rounded px-2"
                    >
                      {SCHEDULES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    row.schedule
                  )}
                </td>
                <td>
                  {editingId === row.id ? (
                    <input
                      type="number"
                      value={form.remaining_emis}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          remaining_emis: e.target.value,
                        }))
                      }
                      onBlur={handleSave}
                      className="border rounded px-2"
                    />
                  ) : (
                    row.remaining_emis
                  )}
                </td>
                <td>
                  {editingId === row.id ? (
                    <input
                      type="date"
                      value={form.emi_date}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, emi_date: e.target.value }))
                      }
                      onBlur={handleSave}
                      className="border rounded px-2"
                    />
                  ) : (
                    row.emi_date
                  )}
                </td>
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
                        data-testid="btn-save-liability"
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
            ))}
            <tr>
              <td>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, type: e.target.value }))
                  }
                  className="border rounded px-2"
                >
                  {TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  value={form.institution}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, institution: e.target.value }))
                  }
                  className="border rounded px-2"
                  placeholder="Institution"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={form.total_amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, total_amount: e.target.value }))
                  }
                  className="border rounded px-2"
                  placeholder="Total"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={form.outstanding_amount}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      outstanding_amount: e.target.value,
                    }))
                  }
                  className="border rounded px-2"
                  placeholder="Outstanding"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={form.emi}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, emi: e.target.value }))
                  }
                  className="border rounded px-2"
                  placeholder="EMI"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={form.interest_rate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, interest_rate: e.target.value }))
                  }
                  className="border rounded px-2"
                  placeholder="Interest"
                />
              </td>
              <td>
                <select
                  value={form.schedule}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, schedule: e.target.value }))
                  }
                  className="border rounded px-2"
                >
                  {SCHEDULES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={form.remaining_emis}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, remaining_emis: e.target.value }))
                  }
                  className="border rounded px-2"
                  placeholder="EMIs"
                />
              </td>
              <td>
                <input
                  type="date"
                  value={form.emi_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, emi_date: e.target.value }))
                  }
                  className="border rounded px-2"
                />
              </td>
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
                <button
                  className="text-green-600"
                  data-testid="btn-save-liability"
                  onClick={handleSave}
                >
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
