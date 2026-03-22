-- Estende cap_table para suportar dados completos da UI
ALTER TABLE cap_table
  ADD COLUMN IF NOT EXISTS tipo text,
  ADD COLUMN IF NOT EXISTS quotas numeric,
  ADD COLUMN IF NOT EXISTS data_entrada date,
  ADD COLUMN IF NOT EXISTS tipo_aquisicao text,
  ADD COLUMN IF NOT EXISTS valor numeric,
  ADD COLUMN IF NOT EXISTS familia boolean DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_cap_table_empresa ON cap_table(empresa_id);
