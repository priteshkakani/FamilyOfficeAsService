import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthProvider";
import supabase from "../../supabaseClient";

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
        query = query.or(
          `name.ilike.%${q}%,pan.ilike.%${q}%,aadhaar.ilike.%${q}%`
        );
      }
      if (relation) query = query.eq("relation", relation);
      if (marital) query = query.eq("marital_status", marital);
      // Sorting
      if (sort === "name") query = query.order("name", { ascending: true });
      else if (sort === "dob_new")
        query = query.order("dob", { ascending: false });
      else if (sort === "dob_old")
        query = query.order("dob", { ascending: true });
      else query = query.order("created_at", { ascending: false });
      // Pagination
      const from = ((page || 1) - 1) * (pageSize || 10);
      const to = from + (pageSize || 10) - 1;
      query = query.range(from, to);
      const { data, error, count, status } = await query;
      if (error && status === 403) throw Object.assign(error, { code: 403 });
      if (error) throw error;
      return { data, count };
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
      
      const { data, error } = await supabase
        .from("family_members")
        .insert([{ ...values, user_id: userId }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["family"]);
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
      
      const { data, error } = await supabase
        .from("family_members")
        .update(updates)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) throw error;
      return data;
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
    mutationFn: async (id) => {
      if (!userId) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("family_members")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["family"]);
    },
  });
}
