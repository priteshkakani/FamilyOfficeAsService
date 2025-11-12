import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    // Automatically create a client instance per test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    }),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

export const mockSession = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      full_name: 'Test User',
    },
  },
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
};

export const mockAssets = [
  {
    id: 1,
    type: 'savings',
    name: 'Savings Account',
    value: 50000,
    currency: 'INR',
    user_id: 'test-user-id',
    created_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 2,
    type: 'investment',
    name: 'Stocks',
    value: 200000,
    currency: 'INR',
    user_id: 'test-user-id',
    created_at: '2023-01-02T00:00:00Z',
  },
];

export const mockLiabilities = [
  {
    id: 1,
    type: 'loan',
    name: 'Home Loan',
    amount: 5000000,
    interest_rate: 7.5,
    term_months: 240,
    user_id: 'test-user-id',
    created_at: '2023-01-01T00:00:00Z',
  },
];

export const mockGoals = [
  {
    id: 1,
    name: 'Buy a House',
    target_amount: 10000000,
    target_date: '2030-01-01',
    current_amount: 2000000,
    user_id: 'test-user-id',
    created_at: '2023-01-01T00:00:00Z',
  },
];
