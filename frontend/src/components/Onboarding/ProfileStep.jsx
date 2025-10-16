import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export default function ProfileStep({ data, onChange, error, showValidation }) {
  const [loading, setLoading] = useState(true);
  const [localData, setLocalData] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
  });
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchProfile() {
      setLoading(true);
      setLoadError("");
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData?.session;
        if (!session || !session.user?.id) {
          setLoadError("No user session");
          setLoading(false);
          return;
        }
        const { data: profile, error: fetchError } = await supabase
          .from("profiles")
          .select("full_name,email,mobile_number")
          .eq("id", session.user.id)
          .single();
        if (fetchError) {
          setLoadError(fetchError.message);
        } else if (isMounted) {
          setLocalData({
            full_name: profile?.full_name || "",
            email: profile?.email || "",
            mobile_number: profile?.mobile_number || "",
          });
          onChange({
            ...data,
            full_name: profile?.full_name || "",
            email: profile?.email || "",
            mobile_number: profile?.mobile_number || "",
          });
        }
      } catch (e) {
        setLoadError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  const handleInput = (e) => {
    setLocalData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    onChange({ ...data, [e.target.name]: e.target.value });
  };
  const isEmpty = (val) => typeof val !== "string" || val.trim() === "";

  if (loading) {
    return (
      <div
        className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6 animate-pulse"
        data-testid="profile-loading"
      >
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      </div>
    );
  }
  if (loadError) {
    return (
      <div className="text-red-500 text-center" data-testid="profile-error">
        {loadError}
      </div>
    );
  }
  return (
    <div
      className="max-w-lg mx-auto bg-white shadow-md rounded-xl p-6"
      data-testid="profile-form"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile</h2>
      <div className="space-y-5">
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Full Name *
          </label>
          <input
            type="text"
            name="full_name"
            value={localData.full_name}
            onChange={handleInput}
            className="input input-bordered w-full rounded-lg focus:ring focus:ring-blue-200"
            required
            data-testid="profile-fullname"
          />
          {showValidation && isEmpty(localData.full_name) && (
            <div className="text-red-500 text-sm mt-1">Name is required</div>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={localData.email}
            onChange={handleInput}
            className="input input-bordered w-full rounded-lg focus:ring focus:ring-blue-200"
            required
            data-testid="profile-email"
          />
          {showValidation && isEmpty(localData.email) && (
            <div className="text-red-500 text-sm mt-1">Email is required</div>
          )}
        </div>
        <div>
          <label className="block mb-2 text-gray-700 font-medium">
            Mobile Number *
          </label>
          <input
            type="tel"
            name="mobile_number"
            value={localData.mobile_number}
            onChange={handleInput}
            className="input input-bordered w-full rounded-lg focus:ring focus:ring-blue-200"
            required
            data-testid="profile-mobile"
          />
          {showValidation && isEmpty(localData.mobile_number) && (
            <div className="text-red-500 text-sm mt-1">
              Mobile number is required
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
