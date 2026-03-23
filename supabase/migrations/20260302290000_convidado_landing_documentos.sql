-- Convidados podem confirmar participação
ALTER TABLE reuniao_convidados ADD COLUMN IF NOT EXISTS confirmado_em timestamptz;

-- Convidado pode atualizar seu próprio registro (para confirmar)
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
    OR user_id = auth.uid()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reunioes r
      JOIN perfis p ON p.empresa_id = r.empresa_id AND p.user_id = auth.uid()
      WHERE r.id = reuniao_convidados.reuniao_id
    )
    OR auth.uid() IS NULL
    OR user_id = auth.uid()
  );

-- Convidados podem ler seu próprio registro para acessar a landing page
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
    OR user_id = auth.uid()
  );

-- Documentos enviados por convidados para reuniões
CREATE TABLE IF NOT EXISTS reuniao_documentos_convidados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reuniao_id uuid NOT NULL REFERENCES reunioes(id) ON DELETE CASCADE,
  convidado_id uuid NOT NULL REFERENCES reuniao_convidados(id) ON DELETE CASCADE,
  nome_arquivo text NOT NULL,
  storage_path text NOT NULL,
  arquivo_url text,
  tamanho bigint,
  mime_type text,
  status text DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reuniao_doc_conv_reuniao ON reuniao_documentos_convidados(reuniao_id);
CREATE INDEX IF NOT EXISTS idx_reuniao_doc_conv_convidado ON reuniao_documentos_convidados(convidado_id);

ALTER TABLE reuniao_documentos_convidados ENABLE ROW LEVEL SECURITY;

-- Convidado pode inserir seus próprios documentos
CREATE POLICY reuniao_doc_conv_insert_own ON reuniao_documentos_convidados
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM reuniao_convidados rc
      WHERE rc.id = reuniao_documentos_convidados.convidado_id
        AND rc.reuniao_id = reuniao_documentos_convidados.reuniao_id
        AND rc.user_id = auth.uid()
        AND rc.ativo = true
    )
  );

-- Convidado pode ler seus próprios documentos
CREATE POLICY reuniao_doc_conv_select_own ON reuniao_documentos_convidados
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reuniao_convidados rc
      WHERE rc.id = reuniao_documentos_convidados.convidado_id
        AND rc.user_id = auth.uid()
        AND rc.ativo = true
    )
  );

-- Perfis da empresa podem ler/update (para aprovação no secretariado)
CREATE POLICY reuniao_doc_conv_select_empresa ON reuniao_documentos_convidados
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM reunioes r
      JOIN perfis p ON p.empresa_id = r.empresa_id AND p.user_id = auth.uid()
      WHERE r.id = reuniao_documentos_convidados.reuniao_id
    )
  );

CREATE POLICY reuniao_doc_conv_update_empresa ON reuniao_documentos_convidados
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM reunioes r
      JOIN perfis p ON p.empresa_id = r.empresa_id AND p.user_id = auth.uid()
      WHERE r.id = reuniao_documentos_convidados.reuniao_id
    )
  );
