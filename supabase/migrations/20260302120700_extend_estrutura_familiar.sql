-- Estende estrutura_familiar com colunas do formulário "Adicionar Familiar"
-- Mapeamento: nome (já existe), parentesco (já existe) + novos campos

ALTER TABLE estrutura_familiar
  ADD COLUMN IF NOT EXISTS idade integer,
  ADD COLUMN IF NOT EXISTS geracao text,
  ADD COLUMN IF NOT EXISTS papel text,
  ADD COLUMN IF NOT EXISTS envolvimento text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'Ativo',
  ADD COLUMN IF NOT EXISTS imagem_url text,
  ADD COLUMN IF NOT EXISTS participacao_societaria text,
  ADD COLUMN IF NOT EXISTS formacao text,
  ADD COLUMN IF NOT EXISTS experiencia text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS telefone text,
  ADD COLUMN IF NOT EXISTS empresas jsonb DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_estrutura_familiar_empresa ON estrutura_familiar(empresa_id);
