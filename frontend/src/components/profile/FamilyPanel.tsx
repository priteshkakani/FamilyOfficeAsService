import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import {
  maskAadhaar,
  maskPan,
  useAddFamilyMember,
  useDeleteFamilyMember,
  useEditFamilyMember,
  useFamilyMembers,
} from "./familyHooks";
// Modal skeletons for View, Edit, Add, Delete
function FamilyViewModal({ open, member, onClose }) {
  if (!open || !member) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow p-6 w-full max-w-md"
        data-testid={`family-view-${member.id}`}
      >
        <h3 className="text-lg font-bold mb-2">View Family Member</h3>
        <div className="space-y-2">
          <div>
            <b>Name:</b> {member.name}
          </div>
          <div>
            <b>Relation:</b> {member.relation}
          </div>
          <div>
            <b>PAN:</b> {member.pan}{" "}
            <button
              className="ml-2 text-xs underline"
              onClick={() => navigator.clipboard.writeText(member.pan)}
            >
              Copy
            </button>
          </div>
          <div>
            <b>Aadhaar:</b> {member.aadhaar}{" "}
            <button
              className="ml-2 text-xs underline"
              onClick={() => navigator.clipboard.writeText(member.aadhaar)}
            >
              Copy
            </button>
          </div>
          <div>
            <b>DOB:</b> {member.dob}
          </div>
          <div>
            <b>Profession:</b> {member.profession}
          </div>
          <div>
            <b>Marital Status:</b> {member.marital_status}
          </div>
        </div>
        <button
          className="mt-4 px-4 py-2 rounded bg-gray-100"
          onClick={onClose}
          data-testid="family-cancel"
        >
          Close
        </button>
      </div>
    </div>
  );
}
// End of FamilyPanel.jsx

