-- Estende reunioes com empresa_id, comissao_id e horario para agenda oficial
ALTER TABLE reunioes
  ADD COLUMN IF NOT EXISTS empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS comissao_id uuid REFERENCES comissoes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS horario time;

CREATE INDEX IF NOT EXISTS idx_reunioes_empresa ON reunioes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_reunioes_comissao ON reunioes(comissao_id);
CREATE INDEX IF NOT EXISTS idx_reunioes_data ON reunioes(data_reuniao);
