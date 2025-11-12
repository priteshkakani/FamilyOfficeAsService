import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthProvider';

// Mock data for testing
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User'
  }
};

// Mock API responses
const mockDashboardData = {
  assets: {
    total: 1000000,
    by_type: [
      { type: 'savings', amount: 200000 },
      { type: 'investment', amount: 800000 }
    ]
  },
  liabilities: {
    total: 500000,
    by_type: [
      { type: 'loan', amount: 500000 }
    ]
  },
  net_worth: 500000,
  recent_transactions: [
    { id: 1, description: 'Salary', amount: 100000, type: 'income', date: '2023-11-01' },
    { id: 2, description: 'Rent', amount: -25000, type: 'expense', date: '2023-11-05' }
  ]
};

// Create a test query client
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

// Custom render function with providers
export const renderWithProviders = (
  ui,
  {
    queryClient = createTestQueryClient(),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

// Mock API functions
export const mockApi = {
  getDashboardData: jest.fn(() => Promise.resolve(mockDashboardData)),
  getAssets: jest.fn(() => Promise.resolve({ data: [] })),
  getLiabilities: jest.fn(() => Promise.resolve({ data: [] })),
  getGoals: jest.fn(() => Promise.resolve({ data: [] })),
  // Add more mock API functions as needed
};

export { mockUser, mockDashboardData };
