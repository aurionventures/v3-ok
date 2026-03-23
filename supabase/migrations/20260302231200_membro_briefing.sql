-- Briefing do membro: gerado pelo ADM/Secretariado
CREATE TABLE IF NOT EXISTS membro_briefing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membro_id uuid NOT NULL REFERENCES membros_governanca(id) ON DELETE CASCADE,
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  reuniao_id uuid REFERENCES reunioes(id) ON DELETE SET NULL,
  titulo text,
  resumo_executivo text,
  perguntas_criticas jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_membro_briefing_membro ON membro_briefing(membro_id);
CREATE INDEX IF NOT EXISTS idx_membro_briefing_empresa ON membro_briefing(empresa_id);

ALTER TABLE membro_briefing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS membro_briefing_select_own ON membro_briefing;
CREATE POLICY membro_briefing_select_own ON membro_briefing
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM membros_governanca m
      WHERE m.id = membro_briefing.membro_id AND m.user_id = auth.uid()
    )
  );

-- Perfil da empresa (admin/secretariado) pode inserir e atualizar briefings
DROP POLICY IF EXISTS membro_briefing_insert_admin ON membro_briefing;
CREATE POLICY membro_briefing_insert_admin ON membro_briefing
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = membro_briefing.empresa_id
    )
  );

DROP POLICY IF EXISTS membro_briefing_update_admin ON membro_briefing;
CREATE POLICY membro_briefing_update_admin ON membro_briefing
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = membro_briefing.empresa_id
    )
  );
