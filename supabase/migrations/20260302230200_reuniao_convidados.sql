-- Convidados de reunião: acesso provisório por e-mail/senha com validade
CREATE TABLE IF NOT EXISTS reuniao_convidados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reuniao_id uuid NOT NULL REFERENCES reunioes(id) ON DELETE CASCADE,
  email text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  senha_valida_ate date NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(reuniao_id, email)
);

CREATE INDEX IF NOT EXISTS idx_reuniao_convidados_reuniao ON reuniao_convidados(reuniao_id);
CREATE INDEX IF NOT EXISTS idx_reuniao_convidados_user ON reuniao_convidados(user_id);

ALTER TABLE reuniao_convidados ENABLE ROW LEVEL SECURITY;

-- Usuários com perfil na empresa podem gerenciar convidados das reuniões da empresa
DROP POLICY IF EXISTS reuniao_convidados_select ON reuniao_convidados;
CREATE POLICY reuniao_convidados_select ON reuniao_convidados
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reunioes r
      JOIN perfis p ON p.empresa_id = r.empresa_id AND p.user_id = auth.uid()
      WHERE r.id = reuniao_convidados.reuniao_id
    )
    OR auth.uid() IS NULL
  );

DROP POLICY IF EXISTS reuniao_convidados_insert ON reuniao_convidados;
CREATE POLICY reuniao_convidados_insert ON reuniao_convidados
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reunioes r
      JOIN perfis p ON p.empresa_id = r.empresa_id AND p.user_id = auth.uid()
      WHERE r.id = reuniao_convidados.reuniao_id
    )
    OR auth.uid() IS NULL
  );

DROP POLICY IF EXISTS reuniao_convidados_update ON reuniao_convidados;
CREATE POLICY reuniao_convidados_update ON reuniao_convidados
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM reunioes r
      JOIN perfis p ON p.empresa_id = r.empresa_id AND p.user_id = auth.uid()
      WHERE r.id = reuniao_convidados.reuniao_id
    )
    OR auth.uid() IS NULL
  );
