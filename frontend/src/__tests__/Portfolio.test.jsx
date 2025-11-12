import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import Portfolio from '../pages/dashboard/Portfolio';
import { renderWithProviders, mockSession } from './test-utils';

// Mock the useAuth hook
jest.mock('../../contexts/AuthProvider', () => ({
  useAuth: () => ({
    user: mockSession.user,
    authLoading: false,
  }),
}));

describe('Portfolio Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the portfolio with client name', async () => {
    renderWithProviders(<Portfolio />, { queryClient });
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    // Mock loading state
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [true, jest.fn()]);
    
    renderWithProviders(<Portfolio />, { queryClient });
    
    // Check for loading skeleton
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles error state', () => {
    // Mock error state
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => ['Failed to load', jest.fn()]);
    
    renderWithProviders(<Portfolio />, { queryClient });
    
    // Check for error message
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });
});
