-- RLS para diagnosticos: membros e ADM da empresa podem ler; ADM pode inserir
ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS diagnosticos_select_membro ON diagnosticos;
CREATE POLICY diagnosticos_select_membro ON diagnosticos
  FOR SELECT
  USING (
    auth.uid() IS NULL
    OR EXISTS (
      SELECT 1 FROM membros_governanca m
      WHERE m.user_id = auth.uid() AND m.empresa_id = diagnosticos.empresa_id
    )
    OR EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = diagnosticos.empresa_id
    )
  );

DROP POLICY IF EXISTS diagnosticos_insert_empresa ON diagnosticos;
CREATE POLICY diagnosticos_insert_empresa ON diagnosticos
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL
    OR EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = diagnosticos.empresa_id
    )
  );
