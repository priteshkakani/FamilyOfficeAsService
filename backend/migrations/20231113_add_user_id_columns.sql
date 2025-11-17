-- Enable RLS on all tables if not already enabled
DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT IN ('spatial_ref_sys')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t.table_name);
    END LOOP;
END
$$;

-- Add user_id column to family_members if it doesn't exist
ALTER TABLE family_members 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
    ADD CONSTRAINT family_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Copy data from client_id to user_id
UPDATE family_members 
SET user_id = client_id 
WHERE user_id IS NULL AND client_id IS NOT NULL;

-- Add RLS policies for user_id
DO $$
BEGIN
    -- Drop old policies if they exist
    DROP POLICY IF EXISTS "Users can view their own family members" ON family_members;
    DROP POLICY IF EXISTS "Users can insert their own family members" ON family_members;
    DROP POLICY IF EXISTS "Users can update their own family members" ON family_members;
    DROP POLICY IF EXISTS "Users can delete their own family members" ON family_members;

    -- Create new policies using user_id
    CREATE POLICY "Users can view their own family members" 
    ON family_members FOR SELECT 
    USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert their own family members" 
    ON family_members FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own family members" 
    ON family_members FOR UPDATE 
    USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own family members" 
    ON family_members FOR DELETE 
    USING (auth.uid() = user_id);
END
$$;
