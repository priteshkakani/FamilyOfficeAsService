-- Enable RLS and allow authenticated owners to select/insert/update their own profile rows

-- Enable row level security on profiles (id should match auth.uid())
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow owners to SELECT their profile
CREATE POLICY "profiles_select_owner" ON public.profiles
  FOR
SELECT
    USING (auth.uid() = id);

-- Allow owners to INSERT their profile (new row must have id = auth.uid())
CREATE POLICY "profiles_insert_owner" ON public.profiles
  FOR
INSERT
  WITH CHECK (auth.uid() =
id);

-- Allow owners to UPDATE their profile
CREATE POLICY "profiles_update_owner" ON public.profiles
  FOR
UPDATE
  USING (auth.uid()
= id)
  WITH CHECK
(auth.uid
() = id);

-- Optionally allow owners to DELETE (uncomment if desired)
-- CREATE POLICY "profiles_delete_owner" ON public.profiles
--   FOR DELETE
--   USING (auth.uid() = id);

-- Note: Apply this on your dev/staging DB only if you control auth.uid semantics.
