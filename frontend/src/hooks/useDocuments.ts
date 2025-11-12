import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Document {
  id: string;
  user_id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  mime_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  return useQuery<Document[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { file: File; type: string; metadata?: Record<string, unknown> }) => {
      const { file, type, metadata = {} } = payload;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `documents/${user.id}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      // Save document metadata to database
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          name: file.name,
          type,
          url: publicUrl,
          size: file.size,
          mime_type: file.type,
          metadata: {
            ...metadata,
            original_name: file.name,
          },
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (documentId: string) => {
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete file from storage
      const filePath = document.url.split('/').pop();
      const { error: deleteError } = await supabase.storage
        .from('documents')
        .remove([filePath]);
      
      if (deleteError) throw deleteError;
      
      // Delete document record from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      return documentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDocumentTypes() {
  return useQuery<string[]>({
    queryKey: ['documentTypes'],
    queryFn: async () => {
      // This could be extended to fetch from a database table if needed
      return [
        'Bank Statement',
        'Tax Return',
        'Investment Statement',
        'Insurance Policy',
        'ID Proof',
        'Address Proof',
        'Salary Slip',
        'Other',
      ];
    },
  });
}
