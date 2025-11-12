import React, { useState, useEffect } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

const DOC_TYPES = [
  "PAN Card",
  "Aadhar Card",
  "Property Papers",
  "Insurance Documents",
  "Other Docs",
  "Consolidated Account Statement",
];

export default function DocumentsUploadStep({ userId }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState(DOC_TYPES[0]);

  const refreshFiles = async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false });
    if (error) notifyError(error.message);
    setFiles(data || []);
  };

  useEffect(() => {
    refreshFiles();
  }, [userId]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadErr } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      if (uploadErr) throw uploadErr;
      const { error: rowErr } = await supabase.from("documents").insert({
        user_id: userId,
        doc_type: docType,
        file_path: filePath,
        original_name: file.name,
        uploaded_at: new Date().toISOString(),
        meta: {},
      });
      if (rowErr) throw rowErr;
      notifySuccess("File uploaded");
      await refreshFiles();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (id, filePath) => {
    if (!window.confirm("Delete this file?")) return;
    setUploading(true);
    try {
      const { error: storageErr } = await supabase.storage
        .from("documents")
        .remove([filePath]);
      if (storageErr) throw storageErr;
      const { error: rowErr } = await supabase
        .from("documents")
        .delete()
        .eq("id", id);
      if (rowErr) throw rowErr;
      notifySuccess("File deleted");
      await refreshFiles();
    } catch (err) {
      notifyError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <OnboardingLayout title="Documents Upload">
      <div className="space-y-5">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Document Type
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full border rounded-lg p-2.5"
            >
              {DOC_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Upload File
            </label>
            <input
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              className="w-full border rounded-lg p-2.5"
            />
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Uploaded Documents</h3>
          <div className="text-sm text-gray-500">List of uploaded files</div>
          {files.length === 0 ? (
            <div className="text-sm text-gray-500">No files uploaded</div>
          ) : (
            <ul className="space-y-2">
              {files.map((f, idx) => (
                <li
                  key={f.id ?? idx}
                  className="border p-2 rounded-md flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{f.doc_type}</div>
                    <div className="text-xs text-gray-500">
                      {f.original_name}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={
                        supabase.storage
                          .from("documents")
                          .getPublicUrl(f.file_path).publicUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View
                    </a>
                    <button
                      className="text-red-600 hover:underline text-xs"
                      onClick={() => deleteFile(f.id, f.file_path)}
                    >
                      Delete
                    </button>
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
