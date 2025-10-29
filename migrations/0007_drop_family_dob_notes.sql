-- Migration: remove optional dob and notes columns from family_members
-- Run this against your Postgres database used by Supabase or local dev DB.

DO $
$
BEGIN
    IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'family_members' AND column_name = 'dob'
  ) THEN
    EXECUTE 'ALTER TABLE family_members DROP COLUMN dob';
END
IF;

  IF EXISTS (
    SELECT 1
FROM information_schema.columns
WHERE table_name = 'family_members' AND column_name = 'notes'
  ) THEN
EXECUTE 'ALTER TABLE family_members DROP COLUMN notes';
END
IF;
END$$;

-- NOTE: Verify there are no remaining application code paths that read these columns before applying.
