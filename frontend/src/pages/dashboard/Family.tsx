import React, { useEffect, useState } from "react";
import FamilyMembers from "../../components/dashboard/FamilyMembers";
import { useClient } from "../../hooks/useClientContext";
import Modal from "../../components/common/Modal";

export default function Family() {
  const { client } = useClient();
  const userId = client?.id;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [form, setForm] = useState({ name: "", relationship: "" });
  const [formError, setFormError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const fetchMembers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/family?user_id=${userId}`);
      const data = await res.json();
      setMembers(data || []);
    } catch (e) {
      setError("Failed to fetch family members");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchMembers();
  }, [userId]);

  const handleDelete = async (memberId) => {
    setLoading(true);
    setError("");
    try {
      await fetch(`/api/family/${memberId}?user_id=${userId}`, {
        method: "DELETE",
      });
      fetchMembers();
    } catch (e) {
      setError("Failed to delete family member");
    }
    setLoading(false);
  };

  // Add/Edit member
  const openAddModal = () => {
    setEditMember(null);
    setForm({ name: "", relationship: "" });
    setFormError("");
    setShowModal(true);
  };
  const openEditModal = (member) => {
    setEditMember(member);
    setForm({ name: member.name, relationship: member.relationship });
    setFormError("");
    setShowModal(true);
  };
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    if (!form.name.trim()) return "Name required";
    if (!form.relationship.trim()) return "Relationship required";
    return "";
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setLoading(true);
    setFormError("");
    try {
      if (editMember) {
        await fetch(`/api/family/${editMember.id}?user_id=${userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(`/api/family?user_id=${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      fetchMembers();
      setShowModal(false);
    } catch (e) {
      setFormError("Failed to save family member");
    }
    setLoading(false);
  };

  // Pagination
  const pagedMembers = members.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(members.length / pageSize);

  return (
    <div className="max-w-xl mx-auto py-8" data-testid="family-panel">
      <h2 className="text-2xl font-bold mb-6">Family Members</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={openAddModal}
        aria-label="Add family member"
        data-testid="add-family-member-btn"
      >
        Add Member
      </button>
      {loading && (
        <div aria-busy="true" data-testid="family-loading">
          Loading…
        </div>
      )}
      {error && (
        <div
          className="text-red-600 mb-4"
          role="alert"
          data-testid="family-error"
        >
          {error}
        </div>
      )}
      <FamilyMembers
        members={pagedMembers}
        userId={userId}
        onDelete={handleDelete}
        onEdit={openEditModal}
      />
      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex gap-2 mt-4"
          role="navigation"
          aria-label="Family pagination"
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 border rounded"
            aria-label="Previous page"
            data-testid="family-prev-page"
          >
            Prev
          </button>
          <span data-testid="family-page">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 border rounded"
            aria-label="Next page"
            data-testid="family-next-page"
          >
            Next
          </button>
        </div>
      )}
      {/* Modal for add/edit */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} data-testid="family-modal">
          <form
            onSubmit={handleFormSubmit}
            className="space-y-4"
            aria-label="Family member form"
          >
            <h3 className="text-lg font-semibold mb-2">
              {editMember ? "Edit" : "Add"} Family Member
            </h3>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={handleFormChange}
              className="border rounded px-2 py-1 w-full"
              aria-label="Name"
              required
              data-testid="family-form-name"
            />
            <input
              name="relationship"
              type="text"
              placeholder="Relationship"
              value={form.relationship}
              onChange={handleFormChange}
              className="border rounded px-2 py-1 w-full"
              aria-label="Relationship"
              required
              data-testid="family-form-relationship"
            />
            {formError && (
              <div
                className="text-red-600"
                role="alert"
                data-testid="family-form-error"
              >
                {formError}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-1 rounded"
                data-testid="family-form-submit"
              >
                {editMember ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
