import React, { useState, useRef, useEffect } from "react";
import { useClient } from "../../hooks/useClientContext";
import useClientData from "../../hooks/useClientData";
import supabase from "../../src/supabaseClient";
import { useClientAndAdvisor } from "../../hooks/useClientAndAdvisor";

const { client } = useClient();
const userId = client?.id;

// Use the new hook for robust client/advisor name fetching
const {
  data: names,
  isLoading: namesLoading,
  error: namesError,
} = useClientAndAdvisor(userId);
const [selectedTab, setSelectedTab] = useState("identity");
const tabGroups = [
  {
    key: "identity",
    label: "Identity & Address Proof",
    testid: "docs-tab-identity",
  },
  { key: "portfolio", label: "Portfolio", testid: "docs-tab-portfolio" },
  { key: "activity", label: "Activity", testid: "docs-tab-activity" },
  {
    key: "subscription",
    label: "Subscription",
    testid: "docs-tab-subscription",
  },
  { key: "plan", label: "Plan", testid: "docs-tab-plan" },
];
const { loading, documents = [], refresh, error } = useClientData(userId);
const [uploading, setUploading] = useState(false);
const [file, setFile] = useState(null);
const [page, setPage] = useState(1);
const pageSize = 6;
// Search and date filters
const [docSearch, setDocSearch] = useState("");
const [docFrom, setDocFrom] = useState("");
const [docTo, setDocTo] = useState("");
// Debounce search
const docSearchRef = useRef();
useEffect(() => {
  docSearchRef.current = setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("docs_q", docSearch);
    params.set("docs_tab", selectedTab);
    if (docFrom) params.set("docs_from", docFrom);
    else params.delete("docs_from");
    if (docTo) params.set("docs_to", docTo);
    else params.delete("docs_to");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  }, 400);
  return () => clearTimeout(docSearchRef.current);
}, [docSearch, docFrom, docTo, selectedTab]);

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

