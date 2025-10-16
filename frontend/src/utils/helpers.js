// Helper functions for onboarding and validation

/**
 * Compute total from a set of fields (object with number values)
 * @param {Object.<string, number>} fields
 * @returns {number}
 */
export function computeMonthlyTotals(fields) {
  return Object.values(fields).reduce((sum, v) => sum + (Number(v) || 0), 0);
}

/**
 * PAN validation (basic)
 */
export function validatePAN(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test((pan || "").toUpperCase());
}

/**
 * UAN validation (12 digits)
 */
export function validateUAN(uan) {
  return /^\d{12}$/.test(uan || "");
}

/**
 * IFSC validation (4 letters + 0 + 6 digits)
 */
export function validateIFSC(ifsc) {
  return /^[A-Z]{4}0\d{6}$/.test((ifsc || "").toUpperCase());
}

/**
 * Fetch connected sources from Supabase consents table
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function fetchConnectedSources(supabase, userId) {
  const { data, error } = await supabase
    .from("consents")
    .select("source, identifier, status")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
}
