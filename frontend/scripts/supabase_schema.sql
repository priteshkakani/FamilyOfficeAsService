-- =============================================
-- Database Schema for Family Office as a Service
-- =============================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "moddatetime" with schema extensions;

-- =============================================
-- Core Tables
-- =============================================

-- Users and Authentication
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text unique,
  phone text,
  date_of_birth date,
  address jsonb,
  city text,
  state text,
  country text,
  postal_code text,
  profile_image_url text,
  timezone text default 'Asia/Kolkata',
  currency text default 'INR',
  preferences jsonb default '{"theme": "light", "notifications": true, "language": "en"}'::jsonb,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Family members table
create table if not exists public.family_members (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  full_name text not null,
  relationship text not null,
  date_of_birth date,
  phone text,
  email text,
  is_dependent boolean default false,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- User documents storage
create table if not exists public.documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  file_path text not null,
  file_type text,
  file_size bigint,
  category text,
  tags text[],
  is_encrypted boolean default false,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =============================================
-- Financial Tables
-- =============================================

-- Accounts (Bank, Credit Cards, Wallets, etc.)
create table if not exists public.accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  account_type text not null check (account_type in ('savings', 'checking', 'credit_card', 'investment', 'loan', 'wallet', 'other')),
  institution_name text,
  account_number text,
  current_balance decimal(15, 2) not null default 0,
  currency text default 'INR',
  is_active boolean default true,
  is_primary boolean default false,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Categories for transactions
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense', 'transfer', 'investment')),
  parent_id uuid references public.categories(id) on delete set null,
  icon text,
  color text,
  is_system boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, name, type)
);

-- Transactions table
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  account_id uuid references public.accounts(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  type text not null check (type in ('income', 'expense', 'transfer', 'investment')),
  amount decimal(15, 2) not null,
  currency text default 'INR',
  description text,
  transaction_date timestamp with time zone not null default now(),
  is_recurring boolean default false,
  recurrence_rule text,
  is_tax_deductible boolean default false,
  receipt_url text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Investment transactions
create table if not exists public.investment_transactions (
  id uuid default uuid_generate_v4() primary key,
  transaction_id uuid references public.transactions(id) on delete cascade,
  asset_type text not null check (asset_type in ('stock', 'mutual_fund', 'etf', 'fd', 'bonds', 'real_estate', 'crypto', 'other')),
  asset_id uuid,
  asset_name text,
  quantity decimal(15, 6) not null,
  price_per_unit decimal(15, 4) not null,
  fee decimal(15, 2) default 0,
  tax decimal(15, 2) default 0,
  exchange text,
  lot_number text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Transfers between accounts
create table if not exists public.transfers (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  from_transaction_id uuid references public.transactions(id) on delete set null,
  to_transaction_id uuid references public.transactions(id) on delete set null,
  amount decimal(15, 2) not null,
  fee decimal(15, 2) default 0,
  exchange_rate decimal(15, 6) default 1,
  reference text,
  notes text,
  transfer_date timestamp with time zone not null default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Recurring transactions
create table if not exists public.recurring_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  account_id uuid references public.accounts(id) on delete cascade not null,
  category_id uuid references public.categories(id) on delete set null,
  description text not null,
  amount decimal(15, 2) not null,
  currency text default 'INR',
  type text not null check (type in ('income', 'expense', 'transfer', 'investment')),
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  day_of_month smallint check (day_of_month between 1 and 31),
  day_of_week smallint check (day_of_week between 0 and 6),
  start_date date not null,
  end_date date,
  last_occurrence date,
  next_occurrence date,
  is_active boolean default true,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =============================================
-- Investment Tables
-- =============================================

-- Stocks table
create table if not exists public.stocks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  symbol text not null,
  company_name text,
  exchange text,
  sector text,
  industry text,
  quantity_owned decimal(15, 6) not null default 0,
  average_buy_price decimal(15, 2) not null,
  current_price decimal(15, 2),
  last_updated timestamp with time zone,
  cost_basis decimal(15, 2) generated always as (quantity_owned * average_buy_price) stored,
  market_value decimal(15, 2) generated always as (quantity_owned * current_price) stored,
  unrealized_gain_loss decimal(15, 2) generated always as ((quantity_owned * current_price) - (quantity_owned * average_buy_price)) stored,
  unrealized_gain_loss_pct decimal(10, 2) generated always as 
    (case when (quantity_owned * average_buy_price) > 0 
      then ((quantity_owned * current_price) - (quantity_owned * average_buy_price)) / (quantity_owned * average_buy_price) * 100 
      else 0 
    end) stored,
  notes text,
  is_tracked boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, symbol, exchange)
);

-- Stock transactions
create table if not exists public.stock_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stock_id uuid references public.stocks(id) on delete cascade not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  type text not null check (type in ('buy', 'sell', 'split', 'dividend', 'merger', 'spin_off')),
  quantity decimal(15, 6) not null,
  price_per_share decimal(15, 4) not null,
  fee decimal(15, 2) default 0,
  tax decimal(15, 2) default 0,
  transaction_date timestamp with time zone not null default now(),
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Stock price history
create table if not exists public.stock_price_history (
  stock_id uuid references public.stocks(id) on delete cascade not null,
  date date not null,
  open_price decimal(15, 4),
  high_price decimal(15, 4),
  low_price decimal(15, 4),
  close_price decimal(15, 4) not null,
  volume bigint,
  primary key (stock_id, date)
);

-- Stock watchlist
create table if not exists public.stock_watchlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  symbol text not null,
  exchange text,
  target_price decimal(15, 2),
  notes text,
  created_at timestamp with time zone default now(),
  unique(user_id, symbol, exchange)
);

