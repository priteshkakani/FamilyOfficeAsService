import React, { useState, useEffect } from "react";
import OnboardingLayout from "../../layouts/OnboardingLayout";
import { supabase } from "../../supabaseClient";
import { notifyError, notifySuccess } from "../../utils/toast";

export default function ProfileStep({
  userId,
  onNext,
  onChange,
  showValidation,
}) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!userId) return;
      const { data } = await supabase
        .from("profiles")
        .select("full_name,email,mobile_number")
        .eq("id", userId)
        .maybeSingle();
      if (data) setForm((f) => ({ ...f, ...data }));
    }
    load();
  }, [userId]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (onChange) onChange({ ...form, [name]: value });
  };

  const [touched, setTouched] = useState({});

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.mobile_number) {
      notifyError("Name and mobile number are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        full_name: form.full_name,
        mobile_number: form.mobile_number,
        onboarding_step: 2,
      };
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, ...payload });
      if (error) throw error;
      notifySuccess("Profile saved");
      onNext && onNext();
    } catch (err) {
      console.error("[ProfileStep][save]", err.message);
      notifyError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout title="Profile" data-testid="onboarding-step-profile">
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        data-testid="profile-form"
      >
        <div>
          <label className="block mb-2 font-medium">Full name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleInput}
            onBlur={handleBlur}
            data-testid="profile-fullname"
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            placeholder="Your full name"
          />
          {showValidation && touched.full_name && !form.full_name ? (
            <div className="text-sm text-red-600 mt-1">Name is required</div>
          ) : null}
        </div>
        <div>
          <label className="block mb-2 font-medium">Email</label>
          <input
            name="email"
            value={form.email}
            readOnly
            className="border border-gray-200 bg-gray-50 rounded-lg p-2.5 w-full"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Mobile number</label>
          <input
            name="mobile_number"
            value={form.mobile_number}
            onChange={handleInput}
            className="border border-gray-300 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            placeholder="10-digit mobile"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={saving}
            data-testid="submit-button"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 py-2.5 w-full"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
