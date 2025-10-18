-- Create tasks table and advisor_clients mapping for RBAC

CREATE TABLE
IF NOT EXISTS public.advisor_clients
(
  advisor_id uuid NOT NULL,
  client_id uuid NOT NULL,
  created_at timestamp
with time zone DEFAULT now
(),
  PRIMARY KEY
(advisor_id, client_id)
);

CREATE TABLE
IF NOT EXISTS public.tasks
(
  id uuid DEFAULT gen_random_uuid
() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL,
  type text,
  priority text,
  due_date date,
  status text DEFAULT 'open',
  notes text,
  created_at timestamp
with time zone DEFAULT now
()
);

-- RLS guidance: enable policy to allow advisor to select/insert tasks for clients they are mapped to.
-- Example policy (run as supabase SQL):
-- ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "advisor_select_tasks" ON public.tasks FOR SELECT USING (
--   auth.role() = 'authenticated' AND (
--     -- supervisors/users who are clients can see their own tasks
--     auth.uid() = user_id OR (
--       -- advisors: check in advisor_clients
--       EXISTS (SELECT 1 FROM public.advisor_clients ac WHERE ac.advisor_id = auth.uid() AND ac.client_id = user_id)
--     )
--   )
-- );

-- Similar policies required for INSERT/UPDATE/DELETE to ensure advisors can only write tasks for clients they are mapped to.
