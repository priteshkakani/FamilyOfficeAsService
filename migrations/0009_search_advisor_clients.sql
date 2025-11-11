-- Migration: Create/replace advisor client search RPC and indexes
-- 1. Create/replace the search_advisor_clients function

-- Postgres migration: create/replace search_advisor_clients RPC
CREATE OR REPLACE FUNCTION public.search_advisor_clients
(q text)
RETURNS TABLE
(
    client_id uuid,
    full_name text,
    email text,
    mobile_number text
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    advisor uuid := auth.uid
();
BEGIN
    IF q IS NULL OR trim(q) = '' THEN
    RETURN QUERY
    SELECT p.id, p.full_name, p.email, p.mobile_number
    FROM profiles p
        INNER JOIN advisor_clients ac ON ac.client_id = p.id
    WHERE ac.advisor_id = advisor
    ORDER BY p.updated_at DESC
        LIMIT 20;
    ELSE
        RETURN QUERY
    SELECT p.id, p.full_name, p.email, p.mobile_number
    FROM profiles p
        INNER JOIN advisor_clients ac ON ac.client_id = p.id
    WHERE ac.advisor_id = advisor
        AND (
            p.full_name
    ILIKE
    ('%' || q || '%') OR
            p.email ILIKE
    ('%' || q || '%') OR
            p.mobile_number ILIKE
    ('%' || q || '%')
          )
        ORDER BY
          CASE WHEN p.full_name ILIKE
    ('%' || q || '%') THEN 0 ELSE 1
END
,
          CASE WHEN p.email ILIKE
('%' || q || '%') THEN 0 ELSE 1
END,
          p.full_name ASC
        LIMIT 25;
END
IF;
END;
$$;

-- 2. Indexes for fast search

-- Indexes for fast search
CREATE INDEX
IF NOT EXISTS idx_profiles_full_name ON profiles
(full_name);
CREATE INDEX
IF NOT EXISTS idx_profiles_email ON profiles
(email);
CREATE INDEX
IF NOT EXISTS idx_profiles_mobile_number ON profiles
(mobile_number);
CREATE INDEX
IF NOT EXISTS idx_advisor_clients_advisor_client ON advisor_clients
(advisor_id, client_id);

-- 3. Grant execute to authenticated

-- Grant execute to authenticated
GRANT EXECUTE ON FUNCTION public.search_advisor_clients
(text) TO authenticated;

-- 4. Refresh PostgREST schema cache

-- Refresh PostgREST schema cache
SELECT pg_notify('pgrst','reload schema');
