-- Credenciais de acesso para membros (Dashboard de Membros)
-- Vincula membros_governanca a auth.users para login no portal de membros

ALTER TABLE membros_governanca
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS senha_alterada boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_membros_governanca_user ON membros_governanca(user_id);

-- RLS: membro pode ler e atualizar sua linha; usuários com perfil na empresa podem listar membros
ALTER TABLE membros_governanca ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS membros_governanca_select_own ON membros_governanca;
CREATE POLICY membros_governanca_select_own ON membros_governanca
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM perfis p
      WHERE p.user_id = auth.uid() AND p.empresa_id = membros_governanca.empresa_id
    )
    -- Permite leitura sem auth (login mock empresa/admin) - remover quando auth real estiver implementado
    OR auth.uid() IS NULL
  );

DROP POLICY IF EXISTS membros_governanca_update_own ON membros_governanca;
CREATE POLICY membros_governanca_update_own ON membros_governanca
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
