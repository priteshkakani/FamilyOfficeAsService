import React, { useState, useEffect } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function FamilyStep({ userId, onChange, data }) {
  const [members, setMembers] = useState((data && data.family_members) || []);
  const [form, setForm] = useState({ name: "", relation: "Spouse" });
  const [saving, setSaving] = useState(false);

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
    if (!userId)
      return () => {
        mounted = false;
      };
    (async () => {
      const { data } = await supabase
        .from("family_members")
        .select("id,name,relation")
        .eq("user_id", userId);
      const next = data || [];
      if (mounted) {
        setMembers(next);
        if (typeof onChange === "function") onChange(next);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const addMember = async () => {
    if (!form.name) return notifyError("Member name required");
    setSaving(true);
    let mounted = true;
    try {
      // Optimistic UI update: add a temporary member immediately so the
      // click handler results in a synchronous state update (prevents
      // act(...) warnings in tests). Replace with server data once insert
      // completes.
      const temp = {
        id: `temp-${Date.now()}`,
        name: form.name,
        relation: form.relation,
      };
      setMembers((cur) => {
        const next = [...cur, temp];
        if (typeof onChange === "function") onChange(next);
        return next;
      });
      setForm({ name: "", relation: "Spouse" });

      const { error } = await supabase.from("family_members").insert({
        user_id: userId,
        name: temp.name,
        relation: temp.relation,
      });
      if (error) throw error;
      notifySuccess("Member added");
      const { data } = await supabase
        .from("family_members")
        .select("id,name,relation")
        .eq("user_id", userId);
      const next = data || [];
      if (mounted) {
        setMembers(next);
        if (typeof onChange === "function") onChange(next);
      }
    } catch (e) {
      console.error("[FamilyStep][add]", e && e.message ? e.message : e);
      notifyError("Failed to add member");
    } finally {
      if (mounted) setSaving(false);
    }
    return () => {
      mounted = false;
    };
  };

  return (
    <OnboardingLayout title="Family">
      <div className="space-y-5" data-testid="onboarding-step-family">
        <div className="flex gap-2">
          <input
            data-testid="family-name-input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Member name"
            className="border border-gray-300 rounded-lg p-2.5 w-full"
          />
          <select
            value={form.relation}
            onChange={(e) =>
              setForm((f) => ({ ...f, relation: e.target.value }))
            }
            className="border border-gray-300 rounded-lg p-2.5"
          >
            <option>Father</option>
            <option>Mother</option>
            <option>Spouse</option>
            <option>Son</option>
            <option>Daughter</option>
            <option>Brother</option>
            <option>Sister</option>
          </select>
          <button
            data-testid="family-add-btn"
            onClick={addMember}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4"
          >
            Add
          </button>
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
