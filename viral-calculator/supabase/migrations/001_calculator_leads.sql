-- Calculator leads table for viral independence calculator
CREATE TABLE calculator_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  hours_per_week INTEGER NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  platform VARCHAR NOT NULL,
  experience_level VARCHAR NOT NULL,
  annual_platform_cost INTEGER NOT NULL,
  annual_savings_potential INTEGER NOT NULL,
  percentage_increase INTEGER NOT NULL,
  monthly_difference INTEGER NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT FALSE,
  trial_started BOOLEAN DEFAULT FALSE,
  converted_to_paid BOOLEAN DEFAULT FALSE,
  consultation_booked BOOLEAN DEFAULT FALSE
);

-- Social shares tracking table
CREATE TABLE calculator_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES calculator_leads(id) ON DELETE CASCADE,
  platform VARCHAR NOT NULL, -- twitter, linkedin, facebook, etc.
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_calculator_leads_email ON calculator_leads(email);
CREATE INDEX idx_calculator_leads_created_at ON calculator_leads(created_at);
CREATE INDEX idx_calculator_leads_platform ON calculator_leads(platform);
CREATE INDEX idx_calculator_leads_savings ON calculator_leads(annual_savings_potential);
CREATE INDEX idx_calculator_leads_updated_at ON calculator_leads(updated_at);

CREATE INDEX idx_calculator_shares_lead_id ON calculator_shares(lead_id);
CREATE INDEX idx_calculator_shares_platform ON calculator_shares(platform);
CREATE INDEX idx_calculator_shares_shared_at ON calculator_shares(shared_at);

-- Email uniqueness constraint
CREATE UNIQUE INDEX idx_calculator_leads_email_unique ON calculator_leads(email);

-- Row Level Security (RLS) policies
ALTER TABLE calculator_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculator_shares ENABLE ROW LEVEL SECURITY;

-- Policy for service role access (API)
CREATE POLICY "Service role can manage calculator leads"
  ON calculator_leads FOR ALL 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage calculator shares"
  ON calculator_shares FOR ALL 
  USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_calculator_leads_updated_at 
    BEFORE UPDATE ON calculator_leads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Analytics view for dashboard
CREATE VIEW calculator_analytics AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE email_sent = true) as emails_sent,
  COUNT(*) FILTER (WHERE trial_started = true) as trials_started,
  COUNT(*) FILTER (WHERE converted_to_paid = true) as conversions,
  AVG(annual_platform_cost) as avg_platform_cost,
  AVG(annual_savings_potential) as avg_savings_potential,
  platform,
  experience_level
FROM calculator_leads 
GROUP BY DATE(created_at), platform, experience_level
ORDER BY date DESC;

-- Grant access to the view
GRANT SELECT ON calculator_analytics TO service_role;