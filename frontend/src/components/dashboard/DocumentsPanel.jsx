import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function DocumentsPanel({ userId }) {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // List documents for user
        const { data, error } = await supabase.storage
          .from("documents")
          .list(userId + "/", { limit: 100 });
        if (error) throw error;
        setDocs(data || []);
      } catch (err) {
        notifyError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const handleUpload = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    try {
      // Upload to storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .upload(userId + "/" + f.name, f, { upsert: true });
      if (storageError) throw storageError;
      // Insert DB row
      const { error: dbError } = await supabase
        .from("documents")
        .insert({
          user_id: userId,
          name: f.name,
          uploaded_at: new Date().toISOString(),
        });
      if (dbError) throw dbError;
      notifySuccess("Uploaded");
      setFile(null);
      // Reload
      const { data } = await supabase.storage
        .from("documents")
        .list(userId + "/", { limit: 100 });
      setDocs(data || []);
    } catch (err) {
      notifyError("Upload failed");
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      // Remove from storage
      const { error: storageError } = await supabase.storage
        .from("documents")
        .remove([userId + "/" + name]);
      if (storageError) throw storageError;
      // Remove DB row
      const { error: dbError } = await supabase
        .from("documents")
        .delete()
        .eq("user_id", userId)
        .eq("name", name);
      if (dbError) throw dbError;
      notifySuccess("Deleted");
      setDocs(docs.filter((d) => d.name !== name));
    } catch (err) {
      notifyError("Delete failed");
    }
  };

  const getPublicUrl = (name) => {
    return supabase.storage.from("documents").getPublicUrl(userId + "/" + name)
      .publicUrl;
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold mb-2">Documents</h3>
      <div className="mb-4">
        <input type="file" onChange={handleUpload} data-testid="docs-upload" />
      </div>
      <ul className="bg-white rounded shadow p-4" data-testid="docs-list">
        {docs.map((doc) => (
          <li
            key={doc.name}
            className="flex items-center justify-between py-2 border-b"
          >
            <span>{doc.name}</span>
            <div className="flex gap-2">
              <a
                href={getPublicUrl(doc.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Preview
              </a>
              <button
                className="text-red-600"
                onClick={() => handleDelete(doc.name)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
