-- validate_schema_integrity.sql
-- Example: Check that all required columns exist in assets, liabilities, family_members

-- Assets table
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'assets' AND column_name IN ('id','user_id','type','name','current_value','details');

-- Liabilities table
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'liabilities' AND column_name IN ('id','user_id','type','category','outstanding_amount','details');

-- Family members table
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'family_members' AND column_name IN ('id','user_id','name','relationship','role','dob');

-- Optionally, check foreign key references
SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name, ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE constraint_type = 'FOREIGN KEY' AND tc.table_name IN ('assets','liabilities','family_members');
