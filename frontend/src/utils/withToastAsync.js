import toast from "react-hot-toast";

/**
 * Wraps an async function with standardized toasts for loading, success, and error.
 * Usage: await withToastAsync(() => supabase.from(...), { loading: 'Saving...', success: 'Saved!', error: 'Failed.' })
 */
export async function withToastAsync(fn, { loading, success, error }) {
  let tId;
  try {
    tId = toast.loading(loading || "Processing...");
    const result = await fn();
    toast.success(success || "Success", { id: tId });
    return result;
  } catch (err) {
    toast.error((error || "Error") + (err?.message ? ": " + err.message : ""), {
      id: tId,
    });
    throw err;
  }
}
