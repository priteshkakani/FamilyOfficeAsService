import React from "react";
import { useForm } from "react-hook-form";
import OnboardingLayout from "./OnboardingLayout";
import { supabase } from "../../supabaseClient";
import LoadingSpinner from "../LoadingSpinner";
import { notifySuccess, notifyError } from "../../utils/toast";

export default function ProfileStep({ onNext, currentStep, showTitle = true }) {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [user, setUser] = React.useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      mobile_number: "",
      email_secondary: "",
    },
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
          .select("full_name,email,mobile_number,email_secondary")
          .eq("id", userObj.id)
          .maybeSingle();
        if (profileError) {
          console.error("[ProfileStep][fetch]", profileError);
        }
        if (profile) {
          setValue("full_name", profile.full_name ?? "");
          setValue("email", profile.email ?? userObj.email ?? "");
          setValue("mobile_number", profile.mobile_number ?? "");
          setValue("email_secondary", profile.email_secondary ?? "");
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
        email_secondary: values.email_secondary,
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

  if (loading)
    return (
      <div data-testid="profile-loading">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5">
        <OnboardingLayout title={showTitle ? "Profile Information" : undefined}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="full_name"
                  type="text"
                  data-testid="input-full_name"
                  {...register("full_name", {
                    required: "Full name is required",
                  })}
                  placeholder="Your full name"
                  className={`border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-200 ${
                    errors.full_name ? "border-red-400" : ""
                  }`}
                />
                {errors.full_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.full_name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Primary Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  data-testid="input-email"
                  {...register("email")}
                  readOnly
                  className="border border-gray-200 bg-gray-50 text-gray-500 rounded-lg w-full p-2.5 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Primary email is linked to your account and cannot be edited.
                </p>
              </div>
              <div>
                <label
                  htmlFor="email_secondary"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Secondary Email{" "}
                  <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="email_secondary"
                  type="email"
                  data-testid="input-email-secondary"
                  {...register("email_secondary", {
                    pattern: {
                      value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  placeholder="Enter secondary email"
                  className={`border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-200 ${
                    errors.email_secondary ? "border-red-400" : ""
                  }`}
                />
                {errors.email_secondary && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email_secondary.message}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Optional. Used for notifications and backup contact.
                </p>
              </div>
              <div>
                <label
                  htmlFor="mobile_number"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Mobile Number{" "}
                  <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  id="mobile_number"
                  type="tel"
                  data-testid="input-mobile_number"
                  {...register("mobile_number")}
                  placeholder="Enter mobile number"
                  className="border border-gray-300 rounded-lg w-full p-2.5 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-3">
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
      </div>
    </div>
  );
}
