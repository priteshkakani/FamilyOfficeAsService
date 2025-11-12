import React, { useState, useEffect, useRef } from "react";
import formatINR from "../../utils/formatINR";
import { supabase } from "../../supabaseClient";

export default function DetailsDrawer({
  open,
  onClose,
  kpiKey,
  entityId,
  entityType,
}) {
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (open && entityId && entityType) {
      supabase
        .from("documents")
        .select("id,doc_type,file_path,original_name,size,uploaded_at")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .then(({ data }) => setAttachments(data || []));
    }
  }, [open, entityId, entityType]);

  const handleUpload = async () => {
    setUploading(true);
    try {
      const user = await supabase.auth.getUser();
      const userId = user?.data?.user?.id;
      const file = fileInputRef.current.files[0];
      if (!file || !userId) return;
      const filePath = `${userId}/${entityType}/${entityId}/${file.name}`;
      const { error: storageErr } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      if (storageErr) throw storageErr;
      const { error: rowErr } = await supabase.from("documents").insert({
        user_id: userId,
        entity_type: entityType,
        entity_id: entityId,
        doc_type: kpiKey,
        file_path: filePath,
        original_name: file.name,
        size: file.size,
        uploaded_at: new Date().toISOString(),
      });
      if (rowErr) throw rowErr;
      fileInputRef.current.value = "";
      supabase
        .from("documents")
        .select("id,doc_type,file_path,original_name,size,uploaded_at")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .then(({ data }) => setAttachments(data || []));
      window.notifySuccess && window.notifySuccess("Upload successful");
      setUploading(false);
    } catch (e) {
      window.notifyError && window.notifyError("Upload failed: " + e.message);
      setUploading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end">
      <div
        className="bg-white w-full max-w-lg h-full shadow-2xl p-6 space-y-5 overflow-y-auto"
        role="dialog"
        aria-label="Details Drawer"
        tabIndex={0}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Details for {kpiKey}</h2>
        {/* Breakdown, trend chart, etc. can be added here */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Upload Attachment</label>
          <input type="file" ref={fileInputRef} className="w-full" />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            onClick={handleUpload}
            disabled={uploading}
            data-testid="drawer-upload-btn"
          >
            Upload
          </button>
        </div>
        <div className="mb-4" data-testid="drawer-attachments-list">
          <h3 className="font-semibold mb-2">Attachments</h3>
          {attachments.length === 0 ? (
            <div className="text-gray-500">No attachments yet.</div>
          ) : (
            <ul className="space-y-2">
              {attachments.map((att) => (
                <li
                  key={att.id}
                  className="bg-gray-50 rounded p-2 flex flex-col"
                >
                  <span>
                    <b>{att.doc_type}</b> - {att.original_name} (
                    {Math.round(att.size / 1024)} KB)
                  </span>
                  <span className="text-xs text-gray-400">
                    {att.uploaded_at}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />
    </div>
  );
}
