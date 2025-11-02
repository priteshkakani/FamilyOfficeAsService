import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

function validatePAN(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}

function FamilyModal({ open, onClose, onSave, initial, clientId }) {
  const [form, setForm] = useState(
    initial || { name: "", relation: "", dob: "", pan: "" }
  );
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setForm(initial || { name: "", relation: "", dob: "", pan: "" });
    setErrors({});
  }, [open, initial]);

  function validate() {
    const e = {};
    if (!form.name) e.name = "Name required";
    if (!form.relation) e.relation = "Relation required";
    if (!form.dob) e.dob = "DOB required";
    else if (new Date(form.dob) > new Date()) e.dob = "DOB cannot be future";
    if (!form.pan) e.pan = "PAN required";
    else if (!validatePAN(form.pan)) e.pan = "Invalid PAN format";
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
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <form
        className="bg-white rounded-xl shadow p-6 z-10 w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h3 className="text-lg font-semibold mb-4">
          {initial ? "Edit" : "Add"} Family Member
        </h3>
        <div className="space-y-3">
          <div>
            <label>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
              autoFocus
            />
            {errors.name && (
              <div className="text-red-600 text-xs">{errors.name}</div>
            )}
          </div>
          <div>
            <label>Relation</label>
            <input
              name="relation"
              value={form.relation}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
            {errors.relation && (
              <div className="text-red-600 text-xs">{errors.relation}</div>
            )}
          </div>
          <div>
            <label>Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
            {errors.dob && (
              <div className="text-red-600 text-xs">{errors.dob}</div>
            )}
          </div>
          <div>
            <label>PAN</label>
            <input
              name="pan"
              value={form.pan}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 uppercase"
              required
              maxLength={10}
              pattern="[A-Z]{5}[0-9]{4}[A-Z]"
            />
            {errors.pan && (
              <div className="text-red-600 text-xs">{errors.pan}</div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [family, setFamily] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Validate clientId from supabase user
  function isValidUUID(id) {
    return (
      typeof id === "string" &&
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id
      )
    );
  }

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!isValidUUID(userId)) {
        console.error("Invalid or missing clientId in Profile panel", userId);
        setLoading(false);
        return;
      }
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      const { data: fam } = await supabase
        .from("family_members")
        .select("*")
        .eq("profile_id", userId);
      if (mounted) {
        setProfile(prof);
        setFamily(fam || []);
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave(member) {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) return;
    if (editIdx != null) {
      // Edit
      const id = family[editIdx].id;
      await supabase.from("family_members").update(member).eq("id", id);
    } else {
      // Add
      await supabase
        .from("family_members")
        .insert({ ...member, profile_id: userId });
    }
    setModalOpen(false);
    setEditIdx(null);
    // Refresh
    const { data: fam } = await supabase
      .from("family_members")
      .select("*")
      .eq("profile_id", userId);
    setFamily(fam || []);
  }

  async function handleDelete(idx) {
    const id = family[idx].id;
    await supabase.from("family_members").delete().eq("id", id);
    setFamily(family.filter((_, i) => i !== idx));
  }

  // Pagination
  const pagedFamily = family.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(family.length / pageSize);

  return (
    <div className="max-w-3xl mx-auto py-8" data-testid="panel-profile">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {loading ? (
        <div>Loading...</div>
      ) : profile ? (
        <div className="mb-8 p-4 bg-gray-50 rounded">
          <div>
            <strong>Name:</strong> {profile.full_name}
          </div>
          <div>
            <strong>Email:</strong> {profile.email}
          </div>
          <div>
            <strong>Phone:</strong> {profile.phone}
          </div>
        </div>
      ) : (
        <div>No profile found.</div>
      )}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Family Members</h3>
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white"
          onClick={() => {
            setModalOpen(true);
            setEditIdx(null);
          }}
          data-testid="add-family-btn"
        >
          Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border rounded" data-testid="family-table">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-1">Name</th>
              <th className="px-2 py-1">Relation</th>
              <th className="px-2 py-1">DOB</th>
              <th className="px-2 py-1">PAN</th>
              <th className="px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedFamily.map((m, idx) => (
              <tr key={m.id}>
                <td className="px-2 py-1">{m.name}</td>
                <td className="px-2 py-1">{m.relation}</td>
                <td className="px-2 py-1">{m.dob}</td>
                <td className="px-2 py-1">{m.pan}</td>
                <td className="px-2 py-1">
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => {
                      setEditIdx((page - 1) * pageSize + idx);
                      setModalOpen(true);
                    }}
                    data-testid={`edit-family-${m.id}`}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete((page - 1) * pageSize + idx)}
                    data-testid={`delete-family-${m.id}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-2 py-1 rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
              onClick={() => setPage(i + 1)}
              data-testid={`family-page-${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      <FamilyModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditIdx(null);
        }}
        onSave={handleSave}
        initial={editIdx != null ? family[editIdx] : null}
        clientId={profile?.id}
      />
    </div>
  );
}
