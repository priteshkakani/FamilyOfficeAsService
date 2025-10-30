CREATE TABLE users
(
    id INT
    AUTO_INCREMENT PRIMARY KEY,
    mobile VARCHAR
    (15) UNIQUE NOT NULL,
    name VARCHAR
    (100),
    email VARCHAR
    (100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE TABLE households
    (
        id INT
        AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR
        (100),
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY
        (owner_id) REFERENCES users
        (id)
);

        CREATE TABLE family_members
        (
            id INT
            AUTO_INCREMENT PRIMARY KEY,
    household_id INT,
    name VARCHAR
            (100),
    relationship VARCHAR
            (50),
    role ENUM
            ('decision-maker', 'view-only'),
    FOREIGN KEY
            (household_id) REFERENCES households
            (id)
);

            CREATE TABLE assets
            (
                id INT
                AUTO_INCREMENT PRIMARY KEY,
    household_id INT,
    type VARCHAR
                (50),
    details JSON,
    FOREIGN KEY
                (household_id) REFERENCES households
                (id)
);

                CREATE TABLE consents
                (
                    id INT
                    AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    source VARCHAR
                    (100),
    scope VARCHAR
                    (255),
    duration VARCHAR
                    (50),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY
                    (user_id) REFERENCES users
                    (id)
);

                    -- Income Records Table
                    CREATE TABLE
                    IF NOT EXISTS income_records
                    (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
                    (),
    user_id uuid REFERENCES users
                    (id) ON
                    DELETE CASCADE,
    source text
                    NOT NULL,
    category text NOT NULL,
    amount numeric
                    (12,2) NOT NULL,
    frequency text,
    date_received date NOT NULL,
    notes text,
    created_at timestamptz DEFAULT now
                    (),
    updated_at timestamptz DEFAULT now
                    ()
);

                    -- Expense Records Table
                    CREATE TABLE
                    IF NOT EXISTS expense_records
                    (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
                    (),
    user_id uuid REFERENCES users
                    (id) ON
                    DELETE CASCADE,
    category text
                    NOT NULL,
    subcategory text,
    amount numeric
                    (12,2) NOT NULL,
    payment_mode text,
    date_incurred date NOT NULL,
    recurring boolean DEFAULT false,
    notes text,
    created_at timestamptz DEFAULT now
                    (),
    updated_at timestamptz DEFAULT now
                    ()
);

                    -- RLS Policies
                    ALTER TABLE income_records ENABLE ROW LEVEL SECURITY;
                    CREATE POLICY "Users can access their own income" ON income_records
    USING
                    (user_id = auth.uid
                    ());
                    CREATE POLICY "Users can insert their own income" ON income_records
    FOR
                    INSERT WITH CHECK
                        (user_id
                    = auth.uid
                    ()
       
                              
                      );

                    ALTER TABLE expense_records ENABLE ROW LEVEL SECURITY;
                    CREATE POLICY "Users can access their own expenses" ON expense_records
    USING
                    (user_id = auth.uid
                    ());
                    CREATE POLICY "Users can insert their own expenses" ON expense_records
    FOR
                    INSERT WITH CHECK
                        (user_id
                    = auth.uid
                    ()
       
                              
                      );
