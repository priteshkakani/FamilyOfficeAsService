import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";

export default function EntityFormPanel({ entity, userId, rowId, onClose }) {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Map entity to table and fields
  const entityConfig = {
    profiles: {
      table: "profiles",
      fields: [
        "email",
        "mobile",
        "address",
        "is_onboarded",
        "terms_accepted_at",
        "other_info",
      ],
      title: "Client Profile",
    },
    family_members: {
      table: "family_members",
      fields: [
        "name",
        "relation",
        "pan",
        "dob",
        "aadhaar",
        "profession",
        "marital_status",
        "marital_date",
        "itr_login_username",
      ],
      title: "Family Member",
    },
    assets: {
      table: "assets",
      fields: ["name", "category", "amount", "as_of_date"],
      title: "Asset",
    },
    liabilities: {
      table: "liabilities",
      fields: [
        "type",
        "institution",
        "total_amount",
        "outstanding_amount",
        "emi",
        "interest_rate",
        "schedule",
        "remaining_emis",
        "emi_date",
        "as_of_date",
      ],
      title: "Liability",
    },
    insurance_policies: {
      table: "insurance_policies",
      fields: [
        "provider",
        "policy_no",
        "type",
        "sum_assured",
        "premium",
        "premium_freq",
        "start_date",
        "end_date",
        "status",
      ],
      title: "Insurance Policy",
    },
    income_records: {
      table: "income_records",
      fields: [
        "source",
        "amount",
        "frequency",
        "employer",
        "start_date",
        "end_date",
      ],
      title: "Income Record",
    },
    goals: {
      table: "goals",
      fields: [
        "title",
        "description",
        "target_amount",
        "target_date",
        "priority",
        "is_completed",
      ],
      title: "Goal",
    },
    documents: {
      table: "documents",
      fields: ["doc_type", "file_path", "original_name", "size", "uploaded_at"],
      title: "Document",
    },
  };

  const config = entityConfig[entity];
  if (!config) return null;

  // Fetch entity data
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["advisor", entity, userId, rowId],
    queryFn: async () => {
      if (!userId || !rowId) return null;
      const { data, error } = await supabase
        .from(config.table)
        .select("*")
        .eq("id", rowId)
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!rowId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Edit mutation
  const updateMutation = useMutation({
    mutationFn: async (values) => {
      const { error } = await supabase
        .from(config.table)
        .update(values)
        .eq("id", rowId)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Saved successfully");
      queryClient.invalidateQueries(["advisor", entity, userId]);
      setEditMode(false);
      refetch();
    },
    onError: (err) => toast.error(err.message || "Save failed"),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from(config.table)
        .delete()
        .eq("id", rowId)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted successfully");
      queryClient.invalidateQueries(["advisor", entity, userId]);
      onClose?.();
    },
    onError: (err) => toast.error(err.message || "Delete failed"),
  });

  // Form state
  const [form, setForm] = useState({});
  React.useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  // Render
  return (
    <div
      className="bg-white rounded-lg shadow p-6 mt-6 max-w-2xl mx-auto"
      data-testid="advisor-form-panel"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{config.title}</h3>
        <div className="relative">
          <button
            className="px-2 py-1 text-gray-500 hover:text-gray-700"
            aria-label="More actions"
            tabIndex={0}
            onClick={() => setEditMode((e) => !e)}
            data-testid="btn-edit"
          >
            Edit
          </button>
          <button
            className="px-2 py-1 text-red-500 hover:text-red-700 ml-2"
            aria-label="Delete"
            tabIndex={0}
            onClick={() => setConfirmDelete(true)}
            data-testid="btn-delete"
            disabled={isLoading || updateMutation.isLoading}
          >
            Delete
          </button>
        </div>
      </div>
      {isLoading && <div>Loading…</div>}
      {isError && (
        <div className="text-red-600 mb-4">
          {error?.message || "Error loading data"}
        </div>
      )}
      {!isLoading && !data && (
        <div className="text-gray-500">No data found.</div>
      )}
      {data && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate(form);
          }}
        >
          {config.fields.map((field) => (
            <div
              key={field}
              className="flex flex-col gap-1"
              data-testid={`field-${field}`}
            >
              <label htmlFor={field} className="font-medium">
                {field
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </label>
              {editMode ? (
                <input
                  id={field}
                  type="text"
                  value={form[field] ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div
                  className="px-3 py-2 bg-gray-50 rounded"
                  tabIndex={0}
                  data-testid={`view-${field}`}
                >
                  {form[field]}
                </div>
              )}
            </div>
          ))}
          {editMode && (
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
                data-testid="btn-save"
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold"
                data-testid="btn-cancel"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      )}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 max-w-sm mx-auto">
            <div className="mb-4">Are you sure you want to delete?</div>
            <div className="flex gap-4">
              <button
                className="bg-red-600 text-white px-6 py-2 rounded font-bold"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? "Deleting…" : "Delete"}
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded font-bold"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
