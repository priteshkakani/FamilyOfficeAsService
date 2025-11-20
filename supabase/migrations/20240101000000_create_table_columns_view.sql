-- Create a view that mimics information_schema.columns but with proper permissions
CREATE OR REPLACE VIEW public.table_columns AS
SELECT 
    table_schema,
    table_name,
    column_name,
    ordinal_position,
    column_default,
    is_nullable,
    data_type,
    character_maximum_length,
    numeric_precision,
    numeric_scale
FROM information_schema.columns
WHERE table_schema = 'public';

-- Grant read access to authenticated users
GRANT SELECT ON public.table_columns TO authenticated;

-- Create a function to get columns for a specific table
CREATE OR REPLACE FUNCTION public.get_table_columns(p_table text)
RETURNS TABLE (
    column_name text,
    data_type text,
    ordinal_position integer
) 
LANGUAGE sql 
SECURITY DEFINER
AS $$
    SELECT 
        column_name::text,
        data_type::text,
        ordinal_position::integer
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = p_table
    ORDER BY ordinal_position;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_table_columns(text) TO authenticated;
