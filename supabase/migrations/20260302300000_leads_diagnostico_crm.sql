-- Leads do diagnóstico de maturidade (landing) – CRM para Super ADM
-- Coleta dados de interesse de visitantes que preenchem o quiz

CREATE TABLE IF NOT EXISTS leads_diagnostico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL,
  telefone text,
  empresa text,
  respostas jsonb NOT NULL DEFAULT '{}',
  scores jsonb NOT NULL DEFAULT '[]',
  nivel_geral text,
  overall_score numeric(4,2),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_diagnostico_created ON leads_diagnostico(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_diagnostico_email ON leads_diagnostico(email);

ALTER TABLE leads_diagnostico ENABLE ROW LEVEL SECURITY;

-- Permite inserção anônima (landing page, visitantes)
DROP POLICY IF EXISTS leads_diagnostico_insert_anon ON leads_diagnostico;
CREATE POLICY leads_diagnostico_insert_anon ON leads_diagnostico
  FOR INSERT
  WITH CHECK (true);

-- Apenas Super Admin pode ler
DROP POLICY IF EXISTS leads_diagnostico_select_admin ON leads_diagnostico;
CREATE POLICY leads_diagnostico_select_admin ON leads_diagnostico
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin'
    )
    OR (auth.jwt()->>'email') = 'admin@legacy.com'
  );
