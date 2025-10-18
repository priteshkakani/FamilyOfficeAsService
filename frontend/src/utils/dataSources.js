import { supabase } from "../supabaseClient";

export async function fetchConnectedSources(userId) {
  try {
    const { data, error } = await supabase
      .from("consents")
      .select("source, identifier, status, meta, created_at")
      .eq("user_id", userId);
    if (error) throw error;
    return data || [];
  } catch (e) {
    console.error("[fetchConnectedSources]", e.message);
    return [];
  }
}
