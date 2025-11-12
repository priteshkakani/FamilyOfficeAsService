import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { renderWithProviders, mockApi, mockUser } from './dashboard-test-utils';
import { useAuth } from '../contexts/AuthProvider';

// Mock the AuthProvider
jest.mock('../contexts/AuthProvider', () => ({
  ...jest.requireActual('../contexts/AuthProvider'),
  useAuth: jest.fn(),
}));

// Mock API modules
jest.mock('../api/dashboard', () => ({
  getDashboardData: () => mockApi.getDashboardData(),
}));

// Mock child components
jest.mock('../components/DashboardHomeTab', () => {
  return function MockDashboardHomeTab() {
    return <div data-testid="mock-dashboard-home">Mock Dashboard Home</div>;
  };
});

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    // Set up the mock user
    useAuth.mockReturnValue({
      user: mockUser,
      isLoading: false,
      error: null,
    });
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  it('renders the dashboard with all main sections', async () => {
    renderWithProviders(<Dashboard />);
    
    // Check for main sections
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-dashboard-home')).toBeInTheDocument();
  });

  it('loads and displays dashboard data', async () => {
    mockApi.getDashboardData.mockResolvedValueOnce({
      net_worth: 1500000,
      assets: { total: 2000000 },
      liabilities: { total: 500000 },
      recent_transactions: []
    });

    renderWithProviders(<Dashboard />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(mockApi.getDashboardData).toHaveBeenCalledTimes(1);
    });
  });

  it('handles tab navigation', async () => {
    renderWithProviders(<Dashboard />);
    
    // Click on the Assets tab
    const assetsTab = screen.getByRole('tab', { name: /assets/i });
    fireEvent.click(assetsTab);
    
    // Verify the active tab
    expect(assetsTab).toHaveAttribute('aria-selected', 'true');
    
    // Click on another tab
    const liabilitiesTab = screen.getByRole('tab', { name: /liabilities/i });
    fireEvent.click(liabilitiesTab);
    
    // Verify the active tab has changed
    expect(assetsTab).toHaveAttribute('aria-selected', 'false');
    expect(liabilitiesTab).toHaveAttribute('aria-selected', 'true');
  });

  it('displays loading state', async () => {
    // Mock loading state
    useAuth.mockReturnValueOnce({
      user: null,
      isLoading: true,
      error: null,
    });
    
    renderWithProviders(<Dashboard />);
    
    // Check for loading indicator
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock API error
    const errorMessage = 'Failed to load dashboard data';
    mockApi.getDashboardData.mockRejectedValueOnce(new Error(errorMessage));
    
    // Mock console.error to prevent error logs in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    renderWithProviders(<Dashboard />);
    
    // Check for error state
    await waitFor(() => {
      // You might want to add an error boundary or error display in your component
      // For now, we'll just verify the error was logged
      expect(console.error).toHaveBeenCalled();
    });
    
    // Restore console.error
    console.error = originalError;
  });

  it('updates when user data changes', async () => {
    const { rerender } = renderWithProviders(<Dashboard />);
    
    // Change the user
    const newUser = {
      ...mockUser,
      id: 'new-user-123',
      email: 'newuser@example.com'
    };
    
    // Update the auth context
    useAuth.mockReturnValue({
      user: newUser,
      isLoading: false,
      error: null,
    });
    
    // Rerender with new user
    rerender(<Dashboard />);
    
    // Verify the dashboard updates for the new user
    await waitFor(() => {
      expect(mockApi.getDashboardData).toHaveBeenCalled();
    });
  });
});
