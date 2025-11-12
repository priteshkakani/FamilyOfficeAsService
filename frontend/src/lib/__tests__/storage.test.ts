import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadFile, downloadFile, deleteFiles, getPublicUrl } from '../storage';

// Mock the Supabase client
vi.mock('@supabase/supabase-js', () => {
  const mockStorage = {
    from: vi.fn().mockReturnThis(),
    upload: vi.fn().mockResolvedValue({ 
      data: { path: 'test/path/file.jpg' }, 
      error: null 
    }),
    download: vi.fn().mockResolvedValue({ 
      data: new Blob(['test content']), 
      error: null 
    }),
    remove: vi.fn().mockResolvedValue({ 
      data: [{ name: 'file.jpg' }], 
      error: null 
    }),
    getPublicUrl: vi.fn().mockReturnValue({ 
      data: { 
        publicUrl: 'https://fomyxahwvnfivxvrjtpf.storage.supabase.co/storage/v1/s3/test-bucket/test/path/file.jpg' 
      } 
    })
  };

  return {
    createClient: vi.fn(() => ({
      storage: {
        from: vi.fn().mockReturnValue(mockStorage)
      }
    })),
    __esModule: true,
  };
});

describe('Storage Utility', () => {
  const mockAccessToken = 'test-access-token';
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const result = await uploadFile({
        file: mockFile,
        bucket: 'test-bucket',
        accessToken: mockAccessToken
      });

      expect(result.error).toBeNull();
      expect(result.data).toHaveProperty('path');
      expect(result.data).toHaveProperty('fullPath');
    });

    it('should handle upload errors', async () => {
      const { createClient } = await import('@supabase/supabase-js');
      const mockStorage = {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn().mockResolvedValue({ 
          data: null, 
          error: new Error('Upload failed') 
        })
      };
      
      // @ts-expect-error - Mocking the createClient
      createClient.mockImplementationOnce(() => ({
        storage: {
          from: vi.fn().mockReturnValue(mockStorage)
        }
      }));

      const result = await uploadFile({
        file: mockFile,
        bucket: 'test-bucket',
        accessToken: mockAccessToken
      });

      expect(result.data).toBeNull();
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('downloadFile', () => {
    it('should download a file successfully', async () => {
      const result = await downloadFile({
        bucket: 'test-bucket',
        path: 'test/path/file.jpg',
        accessToken: mockAccessToken
      });

      expect(result.error).toBeNull();
      expect(result.data).toBeInstanceOf(Blob);
    });
  });

  describe('deleteFiles', () => {
    it('should delete files successfully', async () => {
      const result = await deleteFiles({
        bucket: 'test-bucket',
        paths: ['test/path/file1.jpg', 'test/path/file2.jpg'],
        accessToken: mockAccessToken
      });

      expect(result.error).toBeNull();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('getPublicUrl', () => {
    it('should return the correct public URL', () => {
      const url = getPublicUrl('test-bucket', 'test/path/file.jpg');
      expect(url).toBe('https://fomyxahwvnfivxvrjtpf.storage.supabase.co/storage/v1/s3/test-bucket/test/path/file.jpg');
    });
  });
});
