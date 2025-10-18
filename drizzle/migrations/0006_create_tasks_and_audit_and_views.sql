-- Migration: create tasks, audit_log and summary views

-- tasks table
CREATE TABLE
IF NOT EXISTS tasks
(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  type text,
  priority text,
  due_date timestamptz,
  status text DEFAULT 'open',
  notes jsonb,
  created_at timestamptz DEFAULT now
()
);

-- audit_log table
CREATE TABLE
IF NOT EXISTS audit_log
(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
  actor_id uuid,
  user_id uuid,
  action text,
  entity text,
  entity_id uuid,
  meta jsonb,
  created_at timestamptz DEFAULT now
()
);

-- vw_net_worth
CREATE OR REPLACE VIEW vw_net_worth AS
SELECT p.id as user_id,
    COALESCE(a.total_assets,0) as total_assets,
    COALESCE(l.total_liabilities,0) as total_liabilities,
    COALESCE(a.total_assets,0) - COALESCE(l.total_liabilities,0) as net_worth,
    now() as as_of_date
FROM profiles p
    LEFT JOIN (
  SELECT user_id, SUM(amount) as total_assets
    FROM assets
    GROUP BY user_id
) a ON a.user_id = p.id
    LEFT JOIN (
  SELECT user_id, SUM(outstanding_amount) as total_liabilities
    FROM liabilities
    GROUP BY user_id
) l ON l.user_id = p.id;

-- vw_monthly_cashflow
CREATE OR REPLACE VIEW vw_monthly_cashflow AS
SELECT user_id, date_trunc('month', date_received) as month,
    SUM(amount) FILTER
(WHERE amount > 0) as income,
  0 as expenses,
  0 as savings
FROM income_records
GROUP BY user_id, date_trunc
('month', date_received);

-- vw_asset_allocation
CREATE OR REPLACE VIEW vw_asset_allocation AS
SELECT user_id, category, SUM(amount) as value, now() as as_of_date
FROM assets
GROUP BY user_id, category;

-- vw_goal_progress
CREATE OR REPLACE VIEW vw_goal_progress AS
SELECT g.id as goal_id, g.user_id, g.title, g.target_amount, COALESCE(sum(c.amount),0) as current_amount,
    CASE WHEN g.target_amount > 0 THEN COALESCE(sum(c.amount),0)/g.target_amount*100 ELSE 0 END as progress_pct
FROM goals g
    LEFT JOIN (
  SELECT user_id, SUM(amount) as amount
    FROM assets
    WHERE type='goal'
    GROUP BY user_id
) c ON c.user_id = g.user_id
GROUP BY g.id, g.user_id, g.title, g.target_amount;
