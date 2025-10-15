-- Create missing tables referencing profiles(id) as user_id

CREATE TABLE
IF NOT EXISTS family_members
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
    user_id uuid REFERENCES profiles
(id) ON
DELETE CASCADE,
    name text
NOT NULL,
    dob date,
    relationship text,
    role text
);

CREATE TABLE
IF NOT EXISTS assets
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
    user_id uuid REFERENCES profiles
(id) ON
DELETE CASCADE,
    type text
NOT NULL,
    details jsonb
);

CREATE TABLE
IF NOT EXISTS liabilities
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
    user_id uuid REFERENCES profiles
(id) ON
DELETE CASCADE,
    type text
NOT NULL,
    details jsonb
);

CREATE TABLE
IF NOT EXISTS insurance
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
    user_id uuid REFERENCES profiles
(id) ON
DELETE CASCADE,
    type text
NOT NULL,
    details jsonb
);

CREATE TABLE
IF NOT EXISTS consents
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
    user_id uuid REFERENCES profiles
(id) ON
DELETE CASCADE,
    source text,
    scope text,
    duration text,
    active boolean
DEFAULT true,
    created_at timestamp
with time zone DEFAULT now
()
);

CREATE TABLE
IF NOT EXISTS households
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
    user_id uuid REFERENCES profiles
(id) ON
DELETE CASCADE,
    name text
NOT NULL,
    created_at timestamp
with time zone DEFAULT now
()
);

-- Enable RLS and add policies for each table
DO $$
DECLARE
    tbl text;
BEGIN
    FOREACH tbl IN ARRAY ARRAY['family_members','assets','liabilities','insurance','consents','households']
    LOOP
EXECUTE format
('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tbl);
EXECUTE format
('CREATE POLICY if_not_exists_%I_select ON %I FOR SELECT USING (auth.uid() = user_id)', tbl, tbl);
EXECUTE format
('CREATE POLICY if_not_exists_%I_insert ON %I FOR INSERT WITH CHECK (auth.uid() = user_id)', tbl, tbl);
EXECUTE format
('CREATE POLICY if_not_exists_%I_update ON %I FOR UPDATE USING (auth.uid() = user_id)', tbl, tbl);
EXECUTE format
('CREATE POLICY if_not_exists_%I_delete ON %I FOR DELETE USING (auth.uid() = user_id)', tbl, tbl);
END LOOP;
END $$;
