-- Add additional detail columns to family_members
ALTER TABLE public.family_members
  ADD COLUMN IF NOT EXISTS pan TEXT,
  ADD COLUMN IF NOT EXISTS aadhar VARCHAR(12),
  ADD COLUMN IF NOT EXISTS profession TEXT,
  ADD COLUMN IF NOT EXISTS marital_status TEXT,
  ADD COLUMN IF NOT EXISTS dob DATE;

-- Optional: simple check constraints (basic length checks)
ALTER TABLE public.family_members
  ADD CONSTRAINT IF NOT EXISTS chk_aadhar_length CHECK (aadhar IS NULL OR char_length(aadhar) = 12);

-- Index to help common filters
CREATE INDEX IF NOT EXISTS idx_family_members_user_id_created_at ON public.family_members(user_id, created_at);
