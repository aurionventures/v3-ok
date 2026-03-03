-- Legacy OS: maturidade de governança e entrevistas (schema fictício para referência)

CREATE TABLE IF NOT EXISTS entrevistas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  titulo text,
  data_entrevista date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS respostas_entrevistas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entrevista_id uuid NOT NULL REFERENCES entrevistas(id) ON DELETE CASCADE,
  pergunta text,
  resposta text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS maturidade_governanca (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  nivel text,
  dimensao text,
  observacao text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diagnosticos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  conteudo jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_entrevistas_empresa ON entrevistas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_maturidade_empresa ON maturidade_governanca(empresa_id);
