import React, { useState, useEffect } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function FamilyStep({ userId, onChange, data }) {
  const [members, setMembers] = useState((data && data.family_members) || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", relation: "Spouse" });
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

  const addFamilyMember = async ({ name, relation } = {}) => {
    if (!name) return notifyError("Member name required");
    setSaving(true);
    try {
      const { data: userData, error: uErr } = await supabase.auth.getUser();
      const user = userData?.user;
      if (uErr || !user) throw new Error("Not authenticated");

      const payload = {
        user_id: user.id,
        name,
        relation,
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              data-testid="family-name-input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Member name"
              className="w-full border rounded-lg p-2.5"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Relation</label>
            <select
              data-testid="family-relation-select"
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

          <div className="pt-1">
            <button
              data-testid="family-add-btn"
              onClick={async () => {
                await addFamilyMember({
                  name: form.name,
                  relation: form.relation,
                });
                setForm({ name: "", relation: "Spouse" });
              }}
              disabled={saving}
              className="bg-blue-600 text-white rounded-lg px-4 py-2.5 hover:bg-blue-700 w-full"
            >
              {saving ? "Adding..." : "Add"}
            </button>
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
                  className="border p-2 rounded-md flex justify-between"
                >
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-gray-500">{m.relation}</div>
                    {/* DOB and notes removed from UI */}
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