-- Stock alerts
create table if not exists public.stock_alerts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stock_id uuid references public.stocks(id) on delete cascade,
  symbol text,
  alert_type text not null check (alert_type in ('price_above', 'price_below', 'percent_change', 'volume')),
  target_value decimal(15, 4) not null,
  is_active boolean default true,
  is_triggered boolean default false,
  triggered_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Mutual Funds
create table if not exists public.mutual_funds (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  scheme_code text,
  scheme_name text not null,
  amfi_code text,
  fund_house text,
  category text,
  sub_category text,
  growth_or_dividend text,
  nav decimal(15, 4) not null,
  nav_date date,
  units_held decimal(15, 6) not null default 0,
  investment_amount decimal(15, 2) not null default 0,
  current_value decimal(15, 2) generated always as (nav * units_held) stored,
  profit_loss decimal(15, 2) generated always as ((nav * units_held) - investment_amount) stored,
  profit_loss_percentage decimal(10, 2) generated always as 
    (case when investment_amount > 0 then ((nav * units_held) - investment_amount) / investment_amount * 100 else 0 end) stored,
  isin_div_payout text,
  isin_div_reinvestment text,
  is_tax_saving boolean default false,
  is_active boolean default true,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, scheme_code)
);

-- Mutual Fund transactions
create table if not exists public.mutual_fund_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mutual_fund_id uuid references public.mutual_funds(id) on delete cascade not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  type text not null check (type in ('purchase', 'redemption', 'dividend', 'switch_in', 'switch_out')),
  nav decimal(15, 4) not null,
  units decimal(15, 6) not null,
  amount decimal(15, 2) not null,
  transaction_date timestamp with time zone not null default now(),
  folio_number text,
  scheme_option text,
  is_reinvested boolean default false,
  notes text,
  created_at timestamp with time zone default now()
);

-- Mutual Fund SIPs (Systematic Investment Plans)
create table if not exists public.mutual_fund_sips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mutual_fund_id uuid references public.mutual_funds(id) on delete cascade not null,
  amount decimal(15, 2) not null,
  frequency text not null check (frequency in ('weekly', 'monthly', 'quarterly')),
  day_of_week smallint check (day_of_week between 0 and 6),
  day_of_month smallint check (day_of_month between 1 and 31),
  start_date date not null,
  end_date date,
  next_investment_date date,
  is_active boolean default true,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Mutual Fund NAV history
create table if not exists public.mutual_fund_nav_history (
  mutual_fund_id uuid references public.mutual_funds(id) on delete cascade not null,
  date date not null,
  nav decimal(15, 4) not null,
  repurchase_price decimal(15, 4),
  sale_price decimal(15, 4),
  primary key (mutual_fund_id, date)
);

-- =============================================
-- Goals and Planning
-- =============================================

-- Financial Goals
create table if not exists public.financial_goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  target_amount decimal(15, 2) not null,
  current_amount decimal(15, 2) default 0,
  currency text default 'INR',
  target_date date,
  priority text check (priority in ('low', 'medium', 'high')),
  status text check (status in ('not_started', 'in_progress', 'completed', 'abandoned')),
  progress_percentage decimal(5, 2) generated always as 
    (case when target_amount > 0 then least(100, (current_amount / target_amount) * 100) else 0 end) stored,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Goal Transactions
create table if not exists public.goal_transactions (
  id uuid default uuid_generate_v4() primary key,
  goal_id uuid references public.financial_goals(id) on delete cascade not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  amount decimal(15, 2) not null,
  transaction_date timestamp with time zone not null default now(),
  notes text,
  created_at timestamp with time zone default now()
);

