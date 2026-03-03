-- Legacy OS: histórico de agentes, prompts e insights (schema fictício para referência)

CREATE TABLE IF NOT EXISTS prompts_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  agente_id text NOT NULL,
  prompt_override text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS historico_agente (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  agente_id text NOT NULL,
  entrada jsonb,
  saida jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sinais_mercado (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  titulo text,
  impacto text,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  tipo text,
  conteudo jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_historico_agente_empresa ON historico_agente(empresa_id);
CREATE INDEX IF NOT EXISTS idx_sinais_mercado_empresa ON sinais_mercado(empresa_id);
