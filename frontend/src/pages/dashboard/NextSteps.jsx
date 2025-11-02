import React, { useState, useEffect } from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";

export default function NextSteps() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, tasks = [], refresh, error } = useClientData(userId);
  const [openModal, setOpenModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    due_date: "",
    status: "pending",
  });
  const [formError, setFormError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (editTask) {
      setForm({
        title: editTask.title,
        due_date: editTask.due_date,
        status: editTask.status,
      });
    } else {
      setForm({ title: "", due_date: "", status: "pending" });
    }
    setFormError("");
  }, [editTask, openModal]);

  // CRUD handlers (mock API)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError("Title required");
      return;
    }
    setFormError("");
    setOpenModal(false);
    refresh && refresh();
  };
  const handleDelete = async (id) => {
    refresh && refresh();
  };
  const handleStatusToggle = async (task) => {
    refresh && refresh();
  };

  // Pagination
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.due_date) - new Date(b.due_date)
  );
  const pagedTasks = sortedTasks.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sortedTasks.length / pageSize);

  if (loading)
    return (
      <div data-testid="nextsteps-loading" aria-busy="true">
        Loading Next Steps…
      </div>
    );
  if (error)
    return (
      <div data-testid="nextsteps-error" role="alert">
        Error loading Next Steps
      </div>
    );

  return (
    <div data-testid="nextsteps-page" className="p-4">
      <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setEditTask(null);
          setOpenModal(true);
        }}
        aria-label="Add next step"
        data-testid="add-nextstep-btn"
      >
        Add Next Step
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pagedTasks.length === 0 && (
          <div className="text-gray-500" data-testid="nextsteps-empty">
            No next steps added.
          </div>
        )}
        {pagedTasks.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow p-4 relative">
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => {
                  setEditTask(t);
                  setOpenModal(true);
                }}
                aria-label={`Edit ${t.title}`}
                data-testid={`edit-nextstep-${t.id}`}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(t.id)}
                aria-label={`Delete ${t.title}`}
                data-testid={`delete-nextstep-${t.id}`}
              >
                Delete
              </button>
            </div>
            <div className="font-semibold">{t.title}</div>
            <div className="text-xs text-gray-500">Due: {t.due_date}</div>
            <div className="mt-2">
              <button
                className={`px-2 py-1 rounded ${
                  t.status === "done"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
                onClick={() => handleStatusToggle(t)}
                aria-label={`Toggle status for ${t.title}`}
                data-testid={`toggle-nextstep-status-${t.id}`}
              >
                {t.status === "done" ? "Done" : "Pending"}
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex gap-2 mt-4"
          role="navigation"
          aria-label="Next Steps pagination"
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 border rounded"
            aria-label="Previous page"
            data-testid="nextsteps-prev-page"
          >
            Prev
          </button>
          <span data-testid="nextsteps-page">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 border rounded"
            aria-label="Next page"
            data-testid="nextsteps-next-page"
          >
            Next
          </button>
        </div>
      )}
      {/* Modal for add/edit */}
      {openModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          data-testid="nextsteps-modal"
        >
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4"
            aria-label="Next Step form"
          >
            <h3 className="text-lg font-semibold mb-2">
              {editTask ? "Edit" : "Add"} Next Step
            </h3>
            <input
              name="title"
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              aria-label="Title"
              required
              data-testid="nextsteps-form-title"
            />
            <input
              name="due_date"
              type="date"
              placeholder="Due Date"
              value={form.due_date}
              onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              className="border rounded px-2 py-1 w-full"
              aria-label="Due Date"
              required
              data-testid="nextsteps-form-due-date"
            />
            {formError && (
              <div
                className="text-red-600"
                role="alert"
                data-testid="nextsteps-form-error"
              >
                {formError}
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-1 rounded"
                data-testid="nextsteps-form-submit"
              >
                {editTask ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