-- Budgets
create table if not exists public.budgets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  amount decimal(15, 2) not null,
  period text not null check (period in ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date date not null,
  end_date date,
  category_id uuid references public.categories(id) on delete cascade,
  is_active boolean default true,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Budget vs Actual
create table if not exists public.budget_actuals (
  budget_id uuid references public.budgets(id) on delete cascade not null,
  period_start_date date not null,
  period_end_date date not null,
  budgeted_amount decimal(15, 2) not null,
  actual_amount decimal(15, 2) not null,
  variance decimal(15, 2) generated always as (actual_amount - budgeted_amount) stored,
  variance_percentage decimal(10, 2) generated always as 
    (case when budgeted_amount <> 0 then ((actual_amount - budgeted_amount) / budgeted_amount) * 100 else 0 end) stored,
  primary key (budget_id, period_start_date, period_end_date)
);

-- =============================================
-- Liabilities
-- =============================================

-- Loans
create table if not exists public.loans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  lender text,
  loan_type text check (loan_type in ('home_loan', 'car_loan', 'personal_loan', 'education_loan', 'other')),
  account_number text,
  original_amount decimal(15, 2) not null,
  outstanding_amount decimal(15, 2) not null,
  interest_rate decimal(6, 2) not null,
  interest_type text check (interest_type in ('fixed', 'floating')),
  start_date date not null,
  end_date date,
  emi_amount decimal(15, 2),
  emi_day smallint check (emi_day between 1 and 31),
  is_active boolean default true,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Loan Payments
create table if not exists public.loan_payments (
  id uuid default uuid_generate_v4() primary key,
  loan_id uuid references public.loans(id) on delete cascade not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  payment_date date not null,
  amount decimal(15, 2) not null,
  principal_amount decimal(15, 2) not null,
  interest_amount decimal(15, 2) not null,
  remaining_balance decimal(15, 2) not null,
  is_emi boolean default true,
  notes text,
  created_at timestamp with time zone default now()
);

-- Credit Cards
create table if not exists public.credit_cards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  card_name text not null,
  issuer text,
  card_number_last4 text,
  expiry_month smallint check (expiry_month between 1 and 12),
  expiry_year smallint,
  credit_limit decimal(15, 2),
  available_credit decimal(15, 2),
  due_date_day smallint check (due_date_day between 1 and 31),
  billing_cycle_start_day smallint check (billing_cycle_start_day between 1 and 31),
  is_active boolean default true,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Credit Card Transactions
create table if not exists public.credit_card_transactions (
  id uuid default uuid_generate_v4() primary key,
  card_id uuid references public.credit_cards(id) on delete cascade not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  transaction_date date not null,
  posting_date date,
  description text not null,
  category_id uuid references public.categories(id) on delete set null,
  amount decimal(15, 2) not null,
  currency text default 'INR',
  merchant_name text,
  reference_number text,
  is_settled boolean default false,
  notes text,
  created_at timestamp with time zone default now()
);

-- =============================================
-- Insurance
-- =============================================

-- Insurance Policies
create table if not exists public.insurance_policies (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  policy_number text not null,
  insurance_company text not null,
  policy_type text check (policy_type in ('life', 'health', 'motor', 'home', 'travel', 'other')),
  policy_name text,
  sum_assured decimal(15, 2),
  premium_amount decimal(15, 2) not null,
  premium_frequency text check (premium_frequency in ('monthly', 'quarterly', 'half_yearly', 'yearly', 'one_time')),
  start_date date not null,
  end_date date,
  next_premium_date date,
  is_active boolean default true,
  beneficiary_name text,
  beneficiary_relationship text,
  nominee_name text,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Insurance Premium Payments
create table if not exists public.insurance_premiums (
  id uuid default uuid_generate_v4() primary key,
  policy_id uuid references public.insurance_policies(id) on delete cascade not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  premium_date date not null,
  amount decimal(15, 2) not null,
  payment_method text,
  receipt_number text,
  due_date date,
  paid_date date,
  status text check (status in ('paid', 'unpaid', 'overdue', 'cancelled')),
  notes text,
  created_at timestamp with time zone default now()
);

-- =============================================
-- Tax Planning
-- =============================================

-- Tax Categories
create table if not exists public.tax_categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  section text,
  description text,
  max_limit decimal(15, 2),
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, name)
);

-- Tax Deductions
create table if not exists public.tax_deductions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tax_category_id uuid references public.tax_categories(id) on delete cascade,
  financial_year text not null,
  amount decimal(15, 2) not null,
  description text,
  document_url text,
  verified boolean default false,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Tax Calculation
