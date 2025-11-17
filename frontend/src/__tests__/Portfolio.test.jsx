import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Portfolio from '../pages/dashboard/Portfolio';
import { supabase } from '../supabaseClient';

// Mock the useAuth hook
const mockUser = { id: 'test-user-123', email: 'test@example.com' };
const mockUseAuth = jest.fn(() => ({
  user: mockUser,
  isLoading: false,
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('../../contexts/AuthProvider', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock supabase
jest.mock('../supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  },
}));

// Helper function to render with providers
const renderWithProviders = (ui, { queryClient = new QueryClient() } = {}) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Portfolio Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock successful API responses
    supabase.from.mockImplementation((table) => {
      if (table === 'assets') {
        return {
          select: () => ({
            eq: () => ({
              data: [
                { id: '1', name: 'Test Asset', category: 'stocks', amount: 1000, as_of_date: '2023-01-01' }
              ],
              error: null,
            })
          })
        };
      }
      if (table === 'vw_net_worth') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: () => ({
                data: { net_worth: 50000 },
                error: null,
              })
            })
          })
        };
      }
      return {
        select: () => ({
          eq: () => ({
            data: [],
            error: null,
          })
        })
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the portfolio with net worth', async () => {
    renderWithProviders(<Portfolio />, { queryClient });
    
    // Check for loading state first
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/₹50,000/)).toBeInTheDocument();
      expect(screen.getByText('Test Asset')).toBeInTheDocument();
    });
  });

  it('handles asset creation', async () => {
    // Mock successful insert
    supabase.from.mockImplementation((table) => ({
      insert: () => ({
        select: () => ({
          data: { id: '2', name: 'New Asset', category: 'stocks', amount: 2000, as_of_date: '2023-01-02' },
          error: null,
        })
      })
    }));
    
    renderWithProviders(<Portfolio />, { queryClient });
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Asset')).toBeInTheDocument();
    });
    
    // Test adding a new asset
    fireEvent.click(screen.getByText('Add Asset'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'New Asset' } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '2000' } });
    fireEvent.click(screen.getByText('Save'));
    
    // Check that the insert was called with the correct data
    await waitFor(() => {
      expect(supabase.from('assets').insert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Asset',
          amount: 2000,
          user_id: 'test-user-123',
        })
      );
    });
  });

  it('handles errors when fetching data', async () => {
    // Mock error response
    supabase.from.mockImplementation((table) => ({
      select: () => ({
        eq: () => ({
          data: null,
          error: { message: 'Failed to fetch data' },
        })
      })
    }));

    renderWithProviders(<Portfolio />, { queryClient });

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
