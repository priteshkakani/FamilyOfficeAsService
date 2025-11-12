import { useReducer, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface FamilyMember {
  id?: string;
  name: string;
  relation: string;
  pan?: string;
  aadhaar?: string;
  dob?: string;
  profession?: string;
  marital_status?: string;
  marital_date?: string;
  address?: string;
  login_info_it?: Record<string, unknown>;
}

interface Goal {
  id?: string;
  title: string;
  description?: string;
  target_amount?: number;
  target_date?: string;
  target_year?: number;
  priority?: number;
  is_completed?: boolean;
  metadata?: Record<string, unknown>;
}

interface OnboardingState {
  full_name: string;
  email: string;
  mobile_number: string;
  address?: string;
  monthly_income?: number;
  monthly_expenses?: number;
  monthly_income_details?: Record<string, unknown>;
  monthly_expenses_details?: Record<string, unknown>;
  family_members: FamilyMember[];
  goals: Goal[];
  is_onboarded: boolean;
  terms_accepted_at?: string;
}

const initialState: OnboardingState = {
  full_name: '',
  email: '',
  mobile_number: '',
  family_members: [],
  monthly_income: 0,
  monthly_expenses: 0,
  monthly_income_details: {},
  monthly_expenses_details: {},
  goals: [],
  is_onboarded: false,
};

type OnboardingAction =
  | { type: 'SET_STATE'; payload: Partial<OnboardingState> }
  | { type: 'ADD_FAMILY_MEMBER'; payload: FamilyMember }
  | { type: 'UPDATE_FAMILY_MEMBER'; index: number; payload: Partial<FamilyMember> }
  | { type: 'REMOVE_FAMILY_MEMBER'; index: number }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; index: number; payload: Partial<Goal> }
  | { type: 'REMOVE_GOAL'; index: number };

function reducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'ADD_FAMILY_MEMBER':
      return { ...state, family_members: [...state.family_members, action.payload] };
    case 'UPDATE_FAMILY_MEMBER':
      const updatedMembers = [...state.family_members];
      updatedMembers[action.index] = { ...updatedMembers[action.index], ...action.payload };
      return { ...state, family_members: updatedMembers };
    case 'REMOVE_FAMILY_MEMBER':
      return {
        ...state,
        family_members: state.family_members.filter((_, i) => i !== action.index),
      };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      const updatedGoals = [...state.goals];
      updatedGoals[action.index] = { ...updatedGoals[action.index], ...action.payload };
      return { ...state, goals: updatedGoals };
    case 'REMOVE_GOAL':
      return {
        ...state,
        goals: state.goals.filter((_, i) => i !== action.index),
      };
    default:
      return state;
  }
}

export function useOnboardingState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch user profile and onboarding status
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Check if user is already onboarded
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile?.is_onboarded) {
        navigate('/dashboard');
        return;
      }

      // Set initial state from profile
      if (profile) {
        dispatch({
          type: 'SET_STATE',
          payload: {
            full_name: profile.full_name || '',
            email: profile.email || user.email || '',
            mobile_number: profile.mobile_number || '',
            address: profile.address || '',
            monthly_income: profile.monthly_income || 0,
            monthly_expenses: profile.monthly_expenses || 0,
            monthly_income_details: profile.monthly_income_details || {},
            monthly_expenses_details: profile.monthly_expenses_details || {},
            is_onboarded: profile.is_onboarded || false,
          },
        });
      }

      // Fetch family members
      const { data: familyMembers } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id);

      if (familyMembers) {
        dispatch({
          type: 'SET_STATE',
          payload: { family_members: familyMembers },
        });
      }

      // Fetch goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);

      if (goals) {
        dispatch({
          type: 'SET_STATE',
          payload: { goals },
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Save profile data
  const saveProfile = async (data: Partial<OnboardingState>) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updates = {
        id: user.id,
        full_name: data.full_name || '',
        email: data.email || user.email || '',
        mobile_number: data.mobile_number || '',
        address: data.address || '',
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      dispatch({ type: 'SET_STATE', payload: data });
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile');
      toast.error('Failed to save profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Save family members
  const saveFamilyMembers = async (members: FamilyMember[]) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Delete existing family members
      const { error: deleteError } = await supabase
        .from('family_members')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Insert new family members
      if (members.length > 0) {
        const familyData = members.map(member => ({
          ...member,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error: insertError } = await supabase
          .from('family_members')
          .insert(familyData);

        if (insertError) throw insertError;
      }

      dispatch({ type: 'SET_STATE', payload: { family_members: members } });
      return true;
    } catch (error) {
      console.error('Error saving family members:', error);
      setError('Failed to save family members');
      toast.error('Failed to save family members');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Save income and expense data
  const saveIncomeExpense = async (data: {
    monthly_income?: number;
    monthly_expenses?: number;
    monthly_income_details?: Record<string, unknown>;
    monthly_expenses_details?: Record<string, unknown>;
  }) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updates = {
        id: user.id,
        monthly_income: data.monthly_income || 0,
        monthly_expenses: data.monthly_expenses || 0,
        monthly_income_details: data.monthly_income_details || {},
        monthly_expenses_details: data.monthly_expenses_details || {},
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;

      dispatch({ type: 'SET_STATE', payload: updates });
      return true;
    } catch (error) {
      console.error('Error saving income/expense data:', error);
      setError('Failed to save income/expense data');
      toast.error('Failed to save income/expense data');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Save goals
  const saveGoals = async (goals: Goal[]) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Delete existing goals
      const { error: deleteError } = await supabase
        .from('goals')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Insert new goals
      if (goals.length > 0) {
        const goalsData = goals.map(goal => ({
          ...goal,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

        const { error: insertError } = await supabase
          .from('goals')
          .insert(goalsData);

        if (insertError) throw insertError;
      }

      dispatch({ type: 'SET_STATE', payload: { goals } });
      return true;
    } catch (error) {
      console.error('Error saving goals:', error);
      setError('Failed to save goals');
      toast.error('Failed to save goals');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete onboarding
  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          is_onboarded: true,
          terms_accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      dispatch({
        type: 'SET_STATE',
        payload: { is_onboarded: true },
      });

      toast.success('Onboarding completed successfully!');
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setError('Failed to complete onboarding');
      toast.error('Failed to complete onboarding');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(0, prev - 1));
  const goToStep = (step: number) => setCurrentStep(step);

  return {
    state,
    currentStep,
    isLoading,
    error,
    dispatch,
    fetchProfile,
    saveProfile,
    saveFamilyMembers,
    saveIncomeExpense,
    saveGoals,
    completeOnboarding,
    nextStep,
    prevStep,
    goToStep,
  };
}