create table if not exists public.tax_calculations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  financial_year text not null,
  income_from_salary decimal(15, 2) default 0,
  income_from_other_sources decimal(15, 2) default 0,
  income_from_house_property decimal(15, 2) default 0,
  income_from_capital_gains decimal(15, 2) default 0,
  income_from_business_profession decimal(15, 2) default 0,
  total_income decimal(15, 2) generated always as 
    (income_from_salary + income_from_other_sources + income_from_house_property + 
     income_from_capital_gains + income_from_business_profession) stored,
  deductions_80c decimal(15, 2) default 0,
  deductions_80d decimal(15, 2) default 0,
  deductions_other decimal(15, 2) default 0,
  total_deductions decimal(15, 2) generated always as 
    (deductions_80c + deductions_80d + deductions_other) stored,
  taxable_income decimal(15, 2) generated always as 
    (greatest(0, total_income - total_deductions)) stored,
  tax_payable decimal(15, 2) default 0,
  tax_paid_tds decimal(15, 2) default 0,
  tax_paid_advance decimal(15, 2) default 0,
  tax_paid_self_assessment decimal(15, 2) default 0,
  total_tax_paid decimal(15, 2) generated always as 
    (tax_paid_tds + tax_paid_advance + tax_paid_self_assessment) stored,
  tax_balance decimal(15, 2) generated always as 
    (tax_payable - (tax_paid_tds + tax_paid_advance + tax_paid_self_assessment)) stored,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, financial_year)
);

-- =============================================
-- Estate Planning
-- =============================================

