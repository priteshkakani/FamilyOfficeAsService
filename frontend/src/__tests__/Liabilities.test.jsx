import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import Liabilities from '../components/Liabilities/Liabilities';

// Mock the API calls
jest.mock('../../api/liabilities', () => ({
  getLiabilities: jest.fn(() => Promise.resolve({ data: [] })),
  createLiability: jest.fn(),
  updateLiability: jest.fn(),
  deleteLiability: jest.fn(),
}));

describe('Liabilities Component', () => {
  const mockLiabilities = [
    {
      id: 1,
      type: 'loan',
      name: 'Home Loan',
      amount: 5000000,
      interest_rate: 7.5,
      term_months: 240,
      user_id: 'test-user-id',
      created_at: '2023-01-01T00:00:00Z',
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the liabilities list', async () => {
    // Mock the API response
    require('../../api/liabilities').getLiabilities.mockResolvedValueOnce({
      data: mockLiabilities
    });

    renderWithProviders(<Liabilities />);
    
    // Wait for the data to load
    expect(await screen.findByText('Liabilities')).toBeInTheDocument();
    expect(screen.getByText('Home Loan')).toBeInTheDocument();
  });

  it('opens the add liability modal', async () => {
    renderWithProviders(<Liabilities />);
    
    const addButton = screen.getByRole('button', { name: /add liability/i });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Add New Liability')).toBeInTheDocument();
  });

  it('handles form submission for new liability', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ data: { id: 2 } });
    require('../../api/liabilities').createLiability = mockCreate;
    
    renderWithProviders(<Liabilities />);
    
    // Open the add modal
    fireEvent.click(screen.getByRole('button', { name: /add liability/i }));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Car Loan' }
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '1000000' }
    });
    fireEvent.change(screen.getByLabelText(/interest rate/i), {
      target: { value: '8.5' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    
    // Verify the API was called with the correct data
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Car Loan',
          amount: '1000000',
          interest_rate: '8.5'
        })
      );
    });
  });

  it('handles deletion of a liability', async () => {
    const mockDelete = jest.fn().mockResolvedValue({});
    require('../../api/liabilities').deleteLiability = mockDelete;
    
    // Mock the initial data
    require('../../api/liabilities').getLiabilities.mockResolvedValueOnce({
      data: mockLiabilities
    });
    
    renderWithProviders(<Liabilities />);
    
    // Wait for data to load
    await screen.findByText('Home Loan');
    
    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /yes, delete/i });
    fireEvent.click(confirmButton);
    
    // Verify the API was called
    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(1);
    });
  });
});
