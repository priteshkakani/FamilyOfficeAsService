import React from "react";
import { useForm } from "react-hook-form";
import OnboardingLayout from "./OnboardingLayout";
import OnboardingStepper from "./OnboardingStepper";
import { supabase } from "../../supabaseClient";
import LoadingSpinner from "../LoadingSpinner";
import { notifySuccess, notifyError } from "../../utils/toast";

const steps = [
  "Profile",
  "Family",
  "Data Sources",
  "Income & Expenses",
  "Liabilities",
  "Goals",
];

export default function ProfileStep({ onNext, onBack, currentStep, setCompleted }) {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [completedSteps, setCompletedSteps] = React.useState([]);

  const { register, handleSubmit, setValue, watch, formState } = useForm({
    defaultValues: { full_name: "", email: "", mobile_number: "" },
  });

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { data: sessionData } = await supabase.auth.getUser();
        const userObj = sessionData?.user ?? null;
        if (!userObj) {
          // redirect to login
          window.location.href = "/login";
          return;
        }
        if (!mounted) return;
        setUser(userObj);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name,email,mobile_number")
          .eq("id", userObj.id)
          .maybeSingle();
        if (profileError) {
          console.error("[ProfileStep][fetch]", profileError);
        }
        if (profile) {
          setValue("full_name", profile.full_name ?? "");
          setValue("email", profile.email ?? userObj.email ?? "");
          setValue("mobile_number", profile.mobile_number ?? "");
        } else {
          // no profile row — populate email from auth
          setValue("email", userObj.email ?? "");
        }
      } catch (err) {
        console.error("[ProfileStep][fetch] unexpected", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [setValue]);

  const onSubmit = async (values) => {
    if (!user) return;
    setSaving(true);
    try {
      const payload = {
        id: user.id,
        full_name: values.full_name,
        email: values.email,
        mobile_number: values.mobile_number,
        onboarding_step: 2,
      };

      const { data, error } = await supabase.from("profiles").upsert(payload, { returning: "representation" });
      if (error) {
        console.error("[ProfileStep][save]", error);
        notifyError("Failed to save profile: " + (error.message || "unknown"));
      } else {
        notifySuccess("Profile saved");
        setCompleted && setCompleted((c) => Array.from(new Set([...(c || []), currentStep])));
        onNext && onNext();
      }
    } catch (err) {
      console.error("[ProfileStep][save] unexpected", err);
      notifyError("Unexpected error saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <OnboardingLayout
      stepper={<OnboardingStepper steps={steps} currentStep={currentStep} completedSteps={completedSteps} onStepClick={(i) => {}} />}
    >
      <div data-testid="onboarding-profile">
        <h3 className="text-xl font-semibold mb-4">Profile</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full name</label>
            <input
              data-testid="input-full_name"
              {...register("full_name", { required: true })}
              className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              data-testid="input-email"
              {...register("email")}
              readOnly
              className="border rounded-lg p-2.5 w-full bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile number</label>
            <input
              data-testid="input-mobile_number"
              {...register("mobile_number")}
              className="border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => onBack && onBack()}
              className="px-4 py-2 rounded bg-gray-100"
              data-testid="btn-prev"
            >
              Prev
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded bg-blue-600 text-white"
              data-testid="btn-save-profile"
            >
              {saving ? "Saving..." : "Save & Next"}
            </button>
          </div>
        </form>
      </div>
    </OnboardingLayout>
  );
}
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