-- Assets (Real Estate, Vehicles, etc.)
create table if not exists public.assets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  asset_type text not null check (asset_type in ('real_estate', 'vehicle', 'jewelry', 'art', 'collectibles', 'other')),
  description text,
  purchase_date date,
  purchase_price decimal(15, 2),
  current_value decimal(15, 2),
  location text,
  notes text,
  beneficiary_name text,
  beneficiary_relationship text,
  is_insured boolean default false,
  insurance_policy_id uuid references public.insurance_policies(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Asset Documents
create table if not exists public.asset_documents (
  id uuid default uuid_generate_v4() primary key,
  asset_id uuid references public.assets(id) on delete cascade not null,
  document_type text not null,
  document_number text,
  issue_date date,
  expiry_date date,
  issuing_authority text,
  document_url text not null,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Will and Testament
create table if not exists public.wills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  document_url text,
  execution_date date,
  witness1_name text,
  witness1_contact text,
  witness2_name text,
  witness2_contact text,
  lawyer_name text,
  lawyer_contact text,
  is_active boolean default true,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Will Beneficiaries
create table if not exists public.will_beneficiaries (
  id uuid default uuid_generate_v4() primary key,
  will_id uuid references public.wills(id) on delete cascade not null,
  beneficiary_name text not null,
  relationship text,
  contact_info text,
  share_percentage decimal(5, 2) check (share_percentage between 0 and 100),
  asset_ids uuid[],
  notes text,
  created_at timestamp with time zone default now()
);

-- =============================================
-- Indexes
-- =============================================

-- Profiles
create index if not exists idx_profiles_email on public.profiles(email);

-- Family Members
create index if not exists idx_family_members_user_id on public.family_members(user_id);

-- Documents
create index if not exists idx_documents_user_id on public.documents(user_id);
create index if not exists idx_documents_category on public.documents(category);

-- Accounts
create index if not exists idx_accounts_user_id on public.accounts(user_id);
create index if not exists idx_accounts_type on public.accounts(account_type);
create index if not exists idx_accounts_institution on public.accounts(institution_name);

-- Categories
create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_categories_type on public.categories(type);
create index if not exists idx_categories_parent_id on public.categories(parent_id);

-- Transactions
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_account_id on public.transactions(account_id);
create index if not exists idx_transactions_category_id on public.transactions(category_id);
create index if not exists idx_transactions_type on public.transactions(type);
create index if not exists idx_transactions_date on public.transactions(transaction_date);
create index if not exists idx_transactions_recurring on public.transactions(is_recurring) where is_recurring = true;

-- Investment Transactions
create index if not exists idx_investment_transactions_transaction_id on public.investment_transactions(transaction_id);
create index if not exists idx_investment_transactions_asset_type on public.investment_transactions(asset_type);
create index if not exists idx_investment_transactions_asset_id on public.investment_transactions(asset_id);

-- Transfers
create index if not exists idx_transfers_user_id on public.transfers(user_id);
create index if not exists idx_transfers_from_transaction_id on public.transfers(from_transaction_id);
create index if not exists idx_transfers_to_transaction_id on public.transfers(to_transaction_id);

-- Recurring Transactions
create index if not exists idx_recurring_transactions_user_id on public.recurring_transactions(user_id);
create index if not exists idx_recurring_transactions_account_id on public.recurring_transactions(account_id);
create index if not exists idx_recurring_transactions_category_id on public.recurring_transactions(category_id);
create index if not exists idx_recurring_transactions_next_occurrence on public.recurring_transactions(next_occurrence) where is_active = true;

-- Stocks
create index if not exists idx_stocks_user_id on public.stocks(user_id);
create index if not exists idx_stocks_symbol on public.stocks(symbol);
create index if not exists idx_stocks_exchange on public.stocks(exchange);
create index if not exists idx_stocks_sector on public.stocks(sector);

-- Stock Transactions
create index if not exists idx_stock_transactions_user_id on public.stock_transactions(user_id);
create index if not exists idx_stock_transactions_stock_id on public.stock_transactions(stock_id);
create index if not exists idx_stock_transactions_transaction_id on public.stock_transactions(transaction_id);
create index if not exists idx_stock_transactions_type on public.stock_transactions(type);
create index if not exists idx_stock_transactions_date on public.stock_transactions(transaction_date);

-- Stock Price History
create index if not exists idx_stock_price_history_stock_id on public.stock_price_history(stock_id);
create index if not exists idx_stock_price_history_date on public.stock_price_history(date);

-- Stock Watchlist
create index if not exists idx_stock_watchlist_user_id on public.stock_watchlist(user_id);

-- Stock Alerts
create index if not exists idx_stock_alerts_user_id on public.stock_alerts(user_id);
create index if not exists idx_stock_alerts_stock_id on public.stock_alerts(stock_id);
create index if not exists idx_stock_alerts_is_active on public.stock_alerts(is_active) where is_active = true;

-- Mutual Funds
create index if not exists idx_mutual_funds_user_id on public.mutual_funds(user_id);
create index if not exists idx_mutual_funds_scheme_code on public.mutual_funds(scheme_code);
create index if not exists idx_mutual_funds_category on public.mutual_funds(category);
create index if not exists idx_mutual_funds_fund_house on public.mutual_funds(fund_house);

-- Mutual Fund Transactions
create index if not exists idx_mf_transactions_user_id on public.mutual_fund_transactions(user_id);
create index if not exists idx_mf_transactions_mf_id on public.mutual_fund_transactions(mutual_fund_id);
create index if not exists idx_mf_transactions_transaction_id on public.mutual_fund_transactions(transaction_id);
create index if not exists idx_mf_transactions_type on public.mutual_fund_transactions(type);
create index if not exists idx_mf_transactions_date on public.mutual_fund_transactions(transaction_date);

-- Mutual Fund SIPs
create index if not exists idx_mf_sips_user_id on public.mutual_fund_sips(user_id);
create index if not exists idx_mf_sips_mf_id on public.mutual_fund_sips(mutual_fund_id);
create index if not exists idx_mf_sips_next_date on public.mutual_fund_sips(next_investment_date) where is_active = true;

-- Mutual Fund NAV History
create index if not exists idx_mf_nav_history_mf_id on public.mutual_fund_nav_history(mutual_fund_id);
create index if not exists idx_mf_nav_history_date on public.mutual_fund_nav_history(date);

-- Financial Goals
create index if not exists idx_financial_goals_user_id on public.financial_goals(user_id);
create index if not exists idx_financial_goals_status on public.financial_goals(status);
create index if not exists idx_financial_goals_target_date on public.financial_goals(target_date);

-- Goal Transactions
create index if not exists idx_goal_transactions_goal_id on public.goal_transactions(goal_id);
create index if not exists idx_goal_transactions_transaction_id on public.goal_transactions(transaction_id);

-- Budgets
create index if not exists idx_budgets_user_id on public.budgets(user_id);
create index if not exists idx_budgets_category_id on public.budgets(category_id);
create index if not exists idx_budgets_is_active on public.budgets(is_active) where is_active = true;

-- Budget Actuals
create index if not exists idx_budget_actuals_budget_id on public.budget_actuals(budget_id);
create index if not exists idx_budget_actuals_period on public.budget_actuals(period_start_date, period_end_date);

-- Loans
create index if not exists idx_loans_user_id on public.loans(user_id);
create index if not exists idx_loans_loan_type on public.loans(loan_type);
create index if not exists idx_loans_is_active on public.loans(is_active) where is_active = true;

-- Loan Payments
create index if not exists idx_loan_payments_loan_id on public.loan_payments(loan_id);
create index if not exists idx_loan_payments_transaction_id on public.loan_payments(transaction_id);
create index if not exists idx_loan_payments_date on public.loan_payments(payment_date);

-- Credit Cards
create index if not exists idx_credit_cards_user_id on public.credit_cards(user_id);
create index if not exists idx_credit_cards_issuer on public.credit_cards(issuer);
create index if not exists idx_credit_cards_is_active on public.credit_cards(is_active) where is_active = true;

-- Credit Card Transactions
create index if not exists idx_cc_transactions_card_id on public.credit_card_transactions(card_id);
create index if not exists idx_cc_transactions_transaction_id on public.credit_card_transactions(transaction_id);
create index if not exists idx_cc_transactions_category_id on public.credit_card_transactions(category_id);
create index if not exists idx_cc_transactions_date on public.credit_card_transactions(transaction_date);
create index if not exists idx_cc_transactions_is_settled on public.credit_card_transactions(is_settled) where is_settled = false;

-- Insurance Policies
create index if not exists idx_insurance_policies_user_id on public.insurance_policies(user_id);
create index if not exists idx_insurance_policies_type on public.insurance_policies(policy_type);
create index if not exists idx_insurance_policies_company on public.insurance_policies(insurance_company);
create index if not exists idx_insurance_policies_is_active on public.insurance_policies(is_active) where is_active = true;
create index if not exists idx_insurance_policies_next_premium on public.insurance_policies(next_premium_date) where is_active = true;

-- Insurance Premiums
create index if not exists idx_insurance_premiums_policy_id on public.insurance_premiums(policy_id);
create index if not exists idx_insurance_premiums_transaction_id on public.insurance_premiums(transaction_id);
create index if not exists idx_insurance_premiums_date on public.insurance_premiums(premium_date);
create index if not exists idx_insurance_premiums_status on public.insurance_premiums(status);

-- Tax Categories
create index if not exists idx_tax_categories_user_id on public.tax_categories(user_id);
create index if not exists idx_tax_categories_section on public.tax_categories(section);

-- Tax Deductions
create index if not exists idx_tax_deductions_user_id on public.tax_deductions(user_id);
create index if not exists idx_tax_deductions_category_id on public.tax_deductions(tax_category_id);
create index if not exists idx_tax_deductions_financial_year on public.tax_deductions(financial_year);

-- Tax Calculations
create index if not exists idx_tax_calculations_user_id on public.tax_calculations(user_id);
create index if not exists idx_tax_calculations_financial_year on public.tax_calculations(financial_year);

-- Assets
create index if not exists idx_assets_user_id on public.assets(user_id);
create index if not exists idx_assets_asset_type on public.assets(asset_type);
create index if not exists idx_assets_is_insured on public.assets(is_insured) where is_insured = true;

-- Asset Documents
create index if not exists idx_asset_documents_asset_id on public.asset_documents(asset_id);
create index if not exists idx_asset_documents_type on public.asset_documents(document_type);

-- Wills
create index if not exists idx_wills_user_id on public.wills(user_id);
create index if not exists idx_wills_is_active on public.wills(is_active) where is_active = true;

-- Will Beneficiaries
create index if not exists idx_will_beneficiaries_will_id on public.will_beneficiaries(will_id);

-- =============================================
-- RLS (Row Level Security) Policies
-- =============================================

-- Enable RLS on all tables
DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('_prisma_migrations', 'spatial_ref_sys')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t.tablename);
    END LOOP;
END $$;

-- =============================================
-- RLS Policy Functions
-- =============================================

-- Function to check if user is authenticated
create or replace function public.is_authenticated()
returns boolean as $$
begin
  return auth.role() = 'authenticated';
end;
$$ language plpgsql security definer;

-- Function to check if user owns a record
create or replace function public.is_owner(user_id_param uuid)
returns boolean as $$
begin
  return auth.uid() = user_id_param;
end;
$$ language plpgsql security definer;

-- Function to check if user is admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from auth.users
    where id = auth.uid() and raw_user_meta_data->>'role' = 'admin'
  );
