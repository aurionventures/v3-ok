-- Permite Super Admin (admin@legacy.com) inserir/ler/atualizar pautas sugeridas
-- Usuários empresa_adm já têm acesso via perfis; admin não tem perfis

DROP POLICY IF EXISTS pauta_sugerida_ia_select ON pauta_sugerida_ia;
CREATE POLICY pauta_sugerida_ia_select ON pauta_sugerida_ia
  FOR SELECT
  USING (
    (auth.jwt()->>'email') = 'admin@legacy.com'
    OR EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = pauta_sugerida_ia.empresa_id
    )
  );

DROP POLICY IF EXISTS pauta_sugerida_ia_insert ON pauta_sugerida_ia;
CREATE POLICY pauta_sugerida_ia_insert ON pauta_sugerida_ia
  FOR INSERT
  WITH CHECK (
    (auth.jwt()->>'email') = 'admin@legacy.com'
    OR EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = pauta_sugerida_ia.empresa_id
    )
  );

DROP POLICY IF EXISTS pauta_sugerida_ia_update ON pauta_sugerida_ia;
CREATE POLICY pauta_sugerida_ia_update ON pauta_sugerida_ia
  FOR UPDATE
  USING (
    (auth.jwt()->>'email') = 'admin@legacy.com'
    OR EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = pauta_sugerida_ia.empresa_id
    )
  );
