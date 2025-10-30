import React, { useState, useEffect } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function FamilyStep({ userId, onChange, data }) {
  const [editId, setEditId] = useState(null);
  const [members, setMembers] = useState((data && data.family_members) || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    pan: "",
    dob: "",
    address: "",
    profession: "",
    marital_status: "Single",
    marital_date: "",
    itr_username: "",
    itr_password: "",
    relation: "Spouse",
  });
  const [saving, setSaving] = useState(false);

  // Refresh family list helper
  const refreshFamilyList = async () => {
    setLoading(true);
    setError(null);
    try {
      // Determine owner id: prefer prop, otherwise fall back to authenticated user
      let ownerId = userId;
      if (!ownerId) {
        const { data: userData, error: uErr } = await supabase.auth.getUser();
        const user = userData?.user;
        if (uErr || !user) throw new Error("Not authenticated");
        ownerId = user.id;
      }

      const { data: list, error } = await supabase
        .from("family_members")
        .select("id,name,relation,created_at")
        .eq("user_id", ownerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const next = list || [];
      setMembers(next);
      if (typeof onChange === "function") onChange(next);
    } catch (err) {
      console.error("[FamilyStep][refresh]", err);
      setError(err.message || "Failed to load family members");
      notifyError(err.message || "Failed to load family members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (data && Array.isArray(data.family_members)) {
      const next = data.family_members || [];
      if (mounted) {
        setMembers(next);
        if (typeof onChange === "function") onChange(next);
      }
      return () => {
        mounted = false;
      };
    }
    // Always attempt to refresh the list; refreshFamilyList will derive the
    // authenticated user if userId prop is not provided.
    (async () => {
      await refreshFamilyList();
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const addFamilyMember = async (member) => {
    const updateFamilyMember = async (member) => {
      if (!editId) return;
      // Validation (same as add)
      if (!member.name) return notifyError("Full Name required");
      if (!member.pan) return notifyError("PAN required");
      if (!member.dob) return notifyError("Date of Birth required");
      if (!member.address) return notifyError("Address required");
      if (!member.profession) return notifyError("Profession required");
      if (!member.marital_status) return notifyError("Marital Status required");
      if (member.marital_status === "Married" && !member.marital_date)
        return notifyError("Marital Date required for Married status");
      if (!member.itr_username) return notifyError("ITR Username required");
      if (!member.itr_password) return notifyError("ITR Password required");
      setSaving(true);
      try {
        const payload = {
          name: member.name,
          pan: member.pan,
          dob: member.dob,
          address: member.address,
          profession: member.profession,
          marital_status: member.marital_status,
          marital_date:
            member.marital_status === "Married" ? member.marital_date : null,
          itr_username: member.itr_username,
          itr_password: member.itr_password,
          relation: member.relation,
        };
        const { error } = await supabase
          .from("family_members")
          .update(payload)
          .eq("id", editId);
        if (error) throw error;
        notifySuccess("Family member updated");
        setEditId(null);
        setForm({
          name: "",
          pan: "",
          dob: "",
          address: "",
          profession: "",
          marital_status: "Single",
          marital_date: "",
          itr_username: "",
          itr_password: "",
          relation: "Spouse",
        });
        await refreshFamilyList();
      } catch (err) {
        console.error("[FamilyStep][update] RLS/DB error:", err);
        notifyError(err.message || "Could not update family member");
      } finally {
        setSaving(false);
      }
    };

    const deleteFamilyMember = async (id) => {
      if (!window.confirm("Delete this family member?")) return;
      setSaving(true);
      try {
        const { error } = await supabase
          .from("family_members")
          .delete()
          .eq("id", id);
        if (error) throw error;
        notifySuccess("Family member deleted");
        await refreshFamilyList();
      } catch (err) {
        console.error("[FamilyStep][delete] RLS/DB error:", err);
        notifyError(err.message || "Could not delete family member");
      } finally {
        setSaving(false);
      }
    };
    // Validation
    if (!member.name) return notifyError("Full Name required");
    if (!member.pan) return notifyError("PAN required");
    if (!member.dob) return notifyError("Date of Birth required");
    if (!member.address) return notifyError("Address required");
    if (!member.profession) return notifyError("Profession required");
    if (!member.marital_status) return notifyError("Marital Status required");
    if (member.marital_status === "Married" && !member.marital_date)
      return notifyError("Marital Date required for Married status");
    if (!member.itr_username) return notifyError("ITR Username required");
    if (!member.itr_password) return notifyError("ITR Password required");
    setSaving(true);
    try {
      const { data: userData, error: uErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (uErr || !user) throw new Error("Not authenticated");
      const payload = {
        user_id: user.id,
        name: member.name,
        pan: member.pan,
        dob: member.dob,
        address: member.address,
        profession: member.profession,
        marital_status: member.marital_status,
        marital_date:
          member.marital_status === "Married" ? member.marital_date : null,
        itr_username: member.itr_username,
        itr_password: member.itr_password,
        relation: member.relation,
      };
      const { error } = await supabase.from("family_members").insert(payload);
      if (error) throw error;
      notifySuccess("Family member added");
      await refreshFamilyList();
    } catch (err) {
      console.error("[FamilyStep][add] RLS/DB error:", err);
      notifyError(err.message || "Could not add family member");
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout title="Family">
      <div className="space-y-5" data-testid="onboarding-step-family">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Full Name"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">PAN</label>
            <input
              value={form.pan}
              onChange={(e) => setForm((f) => ({ ...f, pan: e.target.value }))}
              placeholder="PAN"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={form.dob}
              onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Address</label>
            <input
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              placeholder="Address"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Profession
            </label>
            <input
              value={form.profession}
              onChange={(e) =>
                setForm((f) => ({ ...f, profession: e.target.value }))
              }
              placeholder="Profession"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Relation</label>
            <select
              value={form.relation}
              onChange={(e) =>
                setForm((f) => ({ ...f, relation: e.target.value }))
              }
              className="w-full border rounded-lg p-2.5"
            >
              <option>Father</option>
              <option>Mother</option>
              <option>Spouse</option>
              <option>Son</option>
              <option>Daughter</option>
              <option>Brother</option>
              <option>Sister</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Marital Status
            </label>
            <select
              value={form.marital_status}
              onChange={(e) =>
                setForm((f) => ({ ...f, marital_status: e.target.value }))
              }
              className="w-full border rounded-lg p-2.5"
            >
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
            </select>
          </div>
          {form.marital_status === "Married" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Marital Date
              </label>
              <input
                type="date"
                value={form.marital_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, marital_date: e.target.value }))
                }
                className="w-full border rounded-lg p-2.5"
              />
            </div>
          )}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              ITR Login Username
            </label>
            <input
              value={form.itr_username}
              onChange={(e) =>
                setForm((f) => ({ ...f, itr_username: e.target.value }))
              }
              placeholder="ITR Username"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              ITR Login Password
            </label>
            <input
              type="password"
              value={form.itr_password}
              onChange={(e) =>
                setForm((f) => ({ ...f, itr_password: e.target.value }))
              }
              placeholder="ITR Password"
              className="w-full border rounded-lg p-2.5"
            />
          </div>
          <div className="pt-1">
            {editId ? (
              <button
                onClick={async () => {
                  await updateFamilyMember(form);
                }}
                disabled={saving}
                className="bg-green-600 text-white rounded-lg px-4 py-2.5 hover:bg-green-700 w-full"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            ) : (
              <button
                onClick={async () => {
                  await addFamilyMember(form);
                  setForm({
                    name: "",
                    pan: "",
                    dob: "",
                    address: "",
                    profession: "",
                    marital_status: "Single",
                    marital_date: "",
                    itr_username: "",
                    itr_password: "",
                    relation: "Spouse",
                  });
                }}
                disabled={saving}
                className="bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 w-full"
              >
                {saving ? "Adding..." : "Add"}
              </button>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Family members</h3>
          <div className="text-sm text-gray-500">Add your family members</div>
          {members.length === 0 ? (
            <div className="text-sm text-gray-500">No members added</div>
          ) : (
            <ul className="space-y-2">
              {members.map((m, idx) => (
                <li
                  key={m.id ?? `${m.name ?? "member"}-${idx}`}
                  data-testid={`family-member-row-${idx}`}
                  className="border p-2 rounded-md flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.relation}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() => {
                        setEditId(m.id);
                        setForm({
                          name: m.name || "",
                          pan: m.pan || "",
                          dob: m.dob || "",
                          address: m.address || "",
                          profession: m.profession || "",
                          marital_status: m.marital_status || "Single",
                          marital_date: m.marital_date || "",
                          itr_username: m.itr_username || "",
                          itr_password: m.itr_password || "",
                          relation: m.relation || "Spouse",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline text-xs"
                      onClick={() => deleteFamilyMember(m.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}
