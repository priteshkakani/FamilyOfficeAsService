import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase, getCurrentUserId, getCurrentSession, signOut } from '../supabase';

// Mock the Supabase client
vi.mock('@supabase/supabase-js', () => {
  const mockAuth = {
    getUser: vi.fn(),
    getSession: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
  };

  return {
    createClient: vi.fn(() => ({
      auth: mockAuth,
    })),
    __esModule: true,
  };
});

describe('Supabase Client', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: { name: 'Test User' },
  };

  const mockSession = {
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    user: mockUser,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should be properly initialized', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  describe('getCurrentUserId', () => {
    it('should return the current user ID', async () => {
      // @ts-expect-error - Mocking the auth.getUser method
      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const userId = await getCurrentUserId();
      expect(userId).toBe('test-user-id');
    });

    it('should return null if no user is logged in', async () => {
      // @ts-expect-error - Mocking the auth.getUser method
      supabase.auth.getUser.mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });

      const userId = await getCurrentUserId();
      expect(userId).toBeNull();
    });
  });

  describe('getCurrentSession', () => {
    it('should return the current session', async () => {
      // @ts-expect-error - Mocking the auth.getSession method
      supabase.auth.getSession.mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      const session = await getCurrentSession();
      expect(session).toEqual(mockSession);
    });
  });

  describe('signOut', () => {
    it('should sign out the user', async () => {
      // @ts-expect-error - Mocking the auth.signOut method
      supabase.auth.signOut.mockResolvedValueOnce({ error: null });

      await signOut();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should throw an error if sign out fails', async () => {
      const error = new Error('Sign out failed');
      // @ts-expect-error - Mocking the auth.signOut method
      supabase.auth.signOut.mockResolvedValueOnce({ error });

      await expect(signOut()).rejects.toThrow('Sign out failed');
    });
  });
});
