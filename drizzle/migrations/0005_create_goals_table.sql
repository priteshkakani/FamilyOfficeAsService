-- Create the public.goals table for onboarding
CREATE TABLE public.goals
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    target_amount numeric,
    target_year integer,
    priority text CHECK (priority IN ('high', 'medium', 'low')),
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Policy: Only allow users to access their own goals
CREATE POLICY "Goals are user-owned" ON public.goals
  USING
(auth.uid
() = user_id);
