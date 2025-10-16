// src/utils/supabaseSafeQuery.js
import { logInfo, logError, logRemote } from "./logger";

export async function supabaseSafeQuery(label, fn) {
  try {
    const result = await fn();
    if (result.error) {
      logError(`[${label}] Supabase error:`, result.error);
      logRemote && logRemote("error", result.error.message, { label });
      return { ...result, error: result.error };
    }
    logInfo(`[${label}] Supabase success`);
    return result;
  } catch (e) {
    logError(`[${label}] Exception:`, e);
    logRemote && logRemote("error", e.message, { label });
    return { error: e };
  }
}
