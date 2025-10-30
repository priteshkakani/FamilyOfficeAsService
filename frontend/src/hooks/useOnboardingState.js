import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { supabaseSafeQuery } from "../utils/supabaseSafeQuery";

import { logInfo, logError } from "../utils/logger";

const initialState = {
  full_name: "",
  email: "",
  mobile_number: "",
  family_members: [],
  data_sources: [],
  monthly_income: "",
  monthly_expenses: "",
  liabilities_summary: "",
  goals: [],
  is_onboarded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ALL":
      return { ...state, ...action.payload };
    case "UPDATE":
      return { ...state, ...action.payload };
    case "SET_ONBOARDED":
      return { ...state, is_onboarded: true };
    default:
      return state;
  }
}

export function useOnboardingState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  let userId = null;

  // Per-step fetchers
  async function fetchProfile() {
    setLoading(true);
    setError("");
    try {
      logInfo("Fetching: profiles");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      userId = session?.user?.id;
      if (!userId) throw new Error("No user session");
      const { data: profile, error } = await supabaseSafeQuery(
        "fetchProfile",
        () =>
          supabase
            .from("profiles")
            .select("full_name,email,mobile_number,is_onboarded")
            .eq("id", userId)
            .single()
      );
      if (error) throw error;
      dispatch({ type: "SET_ALL", payload: { ...profile } });
      if (profile.is_onboarded) navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFamily() {
    setLoading(true);
    setError("");
    try {
      logInfo("Fetching: family_members");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      userId = session?.user?.id;
      if (!userId) throw new Error("No user session");
      const { data: family, error } = await supabaseSafeQuery(
        "fetchFamily",
        () =>
          supabase
            .from("family_members")
            .select("name,relation")
            .eq("user_id", userId)
      );
      if (error) throw error;
      dispatch({ type: "UPDATE", payload: { family_members: family || [] } });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchGoals() {
    setLoading(true);
    setError("");
    try {
      logInfo("Fetching: goals");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      userId = session?.user?.id;
      if (!userId) throw new Error("No user session");
      const { data: goals, error } = await supabaseSafeQuery("fetchGoals", () =>
        supabase
          .from("goals")
          .select("id,title,description,target_amount,target_year,priority")
          .eq("user_id", userId)
      );
      if (error) throw error;
      dispatch({ type: "UPDATE", payload: { goals: goals || [] } });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Add similar fetchers for data_sources and income_expenses as needed

  // Save only the relevant step's data
  async function saveStep(stepKey, newState) {
    setLoading(true);
    setError("");
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      userId = session?.user?.id;
      if (!userId) throw new Error("No user session");
      if (stepKey === "profile") {
        await supabaseSafeQuery("saveProfile", () =>
          supabase
            .from("profiles")
            .update({
              full_name: newState.full_name,
              email: newState.email,
              mobile_number: newState.mobile_number,
            })
            .eq("id", userId)
        );
      } else if (stepKey === "family") {
        await supabaseSafeQuery("deleteFamilyMembers", () =>
          supabase.from("family_members").delete().eq("user_id", userId)
        );
        if (newState.family_members?.length) {
          await supabaseSafeQuery("insertFamilyMembers", () =>
            supabase
              .from("family_members")
              .insert(
                newState.family_members.map((m) => ({ ...m, user_id: userId }))
              )
          );
        }
      } else if (stepKey === "goals") {
        await supabaseSafeQuery("deleteGoals", () =>
          supabase.from("goals").delete().eq("user_id", userId)
        );
        if (newState.goals?.length) {
          await supabaseSafeQuery("insertGoals", () =>
            supabase
              .from("goals")
              .insert(
                newState.goals.map((goal) => ({ ...goal, user_id: userId }))
              )
          );
        }
      } else if (stepKey === "dataSources" || stepKey === "incomeExpense") {
        await supabaseSafeQuery("saveDataSourcesOrIncomeExpense", () =>
          supabase
            .from("profiles")
            .update({
              data_sources: newState.data_sources,
              monthly_income: newState.monthly_income,
              monthly_expenses: newState.monthly_expenses,
              liabilities_summary: newState.liabilities_summary,
            })
            .eq("id", userId)
        );
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (newData) => {
    dispatch({ type: "UPDATE", payload: newData });
  };

  const handleNext = async () => {
    const stepKeys = [
      "profile",
      "family",
      "dataSources",
      "incomeExpense",
      "goals",
      "summary",
    ];
    const currentStep = stepKeys[stepIndex];
    await saveStep(currentStep, state);
    setStepIndex((i) => Math.min(i + 1, 5));
  };
  const handleBack = async () => {
    const stepKeys = [
      "profile",
      "family",
      "dataSources",
      "incomeExpense",
      "goals",
      "summary",
    ];
    const currentStep = stepKeys[stepIndex];
    await saveStep(currentStep, state);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleFinish = async () => {
    setLoading(true);
    setError("");
    try {
      await saveStep("goals", { ...state, is_onboarded: true });
      await supabaseSafeQuery("finishOnboarding", async () =>
        supabase
          .from("profiles")
          .update({ is_onboarded: true })
          .eq("id", (await supabase.auth.getSession()).data.session.user.id)
      );
      dispatch({ type: "SET_ONBOARDED" });
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    state,
    stepIndex,
    loading,
    error,
    handleNext,
    handleBack,
    handleChange,
    handleFinish,
    setStepIndex,
    fetchProfile,
    fetchFamily,
    fetchGoals,
    // Add fetchDataSources, fetchIncomeExpenses as needed
  };
}
