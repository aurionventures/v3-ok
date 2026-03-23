-- Última análise de ações por empresa (persistida para exibição contínua)
CREATE TABLE IF NOT EXISTS analise_acoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  resultado jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(empresa_id)
);

CREATE INDEX IF NOT EXISTS idx_analise_acoes_empresa ON analise_acoes(empresa_id);

COMMENT ON TABLE analise_acoes IS 'Última análise de governança (documentos + entrevistas) por empresa';
COMMENT ON COLUMN analise_acoes.resultado IS 'JSON completo do resultado (resumoExecutivo, incongruencias, gapsCategorias, planoAcao, raw)';

-- RLS: permitir leitura/escrita para perfis com empresa_id correspondente
ALTER TABLE analise_acoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "analise_acoes_select" ON analise_acoes
  FOR SELECT USING (
    empresa_id IN (SELECT empresa_id FROM perfis WHERE user_id = auth.uid())
  );

CREATE POLICY "analise_acoes_insert" ON analise_acoes
  FOR INSERT WITH CHECK (
    empresa_id IN (SELECT empresa_id FROM perfis WHERE user_id = auth.uid())
  );

CREATE POLICY "analise_acoes_update" ON analise_acoes
  FOR UPDATE USING (
    empresa_id IN (SELECT empresa_id FROM perfis WHERE user_id = auth.uid())
  );