end;
$$ language plpgsql security definer;

-- =============================================
-- Table-Specific RLS Policies
-- =============================================

-- Profiles
create policy "Users can view their own profile" 
on public.profiles for select 
using (is_owner(id));

create policy "Users can update their own profile"
on public.profiles for update 
using (is_owner(id));

-- Family Members
create policy "Users can manage their family members"
on public.family_members for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Documents
create policy "Users can manage their documents"
on public.documents for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Accounts
create policy "Users can manage their accounts"
on public.accounts for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Categories
create policy "Users can manage their categories"
on public.categories for all
using (user_id is null or is_owner(user_id))
with check (user_id is null or is_owner(user_id));

-- Transactions
create policy "Users can manage their transactions"
on public.transactions for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Investment Transactions
create policy "Users can manage their investment transactions"
on public.investment_transactions for all
using (exists (select 1 from public.transactions t where t.id = transaction_id and is_owner(t.user_id)))
with check (true);

-- Transfers
create policy "Users can manage their transfers"
on public.transfers for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Recurring Transactions
create policy "Users can manage their recurring transactions"
on public.recurring_transactions for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Stocks
create policy "Users can manage their stocks"
on public.stocks for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Stock Transactions
create policy "Users can manage their stock transactions"
on public.stock_transactions for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Stock Watchlist
create policy "Users can manage their stock watchlist"
on public.stock_watchlist for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Stock Alerts
create policy "Users can manage their stock alerts"
on public.stock_alerts for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Mutual Funds
create policy "Users can manage their mutual funds"
on public.mutual_funds for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Mutual Fund Transactions
create policy "Users can manage their mutual fund transactions"
on public.mutual_fund_transactions for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Mutual Fund SIPs
create policy "Users can manage their mutual fund SIPs"
on public.mutual_fund_sips for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Financial Goals
create policy "Users can manage their financial goals"
on public.financial_goals for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Goal Transactions
create policy "Users can manage their goal transactions"
on public.goal_transactions for all
using (exists (select 1 from public.financial_goals g where g.id = goal_id and is_owner(g.user_id)))
with check (true);

