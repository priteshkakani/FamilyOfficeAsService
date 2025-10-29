import React from "react";
import { useForm } from "react-hook-form";
import OnboardingLayout from "./OnboardingLayout";
import { supabase } from "../../supabaseClient";
import LoadingSpinner from "../LoadingSpinner";
import { notifySuccess, notifyError } from "../../utils/toast";

export default function ProfileStep({ onNext, currentStep }) {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const { register, handleSubmit, setValue } = useForm({
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
        onboarding_step: currentStep + 1,
      };

      const { error } = await supabase.from("profiles").upsert(payload, {
        returning: "representation",
      });
      if (error) {
        console.error("[ProfileStep][save]", error);
        notifyError("Failed to save profile: " + (error.message || "unknown"));
      } else {
        notifySuccess("Profile saved");
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
    <OnboardingLayout title="Profile Information">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              data-testid="input-full_name"
              {...register("full_name", { required: true })}
              placeholder="Your full name"
              className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              data-testid="input-email"
              {...register("email")}
              readOnly
              className="border border-gray-200 bg-gray-50 text-gray-500 rounded-lg w-full p-2.5 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email is linked to your account and cannot be edited.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              data-testid="input-mobile_number"
              {...register("mobile_number")}
              placeholder="Enter mobile number"
              className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            disabled={saving}
            data-testid="btn-save-profile"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2.5"
          >
            {saving ? "Saving..." : "Save & Continue →"}
          </button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
