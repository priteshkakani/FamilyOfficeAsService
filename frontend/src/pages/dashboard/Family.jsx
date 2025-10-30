import React, { useEffect, useState } from "react";
import FamilyMembers from "../../components/dashboard/FamilyMembers";
import { useClient } from "../../hooks/useClientContext";

export default function Family() {
  const { client } = useClient();
  const userId = client?.id;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="max-w-xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Family Members</h2>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <FamilyMembers
        members={members}
        userId={userId}
        onDelete={handleDelete}
      />
    </div>
  );
}
