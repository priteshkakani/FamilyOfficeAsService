-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Goals are user-owned" ON public.goals;

-- Create new RLS policies
-- Allow users to view their own goals
CREATE POLICY "Enable read access for own goals" 
ON public.goals
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own goals
CREATE POLICY "Enable insert for own goals"
ON public.goals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own goals
CREATE POLICY "Enable update for own goals"
ON public.goals
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own goals
CREATE POLICY "Enable delete for own goals"
ON public.goals
FOR DELETE
USING (auth.uid() = user_id);

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
