import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuth } from "../../contexts/AuthProvider";
import { supabase } from "../../supabaseClient";

export interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  date_of_birth?: string | null;
  created_at: string;
  updated_at: string;
}

const fetchFamilyMembers = async (userId: string | undefined): Promise<FamilyMember[]> => {
  if (!userId) {
    console.warn('No user ID provided to fetchFamilyMembers');
    return [];
  }

  try {
    console.log('Fetching family members for user:', userId);
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message || 'Failed to fetch family members');
    }

    console.log('Fetched family members:', data);
    return data || [];
  } catch (error) {
    console.error('Error in fetchFamilyMembers:', error);
    throw error;
  }
};

interface UseFamilyMembersOptions {
  userId?: string;
  q?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export const useFamilyMembers = (options: UseFamilyMembersOptions = {}) => {
  const auth = useAuth();
  const userId = options.userId || auth?.user?.id;
  const queryClient = useQueryClient();

  console.log('useFamilyMembers hook called, userId:', userId, 'options:', options);

  // Query for family members
  const {
    data: members = [],
    isLoading,
    error,
    refetch
  } = useQuery<FamilyMember[], Error>({
    queryKey: ['familyMembers', userId],
    queryFn: () => fetchFamilyMembers(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Add a new family member
  const addMember = async (data: Omit<FamilyMember, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) {
      const error = new Error('Authentication required');
      console.error('User ID is required for adding family member');
      toast.error(error.message);
      throw error;
    }

    try {
      console.log('Adding family member:', data);
      const insertPayload: Partial<FamilyMember> & { user_id: string } = {
        name: data.name,
        relationship: data.relationship,
        user_id: userId,
      };
      const { data: newMember, error } = await supabase
        .from('family_members')
        .insert([insertPayload])
        .select()
        .single();

      if (error) throw error;
      if (!newMember) throw new Error('No data returned after creating family member');

      await queryClient.invalidateQueries({ queryKey: ['familyMembers', userId] });
      toast.success('Family member added successfully');
      return newMember;
    } catch (error) {
      console.error('Error adding family member:', error);
      const message = error instanceof Error ? error.message : 'Failed to add family member';
      toast.error(message);
      throw error;
    }
  };

  // Update an existing family member
  const updateMember = async (data: { id: string } & Partial<FamilyMember>) => {
    if (!userId) {
      const error = new Error('Authentication required');
      toast.error(error.message);
      throw error;
    }

    try {
      console.log('Updating family member:', data);
      const updatePayload: Partial<FamilyMember> = {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.relationship !== undefined ? { relationship: data.relationship } : {}),
      };
      const { data: updatedMember, error } = await supabase
        .from('family_members')
        .update(updatePayload)
        .eq('id', data.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      if (!updatedMember) throw new Error('No data returned after updating family member');

      await queryClient.invalidateQueries({ queryKey: ['familyMembers', userId] });
      toast.success('Family member updated successfully');
      return updatedMember;
    } catch (error) {
      console.error('Error updating family member:', error);
      const message = error instanceof Error ? error.message : 'Failed to update family member';
      toast.error(message);
      throw error;
    }
  };

  // Delete a family member
  const deleteMember = async (id: string) => {
    if (!userId) {
      const error = new Error('Authentication required');
      toast.error(error.message);
      throw error;
    }

    try {
      console.log('Deleting family member with ID:', id);
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['familyMembers', userId] });
      toast.success('Family member deleted successfully');
      return id;
    } catch (error) {
      console.error('Error deleting family member:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete family member';
      toast.error(message);
      throw error;
    }
  };

  return {
    members,
    isLoading,
    error,
    refetch,
    addMember,
    updateMember,
    deleteMember,
    isAdding: false,
    isUpdating: false,
    isDeleting: false,
  };
};