-- Budgets
create policy "Users can manage their budgets"
on public.budgets for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Budget Actuals
create policy "Users can manage their budget actuals"
on public.budget_actuals for all
using (exists (select 1 from public.budgets b where b.id = budget_id and is_owner(b.user_id)))
with check (true);

-- Loans
create policy "Users can manage their loans"
on public.loans for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Loan Payments
create policy "Users can manage their loan payments"
on public.loan_payments for all
using (exists (select 1 from public.loans l where l.id = loan_id and is_owner(l.user_id)))
with check (true);

-- Credit Cards
create policy "Users can manage their credit cards"
on public.credit_cards for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Credit Card Transactions
create policy "Users can manage their credit card transactions"
on public.credit_card_transactions for all
using (exists (select 1 from public.credit_cards c where c.id = card_id and is_owner(c.user_id)))
with check (true);

-- Insurance Policies
create policy "Users can manage their insurance policies"
on public.insurance_policies for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Insurance Premiums
create policy "Users can manage their insurance premiums"
on public.insurance_premiums for all
using (exists (select 1 from public.insurance_policies p where p.id = policy_id and is_owner(p.user_id)))
with check (true);

-- Tax Categories
create policy "Users can manage their tax categories"
on public.tax_categories for all
using (user_id is null or is_owner(user_id) or is_admin())
with check (user_id is null or is_owner(user_id) or is_admin());

-- Tax Deductions
create policy "Users can manage their tax deductions"
on public.tax_deductions for all
using (is_owner(user_id) or is_admin())
with check (is_owner(user_id) or is_admin());

-- Tax Calculations
create policy "Users can manage their tax calculations"
on public.tax_calculations for all
using (is_owner(user_id) or is_admin())
with check (is_owner(user_id) or is_admin());

-- Assets
create policy "Users can manage their assets"
on public.assets for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Asset Documents
create policy "Users can manage their asset documents"
on public.asset_documents for all
using (exists (select 1 from public.assets a where a.id = asset_id and is_owner(a.user_id)))
with check (true);

-- Wills
create policy "Users can manage their wills"
on public.wills for all
using (is_owner(user_id))
with check (is_owner(user_id));

-- Will Beneficiaries
create policy "Users can manage their will beneficiaries"
on public.will_beneficiaries for all
using (exists (select 1 from public.wills w where w.id = will_id and is_owner(w.user_id)))
with check (true);

-- =============================================
-- Helper Functions
-- =============================================

-- Function to update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Function to calculate age from date of birth
create or replace function public.calculate_age(birth_date date)
returns integer as $$
begin
  return date_part('year', age(birth_date));
end;
$$ language plpgsql immutable;

-- Function to calculate compound interest
create or replace function public.compound_interest(
  principal numeric,
  rate numeric,
  time_years numeric,
  compounds_per_year integer default 1
) returns numeric as $$
begin
  return principal * power(1 + (rate / 100 / compounds_per_year), compounds_per_year * time_years) - principal;
end;
$$ language plpgsql immutable;

-- Function to calculate loan EMI
create or replace function public.calculate_emi(
  principal numeric,
  annual_rate numeric,
  years integer
) returns numeric as $$
declare
  monthly_rate numeric;
  num_payments integer;
begin
  monthly_rate := annual_rate / 12 / 100;
  num_payments := years * 12;
  
  return round(
    (principal * monthly_rate * power(1 + monthly_rate, num_payments)) / 
    (power(1 + monthly_rate, num_payments) - 1),
    2
  );
end;
$$ language plpgsql immutable;

-- Function to generate a random string for reference numbers
create or replace function public.generate_reference(prefix text default '', length integer default 8)
returns text as $$
declare
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer := 0;
begin
  for i in 1..length loop
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  end loop;
  
  return upper(prefix || result);
end;
$$ language plpgsql volatile;

-- Function to get financial year for a given date
create or replace function public.get_financial_year(input_date date default current_date)
text as $$
begin
  return 
    case 
      when extract(month from input_date) >= 4 then 
        extract(year from input_date) || '-' || (extract(year from input_date) + 1)
      else 
        (extract(year from input_date) - 1) || '-' || extract(year from input_date)
    end;
end;
$$ language plpgsql immutable;

-- =============================================
-- Triggers
-- =============================================

-- Create triggers to update updated_at timestamp
create or replace trigger handle_profiles_updated_at
before update on public.profiles
for each row execute function public.handle_updated_at();

create or replace trigger handle_transactions_updated_at
before update on public.transactions
for each row execute function public.handle_updated_at();

create or replace trigger handle_stocks_updated_at
before update on public.stocks
for each row execute function public.handle_updated_at();

