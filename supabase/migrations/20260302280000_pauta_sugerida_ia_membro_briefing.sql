-- Pauta sugerida por IA: armazena output da geração antes da aprovação do ADM
CREATE TABLE IF NOT EXISTS pauta_sugerida_ia (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reuniao_id uuid NOT NULL REFERENCES reunioes(id) ON DELETE CASCADE,
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  output_1 jsonb,
  output_2a jsonb,
  output_2b jsonb,
  metadata jsonb,
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'rejeitada')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pauta_sugerida_ia_empresa ON pauta_sugerida_ia(empresa_id);
CREATE INDEX IF NOT EXISTS idx_pauta_sugerida_ia_reuniao ON pauta_sugerida_ia(reuniao_id);

ALTER TABLE pauta_sugerida_ia ENABLE ROW LEVEL SECURITY;

-- Perfis da empresa (admin/secretariado) podem ler e gerenciar pautas sugeridas
DROP POLICY IF EXISTS pauta_sugerida_ia_select ON pauta_sugerida_ia;
CREATE POLICY pauta_sugerida_ia_select ON pauta_sugerida_ia
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = pauta_sugerida_ia.empresa_id
    )
  );

DROP POLICY IF EXISTS pauta_sugerida_ia_insert ON pauta_sugerida_ia;
CREATE POLICY pauta_sugerida_ia_insert ON pauta_sugerida_ia
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = pauta_sugerida_ia.empresa_id
    )
  );

DROP POLICY IF EXISTS pauta_sugerida_ia_update ON pauta_sugerida_ia;
CREATE POLICY pauta_sugerida_ia_update ON pauta_sugerida_ia
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = pauta_sugerida_ia.empresa_id
    )
  );

-- Extensão de membro_briefing para OUTPUT 2B completo
ALTER TABLE membro_briefing
  ADD COLUMN IF NOT EXISTS seu_foco text,
  ADD COLUMN IF NOT EXISTS preparacao_recomendada text,
  ADD COLUMN IF NOT EXISTS alertas_contextuais text,
  ADD COLUMN IF NOT EXISTS dados_completos jsonb;
