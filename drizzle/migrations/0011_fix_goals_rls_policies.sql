-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Goals are user-owned" ON public.goals;

-- Create policy for SELECT
CREATE POLICY "Enable read access for user's own goals" 
ON public.goals
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for INSERT
CREATE POLICY "Enable insert for authenticated users"
ON public.goals
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy for UPDATE
CREATE POLICY "Enable update for user's own goals"
ON public.goals
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for DELETE
CREATE POLICY "Enable delete for user's own goals"
ON public.goals
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
