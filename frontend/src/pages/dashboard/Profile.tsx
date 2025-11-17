import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";
import FamilyPanel from "../../components/profile/FamilyPanel";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function fetchData() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const { default: supabase } = await import("../../supabaseClient");
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (mounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [user?.id]);

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
      <FamilyPanel profileSaved={!!profile} />
    </div>
  );
}

export default Profile;
