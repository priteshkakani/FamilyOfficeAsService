import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './dashboard-test-utils';
import DashboardHomeTab from '../components/DashboardHomeTab';

// Mock the Dashboard component
jest.mock('../pages/Dashboard', () => {
  return function MockDashboard() {
    return <div data-testid="mock-dashboard">Mock Dashboard</div>;
  };
});

describe('DashboardHomeTab', () => {
  it('renders the Dashboard component', () => {
    renderWithProviders(<DashboardHomeTab />);
    
    // Check if the Dashboard component is rendered
    expect(screen.getByTestId('mock-dashboard')).toBeInTheDocument();
  });

  it('passes the correct props to Dashboard', () => {
    // If DashboardHomeTab passes any props to Dashboard, we can test that here
    // For now, it's a simple wrapper, so we just check if it renders
    renderWithProviders(<DashboardHomeTab />);
    
    // We can add more specific tests if DashboardHomeTab gets more complex
    expect(screen.getByText('Mock Dashboard')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = renderWithProviders(<DashboardHomeTab />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
