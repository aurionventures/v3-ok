-- Legacy OS: conselhos e comitês (schema fictício para referência)

CREATE TABLE IF NOT EXISTS conselhos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nome text NOT NULL,
  tipo text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  conselho_id uuid REFERENCES conselhos(id) ON DELETE SET NULL,
  nome text NOT NULL,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS membros_conselho (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conselho_id uuid NOT NULL REFERENCES conselhos(id) ON DELETE CASCADE,
  perfil_id uuid NOT NULL REFERENCES perfis(id) ON DELETE CASCADE,
  cargo text,
  ativo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(conselho_id, perfil_id)
);

CREATE INDEX IF NOT EXISTS idx_conselhos_empresa ON conselhos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_comites_empresa ON comites(empresa_id);
CREATE INDEX IF NOT EXISTS idx_membros_conselho ON membros_conselho(conselho_id);
