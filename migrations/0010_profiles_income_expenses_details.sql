-- Idempotent migration: Add/convert income & expenses fields to public.profiles
DO $
$ 
BEGIN
    -- monthly_income: numeric(14,2) NOT NULL DEFAULT 0
    IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'monthly_income'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN monthly_income numeric
    (14,2) NOT NULL DEFAULT 0;
ELSIF EXISTS
(
    SELECT 1
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'monthly_income' AND data_type = 'jsonb'
  )
THEN
ALTER TABLE public.profiles ALTER COLUMN monthly_income TYPE
numeric
(14,2) USING
(monthly_income::numeric),
ALTER COLUMN monthly_income
SET
DEFAULT 0,
ALTER COLUMN monthly_income
SET
NOT NULL;
END
IF;

  -- monthly_expenses: numeric(14,2) NOT NULL DEFAULT 0
  IF NOT EXISTS (
    SELECT 1
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'monthly_expenses'
  ) THEN
ALTER TABLE public.profiles ADD COLUMN monthly_expenses numeric
(14,2) NOT NULL DEFAULT 0;
  ELSIF EXISTS
(
    SELECT 1
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'monthly_expenses' AND data_type = 'jsonb'
  )
THEN
ALTER TABLE public.profiles ALTER COLUMN monthly_expenses TYPE
numeric
(14,2) USING
(monthly_expenses::numeric),
ALTER COLUMN monthly_expenses
SET
DEFAULT 0,
ALTER COLUMN monthly_expenses
SET
NOT NULL;
END
IF;

  -- monthly_income_details: jsonb DEFAULT '{}'::jsonb
  IF NOT EXISTS (
    SELECT 1
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'monthly_income_details'
  ) THEN
ALTER TABLE public.profiles ADD COLUMN monthly_income_details jsonb DEFAULT '{}'::jsonb;
END
IF;

  -- monthly_expenses_details: jsonb DEFAULT '{}'::jsonb
  IF NOT EXISTS (
    SELECT 1
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'monthly_expenses_details'
  ) THEN
ALTER TABLE public.profiles ADD COLUMN monthly_expenses_details jsonb DEFAULT '{}'::jsonb;
END
IF;

  -- updated_at trigger (if missing)
  IF NOT EXISTS (
    SELECT 1
FROM pg_trigger
WHERE tgname = 'set_updated_at' AND tgrelid = 'public.profiles'::regclass
  ) THEN
CREATE OR REPLACE FUNCTION public.set_updated_at
()
    RETURNS TRIGGER AS $$
BEGIN
      NEW.updated_at = now
();
RETURN NEW;
END;
    $$ LANGUAGE plpgsql;
CREATE TRIGGER set_updated_at
      BEFORE
UPDATE ON public.profiles
      FOR EACH ROW
EXECUTE FUNCTION
public.set_updated_at
();
END
IF;
END $$;

-- Keep RLS policies intact (no changes needed)
-- Refresh PostgREST schema cache
SELECT pg_notify('pgrst','reload schema');
