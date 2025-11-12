import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import Assets from '../components/Assets/Assets';

// Mock the API calls
jest.mock('../../api/assets', () => ({
  getAssets: jest.fn(() => Promise.resolve({ data: [] })),
  createAsset: jest.fn(),
  updateAsset: jest.fn(),
  deleteAsset: jest.fn(),
}));

describe('Assets Component', () => {
  const mockAssets = [
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
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the assets list', async () => {
    // Mock the API response
    require('../../api/assets').getAssets.mockResolvedValueOnce({
      data: mockAssets
    });

    renderWithProviders(<Assets />);
    
    // Wait for the data to load
    expect(await screen.findByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Savings Account')).toBeInTheDocument();
    expect(screen.getByText('Stocks')).toBeInTheDocument();
  });

  it('filters assets by type', async () => {
    // Mock the API response
    require('../../api/assets').getAssets.mockResolvedValueOnce({
      data: mockAssets
    });

    renderWithProviders(<Assets />);
    
    // Wait for the data to load
    await screen.findByText('Assets');
    
    // Filter by investment type
    const filterSelect = screen.getByLabelText('Filter by Type');
    fireEvent.change(filterSelect, { target: { value: 'investment' } });
    
    // Only investment assets should be visible
    expect(screen.getByText('Stocks')).toBeInTheDocument();
    expect(screen.queryByText('Savings Account')).not.toBeInTheDocument();
  });

  it('handles adding a new asset', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ data: { id: 3 } });
    require('../../api/assets').createAsset = mockCreate;
    
    renderWithProviders(<Assets />);
    
    // Open the add modal
    fireEvent.click(screen.getByRole('button', { name: /add asset/i }));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Fixed Deposit' }
    });
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: 'fixed_deposit' }
    });
    fireEvent.change(screen.getByLabelText(/value/i), {
      target: { value: '100000' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify the API was called with the correct data
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Fixed Deposit',
          type: 'fixed_deposit',
          value: '100000'
        })
      );
    });
  });

  it('handles editing an existing asset', async () => {
    const mockUpdate = jest.fn().mockResolvedValue({ data: {} });
    require('../../api/assets').updateAsset = mockUpdate;
    
    // Mock the initial data
    require('../../api/assets').getAssets.mockResolvedValueOnce({
      data: mockAssets
    });
    
    renderWithProviders(<Assets />);
    
    // Wait for data to load
    await screen.findByText('Savings Account');
    
    // Click edit button
    const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
    fireEvent.click(editButton);
    
    // Update the value
    const valueInput = screen.getByLabelText(/value/i);
    fireEvent.change(valueInput, { target: { value: '75000' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    // Verify the API was called with the updated data
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          value: '75000'
        })
      );
    });
  });
});
