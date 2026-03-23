-- Reunião gestão: metadados de documentos, gravação, assuntos e participantes
CREATE TABLE IF NOT EXISTS reuniao_gestao (
  reuniao_id uuid PRIMARY KEY REFERENCES reunioes(id) ON DELETE CASCADE,
  documentos_count int DEFAULT 0,
  transcricao_texto text,
  gravacao_arquivo_nome text,
  ata_enviada boolean DEFAULT false,
  assuntos_proxima text,
  participantes_confirmados jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tarefas e combinados da reunião (antes/durante reunião)
CREATE TABLE IF NOT EXISTS reuniao_tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reuniao_id uuid NOT NULL REFERENCES reunioes(id) ON DELETE CASCADE,
  nome text NOT NULL,
  responsavel text NOT NULL DEFAULT '',
  data_conclusao date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reuniao_tarefas_reuniao ON reuniao_tarefas(reuniao_id);