// Filter by selected tab (category), search, and date range
const filteredDocs = documents.filter(
  (doc) =>
    doc.category === selectedTab &&
    (!docSearch ||
      doc.original_name?.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.doc_type?.toLowerCase().includes(docSearch.toLowerCase())) &&
    (!docFrom || new Date(doc.uploaded_at) >= new Date(docFrom)) &&
    (!docTo || new Date(doc.uploaded_at) <= new Date(docTo))
);
// Pagination
const pagedDocs = filteredDocs.slice((page - 1) * pageSize, page * pageSize);
const totalPages = Math.ceil(filteredDocs.length / pageSize);

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
    <div className="mb-4">
      {/* Responsive: stack on small, inline on large */}
      <div
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        data-testid="header-names"
      >
        {/* Client Name */}
        <div className="flex items-center gap-2">
          {namesLoading ? (
            <span
              className="animate-pulse bg-gray-200 rounded w-32 h-6 inline-block"
              data-testid="client-name-skeleton"
            />
          ) : (
            <span
              className="font-bold text-xl sm:text-2xl"
              data-testid="client-name"
              title={names?.clientEmail || undefined}
            >
              {names?.clientName?.trim() || "Unnamed Client"}
            </span>
          )}
        </div>
        <span className="hidden sm:inline text-gray-400 text-xl">•</span>
        {/* Advisor Name */}
        <div className="flex items-center gap-2">
          {namesLoading ? (
            <span
              className="animate-pulse bg-gray-200 rounded w-32 h-6 inline-block"
              data-testid="advisor-name-skeleton"
            />
          ) : (
            <span
              className="font-bold text-xl sm:text-2xl"
              data-testid="advisor-name"
              title={names?.advisorEmail || undefined}
            >
              {names?.advisorName?.trim() || "Independent Advisor"}
            </span>
          )}
        </div>
      </div>
      {/* Toast error if fetch failed */}
      {namesError && (
        <div className="mt-2 text-red-600" data-testid="header-names-error">
          Failed to load client/advisor names.
        </div>
      )}
    </div>
    <h2 className="text-xl font-semibold mb-4">Documents</h2>
    {/* Segmented control/tabs for document groups */}
    <div
      className="flex gap-2 mb-4"
      role="tablist"
      aria-label="Document Groups"
    >
      <h2 className="text-xl font-semibold mb-4">Documents</h2>
      {/* Segmented control/tabs for document groups */}
      <div
        className="flex gap-2 mb-4"
        role="tablist"
        aria-label="Document Groups"
      >
        {tabGroups.map((tab) => (
          <button
            key={tab.key}
            data-testid={tab.testid}
            className={`px-4 py-2 rounded ${
              selectedTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => {
              setSelectedTab(tab.key);
              setPage(1);
            }}
            role="tab"
            aria-selected={selectedTab === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Upload button per group */}
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
          data-testid="btn-upload-doc"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>
      {/* Search bar + date range filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search documents"
          className="border px-2 py-1 rounded"
          data-testid="filter-q"
          value={docSearch}
          onChange={(e) => setDocSearch(e.target.value)}
        />
        <input
          type="date"
          className="border px-2 py-1 rounded"
          data-testid="filter-from"
          value={docFrom}
          onChange={(e) => setDocFrom(e.target.value)}
        />
        <input
          type="date"
          className="border px-2 py-1 rounded"
          data-testid="filter-to"
          value={docTo}
          onChange={(e) => setDocTo(e.target.value)}
        />
      </div>
      {/* Table/grid for documents in selected group */}
      <div className="overflow-x-auto">
        <table
          className="min-w-full bg-white rounded-xl shadow"
          data-testid="docs-table"
        >
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Doc Type</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Size</th>
              <th className="px-4 py-2 text-left">Uploaded At</th>
              <th className="px-4 py-2 text-left">Linked To</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedDocs.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-gray-500 text-center py-4"
                  data-testid="documents-empty"
                >
                  No documents uploaded.
                </td>
              </tr>
            ) : (
              pagedDocs.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-4 py-2">{doc.doc_type}</td>
                  <td className="px-4 py-2">{doc.original_name}</td>
                  <td className="px-4 py-2">{doc.size}</td>
                  <td className="px-4 py-2">{doc.uploaded_at}</td>
                  <td className="px-4 py-2">
                    {doc.entity_type
                      ? `${doc.entity_type} (${doc.entity_id})`
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <a
                        href={doc.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        aria-label={`View ${doc.original_name}`}
                        data-testid="action-view"
                      >
                        View
                      </a>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => refresh && refresh()}
                        aria-label={`Delete ${doc.original_name}`}
                        data-testid="action-delete"
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
      {tabGroups.map((tab) => (
        <button
          key={tab.key}
          data-testid={tab.testid}
          className={`px-4 py-2 rounded ${
            selectedTab === tab.key
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => {
            setSelectedTab(tab.key);
            setPage(1);
          }}
          role="tab"
          aria-selected={selectedTab === tab.key}
        >
          {tab.label}
        </button>
      ))}
    </div>
    {/* Upload button per group */}
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
        data-testid="btn-upload-doc"
      >
        {uploading ? "Uploading…" : "Upload"}
      </button>
    </form>
    {/* Search bar + date range filter */}
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Search documents"
        className="border px-2 py-1 rounded"
        data-testid="filter-q"
        value={docSearch}
        onChange={(e) => setDocSearch(e.target.value)}
      />
      <input
        type="date"
        className="border px-2 py-1 rounded"
        data-testid="filter-from"
        value={docFrom}
        onChange={(e) => setDocFrom(e.target.value)}
      />
      <input
        type="date"
        className="border px-2 py-1 rounded"
        data-testid="filter-to"
        value={docTo}
        onChange={(e) => setDocTo(e.target.value)}
      />
    </div>
    {/* Table/grid for documents in selected group */}
    <div className="overflow-x-auto">
      <table
        className="min-w-full bg-white rounded-xl shadow"
        data-testid="docs-table"
      >
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left">Doc Type</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Size</th>
            <th className="px-4 py-2 text-left">Uploaded At</th>
            <th className="px-4 py-2 text-left">Linked To</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagedDocs.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-gray-500 text-center py-4"
                data-testid="documents-empty"
              >
                No documents uploaded.
              </td>
            </tr>
          ) : (
            pagedDocs.map((doc) => (
              <tr key={doc.id}>
                <td className="px-4 py-2">{doc.doc_type}</td>
                <td className="px-4 py-2">{doc.original_name}</td>
                <td className="px-4 py-2">{doc.size}</td>
                <td className="px-4 py-2">{doc.uploaded_at}</td>
                <td className="px-4 py-2">
                  {doc.entity_type
                    ? `${doc.entity_type} (${doc.entity_id})`
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <a
                      href={doc.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      aria-label={`View ${doc.original_name}`}
                      data-testid="action-view"
                    >
                      View
                    </a>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => refresh && refresh()}
                      aria-label={`Delete ${doc.original_name}`}
                      data-testid="action-delete"
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
