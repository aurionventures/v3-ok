-- Permite que usuários com perfil na empresa editem membros (nome, cargo, etc)
DROP POLICY IF EXISTS membros_governanca_update_empresa ON membros_governanca;
CREATE POLICY membros_governanca_update_empresa ON membros_governanca
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = membros_governanca.empresa_id
    )
    OR auth.uid() IS NULL  -- mock login
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = membros_governanca.empresa_id
    )
    OR auth.uid() IS NULL  -- mock login; remover quando auth real estiver implementado
  );
