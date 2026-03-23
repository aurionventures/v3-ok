-- RLS na tabela empresas: isolamento por tenant
-- empresa_adm vê apenas sua empresa; super_admin vê todas.
-- Garante que toda empresa nova criada no Super ADM não herde/exiba dados de outra.

ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- SELECT: super_admin vê todas; empresa_adm vê só sua empresa
DROP POLICY IF EXISTS empresas_select_policy ON empresas;
CREATE POLICY empresas_select_policy ON empresas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid()
        AND (
          (p.role = 'super_admin')
          OR (p.role = 'empresa_adm' AND p.empresa_id = empresas.id)
        )
    )
  );

-- INSERT: apenas super_admin cria novas empresas (Companies no Super ADM)
DROP POLICY IF EXISTS empresas_insert_policy ON empresas;
CREATE POLICY empresas_insert_policy ON empresas
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- UPDATE: super_admin atualiza qualquer; empresa_adm pode atualizar sua própria
DROP POLICY IF EXISTS empresas_update_policy ON empresas;
CREATE POLICY empresas_update_policy ON empresas
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid()
        AND (
          (p.role = 'super_admin')
          OR (p.role = 'empresa_adm' AND p.empresa_id = empresas.id)
        )
    )
  );

-- DELETE: apenas super_admin remove empresas
DROP POLICY IF EXISTS empresas_delete_policy ON empresas;
CREATE POLICY empresas_delete_policy ON empresas
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.role = 'super_admin'
    )
  );
