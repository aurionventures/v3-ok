-- Estende conselhos e comites com descricao, quorum, nivel
-- Cria tabela comissoes
-- Cria membros_governanca e alocacoes para conselhos, comites e comissoes

ALTER TABLE conselhos
  ADD COLUMN IF NOT EXISTS descricao text,
  ADD COLUMN IF NOT EXISTS quorum int DEFAULT 3,
  ADD COLUMN IF NOT EXISTS nivel text;

ALTER TABLE comites
  ADD COLUMN IF NOT EXISTS descricao text,
  ADD COLUMN IF NOT EXISTS tipo text,
  ADD COLUMN IF NOT EXISTS quorum int DEFAULT 3,
  ADD COLUMN IF NOT EXISTS nivel text;

-- Comissoes (comissions)
CREATE TABLE IF NOT EXISTS comissoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome text NOT NULL,
  descricao text,
  tipo text,
  quorum int DEFAULT 3,
  nivel text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comissoes_empresa ON comissoes(empresa_id);

-- Membros de governanca (pessoas que podem ser alocadas)
CREATE TABLE IF NOT EXISTS membros_governanca (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome text NOT NULL,
  cargo_principal text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_membros_governanca_empresa ON membros_governanca(empresa_id);

-- Alocacao de membros em conselhos, comites ou comissoes
CREATE TABLE IF NOT EXISTS alocacoes_membros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membro_id uuid NOT NULL REFERENCES membros_governanca(id) ON DELETE CASCADE,
  conselho_id uuid REFERENCES conselhos(id) ON DELETE CASCADE,
  comite_id uuid REFERENCES comites(id) ON DELETE CASCADE,
  comissao_id uuid REFERENCES comissoes(id) ON DELETE CASCADE,
  cargo text,
  data_inicio date,
  data_fim date,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT chk_alocacao_orgao CHECK (
    (conselho_id IS NOT NULL AND comite_id IS NULL AND comissao_id IS NULL) OR
    (conselho_id IS NULL AND comite_id IS NOT NULL AND comissao_id IS NULL) OR
    (conselho_id IS NULL AND comite_id IS NULL AND comissao_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_alocacoes_membro ON alocacoes_membros(membro_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_conselho ON alocacoes_membros(conselho_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_comite ON alocacoes_membros(comite_id);
CREATE INDEX IF NOT EXISTS idx_alocacoes_comissao ON alocacoes_membros(comissao_id);
