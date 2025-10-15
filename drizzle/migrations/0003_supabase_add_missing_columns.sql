-- Add missing columns to Supabase tables if not present
ALTER TABLE assets ADD COLUMN
IF NOT EXISTS details jsonb;
ALTER TABLE liabilities ADD COLUMN
IF NOT EXISTS details jsonb;
ALTER TABLE family_members ADD COLUMN
IF NOT EXISTS relationship text;
-- Optionally, refresh schema cache manually in Supabase dashboard after running this
