import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FamilyPanel from "../../components/profile/FamilyPanel";

function Profile() {
  const { clientId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      if (!clientId) {
        setLoading(false);
        return;
      }
      const { data: prof } = await import("../../supabaseClient").then(
        ({ default: supabase }) =>
          supabase.from("profiles").select("*").eq("id", clientId).maybeSingle()
      );
      if (mounted) {
        setProfile(prof);
        setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [clientId]);

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
      {/* FamilyPanel with all new features and requirements */}
      <FamilyPanel clientId={clientId} profileSaved={!!profile} />
    </div>
  );
}

export default Profile;
