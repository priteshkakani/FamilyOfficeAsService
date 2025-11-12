import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Get the S3 endpoint from environment variables or use the provided one
const S3_ENDPOINT = import.meta.env.VITE_SUPABASE_S3_ENDPOINT || 'https://fomyxahwvnfivxvrjtpf.storage.supabase.co/storage/v1/s3';

// Initialize Supabase client for storage operations
export const createStorageClient = (accessToken: string): SupabaseClient => {
  return createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );
};

interface UploadFileParams {
  file: File;
  bucket: string;
  path?: string;
  accessToken: string;
}

/**
 * Uploads a file to Supabase Storage
 * @param params.file - The file to upload
 * @param params.bucket - The bucket to upload to
 * @param params.path - Optional path within the bucket
 * @param params.accessToken - User's access token
 * @returns The public URL of the uploaded file
 */
export const uploadFile = async ({
  file,
  bucket,
  path = '',
  accessToken,
}: UploadFileParams): Promise<{ data: { path: string; fullPath: string } | null; error: Error | null }> => {
  try {
    const supabase = createStorageClient(accessToken);
    
    // Generate a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { data: null, error };
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      data: {
        path: filePath,
        fullPath: publicUrl
      },
      error: null
    };
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return { data: null, error: error as Error };
  }
};

interface DownloadFileParams {
  bucket: string;
  path: string;
  accessToken: string;
}

/**
 * Downloads a file from Supabase Storage
 * @param params.bucket - The bucket name
 * @param params.path - Path to the file in the bucket
 * @param params.accessToken - User's access token
 * @returns The file data as a Blob
 */
export const downloadFile = async ({
  bucket,
  path,
  accessToken,
}: DownloadFileParams): Promise<{ data: Blob | null; error: Error | null }> => {
  try {
    const supabase = createStorageClient(accessToken);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path);

    if (error) {
      console.error('Error downloading file:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in downloadFile:', error);
    return { data: null, error: error as Error };
  }
};

interface DeleteFileParams {
  bucket: string;
  paths: string[];
  accessToken: string;
}

/**
 * Deletes files from Supabase Storage
 * @param params.bucket - The bucket name
 * @param params.paths - Array of file paths to delete
 * @param params.accessToken - User's access token
 * @returns The result of the delete operation
 */
export const deleteFiles = async ({
  bucket,
  paths,
  accessToken,
}: DeleteFileParams): Promise<{ data: any; error: Error | null }> => {
  try {
    const supabase = createStorageClient(accessToken);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(paths);

    if (error) {
      console.error('Error deleting files:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in deleteFiles:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Gets a public URL for a file
 * @param bucket - The bucket name
 * @param path - Path to the file in the bucket
 * @returns The public URL of the file
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  // For S3, we can construct the URL directly if we know the bucket is public
  // For private buckets, you'll need to use the download method with an access token
  return `${S3_ENDPOINT}/${bucket}/${path}`;
};
