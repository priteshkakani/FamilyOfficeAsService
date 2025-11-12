import { Database } from '../../database.types';

export type GoalPriority = 'low' | 'medium' | 'high';

export interface Goal extends Database['public']['Tables']['goals']['Row'] {
  // Extend with any additional fields or overrides as needed
}

export interface CreateGoalInput {
  title: string;
  description?: string | null;
  target_amount?: number | null;
  target_year?: number | null;
  priority?: GoalPriority;
  is_completed?: boolean;
}

export interface UpdateGoalInput extends Partial<Omit<CreateGoalInput, 'user_id' | 'created_at'>> {
  id: string;
  is_completed?: boolean;
}

export interface UseGoalsReturn {
  goals: Goal[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<unknown>;
  createGoal: {
    mutate: (goalData: CreateGoalInput) => void;
    isLoading: boolean;
    error: Error | null;
  };
  updateGoal: {
    mutate: (params: { id: string; updates: UpdateGoalInput }) => void;
    isLoading: boolean;
    error: Error | null;
  };
  deleteGoal: {
    mutate: (id: string) => void;
    isLoading: boolean;
    error: Error | null;
  };
}
