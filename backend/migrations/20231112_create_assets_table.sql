-- Enable Row Level Security
ALTER TABLE IF EXISTS assets ENABLE ROW LEVEL SECURITY;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS assets CASCADE;

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stock', 'mutual_fund', 'etf', 'bond', 'real_estate', 'other')),
  ticker TEXT,
  quantity DECIMAL(20, 8) NOT NULL DEFAULT 0,
  avg_price DECIMAL(20, 8) NOT NULL,
  current_price DECIMAL(20, 8) NOT NULL,
  total_value DECIMAL(20, 8) GENERATED ALWAYS AS (current_price * quantity) STORED,
  cost_basis DECIMAL(20, 8) GENERATED ALWAYS AS (avg_price * quantity) STORED,
  gain_loss DECIMAL(20, 8) GENERATED ALWAYS AS ((current_price * quantity) - (avg_price * quantity)) STORED,
  gain_loss_percentage DECIMAL(10, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN (avg_price * quantity) > 0 THEN ((current_price * quantity) - (avg_price * quantity)) / (avg_price * quantity) * 100 
      ELSE 0 
    END
  ) STORED,
  sector TEXT,
  notes TEXT,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
CREATE INDEX IF NOT EXISTS idx_assets_sector ON assets(sector);

-- Row Level Security Policies
CREATE POLICY "Users can view their own assets"
  ON assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assets"
  ON assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assets"
  ON assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own assets"
  ON assets FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row update
CREATE TRIGGER update_assets_updated_at
BEFORE UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function to refresh prices (for demo purposes)
CREATE OR REPLACE FUNCTION refresh_asset_prices()
RETURNS TRIGGER AS $$
BEGIN
  -- In a real application, you would fetch current prices from a financial API here
  -- For demo purposes, we'll just add a small random variation
  UPDATE assets
  SET 
    current_price = current_price * (1 + (RANDOM() * 0.1 - 0.05)),
    last_updated = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to demonstrate price updates (optional)
-- In production, you would use a scheduled job instead
CREATE TRIGGER demo_refresh_prices
AFTER INSERT OR UPDATE ON assets
FOR EACH ROW
EXECUTE FUNCTION refresh_asset_prices();
