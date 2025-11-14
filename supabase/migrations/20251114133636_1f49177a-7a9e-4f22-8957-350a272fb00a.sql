-- Create corporate_structure_members table with Brazilian RFB/DREI standards

CREATE TABLE IF NOT EXISTS corporate_structure_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Personal Data
  name TEXT NOT NULL,
  document TEXT,
  birth_date DATE,
  email TEXT,
  phone TEXT,
  
  -- Governance Classification (aligned with RFB/DREI)
  governance_category TEXT NOT NULL,
  governance_subcategory TEXT,
  official_qualification_code TEXT,
  specific_role TEXT,
  
  -- Corporate/Shareholding Data
  shareholding_percentage DECIMAL(5,2),
  shareholding_class TEXT,
  investment_entry_date DATE,
  investment_type TEXT,
  
  -- Governance Term/Mandate
  term_start_date DATE,
  term_end_date DATE,
  term_is_indefinite BOOLEAN DEFAULT false,
  
  -- Governance Roles
  committees TEXT[],
  is_independent BOOLEAN DEFAULT false,
  is_family_member BOOLEAN DEFAULT false,
  generation TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'Ativo',
  status_reason TEXT,
  priority INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE corporate_structure_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view members from their company"
  ON corporate_structure_members
  FOR SELECT
  USING (company_id IN (
    SELECT company FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can insert members to their company"
  ON corporate_structure_members
  FOR INSERT
  WITH CHECK (company_id IN (
    SELECT company FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update members from their company"
  ON corporate_structure_members
  FOR UPDATE
  USING (company_id IN (
    SELECT company FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can delete members from their company"
  ON corporate_structure_members
  FOR DELETE
  USING (company_id IN (
    SELECT company FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Admins can manage all members"
  ON corporate_structure_members
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_corporate_members_company ON corporate_structure_members(company_id);
CREATE INDEX idx_corporate_members_qualification ON corporate_structure_members(official_qualification_code);
CREATE INDEX idx_corporate_members_category ON corporate_structure_members(governance_category);
CREATE INDEX idx_corporate_members_status ON corporate_structure_members(status);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_corporate_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER corporate_members_updated_at
  BEFORE UPDATE ON corporate_structure_members
  FOR EACH ROW
  EXECUTE FUNCTION update_corporate_members_updated_at();