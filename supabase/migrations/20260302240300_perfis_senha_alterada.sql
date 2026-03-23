-- Adiciona senha_alterada em perfis para ADM de empresa (primeiro acesso deve alterar senha)
ALTER TABLE perfis
  ADD COLUMN IF NOT EXISTS senha_alterada boolean DEFAULT true;

-- Perfis existentes assumem senha já alterada (true). Novos ADMs criados via Edge Function terão false.

-- RLS: usuário pode ler e atualizar seu próprio perfil
ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS perfis_select_own ON perfis;
CREATE POLICY perfis_select_own ON perfis
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS perfis_update_own ON perfis;
CREATE POLICY perfis_update_own ON perfis
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
