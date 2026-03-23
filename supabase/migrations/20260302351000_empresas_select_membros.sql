-- Permite membros (Dashboard de Membros) lerem a empresa da qual fazem parte
-- Necessário para: fetchEmpresaById no login e no MemberLayout (validação empresa ativa)

DROP POLICY IF EXISTS empresas_select_membros ON empresas;
CREATE POLICY empresas_select_membros ON empresas
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM membros_governanca m
      WHERE m.user_id = auth.uid() AND m.empresa_id = empresas.id
    )
  );
