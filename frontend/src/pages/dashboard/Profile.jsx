import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import formatINR from "../../utils/formatINR";

export default function Profile() {
  const userId = supabase.auth.user()?.id;
  const queryClient = useQueryClient();
  // Profile fetch
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  });
  // Edit state
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  React.useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);
  // Save mutation
  const updateMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase
        .from("profiles")
        .update(values)
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", userId]);
      setEditMode(false);
    },
  });

  // Family members fetch
  const { data: family, isLoading: loadingFamily } = useQuery({
    queryKey: ["family", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  });

  // Family member CRUD
  const addFamilyMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase
        .from("family_members")
        .insert([{ ...values, user_id: userId }]);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(["family", userId]),
  });
  const updateFamilyMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase
        .from("family_members")
        .update(values)
        .eq("id", values.id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(["family", userId]),
  });
  const deleteFamilyMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries(["family", userId]),
  });

  // Add/Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Render
  return (
    <div className="space-y-8" data-testid="panel-ov-profile">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        {loadingProfile ? (
          <div>Loading…</div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateMutation.mutate(form);
            }}
          >
            {[
              "primary_email",
              "secondary_email",
              "mobile_number",
              "address",
              "monthly_income",
              "monthly_expenses",
              "other_info",
            ].map((field) => (
              <div key={field} className="flex flex-col gap-1">
                <label htmlFor={field} className="font-medium">
                  {field
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                {editMode ? (
                  <input
                    id={field}
                    type={
                      field.includes("income") || field.includes("expenses")
                        ? "number"
                        : "text"
                    }
                    value={form[field] ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, [field]: e.target.value })
                    }
                    className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded" tabIndex={0}>
                    {form[field]}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-4 mt-6">
              {editMode ? (
                <>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
                    data-testid="btn-profile-save"
                    disabled={updateMutation.isLoading}
                  >
                    {updateMutation.isLoading ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold"
                    data-testid="btn-profile-cancel"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="bg-blue-100 text-blue-700 px-6 py-2 rounded font-bold"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </button>
              )}
            </div>
          </form>
        )}
      </div>
      <div
        className="bg-white rounded-xl shadow p-6"
        data-testid="family-table"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Family Members</h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-bold"
            data-testid="family-add"
            onClick={() => {
              setModalOpen(true);
              setModalData(null);
            }}
          >
            Add Family Member
          </button>
        </div>
        {loadingFamily ? (
          <div>Loading…</div>
        ) : !family?.length ? (
          <div className="text-gray-500">No family members yet.</div>
        ) : (
          <table className="min-w-full text-left border">
            <thead>
              <tr>
                {[
                  "name",
                  "relation",
                  "pan",
                  "dob",
                  "aadhaar",
                  "profession",
                  "marital_status",
                  "marital_date",
                  "itr_login_username",
                  "address",
                ].map((col) => (
                  <th key={col} className="border-b p-2">
                    {col
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </th>
                ))}
                <th className="border-b p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {family.map((member) => (
                <tr key={member.id} className="border-b">
                  {[
                    "name",
                    "relation",
                    "pan",
                    "dob",
                    "aadhaar",
                    "profession",
                    "marital_status",
                    "marital_date",
                    "itr_login_username",
                    "address",
                  ].map((col) => (
                    <td key={col} className="p-2">
                      {member[col]}
                    </td>
                  ))}
                  <td className="p-2">
                    <div
                      className="relative"
                      data-testid={`menu-family-${member.id}`}
                    >
                      {" "}
                      {/* 3-dots menu */}
                      <button
                        className="px-2 py-1 text-gray-500 hover:text-gray-700"
                        aria-label="More actions"
                        tabIndex={0}
                        onClick={() => {
                          setModalOpen(true);
                          setModalData(member);
                        }}
                        data-testid={`family-edit-${member.id}`}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 text-red-500 hover:text-red-700 ml-2"
                        aria-label="Delete"
                        tabIndex={0}
                        onClick={() => deleteFamilyMutation.mutate(member.id)}
                        data-testid={`family-delete-${member.id}`}
                        disabled={deleteFamilyMutation.isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal for Add/Edit Family Member */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 max-w-lg mx-auto">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (modalData?.id) {
                  updateFamilyMutation.mutate(modalData);
                } else {
                  addFamilyMutation.mutate(modalData);
                }
                setModalOpen(false);
              }}
            >
              {[
                "name",
                "relation",
                "pan",
                "dob",
                "aadhaar",
                "profession",
                "marital_status",
                "marital_date",
                "itr_login_username",
                "address",
              ].map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <label htmlFor={field} className="font-medium">
                    {field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </label>
                  <input
                    id={field}
                    type="text"
                    value={modalData?.[field] ?? ""}
                    onChange={(e) =>
                      setModalData({ ...modalData, [field]: e.target.value })
                    }
                    className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
                  disabled={
                    addFamilyMutation.isLoading ||
                    updateFamilyMutation.isLoading
                  }
                >
                  {modalData?.id
                    ? updateFamilyMutation.isLoading
                      ? "Saving…"
                      : "Save"
                    : addFamilyMutation.isLoading
                    ? "Adding…"
                    : "Add"}
                </button>
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
