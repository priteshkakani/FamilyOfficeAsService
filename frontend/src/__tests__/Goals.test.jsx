import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import Goals from '../pages/dashboard/Goals';

// Mock the API calls
jest.mock('../../api/goals', () => ({
  getGoals: jest.fn(() => Promise.resolve({ data: [] })),
  createGoal: jest.fn(),
  updateGoal: jest.fn(),
  deleteGoal: jest.fn(),
}));

describe('Goals Component', () => {
  const mockGoals = [
    {
      id: 1,
      title: 'Buy a House',
      description: '3BHK in the city',
      target_amount: 10000000,
      target_date: '2030-01-01',
      current_amount: 2000000,
      priority: 'high',
      user_id: 'test-user-id',
      created_at: '2023-01-01T00:00:00Z',
    },
    {
      id: 2,
      title: 'Retirement Fund',
      description: 'Retire by 60',
      target_amount: 50000000,
      target_date: '2050-01-01',
      current_amount: 5000000,
      priority: 'medium',
      user_id: 'test-user-id',
      created_at: '2023-01-02T00:00:00Z',
    }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the goals list', async () => {
    // Mock the API response
    require('../../api/goals').getGoals.mockResolvedValueOnce({
      data: mockGoals
    });

    renderWithProviders(<Goals />);
    
    // Wait for the data to load
    expect(await screen.findByText('Financial Goals')).toBeInTheDocument();
    expect(screen.getByText('Buy a House')).toBeInTheDocument();
    expect(screen.getByText('Retirement Fund')).toBeInTheDocument();
  });

  it('opens the add goal modal', async () => {
    renderWithProviders(<Goals />);
    
    const addButton = screen.getByRole('button', { name: /new goal/i });
    fireEvent.click(addButton);
    
    expect(screen.getByText('New Goal')).toBeInTheDocument();
  });

  it('handles adding a new goal', async () => {
    const mockCreate = jest.fn().mockResolvedValue({ data: { id: 3 } });
    require('../../api/goals').createGoal = mockCreate;
    
    renderWithProviders(<Goals />);
    
    // Open the add modal
    fireEvent.click(screen.getByRole('button', { name: /new goal/i }));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'World Tour' }
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Visit 10 countries' }
    });
    fireEvent.change(screen.getByLabelText(/target amount/i), {
      target: { value: '500000' }
    });
    fireEvent.change(screen.getByLabelText(/target year/i), {
      target: { value: '2025' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save goal/i }));
    
    // Verify the API was called with the correct data
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'World Tour',
          description: 'Visit 10 countries',
          target_amount: '500000',
          target_year: '2025',
          priority: 'medium' // default value
        })
      );
    });
  });

  it('handles editing an existing goal', async () => {
    const mockUpdate = jest.fn().mockResolvedValue({ data: {} });
    require('../../api/goals').updateGoal = mockUpdate;
    
    // Mock the initial data
    require('../../api/goals').getGoals.mockResolvedValueOnce({
      data: [mockGoals[0]]
    });
    
    renderWithProviders(<Goals />);
    
    // Wait for data to load
    await screen.findByText('Buy a House');
    
    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    // Update the target amount
    const amountInput = screen.getByLabelText(/target amount/i);
    fireEvent.change(amountInput, { target: { value: '12000000' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    
    // Verify the API was called with the updated data
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          target_amount: '12000000'
        })
      );
    });
  });

  it('handles goal completion', async () => {
    const mockUpdate = jest.fn().mockResolvedValue({ data: {} });
    require('../../api/goals').updateGoal = mockUpdate;
    
    // Mock the initial data
    require('../../api/goals').getGoals.mockResolvedValueOnce({
      data: [mockGoals[0]]
    });
    
    renderWithProviders(<Goals />);
    
    // Wait for data to load
    await screen.findByText('Buy a House');
    
    // Mark as complete
    const completeButton = screen.getByRole('button', { name: /mark complete/i });
    fireEvent.click(completeButton);
    
    // Verify the API was called with is_completed: true
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          is_completed: true
        })
      );
    });
  });

  it('handles goal deletion', async () => {
    const mockDelete = jest.fn().mockResolvedValue({});
    require('../../api/goals').deleteGoal = mockDelete;
    
    // Mock the initial data
    require('../../api/goals').getGoals.mockResolvedValueOnce({
      data: [mockGoals[0]]
    });
    
    renderWithProviders(<Goals />);
    
    // Wait for data to load
    await screen.findByText('Buy a House');
    
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
