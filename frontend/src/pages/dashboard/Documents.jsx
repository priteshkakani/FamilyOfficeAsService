import React, { useState } from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";

export default function Documents() {
  const { client } = useClient();
  const userId = client?.id;
  const { loading, documents = [], refresh, error } = useClientData(userId);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Mock upload handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      refresh && refresh();
    }, 1000);
  };

  // Pagination
  const pagedDocs = documents.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(documents.length / pageSize);

  if (loading)
    return (
      <div data-testid="documents-loading" aria-busy="true">
        Loading documents…
      </div>
    );
  if (error)
    return (
      <div data-testid="documents-error" role="alert">
        Error loading documents
      </div>
    );

  return (
    <div data-testid="documents-page" className="p-4">
      <h2 className="text-xl font-semibold mb-4">Documents</h2>
      <form
        onSubmit={handleUpload}
        className="mb-4 flex gap-2 items-center"
        aria-label="Upload document"
      >
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          aria-label="Select document"
          data-testid="documents-upload-input"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={uploading}
          aria-label="Upload document"
          data-testid="documents-upload-btn"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pagedDocs.length === 0 && (
          <div className="text-gray-500" data-testid="documents-empty">
            No documents uploaded.
          </div>
        )}
        {pagedDocs.map((doc) => (
          <div key={doc.id} className="bg-white rounded-xl shadow p-4 relative">
            <div className="font-semibold">{doc.name}</div>
            <div className="text-xs text-gray-500">{doc.link}</div>
            <div className="absolute top-2 right-2 flex gap-1">
              <a
                href={doc.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                aria-label={`Preview ${doc.name}`}
                data-testid={`preview-doc-${doc.id}`}
              >
                Preview
              </a>
              <button
                className="text-red-600 hover:underline"
                onClick={() => refresh && refresh()}
                aria-label={`Delete ${doc.name}`}
                data-testid={`delete-doc-${doc.id}`}
              >
                Delete
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
          aria-label="Documents pagination"
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 border rounded"
            aria-label="Previous page"
            data-testid="documents-prev-page"
          >
            Prev
          </button>
          <span data-testid="documents-page">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 border rounded"
            aria-label="Next page"
            data-testid="documents-next-page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