function FamilyEditModal({ open, member, onClose, onSave, isEdit }) {
  const [form, setForm] = useState(
    member || {
      name: "",
      relation: "",
      pan: "",
      aadhaar: "",
      dob: "",
      profession: "",
      marital_status: "",
    }
  );
  const [errors, setErrors] = useState({});
  useMemo(() => {
    setForm(
      member || {
        name: "",
        relation: "",
        pan: "",
        aadhaar: "",
        dob: "",
        profession: "",
        marital_status: "",
      }
    );
    setErrors({});
  }, [open, member]);
  function validate() {
    const e = {};
    if (!form.name) e.name = "Name required";
    if (!form.relation) e.relation = "Relation required";
    if (!form.dob) e.dob = "DOB required";
    if (form.pan && !/^([A-Z]{5}[0-9]{4}[A-Z])$/.test(form.pan))
      e.pan = "Invalid PAN format";
    if (form.aadhaar && !/^\d{12}$/.test(form.aadhaar))
      e.aadhaar = "Invalid Aadhaar";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  }
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
    >
      <form
        className="bg-white rounded-xl shadow p-6 w-full max-w-md"
        onSubmit={handleSubmit}
        data-testid={isEdit ? `family-edit-${member?.id}` : "family-add-modal"}
      >
        <h3 className="text-lg font-bold mb-2">
          {isEdit ? "Edit" : "Add"} Family Member
        </h3>
        <div className="space-y-2">
          <div>
            <label>
              Name*{" "}
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                required
              />
            </label>
            {errors.name && (
              <div className="text-red-600 text-xs">{errors.name}</div>
            )}
          </div>
          <div>
            <label>
              Relation*{" "}
              <input
                name="relation"
                value={form.relation}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                required
              />
            </label>
            {errors.relation && (
              <div className="text-red-600 text-xs">{errors.relation}</div>
            )}
          </div>
          <div>
            <label>
              PAN{" "}
              <input
                name="pan"
                value={form.pan}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                maxLength={10}
              />
            </label>
            {errors.pan && (
              <div className="text-red-600 text-xs">{errors.pan}</div>
            )}
          </div>
          <div>
            <label>
              Aadhaar{" "}
              <input
                name="aadhaar"
                value={form.aadhaar}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                maxLength={12}
              />
            </label>
            {errors.aadhaar && (
              <div className="text-red-600 text-xs">{errors.aadhaar}</div>
            )}
          </div>
          <div>
            <label>
              DOB*{" "}
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
                required
              />
            </label>
            {errors.dob && (
              <div className="text-red-600 text-xs">{errors.dob}</div>
            )}
          </div>
          <div>
            <label>
              Profession{" "}
              <input
                name="profession"
                value={form.profession}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </label>
          </div>
          <div>
            <label>
              Marital Status{" "}
              <input
                name="marital_status"
                value={form.marital_status}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full"
              />
            </label>
          </div>
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-100"
            data-testid="family-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white"
            data-testid="family-save"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function FamilyDeleteConfirm({ open, member, onClose, onDelete }) {
  if (!open || !member) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow p-6 w-full max-w-md text-center"
        data-testid="family-delete-confirm"
      >
        <div className="mb-4">
          Delete <b>{member.name}</b>? This cannot be undone.
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded bg-red-600 text-white"
            data-testid="family-delete-confirm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
// Simple toast utility
function showToast(msg, type = "info") {
  // Replace with your app's toast system if available
  window.alert(msg);
}

/**
 * FamilyPanel - Profile section for listing and managing family members
 * Data source: Supabase public.family_members (RLS owner-only)
 *
 * Test IDs:
 * - Panel root: data-testid="profile-family-panel"
 * - Add button: data-testid="family-add"
 * - Table: data-testid="family-table"
 * - Edge banners: data-testid="family-banner"
 */
interface FamilyPanelProps {
  profileSaved: boolean;
  advisorMode?: boolean;
}

export default function FamilyPanel({ profileSaved, advisorMode = false }: FamilyPanelProps) {
  const { user } = useAuth();
  const userId = user?.id;

  if (!userId) {
    return <div>Please sign in to view family members.</div>;
  }
  // State for modals, search, filters, sort, pagination, etc.
  const [showAdd, setShowAdd] = useState(false);
  const [viewMember, setViewMember] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);
  const [q, setQ] = useState("");
  const [relation, setRelation] = useState("");
  const [marital, setMarital] = useState("");
  const [sort, setSort] = useState("created_at");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  // Debounce search
  const [debouncedQ, setDebouncedQ] = useState("");
  useMemo(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Data and loading/error state from hook
  const { data: response = { members: [], totalCount: 0 }, isLoading, error, refetch } = useFamilyMembers({
    userId,
    q: debouncedQ,
    sort,
    page,
    pageSize
  });

  // Extract members and total count from response
  const familyMembers = Array.isArray(response) ? response : response?.members || [];
  const totalCount = response?.totalCount || familyMembers.length;

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize);

  // Use paginated family members directly from the API response
  const paginatedFamily = familyMembers;

  // Mutations
  const addMutation = useAddFamilyMember();
  const editMutation = useEditFamilyMember();
  const deleteMutation = useDeleteFamilyMember();

  return (
    <>
      <section data-testid="profile-family-panel">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h3 className="text-lg font-bold">Family</h3>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold"
            onClick={() => setShowAdd(true)}
            data-testid="family-add"
          >
            Add Family Member
          </button>
        </div>
        {/* Search, filters, sort */}
        <div className="flex flex-wrap gap-2 items-center mb-2">
          <input
            className="border rounded px-2 py-1"
            placeholder="Search name, PAN, Aadhaar"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            data-testid="family-filter-q"
          />
          <select
            className="border rounded px-2 py-1"
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            data-testid="family-filter-relation"
          >
            <option value="">All Relations</option>
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
            <option value="Parent">Parent</option>
            <option value="Other">Other</option>
          </select>
          <select
            className="border rounded px-2 py-1"
            value={marital}
            onChange={(e) => setMarital(e.target.value)}
            data-testid="family-filter-marital"
          >
            <option value="">All Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
          </select>
          <select
            className="border rounded px-2 py-1"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            data-testid="family-sort"
          >
            <option value="created_at">Recently Added</option>
            <option value="name">Name A→Z</option>
            <option value="dob_new">DOB (Newest)</option>
            <option value="dob_old">DOB (Oldest)</option>
          </select>
        </div>
        {/* Table (desktop) */}
        <div className="overflow-x-auto">
          <table className="min-w-full" data-testid="family-table">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Relation</th>
                <th className="px-2 py-1">PAN</th>
                <th className="px-2 py-1">Aadhaar</th>
                <th className="px-2 py-1">DOB</th>
                <th className="px-2 py-1">Profession</th>
                <th className="px-2 py-1">Marital Status</th>
                <th className="px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="text-red-500 text-center py-4">
                    {error.message || 'Failed to load family members'}
                  </td>
                </tr>
              ) : familyMembers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-gray-400 text-center py-4">
                    No family members yet.
                  </td>
                </tr>
              ) : (
                paginatedFamily.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.relation}</td>
                    <td>{maskPan(m.pan)}</td>
                    <td>{maskAadhaar(m.aadhaar)}</td>
                    <td>{m.dob}</td>
                    <td>{m.profession}</td>
                    <td>{m.marital_status}</td>
                    <td>
                      <div className="relative">
                        <button
                          className="px-2 text-blue-600"
                          data-testid={`menu-family-${m.id}`}
                          onClick={() => setViewMember(m)}
                          title="View"
                        >
                          View
                        </button>
                        <button
                          className="px-2 text-green-600"
                          onClick={() => setEditMember(m)}
                          data-testid={`edit-family-${m.id}`}
                          title="Edit"
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 text-red-600"
                          onClick={() => setDeleteMember(m)}
                          data-testid={`delete-family-${m.id}`}
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex gap-2 justify-end mt-2">
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              data-testid="family-page-prev"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="px-2 py-1 border rounded"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              data-testid="family-page-next"
            >
              Next
            </button>
          </div>
        )}
      </section>
      {/* Modals for view, edit, add, delete (only once per panel) */}
      <FamilyViewModal
        open={Boolean(viewMember)}
        member={viewMember}
        onClose={() => setViewMember(null)}
      />
      <FamilyEditModal
        open={showAdd}
        isEdit={false}
        onClose={() => setShowAdd(false)}
        onSave={async (form) => {
          try {
            await addMutation.mutateAsync({ ...form, user_id: userId });
            setShowAdd(false);
            showToast("Family member added", "success");
            refetch();
          } catch (e) {
            showToast(
              "[FamilyPanel] Failed to add: " + (e.message || e),
              "error"
            );
          }
        }}
      />
      <FamilyEditModal
        open={Boolean(editMember)}
        member={editMember}
        isEdit={true}
        onClose={() => setEditMember(null)}
        onSave={async (form) => {
          try {
            await editMutation.mutateAsync({
              ...form,
              id: editMember.id,
              user_id: userId,
            });
            setEditMember(null);
            showToast("Family member updated", "success");
            refetch();
          } catch (e) {
            showToast(
              "[FamilyPanel] Failed to update: " + (e.message || e),
              "error"
            );
          }
        }}
      />
      <FamilyDeleteConfirm
        open={Boolean(deleteMember)}
        member={deleteMember}
        onClose={() => setDeleteMember(null)}
        onDelete={async () => {
          try {
            await deleteMutation.mutateAsync({
              id: deleteMember.id,
              user_id: userId,
            });
            setDeleteMember(null);
            showToast("Family member deleted", "success");
            refetch();
          } catch (e) {
            showToast(
              "[FamilyPanel] Failed to delete: " + (e.message || e),
              "error"
            );
          }
        }}
      />
    </>
  );
}
