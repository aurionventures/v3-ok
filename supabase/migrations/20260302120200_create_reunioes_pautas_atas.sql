-- Legacy OS: reuniões, pautas e atas (schema fictício para referência)

CREATE TABLE IF NOT EXISTS reunioes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conselho_id uuid REFERENCES conselhos(id) ON DELETE CASCADE,
  comite_id uuid REFERENCES comites(id) ON DELETE SET NULL,
  titulo text NOT NULL,
  data_reuniao date,
  tipo text,
  status text DEFAULT 'agendada',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pautas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reuniao_id uuid NOT NULL REFERENCES reunioes(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  ordem int DEFAULT 0,
  tempo_estimado_min int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS atas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reuniao_id uuid NOT NULL REFERENCES reunioes(id) ON DELETE CASCADE,
  conteudo text,
  resumo text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deliberacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ata_id uuid NOT NULL REFERENCES atas(id) ON DELETE CASCADE,
  assunto text NOT NULL,
  decisao text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS encaminhamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ata_id uuid NOT NULL REFERENCES atas(id) ON DELETE CASCADE,
  responsavel_id uuid REFERENCES perfis(id) ON DELETE SET NULL,
  acao text NOT NULL,
  prazo date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reunioes_conselho ON reunioes(conselho_id);
CREATE INDEX IF NOT EXISTS idx_pautas_reuniao ON pautas(reuniao_id);
CREATE INDEX IF NOT EXISTS idx_atas_reuniao ON atas(reuniao_id);
