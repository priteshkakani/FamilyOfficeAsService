import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthProvider";
import { supabase } from "../../supabaseClient";

// Mask PAN: AA***1234A, Aadhaar: XXXX-XXXX-1234
export function maskPan(pan) {
  if (!pan || pan.length !== 10) return pan;
  return pan.slice(0, 2) + "***" + pan.slice(5);
}
export function maskAadhaar(aadhaar) {
  if (!aadhaar || aadhaar.length !== 12) return aadhaar;
  return "XXXX-XXXX-" + aadhaar.slice(-4);
}

// PAN validation: AAAAA9999A
export function validatePan(pan) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan);
}
// Aadhaar validation: 12 digits
export function validateAadhaar(aadhaar) {
  return /^\d{12}$/.test(aadhaar);
}

// Fetch family members for the current user with filters, search, sort, pagination
export function useFamilyMembers({
  q,
  relation,
  marital,
  sort,
  page,
  pageSize,
  enabled = true,
}) {
  const { user } = useAuth();
  const userId = user?.id;
  
  return useQuery({
    queryKey: [
      "family",
      userId,
      { q, relation, marital, sort, page, pageSize },
    ],
    enabled: !!userId && enabled !== false,
    queryFn: async () => {
      let query = supabase
        .from("family_members")
        .select("*", { count: "exact" })
        .eq("user_id", userId);
      if (q) {
        query = query.or(`name.ilike.%${q}%`);
      }
      if (relation) query = query.eq("relationship", relation);
      // Sorting
      if (sort === "name") query = query.order("name", { ascending: true });
      else if (sort === "dob_new") query = query.order("created_at", { ascending: false });
      else if (sort === "dob_old") query = query.order("created_at", { ascending: true });
      else query = query.order("created_at", { ascending: false });
      // Pagination
      const from = ((page || 1) - 1) * (pageSize || 10);
      const to = from + (pageSize || 10) - 1;
      query = query.range(from, to);
      const { data, error, count, status } = await query;
      if (error && status === 403) throw Object.assign(error, { code: 403 });
      if (error) throw error;
      // Map DB columns to UI expectations (relation, dob, aadhaar)
      const mapped = (data || []).map((row) => ({
        ...row,
        relation: row.relationship,
        dob: row.dob ?? row.date_of_birth,
        aadhaar: row.aadhar,
      }));
      return { members: mapped, totalCount: count };
    },
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  });
}

// Mutations for add, edit, delete
export function useAddFamilyMember() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  
  return useMutation({
    mutationFn: async (values) => {
      if (!userId) throw new Error("User not authenticated");
      // Map UI values to DB columns and only pass known columns
      const payload = {
        name: values?.name || "",
        relationship: values?.relation || "",
        user_id: userId,
      };
      if (values?.pan) payload.pan = values.pan;
      if (values?.aadhaar) payload.aadhar = values.aadhaar;
      if (values?.profession) payload.profession = values.profession;
      if (values?.marital_status) payload.marital_status = values.marital_status;
      if (values?.dob) payload.dob = values.dob;
      const { data, error } = await supabase
        .from("family_members")
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      // Map back to UI shape with relation/dob/aadhaar
      return {
        ...data,
        relation: data.relationship,
        dob: data.dob ?? data.date_of_birth,
        aadhaar: data.aadhar,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family"] });
    },
  });
}
export function useEditFamilyMember() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      if (!userId) throw new Error("User not authenticated");
      // Only update known columns and map keys
      const updatePayload = {
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.relation !== undefined ? { relationship: updates.relation } : {}),
        ...(updates.pan !== undefined ? { pan: updates.pan } : {}),
        ...(updates.aadhaar !== undefined ? { aadhar: updates.aadhaar } : {}),
        ...(updates.profession !== undefined ? { profession: updates.profession } : {}),
        ...(updates.marital_status !== undefined ? { marital_status: updates.marital_status } : {}),
        ...(updates.dob !== undefined ? { dob: updates.dob } : {}),
      };
      const { data, error } = await supabase
        .from("family_members")
        .update(updatePayload)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) throw error;
      return { ...data, relation: data.relationship, dob: data.date_of_birth };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["family"]);
    },
  });
}
export function useDeleteFamilyMember() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;
  
  return useMutation({
    mutationFn: async (arg) => {
      if (!userId) throw new Error("User not authenticated");
      // Accept either a string id or an object with { id }
      const id = typeof arg === "string" ? arg : arg?.id;
      if (!id || typeof id !== "string") {
        throw new Error("A valid member id is required to delete");
      }
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["family"] });
    },
  });
}
