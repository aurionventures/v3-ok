-- Permite que perfis da empresa excluam diagnósticos (para limpar dados de maturidade)
DROP POLICY IF EXISTS diagnosticos_delete_empresa ON diagnosticos;
CREATE POLICY diagnosticos_delete_empresa ON diagnosticos
  FOR DELETE
  USING (
    auth.uid() IS NULL
    OR EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = diagnosticos.empresa_id
    )
  );
