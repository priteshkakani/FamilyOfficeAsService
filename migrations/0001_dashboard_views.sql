-- Views for advisor dashboard
CREATE OR REPLACE VIEW public.vw_net_worth AS
SELECT
    p.id as user_id,
    COALESCE((SELECT SUM(amount) FROM public.assets a WHERE a.user_id = p.id),0)
::numeric as total_assets,
  COALESCE
((SELECT SUM(outstanding_amount)
FROM public.liabilities l
WHERE l.user_id = p.id)
,0)::numeric as total_liabilities,
(COALESCE
((SELECT SUM(amount)
FROM public.assets a
WHERE a.user_id = p.id)
,0) - COALESCE
((SELECT SUM(outstanding_amount)
FROM public.liabilities l
WHERE l.user_id = p.id)
,0))::numeric as net_worth,
  now
() as as_of_date
FROM public.profiles p;

CREATE OR REPLACE VIEW public.vw_monthly_cashflow AS
SELECT
    user_id,
    to_char(date_trunc('month', date_received), 'Mon YYYY') as month,
    SUM(CASE WHEN amount IS NOT NULL THEN amount ELSE 0 END) FILTER
(WHERE TRUE) as income,
  0 as expenses
FROM public.income_records
GROUP BY user_id, date_trunc
('month', date_received)
UNION ALL
SELECT
    user_id,
    to_char(date_trunc('month', date_incurred), 'Mon YYYY') as month,
    0 as income,
    SUM(CASE WHEN amount IS NOT NULL THEN amount ELSE 0 END) as expenses
FROM public.expense_records
GROUP BY user_id, date_trunc('month', date_incurred);

CREATE OR REPLACE VIEW public.vw_asset_allocation AS
SELECT
    user_id,
    COALESCE(category, 'Other') as category,
    SUM(amount)
::numeric as value,
  now
() as as_of_date
FROM public.assets
GROUP BY user_id, category;
