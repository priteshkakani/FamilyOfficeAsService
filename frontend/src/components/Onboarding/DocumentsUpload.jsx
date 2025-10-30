import React, { useState, useRef } from "react";
import { supabase } from "../../supabaseClient";

const DOC_TYPES = [
  "PAN",
  "Aadhaar",
  "Bank Statement",
  "Insurance Policy",
  "EPFO",
  "ITR",
  "Others",
];

export default function DocumentsUpload() {
  const [files, setFiles] = useState([]);
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [notes, setNotes] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const fileInputRef = useRef();

  const fetchDocs = async (userId) => {
    const { data } = await supabase
      .from("documents")
      .select("id,doc_type,file_path,original_name,size,uploaded_at,notes")
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false });
    setUploadedDocs(data || []);
    console.log("[Documents][fetch]", data);
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const user = await supabase.auth.getUser();
      const userId = user?.data?.user?.id;
      if (!userId || files.length === 0) return;
      for (const file of files) {
        const filePath = `${userId}/${Date.now()}_${file.name}`;
        const { data: storageRes, error: storageErr } = await supabase.storage
          .from("documents")
          .upload(filePath, file);
        if (storageErr) throw storageErr;
        const { data: row, error: rowErr } = await supabase
          .from("documents")
          .insert({
            user_id: userId,
            doc_type: docType,
            file_path: filePath,
            original_name: file.name,
            size: file.size,
            uploaded_at: new Date().toISOString(),
            notes,
          });
        if (rowErr) throw rowErr;
        console.log("[Documents][upload]", row);
      }
      await fetchDocs(userId);
      setFiles([]);
      setNotes("");
      fileInputRef.current.value = "";
      alert("Upload successful!");
    } catch (e) {
      alert("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.id) fetchDocs(data.user.id);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5"
        data-testid="docs-upload"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Upload Documents</h2>
        <div className="space-y-4">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {DOC_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="w-full"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
          >
            Upload
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded"
            onClick={() => (window.location.href = "/onboarding/terms")}
          >
            Continue
          </button>
        </div>
        <div className="mt-6" data-testid="docs-list">
          <h3 className="font-semibold mb-2">Uploaded Documents</h3>
          {uploadedDocs.length === 0 ? (
            <div className="text-gray-500">No documents uploaded yet.</div>
          ) : (
            <ul className="space-y-2">
              {uploadedDocs.map((doc) => (
                <li
                  key={doc.id}
                  className="bg-gray-50 rounded p-2 flex flex-col"
                >
                  <span>
                    <b>{doc.doc_type}</b> - {doc.original_name} (
                    {Math.round(doc.size / 1024)} KB)
                  </span>
                  <span className="text-xs text-gray-400">
                    {doc.uploaded_at}
                  </span>
                  {doc.notes && (
                    <span className="text-xs text-gray-500">
                      Notes: {doc.notes}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