create or replace trigger handle_mutual_funds_updated_at
before update on public.mutual_funds
for each row execute function public.handle_updated_at();

-- =============================================
-- Security
-- =============================================

-- Allow authenticated users to access the public schema
grant usage on schema public to anon, authenticated;

grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;
grant all on all functions in schema public to authenticated;

-- Set up storage buckets (if using Supabase Storage)
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', true);

-- =============================================
-- Helper Functions
-- =============================================

-- Function to get user's net worth
create or replace function public.get_net_worth(user_id_param uuid)
returns table (
  total_assets decimal(15, 2),
  total_liabilities decimal(15, 2),
  net_worth decimal(15, 2)
) as $$
begin
  return query
  select 
    coalesce(sum(current_value), 0) as total_assets,
    0 as total_liabilities, -- Add your liabilities logic here
    coalesce(sum(current_value), 0) - 0 as net_worth
  from (
    select current_value from public.stocks where user_id = user_id_param
    union all
    select current_value from public.mutual_funds where user_id = user_id_param
  ) as assets;
end;
$$ language plpgsql security definer;

-- =============================================
-- Comments
-- =============================================

-- Core Tables
comment on table public.profiles is 'Stores user profile information';
comment on table public.family_members is 'Stores information about family members of users';
comment on table public.documents is 'Stores user documents and related metadata';

-- Financial Tables
comment on table public.accounts is 'Stores bank accounts, credit cards, and other financial accounts';
comment on table public.categories is 'Categorization system for transactions and budgets';
comment on table public.transactions is 'Tracks all financial transactions';
comment on table public.investment_transactions is 'Tracks investment-specific transaction details';
comment on table public.transfers is 'Tracks transfers between accounts';
comment on table public.recurring_transactions is 'Stores templates for recurring transactions';

-- Investment Tables
comment on table public.stocks is 'Tracks stock investments and holdings';
comment on table public.stock_transactions is 'Tracks buy/sell transactions for stocks';
comment on table public.stock_price_history is 'Historical price data for stocks';
comment on table public.stock_watchlist is 'User watchlists for tracking stocks';
comment on table public.stock_alerts is 'Price and volume alerts for stocks';
comment on table public.mutual_funds is 'Tracks mutual fund investments';
comment on table public.mutual_fund_transactions is 'Tracks transactions for mutual funds';
comment on table public.mutual_fund_sips is 'Tracks SIP (Systematic Investment Plan) details';
comment on table public.mutual_fund_nav_history is 'Historical NAV data for mutual funds';

-- Goals and Planning
comment on table public.financial_goals is 'User-defined financial goals';
comment on table public.goal_transactions is 'Links transactions to financial goals';
comment on table public.budgets is 'User budgets for categories and time periods';
comment on table public.budget_actuals is 'Tracks actual spending vs budget';

-- Liabilities
comment on table public.loans is 'Tracks loan liabilities';
comment on table public.loan_payments is 'Tracks loan EMI and other payments';
comment on table public.credit_cards is 'Tracks credit card accounts';
comment on table public.credit_card_transactions is 'Tracks credit card transactions';

-- Insurance
comment on table public.insurance_policies is 'Tracks insurance policies';
comment on table public.insurance_premiums is 'Tracks insurance premium payments';

-- Tax Planning
comment on table public.tax_categories is 'Categories for tax deductions';
comment on table public.tax_deductions is 'Tracks tax-deductible expenses';
comment on table public.tax_calculations is 'Stores tax calculation results';

-- Estate Planning
comment on table public.assets is 'Tracks physical and financial assets';
comment on table public.asset_documents is 'Stores documents related to assets';
comment on table public.wills is 'Tracks will and testament information';
comment on table public.will_beneficiaries is 'Beneficiaries listed in wills';

-- =============================================
-- Sample Data (Optional - Uncomment if needed)
-- =============================================

/*
-- Insert default categories
INSERT INTO public.categories (name, type, is_system) VALUES 
('Salary', 'income', true),
('Business Income', 'income', true),
('Dividend', 'income', true),
('Interest', 'income', true),
('Rental Income', 'income', true),
('Other Income', 'income', true),

('Food & Dining', 'expense', true),
('Shopping', 'expense', true),
('Housing', 'expense', true),
('Transportation', 'expense', true),
('Entertainment', 'expense', true),
('Healthcare', 'expense', true),
('Education', 'expense', true),
('Bills & Utilities', 'expense', true),
('Travel', 'expense', true),
('Personal Care', 'expense', true),
('Gifts & Donations', 'expense', true),
('Investments', 'expense', true),
('Taxes', 'expense', true),
('Other Expense', 'expense', true),

('Transfer', 'transfer', true),
('Refund', 'income', true),
('Reimbursement', 'income', true);
*/

-- =============================================
-- End of Schema
-- =============================================
