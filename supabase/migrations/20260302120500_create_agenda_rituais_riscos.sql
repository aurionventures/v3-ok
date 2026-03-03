-- Legacy OS: agenda, rituais, riscos e ações (schema fictício para referência)

CREATE TABLE IF NOT EXISTS rituais (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  conselho_id uuid REFERENCES conselhos(id) ON DELETE SET NULL,
  nome text NOT NULL,
  frequencia text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agenda_anual (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  ano int NOT NULL,
  conteudo jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS temas_agenda (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agenda_id uuid REFERENCES agenda_anual(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  prioridade int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS riscos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
  descricao text NOT NULL,
  severidade text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS acoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id uuid REFERENCES empresas(id) ON DELETE CASCADE,
  ata_id uuid REFERENCES atas(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  responsavel_id uuid REFERENCES perfis(id) ON DELETE SET NULL,
  prazo date,
  status text DEFAULT 'pendente',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rituais_empresa ON rituais(empresa_id);
CREATE INDEX IF NOT EXISTS idx_riscos_empresa ON riscos(empresa_id);
